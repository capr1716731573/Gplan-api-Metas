SELECT
pla.pk_plan,
    pla.fk_pntvods,
    pla.fk_gad,
    pla.categoria_plan,
    pla.programa_plan,
    pla.anio_base_plan,
    pla.anio_meta_plan,
    pla.indicador_plan,
    pla.pk_compo,
    pla.proyecto_plan,
    pla.presupuesto_plan,
    pla.audit_creacion::json,
    pla.audit_modificacion::json,
    pla.activo_plan,
    pla.largoplazo_plan
pla.linea_base_plan,
    pla.unimed_plan,
    pla.fk_objestra,
    pla.fk_compgad,
    ods.pk_ods,
    ods.nombre_ods,
    ods.descripcion_ods,
    ods.logo_ods,
    ods.activo_ods,
    ods.numeral_ods,
    eje.pk_eje,
    eje.nombre_eje,
    eje.activo_eje,
    eje.numeral_eje,
    obj.pk_obj,
    obj.nombre_obj,
    obj.activo_obj,
    obj.numeral_obj,
    o.pk_objestra,
    o.nombre_objestra,
    c2.pk_compgad,
    c2.nombre_compgad,
    c2.activo_compgad,
    c2.fuente_compgad,
    compo.nombre_compo,
    compo.descripcion,
    compo.activo_compo
FROM
planes_pdot pla INNER JOIN pntv_ods po
INNER JOIN objetivo_pntv obj
INNER JOIN eje_pntv eje on obj.fk_eje = eje.pk_eje
on po.fk_obj = obj.pk_obj
INNER JOIN ods ON po.fk_ods = ods.pk_ods
on pla.fk_pntvods = po.pk_pntvods
INNER JOIN gad on pla.fk_gad = gad.pk_gad
INNER JOIN competencias_gad c2 on pla.fk_compgad = c2.pk_compgad
LEFT JOIN componentes compo on pla.pk_compo = compo.pk_compo
LEFT JOIN objetivo_estrategico o on pla.fk_objestra = o.pk_objestra