var express = require('express');
var bodyParser = require('body-parser');

var tipo_identificacion_route = require('./rutas/tipo_identificacion.route');
var geografia_route = require('./rutas/geografia.route');
var profesion_route = require('./rutas/profesion.route');
var nivel_educacion_route = require('./rutas/nivel_educacion.route');
var usuario_route = require('./rutas/usuario.route');
var persona_route = require('./rutas/persona.route');
var items_menu_route = require('./rutas/items_menu.route');
var menu_perfil_route = require('./rutas/menu_perfil.route');
var tipo_discapacidad_route = require('./rutas/tipo_discapacidad.route');
var empresa_route = require('./rutas/empresa.route');
var empresa_user_route = require('./rutas/empresa_user.route');
var perfil_route = require('./rutas/perfil.route');
var perfil_usuario_route = require('./rutas/perfil_usuario.route');
var especialidad_route = require('./rutas/especialidad.route');
var especialidad_user_route = require('./rutas/especialidad_user.route');
var login_route = require('./rutas/login.route');

var gplan_competencia_route = require('./rutas/gplan_competencia.route');
var gplan_eje_route = require('./rutas/gplan_eje.route');
var gplan_gad_route = require('./rutas/gplan_gad.route');
var gplan_meta_route = require('./rutas/gplan_meta.route');
var gplan_submeta_route = require('./rutas/gplan_submeta.route');
var gplan_objetivo_estrategico_route = require('./rutas/gplan_objetivo_estrategico.route');
var gplan_objetivo_route = require('./rutas/gplan_objetivo.route');
var gplan_ods_route = require('./rutas/gplan_ods.route');
var gplan_plan_route = require('./rutas/gplan_plan.route');
var gplan_tipo_gad_route = require('./rutas/gplan_tipo_gad.route');
var gplan_periodogestion_route = require('./rutas/gplan_periodogestion.route');
var gplan_recorrido_route = require('./rutas/gplan_recorridometa.route');
var gplan_pntvs_route = require('./rutas/gplan_pntv_ods.route');
var gplan_componentes_route = require('./rutas/gplan_componente.route');
var upload_route = require('./rutas/upload.route');


//Inicializar variables 
var app = express();

//Habilitar CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,token");
    res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS", );
    next();
});

//Configuracion Body-Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/tipo_identificacion', tipo_identificacion_route);
app.use('/geografia', geografia_route);
app.use('/profesion', profesion_route);
app.use('/nivel_educacion', nivel_educacion_route);
app.use('/usuarios', usuario_route);
app.use('/persona', persona_route);
app.use('/menu', items_menu_route);
app.use('/menu_perfil', menu_perfil_route);
app.use('/tipo_discapacidad', tipo_discapacidad_route);
app.use('/empresa', empresa_route);
app.use('/empresa_user', empresa_user_route);
app.use('/perfil', perfil_route);
app.use('/perfil_usuario', perfil_usuario_route);
app.use('/especialidad', especialidad_route);
app.use('/especialidad_user', especialidad_user_route);
app.use('/login', login_route);

app.use('/competencia', gplan_competencia_route);
app.use('/eje', gplan_eje_route);
app.use('/gad', gplan_gad_route);
app.use('/meta', gplan_meta_route);
app.use('/submeta', gplan_submeta_route);
app.use('/objetivo_estrategico', gplan_objetivo_estrategico_route);
app.use('/objetivo', gplan_objetivo_route);
app.use('/ods', gplan_ods_route);
app.use('/plan', gplan_plan_route);
app.use('/tipo', gplan_tipo_gad_route);
app.use('/periodo', gplan_periodogestion_route);
app.use('/recorrido', gplan_recorrido_route);
app.use('/pntv', gplan_pntvs_route);
app.use('/componente', gplan_componentes_route);
app.use('/cargar_archivo', upload_route);



//Configuracion 2 ->Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});