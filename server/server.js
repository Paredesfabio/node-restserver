// ARCHIVO DE CONFIGURACION
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// SE DEFINEN LAS RUTAS
app.use( require('./routes/usuario'));
 
// CONEXION BASE DE DATOS MONGO
mongoose.connect(process.env.URL_DB, 
    { useNewUrlParser: true, useCreateIndex: true }, (err,res) => {
    if( err ) throw err;
    console.log('Base de Datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto: ${ process.env.PORT }`);
});