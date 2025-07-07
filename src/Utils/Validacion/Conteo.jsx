export async function Conteos(form) {
    let errors = {};

    if (form.id_carga === null || form.id_carga === 0 || form.id_carga === NaN || form.id_carga === undefined || form.id_carga === "") {
        errors.id_carga = true;
    } else {
        errors.id_carga = false;
    }

    if (form.id_usuario === null || form.id_usuario === 0 || form.id_usuario === NaN || form.id_usuario === undefined || form.id_usuario === "") {
        errors.id_usuario = true;
    } else {
        errors.id_usuario = false;
    }


    if (form.id_almacen === null || form.id_almacen === 0 || form.id_almacen === NaN || form.id_almacen === undefined || form.id_almacen === "") {
        errors.id_almacen = true;
    } else {
        errors.id_almacen = false;
    }

    if (form.id_unidadmedida === null || form.id_unidadmedida === 0 || form.id_unidadmedida === NaN || form.id_unidadmedida === undefined || form.id_unidadmedida === "") {
        errors.id_unidadmedida = true;
    } else {
        errors.id_unidadmedida = false;
    }

    if (form.id_grupofamilia === null || form.id_grupofamilia === 0 || form.id_grupofamilia === NaN || form.id_grupofamilia === undefined || form.id_producto === "") {
        errors.id_grupofamilia = true;
    } else {
        errors.id_grupofamilia = false;
    }


    if (form.id_producto === null || form.id_producto === 0 || form.id_producto === NaN || form.id_producto === undefined || form.id_producto === "") {
        errors.id_producto = true;
    } else {
        errors.id_producto = false;
    }

    if (form.codigo === null || form.codigo === 0 || form.codigo === NaN || form.codigo === undefined || form.codigo === "") {
        errors.codigo = true;
    } else {
        errors.codigo = false;
    }

    if (form.descripcion === null || form.descripcion === 0 || form.descripcion === NaN || form.descripcion === undefined || form.descripcion === "") {
        errors.descripcion = true;
    } else {
        errors.descripcion = false;
    }

    if (form.ume === null || form.ume === 0 || form.ume === NaN || form.ume === undefined || form.ume === "") {
        errors.ume = true;
    } else {
        errors.ume = false;
    }

    if (form.cantidad === null || form.cantidad === 0 || form.cantidad === NaN || form.cantidad === undefined || form.cantidad === "" || form.cantidad === "0.00") {
        errors.cantidad = true;
    } else {
        errors.cantidad = false;
    }

    if (form.ubicacion === null || form.ubicacion === 0 || form.ubicacion === NaN || form.ubicacion === undefined || form.ubicacion === "") {
        errors.ubicacion = true;
    } else {
        errors.ubicacion = false;
    }

    // if (form.observaciones === null || form.observaciones === 0 || form.observaciones === NaN || form.observaciones === undefined || form.observaciones === "") {
    //     errors.observaciones = true;
    // } else {
    //     errors.observaciones = false;
    // }

    return errors;
}
