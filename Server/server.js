// iniciando express
const express = require('express');
const bodyParser = require('body-parser');
const { Alumno } = require('../BaseDatos/BaseDatos.js');

let app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use(function(req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
    next(); 
});

// get app
const Operaciones = require('./Operaciones.js');

app = Operaciones.GetOperaciones.ObtenerOperaciones(app, Alumno);

const PORT = process.env.port || 4001;

app.listen(PORT, () => {
    console.log(`Servidor express corriendo en el puerto ${PORT}`);
});