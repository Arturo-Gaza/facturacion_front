const responses = {
	forbidden: 'No tiene permisos para realizar esta acción',
	created: 'Los datos se crearon con éxito',
	updated: 'Los datos se guardaron con éxito',
	deleted: 'Registro eliminado con exito',
	serverError: 'Error en el servidor, contacta a tu administrador de sistemas',
	login: 'Favor de iniciar sesión',
	sessionExpired: 'La sesión expiró, por favor inicia sesión nuevamente',
	networkError: 'Error de red - Asegurate de tener conexión a Internet',
	systemError: 'Error de sistema',
	nothingToExport: 'No se encontraron registros para exportar',
	passwordSent: 'La contraseña fue enviada con éxito',
}
const confirmations = {
	enableTitle: '¿Desea activar el registro?',
	enable: 'El registro será activado',
	disableTitle: '¿Desea desactivar el registro?',
	disable: 'El registo podrá ser reactivado más tarde',
	deleteTitle: '¿Desea eliminar el registro?',
	delete: 'El registro será eliminado',
}

const warnings = {
	unselectedTable: 'Primero selecciona un catálogo.',
}
const baseUrls = {
	//EJEMPLOS
	// getBaseUrl: process.env.REACT_APP_URL_LOCAL,
	//getBaseUrl: 'https://localhost:7101/api',
	//getBaseUrl: 'https://localhost:44377/api/',
	//getBaseUrl: 'https://localhost:44337/api',
	//getBaseUrl: 'https://sys-app-full.azurewebsites.net/api/',
	// getBaseUrl: 'https://www.finaccess.com.mx/webservices/apphw/', ///Produccion FINACCESS
	//getBaseUrl: 'https://spp1.finaccess.com.mx/webservices/apphw/', ///QA FINACCESS
	//PRODUCCIÓN
}

const Dictionary = {
	baseUrls,
	confirmations,
	responses,
	warnings,
}

export default Dictionary
