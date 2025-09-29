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
    let project = {id,name,description,Myfilename,rating: 0,ratingCount: 0};
    projects[id] = project;
     res.status(201).json({message:"ok"})

})

router.delete('/:id',(req,res)=>{

    //ולידציה
    let id = Number(req.params.id);
    if(isNaN(id)){
        return res.json({message:"לא חוקי"})
    }
    let project = projects[id];
    if(!project){
        return res.json("לא קיים")
    }

    if(project.Myfilename){
        if(fs.existsSync(path.join('uploads',project.Myfilename))){
            fs.unlinkSync(path.join('uploads',project.Myfilename))
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
    let project = projects[id];
    if(!project){
        return res.json("לא קיים")
    }
    res.json(project);
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


// הוספת דירוג לפרויקט
router.post('/:id/rate', (req, res) => {
    let id = Number(req.params.id);
    let score = Number(req.body.score); // ערך בין 1 ל־5

    if (isNaN(id) || isNaN(score) || score < 1 || score > 5) {
        return res.status(400).json({ message: "דירוג לא חוקי" });
    }

    let project = products[id];
    if (!project) {
        return res.status(404).json({ message: "פרויקט לא קיים" });
    }

    // אם זו הפעם הראשונה שמדרגים את הפרויקט
    if (!project.rating) {
        project.rating = 0;
        project.ratingCount = 0;
    }

    // חישוב ממוצע חדש
    project.rating = ((project.rating * project.ratingCount) + score) / (project.ratingCount + 1);
    project.ratingCount++;

    res.json({ 
        message: "✅ דירוג התקבל בהצלחה", 
        rating: project.rating.toFixed(2),
        ratingCount: project.ratingCount
    });
});


module.exports = router;    