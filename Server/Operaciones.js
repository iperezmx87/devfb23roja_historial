var GetOperaciones = {
    ObtenerOperaciones: (app, Alumno) => {
        
        app.get("/", (req, res) => {
            res.send("<h1>Bienvenido al API del historial. Revisa la documentación</h1>");
        });

        app.get('/api/v1/Alumnos', (req, res) => {
            console.log(Alumno);
            
            
            Alumno
            .find()
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

        return app;
    }
}

module.exports = { GetOperaciones };