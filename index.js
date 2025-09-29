//ספריות
const express = require('express');
const path = require('path');
const app = express();
const port = 4500;

//מידלוורים
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

//נתיבים    
app.get('/',(req,res)=>{ res.sendFile(path.join(__dirname,'public','index.html'))});
app.use('/p',require('./routes/projects_R'))


// הפעלת שרת
app.listen(port,()=>{console.log(`http://localhost:${port}`)});