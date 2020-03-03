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
    tabla_target: 'planes_pdot',
    pk_tabla: 'pk_plan',
    sp_crud_tabla: 'sp_gplan_crud_planes'
}

var consulta_main = 'SELECT ' +
    'pla.pk_plan, ' +
    'pla.fk_pntvods, ' +
    'pla.fk_gad, ' +
    'pla.categoria_plan, ' +
    'pla.programa_plan, ' +
    'pla.anio_base_plan, ' +
    'pla.anio_meta_plan, ' +
    'pla.indicador_plan, ' +
    'pla.pk_compo, ' +
    'pla.proyecto_plan, ' +
    'pla.presupuesto_plan, ' +
    'pla.audit_creacion::json, ' +
    'pla.audit_modificacion::json, ' +
    'pla.activo_plan, ' +
    'pla.tipo_va_plan, ' +
    'pla.linea_base_plan, ' +
    'pla.meta_plan, ' +
    'pla.va_anual_plan, ' +
    'pla.unimed_plan, ' +
    'pla.fk_objestra, ' +
    'pla.fk_compgad, ' +
    'ods.pk_ods, ' +
    'ods.nombre_ods, ' +
    'ods.descripcion_ods, ' +
    'ods.logo_ods, ' +
    'ods.activo_ods, ' +
    'ods.numeral_ods, ' +
    'eje.pk_eje, ' +
    'eje.nombre_eje, ' +
    'eje.activo_eje, ' +
    'eje.numeral_eje, ' +
    'obj.pk_obj, ' +
    'obj.nombre_obj, ' +
    'obj.activo_obj, ' +
    'obj.numeral_obj, ' +
    'o.pk_objestra, ' +
    'o.nombre_objestra, ' +
    'c2.pk_compgad, ' +
    'c2.nombre_compgad, ' +
    'c2.activo_compgad, ' +
    'c2.fuente_compgad, ' +
    'compo.nombre_compo, ' +
    'compo.descripcion, ' +
    'compo.activo_compo ' +
    'FROM ' +
    'planes_pdot pla INNER JOIN pntv_ods po ' +
    '    INNER JOIN objetivo_pntv obj ' +
    '                INNER JOIN eje_pntv eje on obj.fk_eje = eje.pk_eje ' +
    '    on po.fk_obj = obj.pk_obj ' +
    '    INNER JOIN ods ON po.fk_ods = ods.pk_ods ' +
    '    on pla.fk_pntvods = po.pk_pntvods ' +
    'INNER JOIN gad on pla.fk_gad = gad.pk_gad ' +
    'INNER JOIN competencias_gad c2 on pla.fk_compgad = c2.pk_compgad ' +
    'LEFT JOIN componentes compo on pla.pk_compo = compo.pk_compo ' +
    'LEFT JOIN objetivo_estrategico o on pla.fk_objestra = o.pk_objestra ';

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/gad/:gad', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var gad = req.params.gad;
    var consulta;
    console.log(consulta_main);

    consulta = `${ consulta_main } WHERE pla.fk_gad = ${gad}`;

    crud.getAll(datos_tabla.tabla_target, consulta, res);
});


// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:id', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id;
    //consulta si existen un registro del existente
    consulta = `${ consulta_main } WHERE pla.pk_plan= ${ id }`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, id, consulta, res);

});


// ==========================================
// Ejecutar Crud acorde a parametro 
// ========================================== 
app.post('/variacion_anual', mdAuthenticationJWT.verificarToken, (req, res) => {

    //Recibo los datos en el body y con el body parser me lo transforma a JSON
    var body = req.body;
    consulta = `SELECT * FROM sp_calculo_va ('${body.json}'::json)`;
    console.log(consulta);
    crud.getValidar('consulta variacion anual', body, consulta, res);

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