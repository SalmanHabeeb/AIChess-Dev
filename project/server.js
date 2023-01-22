express = require("express");
utils = require("./utils.js");

const app = express();

app.get('/', (req, res) => {
    const response = [
        {
            "status": "running",
            "port": 5000,
            "request type": "get",
            "current url": "http:localhost:5000",
            "message": "Use http:localhost:5000/api to make relevent 'post' requests"
        }
    ];
    res.json(response);
});

var bodyParser = require('body-parser');  
var jsonParser = bodyParser.json();

app.post('/api', jsonParser, (req, res) => {
    let pgn = req.body.pgn;
    // console.log(pgn);
    let depth = req.body.depth;
    // console.log(utils.getBestMove(pgn, depth))
    let response = [
        {"move": utils.getBestMove(pgn, depth)}
    ];
    res.json(response);
})

const port = process.env.PORT;
app.listen(port, () => console.log(`Server started on ${port}`));