const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const saltRounds = 10;

// MODELOS DE BASE DE DATOS
const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0 ; 
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let condicion = {
        estado: true
    };
    
    Usuario.find(condicion, 'nombre email role estado google img')
            .skip( desde )        
            .limit( limite )            
            .exec( (err, usuarios) => {

                if( err ){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                } 
                
                Usuario.count(condicion, (err, conteo) =>{

                    if( err ){
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }                     

                    res.json({
                        ok: true,
                        usuarios,
                        conteo
                    });

                });


            } )
  });
  
  app.post('/usuario', function (req, res) {
        let body = req.body;
        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync( body.password, saltRounds ) ,
            //img: body.img,
            role: body.role
        });

        usuario.save( (err, usuarioDB) =>{
            if( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            } 
            
            res.json({
                ok: true,
                usuario: usuarioDB
            });


        });
  });
  
  app.put('/usuario/:id', function (req, res) {
      let id = req.params.id;
      // PARA ACTUALIZAR SOLO LAS PROPIEDADES QUE QUIERO
      let body = _.pick(req.body, [ 'nombre', 'email','img','role','estado' ]);

      Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true}, (err, usuarioDB)=> {

        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }         

        res.json({ 
            ok: true,
            usuario: usuarioDB
        });        

      });

  });
  
  app.delete('/usuario/:id', function (req, res) {
    
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    //Usuario.findByIdAndUpdate(id, { $set: { estado: false }}, { new: true, runValidators: true}, (err, usuarioSoftDelete)=> {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true}, (err, usuarioSoftDelete)=> {

        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }         

        res.json({ 
            ok: true,
            usuario: usuarioSoftDelete
        });        

      });    
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if( err ){
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }   
        
    //     if(!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         }); 
    //     }else{
    //         res.json({ 
    //             ok: true,
    //             usuario: usuarioBorrado
    //         });   
    //     }

    // });


  });

  module.exports = app;