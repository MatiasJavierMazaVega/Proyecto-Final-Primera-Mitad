const express = require('express');
const app = express();
const mysql = require('mysql2');
const hbs = require('hbs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();


//Configuramos el puerto
const PORT = process.env.PORT || 9000;

//Middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Configuramos el motor de plantillas de HBS
app.set('view engine', 'hbs');
//Configuramos la ubicacion de las plantillas
app.set('views', path.join(__dirname, 'views'));
//Configuramos los parciales de los motores de plantillas
hbs.registerPartials(path.join(__dirname, 'views/partials'));



//Conexion a la Base de Datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DBPORT
})

conexion.connect((err) =>{
    if(err) throw err;
    console.log(`Conectado a la Base de Datos ${process.env.DATABASE}`);
})

//Rutas de la aplicacion
app.get('/', (req, res) => {
    res.send('Bienvenido a la App')
})

//Servidor a la escucha de las peticiones
app.listen(PORT, ()=>{
    console.log(`Servidor trabajando en el Puerto: ${PORT}`);
})

