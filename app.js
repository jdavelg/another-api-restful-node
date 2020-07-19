'use strict'

//cargar modulos de node
var express= require('express')
var bodyParser= require('body-parser')
var app= express();


//ejecutar express(http)

//cargar ficheros rutas
var article_routes= require('./rutas/article')


//Midllewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

//cargar CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});





//añadir prefijos a rutas/ cargar rutas
app.use('/api', article_routes)



//ruta de prueba
/* app.get('/', (req, res)=> {
    res.status(200).send({
        name:'jonathan',
        apellidos:'lopez'
    })
}) */

//exportar modulo
module.exports= app