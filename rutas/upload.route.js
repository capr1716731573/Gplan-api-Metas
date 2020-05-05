var express = require('express');
var fileUpload = require('express-fileupload');
var Fs = require('fs');

var app = express();
const path1 = require('path');

//variable de conexion a postgres
const pool = require('../config/db');

var extensionesPermitidas = require('../config/config').EXTENSIONES_PERMITIDAS;

//Middleware fileUpload
app.use(fileUpload());

app.post('/:id', function(req, res) {
    //que tipo de imagen quiero subir si es de Medico, Hospital, Usuario
    //var tipo = req.params.tipo;
    var id = req.params.id;

    //error si non hay archivo para subir
    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    //obtener nombre del archivo333333
    var archivo = req.files.imagen_postman;
    //extraer extendion de archivo
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Valido que el archivo tenga la extension valida acorde a la variable de configuraciones
    if (extensionesPermitidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no Valida',
            errors: { message: 'Las extensiones validas son ' + extensionesPermitidas.join(', ') }
        });
    }

    //Nombre del Archivo <nombre>-<#ramdom>.<extension>
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    //Mover el Archivo a un path o carpeta del server
    var path = path1.join(__dirname, '../') + 'uploads/' + nombreArchivo;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            })
        }
    })

    //funcion para subir y actualizar registro en la tabla o coleection de Usuario, Hospitales, Medicos
    console.log('EL Comando process.cmd() == > ' + process.cwd());
    console.log('EL Comando __dirname == > ' + __dirname);
    console.log('Probando retroceso de carpetas ===> ' + path1.join(__dirname, '../'));
    console.log(id + '   ' + nombreArchivo);

    return res.status(200).json({
        ok: true,
        nombre_archivo: nombreArchivo,
        mensaje: 'Archivo Movido',
        extensionArchivo: extensionArchivo
    });

});

module.exports = app;