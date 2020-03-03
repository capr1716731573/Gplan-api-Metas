var express = require('express');
var app = express();
var rows = require('../config/config').ROWS_POR_PAG;
var mdAuthenticationJWT = require('../middlewares/authentication');
//variable de conexion a postgres
const pool = require('../config/db');

//datos de funcion crud general
var crud = require('../funciones/crud_operaciones');
//DATOS DE LA TABLA
var datos_tabla = {
    tabla_target: 'metas',
    pk_tabla: 'pk_meta',
    sp_crud_tabla: 'sp_gplan_crud_metas'
}

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:plan', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var desde = req.query.desde;
    var plan = req.params.plan;
    desde = Number(desde);
    var fk_padre = req.query.fk_padre || 0;
    fk_padre = Number(fk_padre);
    var consulta;
    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `SELECT * FROM ${ datos_tabla.tabla_target } WHERE fk_plan = ${plan} ORDER BY anio_meta ASC LIMIT ${ rows } OFFSET ${ desde }`;
    } else {
        consulta = `SELECT * FROM ${ datos_tabla.tabla_target } WHERE fk_plan = ${plan} ORDER BY anio_meta ASC`;
    }
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});


// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:id', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id;
    //consulta si existen un registro del existente
    consulta = `SELECT * FROM ${ datos_tabla.tabla_target } WHERE ${datos_tabla.pk_tabla}= ${ id } ORDER BY anio_meta ASC`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, id, consulta, res);

});


// ==========================================
// Obtener registro Linea Base
// ========================================== 
app.get('/linea_base/:plan', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var plan = req.params.plan;
    //consulta si existen un registro del existente
    consulta = `SELECT * FROM sp_getLineaBase(${ plan })`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, plan, consulta, res);

});


// ==========================================
// Ejecutar creacion de metas
// ========================================== 
app.post('/crear_metas', mdAuthenticationJWT.verificarToken, (req, res) => {

    //Recibo los datos en el body y con el body parser me lo transforma a JSON
    var body = req.body;
    consulta = `SELECT * FROM sp_gplan_crear_metas ('${body.json}'::json)`;
    console.log(consulta);
    crud.getValidar('Creacion de Metas', body, consulta, res);

});


// ==========================================
// Ejecutar Crud acorde a parametro 
// ========================================== 
app.post('/', mdAuthenticationJWT.verificarToken, (req, res) => {

    //Recibo los datos en el body y con el body parser me lo transforma a JSON
    var body = req.body;
    consulta = `SELECT * FROM ${datos_tabla.sp_crud_tabla} ($1,$2)`;
    crud.crudBasico(datos_tabla.tabla_target, consulta, body, res);

});


module.exports = app;