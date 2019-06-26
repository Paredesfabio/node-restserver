const express = require('express');
const { verificacionToken } = require('../middlewares/auth'); 
const app = express();

 let Producto = require('../models/producto');

// =================================================
//  OBTENER TODOS LOS PRODUCTOS
// =================================================
app.get('/productos', verificacionToken, (req,res)=>{

    let desde = req.query.desde || 0 ; 
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let condicion = {
        disponible: true
    }; 
    
    Producto.find(condicion, 'nombre precioUni descripcion disponible')
    .sort('nombre')
    .skip( desde )        
    .limit( 5 )   
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')            
    .exec( (err, productosDB) => {

        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        } 
        
        Producto.countDocuments(condicion, (err, conteo) =>{

            if( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }                     

            res.json({
                ok: true,
                productos: productosDB,
                contador: conteo

            });

        });


    });        
});

// =================================================
//  OBTENER UN PRODUCTO POR ID
// =================================================
app.get('/productos/:id', verificacionToken, (req,res)=>{

    let id = req.params.id;

    Producto.findById( id )
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')            
        .exec( (err, productosDB) => {

            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            } 

            if( !productosDB ){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no Existe'
                    }
                });
            }  
            
            res.json({
                ok: true,
                producto: productosDB
            });

    });  
});

// =================================================
//  BUSCAR PRODUCTOS
// =================================================
app.get('/productos/buscar/:termino', verificacionToken, (req, res) => {

    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i');

    Producto.find({ nombre: regexp })
            .populate('categoria', 'descripcion')
            .exec( (err, productos) => {

                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }          
                
                res.json({
                    ok: true,
                    productos
                });

            });
});

// =================================================
//  GUARDAR UN PRODUCTO
// =================================================
app.post('/productos', verificacionToken, (req,res)=>{
    //grabar usuario, categoria
    let body = req.body;
    let producto = new Producto({
        usuario: body.usuario,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,  
        disponible: body.disponible,
        categoria: body.categoria
    });    
     producto.save( (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
     });

});

// =================================================
//  ACTUALIZAR UN PRODUCTO
// =================================================
app.put('/productos/:id', verificacionToken, (req,res)=>{
    //grabar usuario, categoria
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id,(err,productoDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }        

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        //productoDB.usuario = body.usuario;        
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;  

        productoDB.save((err, productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
        

        
    })

});

// =================================================
//  BORRAR UN PRODUCTO
// =================================================
app.delete('/productos/:id', verificacionToken, (req,res)=>{
    
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true}, (err, productoSoftDelete)=> {

        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }         

        if( !productoSoftDelete ){
            return res.status(540).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }                 
    
        res.json({ 
            ok: true,
            producto: productoSoftDelete
        });        
    
    });     
});

 module.exports = app;

