require("dotenv").config();
const express = require('express');
var expressStaticGzip = require('express-static-gzip');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;


app.use(expressStaticGzip(path.join(__dirname, 'build'), {
    orderPreference: ['gzip'],
    maxAge: 0,
    serveStatic: {
        maxAge: 0,
    }
}))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(PORT, () => {
    console.log("Server started on port: " + PORT)
});