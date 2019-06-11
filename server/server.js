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

// CONFIGURACION GLOBAL DE RUTAS
app.use( require('./routes/index'));
 
// CONEXION BASE DE DATOS MONGO
mongoose.connect(process.env.URL_DB, 
    { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false}, 
    (err,res) => {
        if( err ) throw err;
        console.log('Base de Datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto: ${ process.env.PORT }`);
});


// function parseJwt (token) {
//     var base64Url = token.split('.')[1];
//     var base64 = base64Url.replace('-', '+').replace('_', '/');
//     return JSON.parse(window.atob(base64));
// };
 //let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZhYmlvIFBhcmVkZXMgUm9kcmlndWV6IiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiYXNkYXNkYXNkYXNkYXNkYXNkIn0.aAdtOq1gDfpFgDZhwgL6XIckxRFifUp_mLREzGZiigU';
// parseJwt(token);