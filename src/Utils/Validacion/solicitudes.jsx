export async function validateSolicitudDetalle(
  detalleSolicitud,
  articulosSet,
  reqMarcaModelo,
  cotizacionBase64
) {
  let errors = {};

  if (Array.isArray(cotizacionBase64)) {
    cotizacionBase64.forEach((archivo) => {
      if (archivo.recomendada === true) {
        if (
          archivo.justificacion === null ||
          archivo.justificacion === "" ||
          archivo.justificacion === NaN ||
          archivo.justificacion === 0
        ) {
          errors.justificacion = "El campo justificacion es obligatorio";
        }
      }
    });
  }
  if (
    detalleSolicitud.id_producto === null ||
    detalleSolicitud.id_producto === "" ||
    detalleSolicitud.id_producto === NaN ||
    detalleSolicitud.id_producto === 0
  ) {
    errors.id_producto = "El campo artículo es obligatorio";
  }
  if (
    detalleSolicitud.descripcion === null ||
    detalleSolicitud.descripcion === "" ||
    detalleSolicitud.descripcion === NaN ||
    detalleSolicitud.descripcion === 0
  ) {
    errors.descripcion = "El campo descripción es obligatorio";
  }
  // if (reqMarcaModelo == true) {
  //     if (detalleSolicitud.marca === null || detalleSolicitud.marca === "" || detalleSolicitud.marca === NaN || detalleSolicitud.marca === 0) {
  //         errors.marca = 'El campo marca es obligatorio';
  //     }
  //     if (detalleSolicitud.modelo === null || detalleSolicitud.modelo === "" || detalleSolicitud.modelo === NaN || detalleSolicitud.modelo === 0) {
  //         errors.modelo = 'El campo modelo es obligatorio';
  //     }
  // }
  if (
    detalleSolicitud.cantidad === null ||
    detalleSolicitud.cantidad === "" ||
    detalleSolicitud.cantidad === NaN ||
    detalleSolicitud.cantidad === 0
  ) {
    errors.cantidad = "El campo cantidad es obligatorio";
  }
  // if (detalleSolicitud.observacion === null || detalleSolicitud.observacion === "" || detalleSolicitud.observacion === NaN || detalleSolicitud.observacion === 0) {
  //     errors.observacion = 'El campo observación es obligatorio';
  // }
  if (
    articulosSet.id === null ||
    articulosSet.id === "" ||
    articulosSet.id === NaN ||
    articulosSet.id === 0
  ) {
    errors.id = "El campo artículo es obligatorio";
  }
  if (
    articulosSet.descripcion_producto === null ||
    articulosSet.descripcion_producto === "" ||
    articulosSet.descripcion_producto === NaN ||
    articulosSet.descripcion_producto === 0
  ) {
    errors.descripcion_producto = "El campo descripción es obligatorio";
  }
  if (
    articulosSet.id_gpo_familia === null ||
    articulosSet.id_gpo_familia === "" ||
    articulosSet.id_gpo_familia === NaN ||
    articulosSet.id_gpo_familia === 0
  ) {
    errors.id_gpo_familia = "El campo grupo de artículos es obligatorio";
  }

  return errors;
}

export async function validateSolicitudDetalle2(
  cotizacionGeneralBase64
) {
  let errors = {};

  if (Array.isArray(cotizacionGeneralBase64)) {
    cotizacionGeneralBase64.forEach((archivo) => {
      if (archivo.recomendada === true) {
        if (
          archivo.justificacionGeneral === null ||
          archivo.justificacionGeneral === "" ||
          archivo.justificacionGeneral === NaN ||
          archivo.justificacionGeneral === 0
        ) {
          errors.justificacionGeneral = "El campo justificacion es obligatorio";
        }
      }
    });
  }
  
  return errors;
}

export async function validateSolicitudHeader(solicitudTabla, _Tipo, _ticket) {
  let errors = {};

  if (
    solicitudTabla.descripcion === null ||
    solicitudTabla.descripcion === "" ||
    solicitudTabla.descripcion === NaN ||
    solicitudTabla.descripcion === 0
  ) {
    errors.descripcion = "El campo descripción es obligatorio";
  }

  if (
    solicitudTabla.justificacion === null ||
    solicitudTabla.justificacion === "" ||
    solicitudTabla.justificacion === NaN ||
    solicitudTabla.justificacion === 0
  ) {
    errors.justificacion = "El campo justificación es obligatorio";
  }
  if (
    solicitudTabla.prioridad === null ||
    solicitudTabla.prioridad === "" ||
    solicitudTabla.prioridad === NaN ||
    solicitudTabla.prioridad === 0
  ) {
    errors.prioridad = "El campo prioridad es obligatorio";
  }
  if (
    solicitudTabla.id_categoria === null ||
    solicitudTabla.id_categoria === "" ||
    solicitudTabla.id_categoria === NaN ||
    solicitudTabla.id_categoria === 0
  ) {
    errors.id_categoria = "El campo categoría es obligatorio";
  }
  if (
    _Tipo.id === null ||
    _Tipo.id === "" ||
    _Tipo.id === NaN ||
    _Tipo.id === 0
  ) {
    errors.id = "El campo tipo es obligatorio";
  }
  if (solicitudTabla.prioridad === 1) {
    if (
      solicitudTabla.justificacion_prioridad === null ||
      solicitudTabla.justificacion_prioridad === "" ||
      solicitudTabla.justificacion_prioridad === NaN ||
      solicitudTabla.justificacion_prioridad === 0
    ) {
      errors.justificacion_prioridad =
        "El campo Justificación de la Prioridad es obligatorio";
    }
  }

  return errors;
}
