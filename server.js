require("dotenv").config();
const express = require('express');
var expressStaticGzip = require('express-static-gzip');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;


app.use(expressStaticGzip(path.join(__dirname, 'build'), {
  //  enableBrotli :true,
    orderPreference: ['gzip'],
    maxAge: 10,
    serveStatic: {
        maxAge: 10,            // will be kept 
    }
}))


app.listen(PORT, ()=>{
    console.log("Server started on port: " + PORT)
});