const express = require('express');
const fileUpload = require('express-fileupload');
const { verificacionToken } = require('../middlewares/auth'); 
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use( fileUpload({ useTempFiles: true }) );
// este middleware hace que todos los archivos que se carguen 
// se cargan en el req.files

app.put('/uploadTemp', (req,res) => {


    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err:{
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    // nombre del input donde se sube el archivo
    let archivo = req.files.archivo;
    let nombreArchivoCortado = archivo.name.split('.');
    let extension = nombreArchivoCortado[nombreArchivoCortado.length -1];
    // nombre nombreArchivo[0]
    // extension nombreArchivo[1]

    // Extensiones permitidas
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    if( extensionesValidas.indexOf( extension) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones validas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // cambiar nombre al archivo
    let nombreArchivo = `${ new Date() }.${ extension }`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/pruebas/${ nombreArchivo }`, (err) => {
        
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
            
        res.json({
            ok: true,
            img: nombreArchivo
        });

    }); 
    
});

app.put('/upload/:tipo/:id', verificacionToken, (req,res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err:{
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    // validar tipos
    let tiposValidos = ['productos', 'usuarios'];

    if( tiposValidos.indexOf( tipo ) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
                tipo: tipo
            }
        });
    }


    // nombre del input donde se sube el archivo
    let archivo = req.files.archivo;
    let nombreArchivoCortado = archivo.name.split('.');
    let extension = nombreArchivoCortado[nombreArchivoCortado.length -1];
    // nombre nombreArchivo[0]
    // extension nombreArchivo[1]

    // Extensiones permitidas
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    if( extensionesValidas.indexOf( extension) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones validas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        
        // aqui la imagen ya se cargo 
        if( tipo === 'usuarios' ){
            imagenUsuario(id, res, nombreArchivo);
        }else if( tipo === 'productos' ){
            imagenProducto(id, res, nombreArchivo);
        }                

    }); 
    
});

function imagenUsuario( id, res, nombreArchivo ){

    Usuario.findById( id, (err, usuarioDB) => {

        if( err ){
            
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !usuarioDB ){
            
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });            
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioUpdate) => {

            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            
            res.json({
                ok: true,
                usuario: usuarioUpdate,
                img: nombreArchivo
            }
            );

        });



         

    });

}

function imagenProducto( id, res, nombreArchivo ){
    
    Producto.findById( id, (err, productoDB) => {

        if( err ){
            
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ){
            
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });            
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoUpdate) => {

            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            
            res.json({
                ok: true,
                usuario: productoUpdate,
                img: nombreArchivo
            }
            );

        });  

    });    
}

function borraArchivo(nombreImagen, tipo){

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if( fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }    

}

module.exports = app;