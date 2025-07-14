//En este archivo estarán todas las rutas de los end point creados en nuestra API
/*::::::::::::::::::::::::::::	EJEMPLOS	*/
// export const GET_LIST_GESTION_CLIENTE = 'GCPersonas/GetListPersonas/'
// export const GET_CAT_ACT_CNBV_BY_ID = 'ActividadesCNBV/GetById/'
// export const CREATE_CAT_ACT_CNBV = 'ActividadesCNBV/Create'
// export const UPDATE_CAT_ACT_CNBV = 'ActividadesCNBV/Update'
// export const DELETE_CAT_ACT_CNBV = ''

/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::	SIAC	:::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */


/*:::::::::::::::::::::::::::::::::::::::::CUSAP:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
/*::::::::::::::::::::::::::::	LOGIN	*/
export const LOGIN_USER = 'auth/login'

/*::::::::::::::::::::::::::::	LOGOUT	*/
export const LOGOUT_USER = 'auth/logout/'

/*::::::::::::::::::::::::::::	USUARIOS	*/


export const GET_LIST_USER = 'usuario/getAll'
export const GET_LIST_USER_ALL = 'usuario/getAllUser'
export const GET_USER_BY_ID = 'usuario/getById/'
export const CREATE_USER = 'auth/register'
export const UPDATE_USER = 'usuario/update/'
export const DELETE_USER = 'usuario/deleteUser/'
export const DELETE_REEMPLAZAR = ''
export const GET_LIST_USER_ALMACEN = 'usuario/getAllUserAlmacen/'
export const GET_LIST_USER_ASINACION = 'usuario/getAllUserAsignado/'
export const ENVIAR_CORREO_PASS = 'usuario/enviarCorreoRec'
export const ENVIAR_CODIGO_PASS = 'usuario/validarCorreoRec'
export const CAMBIAR_PASS = 'usuario/recPass'

/*::::::::::::::::::::::::::::	UsuariosSistemas (Modulos)	*/
export const GET_MODULOS_BY_ID = 'usuario/SistemaByIdUser/'
/*:::::::::::::::::::::::::::::::::::::::::PREEGRE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
/*::::::::::::::::::::::::::::	CATALOGOS	*/
/*::::::::::::::::::::::::::::	Almacen	*/ //FALTA CONSUMIR###
export const GET_LIST_CAT_ALMACEN = 'catAlmacenes/getAll'
export const GET_CAT_ALMACEN_BY_ID = 'catAlmacenes/getById/'
export const CREATE_CAT_ALMACEN = 'catAlmacenes/register'
export const UPDATE_CAT_ALMACEN = 'catAlmacenes/update/'
export const DELETE_CAT_ALMACEN = ''


/*::::::::::::::::::::::::::::	Unidad de Medida	*/ //FALTA CONSUMIR###
export const GET_LIST_CAT_UNIDAD_MEDIDA = 'catUnidadMedidas/getAll'
export const GET_CAT_UNIDAD_MEDIDA_BY_ID = 'catUnidadMedidas/getById/'
export const CREATE_CAT_UNIDAD_MEDIDA = 'catUnidadMedidas/register'
export const UPDATE_CAT_UNIDAD_MEDIDA = 'catUnidadMedidas/update/'
export const DELETE_CAT_UNIDAD_MEDIDA = ''
export const GET_CAT_UNIDAD_MEDIDA_EXCEL = 'catUnidadMedidas/exportar'

/*::::::::::::::::::::::::::::	Grupo familia	*/ //FALTA CONSUMIR###
export const GET_LIST_CAT_GRUPO_FAMILIA = 'catGpoFamilia/getAll'
export const GET_CAT_GRUPO_FAMILIA_BY_ID = 'catGpoFamilia/getById/'
export const CREATE_CAT_GRUPO_FAMILIA = 'catGpoFamilia/register'
export const UPDATE_CAT_GRUPO_FAMILIA = 'catGpoFamilia/update/'
export const DELETE_CAT_GRUPO_FAMILIA = ''
export const GET_LIST_CAT_GRUPO_FAMILIA_PERSONALIZADO = 'catGpoFamilia/getAllPersonalizado/'
export const GET_CAT_GRUPO_FAMILIA_EXCEL = 'catGpoFamilia/exportar'

/*::::::::::::::::::::::::::::	Productos	*/ //FALTA CONSUMIR###  
export const GET_LIST_CAT_PRODUCTOS = 'catProductos/getAll'
export const GET_CAT_PRODUCTOSBY_ID = 'catProductos/getById/'
export const CREATE_CAT_PRODUCTOS = 'catProductos/register'
export const CREATE_CAT_PRODUCTOS_SIN_CLAVE = 'catProductos/registerSinClave'
export const UPDATE_CAT_PRODUCTOS = 'catProductos/update/'
export const DELETE_CAT_PRODUCTOS = ''
export const GET_LIST_CAT_PRODUCTOS_PERSONALIZADO = 'catProductos/getAllPersonalizado/'
export const GET_CAT_PRODUCTOSBY_ID_CATEGORIA = 'catProductos/getBygetByCategoria/'
export const GET_CAT_PRODUCTOS_EXCEL = 'catProductos/exportar'

/*::::::::::::::::::::::::::::	Roles	*/ //FALTA CONSUMIR###
export const GET_LIST_CAT_ROLES = 'catRoles/getAll'
export const GET_CAT_ROLES_BY_ID = 'catRoles/getById/'
export const CREATE_CAT_ROLES = 'catRoles/register'
export const UPDATE_CAT_ROLES = 'catRoles/update/'
export const DELETE_CAT_ROLES = ''
export const GET_ROLES_EXCEL = 'catRoles/exportar'

/*::::::::::::::::::::::::::::	Roles	*/ //FALTA CONSUMIR###
export const UPLOAD_GET_MESSAGE = 'process-csv'

/*::::::::::::::::::::::::::::	Roles*/
export const GET_LIST_CAT_UBICACIONES = 'catUbicaciones/getAll'
export const GET_LIST_CAT_UBICACIONES_PAGINATE = 'catUbicaciones/getAllPaginate'
export const GET_CAT_UBICACIONES_BY_ID = 'catUbicaciones/getById/'
export const CREATE_CAT_UBICACIONES = 'catUbicaciones/register'
export const UPDATE_CAT_UBICACIONES = 'catUbicaciones/update/'

export const GET_LIST_DATELLE_ARCHIVO = 'tabCargaDetalle/getAll';
export const CREATE_INSERTAR_FALTANTES = 'InsertarDatos';
export const CREATE_CABECERA_DETALLE_ARCHIVO = 'detalleArchivo/'; // CREAR CABECERA  
export const CREATE_CATALOGOS_COMPLEMENTOS_ARCHIVO = '/cargarArchivoCompleto/';
export const CREATE_CATALOGO_PRODUCTO_ARCHIVO = 'InsertarDatos';
export const CREATE_CABECERA_NO_INSERTFALTANTES = 'noInsertarFaltantes/';
export const CREATE_CABECERA_INSERTFALTANTES = 'detalleUsuarioAsignacionCompleto/';
export const GET_NOMBRE_ARCHIVO = 'nombreArchivoExi';
export const UPDATE_VALIDAR_CIERRE = 'tabCargaDetalle/updateValidarCierre';
export const GET_VALIDAR_CIERRE_USUARIOS = 'tabCargaDetalle/ValidarCierreUsuarios/';
export const DELETE_CARGA = 'tabCargaDetalle/deleteCarga/';
export const GET_CONTEO_BY_IDCARGA_CONTEO = 'tabCargaDetalle/validarEstatusCarga/'; //Parametros idCarga y numero de conteo

/*::::::::::::::::::::::::::::	ASIGNACIONES	*/
export const CREATE_DESIGNAR = 'TabAsignacion/Designacion/';
export const CREATE_ASIGNAR = 'TabAsignacion/Asignacion';
export const CERRAR_ALL_ASIGANDOS = 'TabAsignacion/CerrarAll/';
export const GET_ALL_ASIGNACION_PERONALIZADO = 'TabAsignacion/getAllPersonalizado/'
export const UPDATE_ASIGNACION_ESTATUS = 'actualizarEstatus/'
export const UPDATE_ASIGNACION_ESTATUS_FECHA_INICIO = 'actualizarEstatusFechaInicio/'
export const UPDATE_ASIGNACION_ESTATUS_FECHA_FIN = 'actualizarEstatusFechaFin/'


export const CAMBIO_ESTATUS_CABECERA = 'ActualizarStatus/';
export const GET_ARCHIVO_CARGA_DETALLE = 'cargaArchivo/'

//nuevo conteo
export const UPDATE_CABECERA_ESTATUS_CONTEO = 'tabCargaDetalle/updateConteo/'
export const UPDATE_ASIGNACION_ESTATUS_CONTEO = 'TabAsignacion/NuevoConteoAsignacion/'

export const GET_CARGA_DETALLE_ASIGANDO = 'detalleUsuarioAsignacion/'

/*::::::::::::::::::::::::::::	oObservaciones	*/
export const GET_LIST_OBSERVACIONES = 'tabObsercaiones/getAll'
export const GET_OBSERVACIONES_ID = 'tabObsercaiones/getById/'
export const GET_OBSERVACIONES_ID_CARGA = 'tabObsercaiones/getByIdCarga/'
export const GET_OBSERVACIONES_ID_CARGA_USER = 'tabObsercaiones/getByIdCargaIdUser/'
export const CREATE_OBSERVACIONES = 'tabObsercaiones/register'
export const UPDATE_OBSERVACIONES = 'tabObsercaiones/update/'
export const DELETE_OBSERVACIONES = ''

/*::::::::::::::::::::::::::::	CONTEO	*/
export const GET_LIST_CONTEO = 'TabConteo/getAll'
export const GET_LIST_CONTEO_IDCARGA = 'TabConteo/getByIDCarga/'
export const GET_LIST_CONTEO_IDCARGA_IDUSER = 'TabConteo/getByIDCargaIDUser/'
export const GET_CONTEO_BY_ID = 'TabConteo/getById/'
export const CREATE_CONTEO = 'TabConteo/register'
export const UPDATE_CONTEO = 'TabConteo/update/'
export const DELETE_CONTEO_BY_IDS = 'TabConteo/deleteConteoAllByIDCargaIDUser/'
export const GET_CONTEOS = 'TabConteo/getConteosGeneral/'
export const GET_DIFERENCIA_CONTEOS = 'TabConteo/getDiferenciasConteo/'
export const GET_NUM_CONTEOS_BY_CARGA = 'TabConteo/getNumConteoByCarga/'
export const GET_CONTEOS_CONCENTRADOS_BY_CARGA = 'TabConteo/getConcentradoByCarga/'
export const GET_DIFERENCIA_CA = 'TabConteo/getDiferenciasCA/'


/*::::::::::::::::::::::::::::	conceptos	*/ //FALTA CONSUMIR### actualizarEstatusFechaInicio/
// export const GET_LIST_CAT_REEMPLAZAR = 'catConceptos/getAllByCapitulo/'
// export const GET_CAT_REEMPLAZAR_BY_ID = 'catConceptos/getById/'
// export const CREATE_CAT_REEMPLAZAR = 'catConceptos/create'
// export const UPDATE_CAT_REEMPLAZAR = 'catConceptos/update/'
// export const DELETE_CAT_REEMPLAZAR = ''


///GENERACION DE TICKETS//
/*::::::::::::::::::::::::::::	RESETEAR BANDERAS Y ARCHIVOS*/ //FALTA CONSUMIR###
export const FORMATEAR_SOLICITUD = 'tabSolicitudes/formatearSolicitud/'
/*::::::::::::::::::::::::::::	ARCHIVOS COTIZACION	GENERAL*/ //FALTA CONSUMIR###
export const CREATE_ARCHIVO_COTIZACIONES_GENERAL = 'tabCotizacionesSolicitudes/register'
export const GET_ARCHIVO_COTIZACIONES_BY_ID_SOLICITUD_DETALLE_GENERAL = 'tabCotizacionesSolicitudes/getByIdDetalle/'
export const DELETE_ARCHIVO_COTIZACIONES_GENERAL = 'tabCotizacionesSolicitudes/delete'
export const UPDATE_ARCHIVO_COTIZACIONES_GENERAL = 'tabCotizacionesSolicitudes/update'
/*::::::::::::::::::::::::::::	ARCHIVOS COTIZACION	*/ //FALTA CONSUMIR###
export const CREATE_ARCHIVO_COTIZACIONES = 'tabCotizacionesSolicitudDetalle/register'
export const GET_ARCHIVO_COTIZACIONES_BY_ID_SOLICITUD_DETALLE = 'tabArchivoSolicitudesDetalle/getByIDSolicitudDeta/'
export const DELETE_ARCHIVO_COTIZACIONES = 'tabCotizacionesSolicitudDetalle/delete'
export const UPDATE_ARCHIVO_COTIZACIONES = 'tabCotizacionesSolicitudDetalle/update'
/*::::::::::::::::::::::::::::	ARCHIVOS	*/ //FALTA CONSUMIR###
export const CREATE_ARCHIVO = 'tabArchivoSolicitudesDetalle/register'
export const GET_ARCHIVO_BY_ID_SOLICITUD_DETALLE = 'tabArchivoSolicitudesDetalle/getByIDSolicitudDeta/'
export const DELETE_ARCHIVO = 'tabArchivoSolicitudesDetalle/delete'

/*::::::::::::::::::::::::::::	SOLICITUD DETALLE	*/ //FALTA CONSUMIR###
export const GET_LIST_TAB_SOLICITUDES_DETALLE = 'tabSolicitudesDetalle/getAll'
export const GET_TAB_SOLICITUDES_DETALLE_BY_ID = 'tabSolicitudesDetalle/getById/'
export const GET_TAB_SOLICITUDES_DETALLE_BY_ID_SOLICITUD = 'tabSolicitudesDetalle/getByIDSolicitud/'
export const CREATE_TAB_SOLICITUDES_DETALLE = 'tabSolicitudesDetalle/register'
export const UPDATE_TAB_SOLICITUDES_DETALLE = 'tabSolicitudesDetalle/update/'
export const DELETE_TAB_SOLICITUDES_DETALLE = 'tabSolicitudesDetalle/deleteByDetalle/'

/*::::::::::::::::::::::::::::	SOLICITUD	*/ //FALTA CONSUMIR###   tabSolicitudes/asignar
export const GET_LIST_TAB_SOLICITUDES = 'tabSolicitudes/getAll'
export const GET_TAB_SOLICITUDES_BY_ID = 'tabSolicitudes/getById/'
export const CREATE_TAB_SOLICITUDES = 'tabSolicitudes/register'
export const UPDATE_TAB_SOLICITUDES = 'tabSolicitudes/update/'
export const UPDATE_ESTATUS_SOLICITUDES = 'tabSolicitudes/cambiarEstatus'
export const ASIGNAR_USUARIO_SOLICITUDES = 'tabSolicitudes/asignar'
export const REASIGNAR_USUARIO_SOLICITUDES = 'tabSolicitudes/reasignar'
export const DELETE_TAB_SOLICITUDES = ''
export const GET_TAB_COTIZACIONESSOLICITUD_BY_ID ='tabSolicitudes/getCotizaciones/'

/*::::::::::::::::::::::::::::	Cat Moneda	*/
export const GET_LIST_MONEDA = 'catMoneda/getAll'
export const GET_MONEDA_ID = 'catMoneda/getById/'
export const CREATE_MONEDA = 'catMoneda/register'
export const UPDATE_MONEDA = 'catMoneda/update/'
export const GET_MONEDA_EXCEL = 'catMoneda/exportar'

/*::::::::::::::::::::::::::::	Cat Centro	*/
export const GET_LIST_CENTRO = 'catCentro/getAll'
export const GET_CENTRO_ID = 'catCentro/getById/'
export const CREATE_CENTRO = 'catCentro/register'
export const UPDATE_CENTRO = 'catCentro/update/'

/*::::::::::::::::::::::::::::	Cat Categoria	*/
export const GET_LIST_CATEGORIA = 'catCategorias/getAll'
export const GET_CATEGORIA_ID = 'catCategorias/getById/'
export const GET_CATEGORIA_ID_DEPARTAMENTO = 'catCategorias/getByDpto/'
export const CREATE_CATEGORIA = 'catCategorias/register'
export const UPDATE_CATEGORIA = 'catCategorias/update/'
export const GET_CAT_BY_TIPO = 'catCategorias/getByIdCat/'
export const GET_CATEGORIA_EXCEL = 'catCategorias/exportar'

/*::::::::::::::::::::::::::::	Cat Tipo	*/
export const GET_LIST_TIPO = 'catTipos/getAll'
export const GET_TIPO_ID = 'catTipos/getById/'
export const GET_TIPO_ID_DEPARTAMENTO = 'catTipos/getByDpto/'
export const CREATE_TIPO = 'catTipos/register'
export const UPDATE_TIPO = 'catTipos/update/'
export const GET_TIPO_EXCEL = 'catTipos/exportar'

/*::::::::::::::::::::::::::::	Cat Departamento	*/
export const GET_LIST_DEPARTAMENTO = 'catDepartamentos/getAll'
export const GET_DEPARTAMENTO_ID = 'catDepartamentos/getById/'
export const CREATE_DEPARTAMENTO = 'catDepartamentos/register'
export const UPDATE_DEPARTAMENTO = 'catDepartamentos/update/'
export const CREATE_CAT_DEPARTAMENTO = 'tabDepartamento/cateDepartamento'
export const GET_ALL_COMPRAS = 'usuario/getCompras'
export const GET_DEPARTAMENTO_EXCEL = 'catDepartamentos/exportar'

/*::::::::::::::::::::::::::::	Tab observaciones solicitud	*/
export const GET_LIST_OBSERVACIONES_SOLICITUD = 'tabObservacionSolicitud/getAll'
export const GET_OBSERVACIONES_SOLICITUD_BYID = 'tabObservacionSolicitud/getById/'
export const GET_OBSERVACIONES_SOLICITUD_ID = 'tabObservacionSolicitud/solicitud/'
export const CREATE_OBSERVACIONES_SOLICITUD = 'tabObservacionSolicitud/register'
export const UPDATE_OBSERVACIONES_SOLICITUD = 'tabObservacionSolicitud/update/'

export const CAMBIAR_ESTATUS = 'tabSolicitudes/cambiarEstatus'

/*::::::::::::::::::::::::::::	Tab observaciones articulo detalle	*/
export const GET_LIST_OBSERVACIONES_ARTICULOS_DETALLE = 'tabobservacionesSolicitudDetalle/getAll'
export const GET_OBSERVACIONES_ARTICULOS_DETALLE_ID = 'tabobservacionesSolicitudDetalle/getById/'
export const CREATE_OBSERVACIONES_ARTICULOS_DETALLE = 'tabobservacionesSolicitudDetalle/register'
export const UPDATE_OBSERVACIONES_ARTICULOS_DETALLE = 'tabobservacionesSolicitudDetalle/update/'

export const TABLA_REPORTE = 'tabSolicitudes/reporte'