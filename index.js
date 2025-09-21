const express = require('express');
const path = require('path');
const app = express();
const port = 4500;

app.use(express.static(__dirname));

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/public/index.html')
});


app.listen(port,()=>{console.log(`http://localhost:${port}`)});