const express = require('express');
const router = express.Router();

const products = [];
let nextID = 1;

router.get('/',(req,res)=>{
    res.status(200).json(products)
});


module.exports = router;    