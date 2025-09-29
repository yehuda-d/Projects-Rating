const express = require('express');
const router = express.Router();
const multer = require('multer');//ספרייה שנותנת להעלות קבצים
const fs = require('fs');//ספרייה שנותנת לערוך קבצים
const path = require('path');

const projects = [];
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
    res.status(200).json(projects)
});

router.post('/',uplode.single('myFile'),(req,res)=>{
    let name = req.body.name;
    if(!name){
        return res.status(400).json({message:"not valid"})       
    }
    let id = nextID++;
    let description = (req.body.description);
    let Myfilename = req.file ? req.file.filename : null;
    let product = {id,name,description,Myfilename};
    projects[id] = product;
     res.status(201).json({message:"ok"})

})

router.delete('/:id',(req,res)=>{

    //ולידציה
    let id = Number(req.params.id);
    if(isNaN(id)){
        return res.json({message:"לא חוקי"})
    }
    let product = projects[id];
    if(!product){
        return res.json("לא קיים")
    }

    if(product.Myfilename){
        if(fs.existsSync(path.join('uploads',product.Myfilename))){
            fs.unlinkSync(path.join('uploads',product.Myfilename))
        }
    }
    projects[id] = null;
    res.json({message:"ok"});

})

//נקודת קצה של הצגת אובייקט
router.get('/:id',(req,res)=>{
    //ולידציה
    let id = Number(req.params.id);
    if(isNaN(id)){
        return res.json({message:"לא חוקי"})
    }
    let product = projects[id];
    if(!product){
        return res.json("לא קיים")
    }
    res.json(product);
})

//עדכון אובייקט
router.patch('/:id',uplode.single('myFile'),(req,res)=>{
     //ולידציה
    let id = Number(req.params.id);
    if(isNaN(id)){
        return res.json({message:"לא חוקי"})
    }
    let project = projects[id];
    if(!project){
        return res.json("לא קיים")
    }

    let Oldfilename = project.Myfilename;
    let Newfilename = req.file ? req.file.filename : null;
    if(Oldfilename && Newfilename && Newfilename != Oldfilename){
        if(fs.existsSync(path.join('uploads',Oldfilename))){
            fs.unlinkSync(path.join('uploads',Oldfilename))
        }
        project.Myfilename = Newfilename;
    }

    let name = req.body.name;
    let description = req.body.description;
    if(name){
        project.name = name;       
    }
    if(description){
        project.description = description;
    }

    res.json({message:"ok"});

})

module.exports = router;    