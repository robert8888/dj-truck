require("dotenv").config();
const express = require('express');
var expressStaticGzip = require('express-static-gzip');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'build')));

app.use(expressStaticGzip(path.join(__dirname, 'build'), {
    enableBrotli :true,
    index: "index.html"
}))


app.listen(PORT, ()=>{
    console.log("Server started on port: " + PORT)
});