const express = require('express');
const router = express.Router();
const multer = require('multer');//ספרייה שנותנת להעלות קבצים
const fs = require('fs');//ספרייה שנותנת לערוך קבצים
const path = require('path');

const products = [];
let nextID = 1;

//אם אין תיקייה כזו אז שתייצר אותה
if(!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

// אובייקט ההוספה ועדכון קבצים
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'uploads/');
    },
    filename: (req,file,cb)=>{
        let id = req.params.id ? req.params.id : nextID;
        let finalFilename = `${id}${path.extname(file.originalname)}`;
        cb(null, finalFilename);
    }
})
const uplode = multer({storage: storage});

router.get('/',(req,res)=>{
    res.status(200).json(products)
});

router.post('/',uplode.single('myFile'),(req,res)=>{
    let name = req.body.name;
    if(!name){
        return res.status(400).json({message:"not valid"})       
    }
    let id = nextID++;
    let price = parseFloat(req.body.price);
    let filename = req.file ? req.file.filename : null;
    let product = {id,name,price:parseFloat(price),filename};
    products[id] = product;
     res.status(201).json({message:"ok"})

})


module.exports = router;    