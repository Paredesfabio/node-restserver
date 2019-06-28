const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificacionTokenImg } = require('../middlewares/auth');

const app = express();


app.get('/imagen/:tipo/:img', verificacionTokenImg, (req,res)=>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve( __dirname, `../../uploads/${ tipo }/${ img}`);

    if( fs.existsSync(pathImg) ){
        return res.sendFile(pathImg);    
    }else{
        let pathNoImage = path.resolve( __dirname, '../assets/no-image.jpg');    
        return  res.sendFile(pathNoImage);        
    }


});


module.exports = app;
