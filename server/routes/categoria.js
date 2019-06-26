const express = require('express');
let { verificacionToken, verificacionAdminRole } = require('../middlewares/auth'); 
const app = express();

let Categoria = require('../models/categoria');

// MOSTRAR TODAS LAS CATEGORIAS
app.get('/categoria', verificacionToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') // saco los registros del usuario relacionado
        .exec( (err,categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });

});

// MOSTRAR UNA CATEGORIA POR ID
app.get('/categoria/:id', verificacionToken, (req, res) => {
    
    let id = req.params.id;

    Categoria.findById(id, (err,categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El id no existe'
                }
            });
        }        

        res.json({
            ok: true,
            categoriaDB
        });        

    }); 

});

// CREAR NUEVA CATEGORIA
app.post('/categoria', verificacionToken, (req, res) =>{
    //regresa la nueva categoria
    // req.usuario._id

    let body = req.body;
    let categoria = new Categoria();
    categoria.descripcion = body.descripcion;
    categoria.usuario = req.usuario._id;

    categoria.save((err, categoriaDB) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }         

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });            
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

app.put('/categoria/:id', verificacionToken, (req, res) => {
    //solo se actualiza la descripcin de la categoria
    let id = req.params.id;
    let body = req.body;

    let desCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true}, (err, categoriaDB)=>{

        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }         

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });            
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

app.delete('/categoria/:id', [verificacionToken, verificacionAdminRole], (req, res) => {
    //solo borra un administrador
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB)=>{

        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }         

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });            
        }
        
        res.json({ 
            ok: true,
            categoria: categoriaDB
        });             

    });

});

module.exports = app;
