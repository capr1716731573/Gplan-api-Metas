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
    tabla_target: 'submetas',
    pk_tabla: 'pk_submeta',
    sp_crud_tabla: 'sp_gplan_crud_submetas'
}

var consulta_main = 'select ' +
    ' pk_submeta, ' +
    ' fk_meta, ' +
    " COALESCE(TO_CHAR(desde_submeta:: DATE, 'yyyy-mm-dd'),'NO DEFINIDA') as desde_submeta, " +
    " COALESCE(TO_CHAR(hasta_submeta:: DATE, 'yyyy-mm-dd'),'NO DEFINIDA') as hasta_submeta, " +
    ' planificado_submeta, ' +
    ' ejecutado_submeta, ' +
    ' presup_plani_submeta, ' +
    ' presup_ejec_submeta, ' +
    ' presup_codif_submeta, ' +
    ' audit_creacion, ' +
    ' audit_modificacion, ' +
    ' COALESCE(tiempo_submeta,0) as tiempo_submeta, ' +
    " (CASE WHEN ( tiempo_submeta = 1 ) THEN 'MENSUAL (1 MES)'  " +
    " WHEN ( tiempo_submeta = 2 ) THEN 'BIMENSUAL (2 MESES)'  " +
    " WHEN ( tiempo_submeta = 3 ) THEN 'TRIMESTRAL (3 MESES)'  " +
    " WHEN ( tiempo_submeta = 4 ) THEN 'CUATRIMESTRAL (4 MESES)'  " +
    " WHEN ( tiempo_submeta = 6 ) THEN 'SEMESTRAL (6 MESES)' " +
    " WHEN ( tiempo_submeta = 12 ) THEN 'ANUAL (12 MESES)' ELSE 'NO DEFINIDO (0 MESES)' END) AS temporalidad," +
    ' round( CAST(float8( CASE WHEN (ejecutado_submeta =0 OR planificado_submeta = 0) OR (ejecutado_submeta ISNULL OR planificado_submeta ISNULL) THEN ' +
    '        0 ' +
    '     ELSE ' +
    '  ' +
    '       CASE WHEN ((ejecutado_submeta/planificado_submeta)*100) > 100 then 100.00 else ' +
    '           (ejecutado_submeta/planificado_submeta)*100 end ' +
    '     END ' +
    '     )as numeric), 2) as porcentaje_submeta, ' +
    ' round( CAST(float8( CASE WHEN (presup_ejec_submeta =0 OR presup_plani_submeta = 0) OR (presup_ejec_submeta ISNULL OR presup_plani_submeta ISNULL) THEN ' +
    '        0 ' +
    '     ELSE ' +
    '      CASE WHEN ((presup_ejec_submeta/presup_plani_submeta)*100) > 100 then 100.00 else ' +
    '           (presup_ejec_submeta/presup_plani_submeta)*100 end ' +
    '     END ' +
    '     )as numeric), 2) as porcentaje_valor ' +
    ' from submetas  ';


//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:meta', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var desde = req.query.desde;
    var meta = req.params.meta;
    desde = Number(desde);
    var fk_padre = req.query.fk_padre || 0;
    fk_padre = Number(fk_padre);
    var consulta;
    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `${ consulta_main } WHERE fk_meta = ${meta} ORDER BY desde_submeta ASC, fk_meta ASC LIMIT ${ rows } OFFSET ${ desde }`;
    } else {
        consulta = `${ consulta_main } WHERE fk_meta = ${meta} ORDER BY desde_submeta ASC, fk_meta ASC`;
    }
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

// ==========================================
// Ejecutar creacion de seguimiento
// ========================================== 
app.post('/crear_seguimiento', mdAuthenticationJWT.verificarToken, (req, res) => {

    //Recibo los datos en el body y con el body parser me lo transforma a JSON
    var body = req.body;
    consulta = `SELECT * FROM sp_gplan_crear_seguimiento ('${body.json}'::json)`;
    console.log(consulta);
    crud.getValidar('Creacion de Seguimiento', body, consulta, res);

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