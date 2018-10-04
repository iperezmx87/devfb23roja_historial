var GetOperaciones = {
    ObtenerOperaciones: (app, Alumno, Asignatura, Calificacion) => {
        
        app.get("/", (req, res) => {
            res.send("<h1>Bienvenido al API del historial. Revisa la documentación</h1>");
        });

        // nuevo alumno
        app.post('/api/v1/alumno', (req, res)=> {
            let json = req.body;
            const nuevoAlumno = Alumno(json);

            nuevoAlumno
            .save((error, alumnoCreado) => {
                res.status(200).send({
                    "message" : "Alumno creado exitosamente" ,
                    "body": alumnoCreado,
                    "error": error
                });
            });
        });

        // obtener calificaciones del alumno por id
        app.get('/api/v1/alumno/:id/', (req, res) => {
            const alumnoId = req.params.id;  

            Alumno
            .findOne({ _id: alumnoId })
            .populate('Asignaturas')
            .populate('Calificacion')
            .exec()
            .then(listaAlumnos => {
                res.status(200).send({
                    "message": "Lista de artículos obtenida exitosamente",
                    "body": listaAlumnos
                });
            })
            .catch(error => {
                res.status(404).send({
                    "message": error,
                    "body": null
                });
            })
        });

        // actualizar alumno
        app.put('/api/v1/alumno/:id/', (req, res) => {
            const alumnoId = req.params.id;
            
            let alumnoUpdate = {
                Nombre: req.body.Nombre,
                ApellidoPaterno: req.body.ApellidoPaterno,
                ApellidoMaterno: req.body.ApellidoMaterno,
                Matricula: req.body.Matricula,
            }

            Alumno
            .findByIdAndUpdate(alumnoId,
                {$set: alumnoUpdate},
                {new:true})
            .exec()
            .then((alumnoActualizado) => {
                res.status(200).send({
                    "message":"Alumno modificado correctamente",
                    "body":alumnoActualizado
                });
            })
            .catch(error => res.status(404).send({
                "message": error,
                "body": null
            }));
        });

        // consulta de calificaciones por alumno
        // buscando alumno por matricula
        app.get('/api/v1/alumno/busqueda/:search/', (req, res) => {
            const serachValue = req.params.search;

            // buscando con regex
            Alumno
            .find({Matricula: {$regex: '.*' + serachValue + '.*', $options:'i'}})
            .exec()
            .then(resultados => {
                res.status(200).send({
                    "message": "Lista de resultados",
                    "body": resultados
                });
            })
            .catch(error => {
                res.status(404).send({
                    "message": error,
                    "body": null
                });
            });
            
        });

        // carga de calificaciones por alumno
        // unitaria
        // se recibe el siguiente objeto
      //  {
        //    "AlumnoId":"abscfed",
         //   "Asignatura":{
         //       Nombre: "Fisica I",
         //       Creditos: 10,
         //       Semestre:1,
         //       Calificacion: {
          //          Evaluacion: "Ordinario", // Ordinario o Extraordinario
          //          Calificacion: 7, // NP, 5-10
         //       }
        //    }
      //  }
        app.post("/api/v1/alumno/calificacion/", (req,res) => {
            // una buena transaccion
            // primero inserto la calificacion
            const requestBody = req.body;
            const nuevaCalif = Calificacion(requestBody.Asignatura.Calificacion);
            
            console.log("guardando calificacion");

            nuevaCalif
            .save((error, califGrabada) => {
                // recibo el id de la calificacion
                // insertando la asignatura
                const nuevaAsignatura = Asignatura({
                    Nombre: requestBody.Asignatura.Nombre,
                    Creditos:requestBody.Asignatura.Creditos,
                    Semestre: requestBody.Asignatura.Semestre,
                    // la relacion bebe
                    Calificacion: califGrabada._id
                });

                console.log("se guardo la calificacion. se guarda asignatura");

                nuevaAsignatura
                .save((error, asignaturaGrabada) => {
                    // update a alumno para colocar la nueva calificacion
                    Alumno
                    .findOne({ _id: requestBody.AlumnoId })
                    .exec()
                    .then(alumno => {
                        // actualizarlo colocando una calificacion

                        console.log("se guardo la asignatura, ahora se actualizara el alumno");

                        const calificacionesAlumno = alumno.Asignaturas;
                        
                        // es un array de ids, asi que hay que modificarlo
                        calificacionesAlumno.push(asignaturaGrabada._id);

                        alumno
                        .save()
                        .then((alumnoActualizado) => {
                            console.log("yeah !!! :D ");
                            res.status(200).send({
                                "message": "Proceso completado exitosamente",
                                "body": alumnoActualizado
                            });
                        })
                        .catch(error => {
                            res.status(500).send({
                                "message": error,
                                "body": null
                            });
                        });
                    })
                    .catch(error => {
                        res.status(404).send({
                            "message": error,
                            "body": null
                        });
                    })
                });
            });
        });

        return app;
    }
}

module.exports = { GetOperaciones };