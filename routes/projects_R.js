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
    let Myfilename = req.file ? req.file.filename : null;
    let product = {id,name,price:parseFloat(price),Myfilename};
    products[id] = product;
     res.status(201).json({message:"ok"})

})

router.delete('/:id',(req,res)=>{

    //ולידציה
    let id = Number(req.params.id);
    if(isNaN(id)){
        return res.json({message:"לא חוקי"})
    }
    let product = products[id];
    if(!product){
        return res.json("לא קיים")
    }

    if(product.Myfilename){
        if(fs.existsSync(path.join('uploads',product.Myfilename))){
            fs.unlinkSync(path.join('uploads',product.Myfilename))
        }
    }
    products[id] = null;
    res.json({message:"ok"});

})

//נקודת קצה של הצגת אובייקט
router.get('/:id',(req,res)=>{
    //ולידציה
    let id = Number(req.params.id);
    if(isNaN(id)){
        return res.json({message:"לא חוקי"})
    }
    let product = products[id];
    if(!product){
        return res.json("לא קיים")
    }
    res.json(product);
})

module.exports = router;    