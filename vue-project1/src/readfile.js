const express = require('express');
const fs = require("fs");
const app = express();

app.use('/', express.static('dist'));


app.post('/todo.json', (req, res) => {
    req.pipe(fs.createWriteStream('dist/todo.json'))
        .once('finish', () => {
            res.writeHead(200);
            res.end();
        });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on port ${port}...`));