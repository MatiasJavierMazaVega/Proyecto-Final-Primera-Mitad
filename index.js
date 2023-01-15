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
app.use(express.static(path.join(__dirname, '/public')));

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

//rutas de la aplicacion
app.get('/', (req, res) =>{
    res.render('index',  {
        titulo: 'El Rincón de las Patas'
    })
})


app.get('/perros', (req, res) =>{
    let sql = "SELECT * FROM perros";
    conexion.query(sql, function(err, result){
            if (err) throw err;
                console.log(result);
                res.render('perros',  {
                    titulo: 'Perros',
                    datos: result
                })
        })
})


app.get('/gatos', (req, res) =>{
    let sql = "SELECT * FROM gatos";
    conexion.query(sql, function(err, result){
            if (err) throw err;
                console.log(result);
                res.render('gatos',  {
                    titulo: 'Gatos',
                    datos: result
                })
        })
})

app.get('/adopcion', (req, res) =>{
    res.render('adopcion',  {
        titulo: 'Formulario de Adopción'
    })
})


app.post('/adopcion', (req, res) =>{
    const nombrePersona = req.body.nombrePersona;
    const email = req.body.email;
    const telefono = req.body.telefono;
    const codigoMascota = req.body.codigoMascota;

    

    //función de mail
    async function envioMail(){
        //configurar cuenta de envío
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD
            },
            tls: {rejectUnauthorized: false}
        });
        //envío del mail
        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: `${email}`,
            subject: "Gracias por contactarnos",
            html: `Muchas gracias por confiar en El Rincón de las Patas!! <br>
                   Su pedido de adopción se ha registrado correctamente y nos pondremos en contacto a la brevedad para coordinar los detalles. <br>
                   Saludos!`
        })
    }

    let datos = {
        nombrePersona: nombrePersona,
        email: email,
        telefono : telefono,
        codigoMascota: codigoMascota
    }


    let sql = "insert into adopcion set ?"

    conexion.query(sql, datos,  function(error){
        if (error) throw error;
        console.log('1 registro insertado');
        envioMail().catch(console.error);
    })
    res.render('index',  {
        titulo: 'El Rincón de las Patas'
    })
    
    })


//Servidor a la escucha de las peticiones
app.listen(PORT, ()=>{
    console.log(`Servidor trabajando en el Puerto: ${PORT}`);
})




