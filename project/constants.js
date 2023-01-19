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

const pawnEvalWhite = [
    [ 0,   0,   0,   0,   0,   0,   0,   0],
    [50,  50,  50,  50,  50,  50,  50,  50],
    [10,  10,  20,  30,  30,  20,  10,  10],
    [ 5,   5,  10,  25,  25,  10,   5,   5],
    [ 0,   0,   0,  20,  20,   0,   0,   0],
    [ 5,  -5, -10,   0,   0, -10,  -5,   5],
    [ 5,  10, 10,  -20, -20,  10,  10,   5],
    [ 0,   0,   0,   0,   0,   0,   0,   0]
];

const pawnEvalBlack = pawnEvalWhite.slice().reverse();

const knightEvalNeutral = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20,   0,   0,   0,   0, -20, -40],
    [-30,   0,  10,  15,  15,  10,   0, -30],
    [-30,   5,  15,  20,  20,  15,   5, -30],
    [-30,   0,  15,  20,  20,  15,   0, -30],
    [-30,   5,  10,  15,  15,  10,   5, -30],
    [-40, -20,   0,   5,   5,   0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
];

const bishopEvalWhite = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10,   0,   0,   0,   0,   0,   0, -10],
    [-10,   0,   5,  10,  10,   5,   0, -10],
    [-10,   5,   5,  10,  10,   5,   5, -10],
    [-10,   0,  10,  10,  10,  10,   0, -10],
    [-10,  10,  10,  10,  10,  10,  10, -10],
    [-10,   5,   0,   0,   0,   0,   5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
];

const bishopEvalBlack = bishopEvalWhite.slice().reverse();

const rookEvalWhite = [
    [  0,   0,   0,   0,   0,   0,   0,   0],
    [  5,  10,  10,  10,  10,  10,  10,   5],
    [ -5,   0,   0,   0,   0,   0,   0,  -5],
    [ -5,   0,   0,   0,   0,   0,   0,  -5],
    [ -5,   0,   0,   0,   0,   0,   0,  -5],
    [ -5,   0,   0,   0,   0,   0,   0,  -5],
    [ -5,   0,   0,   0,   0,   0,   0,  -5],
    [  0,    0,  0,   5,   5,   0,   0,   0]
];

const rookEvalBlack = rookEvalWhite.slice().reverse();

const queenEvalNeutral = [
    [-20, -10, -10,  -5,  -5, -10, -10, -20],
    [-10,   0,   0,   0,   0,   0,   0, -10],
    [-10,   0,   5,   5,   5,   5,   0, -10],
    [ -5,   0,   5,   5,   5,   5,   0,  -5],
    [  0,   0,   5,   5,   5,   5,   0,  -5],
    [-10,   5,   5,   5,   5,   5,   0, -10],
    [-10,   0,   5,   0,   0,   0,   0, -10],
    [-20, -10, -10,  -5,  -5, -10, -10, -20]
];

const kingEvalWhite = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [ 20,  20,   0,   0,   0,   0,  20,  20],
    [ 20,  30,  10,   0,   0,  10,  30,  20]
];

const kingEvalBlack = kingEvalWhite.slice().reverse();

const evalBlack = {
    'p' : pawnEvalBlack,
    'n' : knightEvalNeutral,
    'b' : bishopEvalBlack,
    'r' : rookEvalBlack,
    'q' : queenEvalNeutral,
    'k' : kingEvalBlack
}

const evalWhite = {
    'p' : pawnEvalWhite,
    'n' : knightEvalNeutral,
    'b' : bishopEvalWhite,
    'r' : rookEvalWhite,
    'q' : queenEvalNeutral,
    'k' : kingEvalWhite
}

const evalRepo =  {
    'b' : evalBlack, 
    'w' : evalWhite
}

module.exports.pawnEvalWhite = pawnEvalWhite;
module.exports.pawnEvalBlack = pawnEvalBlack;
module.exports.knightEvalNeutral = knightEvalNeutral;
module.exports.bishopEvalWhite = bishopEvalWhite;
module.exports.bishopEvalBlack= bishopEvalBlack;
module.exports.rookEvalWhite = rookEvalWhite;
module.exports.rookEvalBlack = rookEvalBlack;
module.exports.queenEvalNeutral = queenEvalNeutral;
module.exports.kingEvalBlack = kingEvalBlack;
module.exports.kingEvalWhite = kingEvalWhite
module.exports.evalRepo = evalRepo;
// default evalRepo;

module.exports.P = 100;
module.exports.N = 300;
module.exports.B = 300;
module.exports.R = 500;
module.exports.Q = 900;
module.exports.K = 9000;

