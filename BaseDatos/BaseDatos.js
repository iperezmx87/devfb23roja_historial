const URL_DB = "mongodb://admin:Admin123@ds052827.mlab.com:52827/devfcrojab23_historial";

const mongoose = require('mongoose');

mongoose.connect(URL_DB,
     { useNewUrlParser:true },
     () =>{
         console.log("Conexion exitosa con la base de datos");
});

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.ObjectId;

const AlumnoSchema = Schema({
    Nombre: {type: String, require:true},
    ApellidoPaterno: {type: String, require:true},
    ApellidoMaterno: String,
    Matricula: {type: String, require:true},
    Asignaturas: [{type: ObjectId, ref: 'Asignatura'}],
    Plantel: {type: String, require:true}
});

const AsignaturaSchema = Schema({
    Nombre: {type: String, require:true},
    Creditos: Number,
    Semestre:{type: Number, require:true},
    Calificacion: {type: ObjectId, ref: 'Calificacion'}
});

const CalificacionSchema = Schema({
    Evaluacion: {type: String, require:true}, // Ordinario o Extraordinario
    Calificacion: {type: String, require:true}, // NP, 5-10
});

const Alumno = mongoose.model('Alumno', AlumnoSchema);
const Asignatura = mongoose.model('Asignatura', AsignaturaSchema);
const Calificacion = mongoose.model('Calificacion', CalificacionSchema);

module.exports = { Alumno, Asignatura, Calificacion };