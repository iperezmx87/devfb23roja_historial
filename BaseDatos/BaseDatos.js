const URL_DB = "mongodb://admin:Admin123@ds052827.mlab.com:52827/devfcrojab23_historial";

const mongoose = require('mongoose');

mongoose.connect(URL_DB,
     {
         useNewUrlParser:true
     },
     () =>{
         console.log("Conexion exitosa con la base de datos");
});

const Schema = mongoose.Schema;

const AlumnoSchema = Schema({
    Nombre: {type: String, require:true},
    ApellidoPaterno: {type: String, require:true},
    ApellidoMaterno: String,
    Matricula: {type: String, require:true}
});

const Alumno = mongoose.model('Alumno', AlumnoSchema);

module.exports = { Alumno };