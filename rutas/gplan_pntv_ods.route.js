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
    tabla_target: 'pntv_ods',
    pk_tabla: 'pk_pntvods',
    sp_crud_tabla: 'sp_gplan_crud_pntv_ods'
}

var consulta_main = 'SELECT ' +
    'po.pk_pntvods, ' +
    'po.fk_obj, ' +
    'po.fk_ods, ' +
    'po.activo_pntvods, ' +
    'po.audit_creacion, ' +
    'po.audit_modificacion, ' +
    'o2.nombre_ods, ' +
    'o2.numeral_ods, ' +
    'o2.logo_ods, ' +
    'eje.pk_eje, ' +
    'eje.nombre_eje, ' +
    'eje.numeral_eje, ' +
    'o.nombre_obj, ' +
    'o.numeral_obj ' +
    'FROM pntv_ods po ' +
    'INNER JOIN objetivo_pntv o ' +
    '  INNER JOIN eje_pntv eje on o.fk_eje = eje.pk_eje ' +
    'on po.fk_obj = o.pk_obj ' +
    'INNER JOIN ods o2 on po.fk_ods = o2.pk_ods ';

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:eje/:ods', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var eje = req.params.eje;
    var ods = req.params.ods;
    var consulta;

    consulta = `${ consulta_main } WHERE fk_ods = ${ods} AND pk_eje=${eje} ORDER BY numeral_obj ASC`;

    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/config/:eje/:ods', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var eje = req.params.eje;
    var ods = req.params.ods;
    var consulta = ` SELECT` +
        `  pk_obj,` +
        `  nombre_obj,` +
        `  activo_obj,` +
        `  numeral_obj,` +
        `  (select COALESCE(pk_pntvods) FROM pntv_ods p WHERE p.fk_ods=${ods} AND p.fk_obj=pk_obj) id,` +
        `  (CASE WHEN` +
        `      ((select count(*) FROM pntv_ods p WHERE p.fk_ods=${ods} AND p.fk_obj=pk_obj) > 0) THEN` +
        `      true` +
        `      ELSE` +
        `      false` +
        `  END) as registro` +
        `  ` +
        `  from objetivo_pntv where fk_eje=${eje}` +
        `  ORDER BY numeral_obj ASC`;

    crud.getAll(datos_tabla.tabla_target, consulta, res);
});



// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:id', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id;
    //consulta si existen un registro del existente
    consulta = `SELECT * FROM ${ datos_tabla.tabla_target } WHERE ${datos_tabla.pk_tabla}= ${ id }`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, id, consulta, res);

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