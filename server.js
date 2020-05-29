require("dotenv").config();
const express = require('express');
var expressStaticGzip = require('express-static-gzip');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

const pattern = /.*\.(png|js|css)/
// app.use((req, res, next)=>{
//     if(!req.originalUrl.match(pattern)){
//         next();
//         return;
//     }

//     req.originalUrl += ".br"
//     req._parsedUrl.pathname += ".br"
//     req._parsedUrl.path += ".br"
//     req._parsedUrl.href += ".br"
//     req._parsedUrl._raw += ".br"
//     req.url += ".br"
//     next();
// })

// app.use((req, res , next) => {
//     console.log([req.originalUrl,
//         req._parsedUrl.pathname,
//         req._parsedUrl.path,
//         req._parsedUrl.href,
//         req._parsedUrl._raw,
//         req.url,])
//     next();
// })

app.use(express.static(path.join(__dirname, 'build')));

app.use(expressStaticGzip(path.join(__dirname, 'build'), {
    enableBrotli :true,
}))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html.gz'));
});

app.listen(PORT, ()=>{
    console.log("Server started on port: " + PORT)
});