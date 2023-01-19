// // @license

// // This program hosts a chess engine.

// // Copyright (C) 2023  Syed Salman Habeeb Quadri

// // This program is free software: you can redistribute it and/or modify
// // it under the terms of the GNU General Public License as published by
// // the Free Software Foundation, either version 3 of the License, or
// // (at your option) any later version.

// // This program is distributed in the hope that it will be useful,
// // but WITHOUT ANY WARRANTY; without even the implied warranty of
// // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// // GNU General Public License for more details.

// // The GNU General Public License does not permit incorporating this program
// // into proprietary programs.

// // You should have received a copy of the GNU General Public License
// // along with this program.  
// // If not, see [GNU General Public License](https://www.gnu.org/licenses/).

import React, { useState } from 'react';
import { Chess } from 'chess.js';
import Tile from '../tiles/tile';
import Banner from '../banner/banner';
import FrameStick from '../frame/frame';
import './arena.css';
import Console from '../console/console';
import { useSelector } from "react-redux";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];


var chess = new Chess();
var selectedPiece = null;
var message = null;
var promotionColor = null;
var secondBackPiece = null;
var promotionMove = null;

var isSoundEffectAllowed = (navigator.deviceMemory >= 8);
const moveSound = new Audio("assets/sounds/move_sound.wav");
const checkSound = new Audio("assets/sounds/check_sound.wav");
const winSound = new Audio("assets/sounds/win_sound.wav");
const loseSound = new Audio("assets/sounds/lose_sound.wav");
const drawSound = new Audio("assets/sounds/draw_sound.wav");

function Arena() {
    const [board, setBoard] = useState(new renderBoard());
    const DEPTH = useSelector((state) => state.game.level);

    function refresh() {
        setBoard(new renderBoard());
    }

    function highlightPossibleMoves(possibleMoves) {
        for (let i = 0; i < possibleMoves.length; i++) {
            let pos = /\w\d/.exec(possibleMoves[i]);
            if (pos !== null) {
                document.getElementById(pos).style.border = '3px inset blue';
            }
            else if(possibleMoves[i] === 'O-O' | possibleMoves[i] === 'O-O-O') {
                let shuffleProfile = chess.move(possibleMoves[i]);
                chess.undo();
                document.getElementById(shuffleProfile['to']).style.border = '3px inset blue';
            }
        }
    }

    function dehighlightTiles(currentElement) {
        for (let i=0; i < horizontalAxis.length; i++) {
            for (let j=0; j < verticalAxis.length; j++) {
                let pos = horizontalAxis[i] + verticalAxis[j];
                if (currentElement.id !== pos) {
                    document.getElementById(pos).style.border = 'none';
                } 
            }   
        }
    }

    async function playSound() {
        if (isSoundEffectAllowed) {
            if (chess.isCheckmate()) {
                if (chess.turn() === 'b') {
                    await winSound.play();
                }
                else {
                    await loseSound.play();
                }
                }
            else if (chess.isStalemate() | chess.isThreefoldRepetition() | chess.isDraw()) {
                await drawSound.play();
            }
            else if(chess.isCheck()) {
                await checkSound.play();
            }
            else{
                await moveSound.play();
            }
        }
    }

    function renderMessage() {
        let newMessage = "None";
        if (chess.isCheckmate()) {
            newMessage = "CHECKMATE";
        }
        else if (chess.isStalemate()) {
            newMessage = "STALEMATE";
        }
        else if(chess.isThreefoldRepetition()) {
            newMessage = "Three-fold";
        }
        else if (chess.isDraw()) {
            newMessage = "DRAW";
        }
        else if(chess.isCheck()) {
            newMessage = "CHECK";
        }
        if (newMessage !== "None") {
            if (message !== newMessage + "!") {
                message = newMessage + "!";
            }
            else {
                message = null;
            }
        }
        else {
            message = null;
        }  
    }

    function highlightByIds(ids) {
        for (let i=0; i<ids.length; i++) {
            document.getElementById(ids[i]).style.border = '3px inset blue';
        }
    }

    async function fetchBestMove() {
        let response = null;
        try {
          response = await fetch("/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fen: chess.fen(),
            depth: `${DEPTH}`
          })});
        }
        catch(err){
          console.log(err);
        }
        const message = await response.json();
        return message[0]["move"];
    }

    async function playModelMove() {
        if (chess.turn() === 'b') {
            // let compMove = chess.moves()[Math.floor(Math.random()*chess.moves().length)];
            let compMove = await fetchBestMove();
            if (compMove === undefined) {
                compMove = chess.moves()[Math.floor(Math.random()*chess.moves().length)];
            }
            let move = chess.move(compMove);
            // if (move === null) {
            //     compMove = chess.moves()[Math.floor(Math.random()*chess.moves().length)];
            //     move = chess.move(move);
            // }
            try {
                move = [move['from'], move['to']];
                highlightByIds(move);
                playSound();
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    async function playTurn(movePlayed) {
        if (movePlayed) {
            renderMessage();
            refresh();
            await new Promise(r => setTimeout(r, 1000));

            if(!chess.isGameOver()) {
                await playModelMove();
                renderMessage();
                refresh();
            }
        }
    }

    async function pushPieces(element, promoPiece=null) {
        
        let movePlayed = false;
        if (!chess.isGameOver()) {
            if (promoPiece === null) {
                movePlayed = chess.move({from: selectedPiece.id, to: element.id});
            }
            else {
                movePlayed = chess.move({from: secondBackPiece.id, to: element.id});
            }
            
            if (movePlayed !== null) {
                movePlayed = true;
                playSound();
            }
            await playTurn(movePlayed);
            return movePlayed;
        }
    }

    function grabPiece(e: React.MouseEvent) {
        const element: HTMLElement = e.target;
        dehighlightTiles(element);
        if (element.classList.contains('piece')) {
            if (/\W\w{2}\./.exec(element.style.backgroundImage)[0].charAt(1) === 'w') {
                if (selectedPiece !== null) {
                    selectedPiece.style.border = 'none';
                    selectedPiece = null;
                }
                highlightPossibleMoves(chess.moves({square: element.id}));
                element.style.border = '3px inset gray';
                selectedPiece = element;
            }
            else if (/\W\w{2}\./.exec(element.style.backgroundImage)[0].charAt(1) === 'b') {
                if ((selectedPiece !== null) & (/\W\w{2}\./.exec(selectedPiece.style.backgroundImage)[0].charAt(1) === 'w')) {
                    let str = /\W\w{2}\./.exec(selectedPiece.style.backgroundImage);
                    let pawnColor = str[0].charAt(1);
                    let verticalAxisPawnPosition = selectedPiece.id.charAt(1);
                    let isPawn = (str[0].charAt(2) === 'p');
                    let isPrePromotionTile = (pawnColor === 'w' & verticalAxisPawnPosition === '7') | (pawnColor === 'b' & verticalAxisPawnPosition === '2');
                    if (isPrePromotionTile & isPawn) {
                        if (chess.move({from: selectedPiece.id, to: element.id, promotion: 'q'})) {
                            promotionMove = {from: selectedPiece.id, to: element.id, promotion: 'q'}
                            promotionColor = pawnColor;
                            chess.undo();
                            refresh();
                        }
                    }
                    else {
                        pushPieces(element);
                    }
                }
                selectedPiece = element;
            }
        }
        else if (element.classList.contains('tile')) {
            if (selectedPiece !== null) {
                let str = /\W\w{2}\./.exec(selectedPiece.style.backgroundImage);
                let pawnColor = str[0].charAt(1);
                let isPawn = (str[0].charAt(2) === 'p');
                let verticalAxisPawnPosition = selectedPiece.id.charAt(1);
                let isPrePromotionTile = (pawnColor === 'w' & verticalAxisPawnPosition === '7') | (pawnColor === 'b' & verticalAxisPawnPosition === '2');
                if (isPrePromotionTile & isPawn) {
                    if (chess.move({from: selectedPiece.id, to: element.id, promotion: 'q'})) {
                        promotionMove = {from: selectedPiece.id, to: element.id, promotion: 'q'};
                        promotionColor = pawnColor;
                        chess.undo();
                        refresh();
                    }
                }
                else {
                    pushPieces(element);
                }
                selectedPiece.style.border = 'none';
                selectedPiece = null;
            }
            
        }
        else if (element.classList.contains('promopiece')) {
            let str = /\W\w{2}\./.exec(element.style.backgroundImage);
            let pieceName = str[0].charAt(2);
            promotionMove['promotion'] = pieceName;
            chess.move(promotionMove);
            playSound();
            promotionColor = null;
            // renderMessage();
            // refresh();
            // if(!chess.isGameOver()) {
            //     playModelMove();
            //     renderMessage();
            //     refresh();
            // }
            playTurn(true);
        }
    }
    
    function renderBoard() {
    
        var board = [];
        var image = null;
        board.push(<Banner message={message} isPromotion={promotionColor}/>)
        for(let i = verticalAxis.length - 1; i >= 0; i--)
        {
            for(let j = 0; j < horizontalAxis.length; j++)
            {
                let rev_i = verticalAxis.length - 1 - i;
                if (chess.board()[rev_i][j] !== null) {
                    image = "assets/pieces/" + chess.board()[rev_i][j].color + chess.board()[rev_i][j].type + ".svg";
                }
                else {
                    image = null;
                }
                const number = i + j;
                const xy = horizontalAxis[j] + verticalAxis[i];
                board.push(<Tile xy={xy} image={image} number={number}/>);
            }
            board.push(<FrameStick showChar={verticalAxis[i]} isVertical={true}/>);
        }
        for(let i = 0; i < 8; i++) {
            board.push(<FrameStick showChar={horizontalAxis[i]} isVertical={false}/>);
        }
        if (chess.isGameOver()) {
            let endStatement = "You Lose!";
            if (chess.isCheckmate()) {
                if (chess.turn() !== 'w') {
                    endStatement = "You Win!";
                }
            }
            else {
                endStatement = message;
            }
            board.push(<div className="board game-over"><h2>{endStatement}</h2><a className="redirect-link" href="/">Main page</a></div>)
        }

        return (board)
    }
    // let gameView = <div id="GameView"><Chessboard /></div>;
    // let gameConsole = <div id="GameConsole"><Console pgn= { chess.pgn() }/></div>
  
    return (
        <div id="Arena">
        <div id='GameView'>
            <div onMouseDown={(e) => grabPiece(e)} id="board">{board}</div>
        </div>
        <div id="GameConsole"><Console pgn= { chess.pgn() }/></div>
        </div>
    )
}

export default Arena;