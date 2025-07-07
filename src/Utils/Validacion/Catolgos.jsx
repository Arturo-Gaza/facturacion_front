export async function CAT_Almacen(form) {
    let errors = {};

    if (form.clave_almacen === null || form.clave_almacen === 0 || form.clave_almacen === NaN || form.clave_almacen === undefined || form.clave_almacen === "") {
        errors.clave_almacen = true;
    } else {
        errors.clave_almacen = false;
    }

    if (form.descripcion_almacen === null || form.descripcion_almacen === 0 || form.descripcion_almacen === NaN || form.descripcion_almacen === undefined || form.descripcion_almacen === "") {
        errors.descripcion_almacen = true;
    } else {
        errors.descripcion_almacen = false;
    }

    return errors;
}

export async function CAT_Unidad_Medida(form) {
    let errors = {};

    if (form.clave_unidad_medida === null || form.clave_unidad_medida === 0 || form.clave_unidad_medida === NaN || form.clave_unidad_medida === undefined || form.clave_unidad_medida === "") {
        errors.clave_unidad_medida = true;
    } else {
        errors.clave_unidad_medida = false;
    }

    if (form.descripcion_unidad_medida === null || form.descripcion_unidad_medida === 0 || form.descripcion_unidad_medida === NaN || form.descripcion_unidad_medida === undefined || form.descripcion_unidad_medida === "") {
        errors.descripcion_unidad_medida = true;
    } else {
        errors.descripcion_unidad_medida = false;
    }

    return errors;
}

export async function CAT_Grupo_Familia(form) {
    let errors = {};

    if (form.clave_gpo_familia === null || form.clave_gpo_familia === 0 || form.clave_gpo_familia === NaN || form.clave_gpo_familia === undefined || form.clave_gpo_familia === "") {
        errors.clave_gpo_familia = true;
    } else {
        errors.clave_gpo_familia = false;
    }

    if (form.descripcion_gpo_familia === null || form.descripcion_gpo_familia === 0 || form.descripcion_gpo_familia === NaN || form.descripcion_gpo_familia === undefined || form.descripcion_gpo_familia === "") {
        errors.descripcion_gpo_familia = true;
    } else {
        errors.descripcion_gpo_familia = false;
    }

    return errors;
}


export async function CAT_Roles(form) {
    let errors = {};

    if (form.nombre === null || form.nombre === 0 || form.nombre === NaN || form.nombre === undefined || form.nombre === "") {
        errors.nombre = true;
    } else {
        errors.nombre = false;
    }

    return errors;
}

export async function CAT_Productos(form) {
    let errors = {};

    if (form.id_moneda === null || form.id_moneda === 0 || form.id_moneda === NaN || form.id_moneda === undefined || form.id_moneda === "") {
        errors.id_moneda = true;
    } else {
        errors.id_moneda = false;
    }

    if (form.id_unidad_medida === null || form.id_unidad_medida === 0 || form.id_unidad_medida === NaN || form.id_unidad_medida === undefined || form.id_unidad_medida === "") {
        errors.id_unidad_medida = true;
    } else {
        errors.id_unidad_medida = false;
    }

    if (form.id_gpo_familia === null || form.id_gpo_familia === 0 || form.id_gpo_familia === NaN || form.id_gpo_familia === undefined || form.id_gpo_familia === "") {
        errors.id_gpo_familia = true;
    } else {
        errors.id_gpo_familia = false;
    }

    // if (form.clave_producto === null || form.clave_producto === 0 || form.clave_producto === NaN || form.clave_producto === undefined || form.clave_producto === "") {
    //     errors.clave_producto = true;
    // } else {
    //     errors.clave_producto = false;
    // }

    if (form.descripcion_producto === null || form.descripcion_producto === 0 || form.descripcion_producto === NaN || form.descripcion_producto === undefined || form.descripcion_producto === "") {
        errors.descripcion_producto = true;
    } else {
        errors.descripcion_producto = false;
    }

    if (form.id_categoria === null || form.id_categoria === 0 || form.id_categoria === NaN || form.id_categoria === undefined || form.id_categoria === "") {
        errors.id_categoria = true;
    } else {
        errors.id_categoria = false;
    }

    return errors;
}

export async function CAT_Productos_Sin_Clave(form) {
    let errors = {};

    if (form.id_gpo_familia === null || form.id_gpo_familia === 0 || form.id_gpo_familia === NaN || form.id_gpo_familia === undefined || form.id_gpo_familia === "") {
        errors.id_gpo_familia = true;
    } else {
        errors.id_gpo_familia = false;
    }

    if (form.id_unidad_medida === null || form.id_unidad_medida === 0 || form.id_unidad_medida === NaN || form.id_unidad_medida === undefined || form.id_unidad_medida === "") {
        errors.id_unidad_medida = true;
    } else {
        errors.id_unidad_medida = false;
    }


    if (form.descripcion_producto === null || form.descripcion_producto === 0 || form.descripcion_producto === NaN || form.descripcion_producto === undefined || form.descripcion_producto === "") {
        errors.descripcion_producto = true;
    } else {
        errors.descripcion_producto = false;
    }

    if (form.id_categoria === null || form.id_categoria === 0 || form.id_categoria === NaN || form.id_categoria === undefined || form.id_categoria === "") {
        errors.id_categoria = true;
    } else {
        errors.id_categoria = false;
    }

    return errors;
}

export async function CAT_Ubicaciones(form) {
    let errors = {};

    if (form.clave_ubicacion === null || form.clave_ubicacion === 0 || form.clave_ubicacion === NaN || form.clave_ubicacion === undefined || form.clave_ubicacion === "") {
        errors.clave_ubicacion = true;
    } else {
        errors.clave_ubicacion = false;
    }

    if (form.descripcion_ubicacion === null || form.descripcion_ubicacion === 0 || form.descripcion_ubicacion === NaN || form.descripcion_ubicacion === undefined || form.descripcion_ubicacion === "") {
        errors.descripcion_ubicacion = true;
    } else {
        errors.descripcion_ubicacion = false;
    }

    return errors;
}

export async function CAT_Moneda(form) {
    let errors = {};

    if (form.clave_moneda === null || form.clave_moneda === 0 || form.clave_moneda === NaN || form.clave_moneda === undefined || form.clave_moneda === "") {
        errors.clave_moneda = true;
    } else {
        errors.clave_moneda = false;
    }

    if (form.descripcion_moneda === null || form.descripcion_moneda === 0 || form.descripcion_moneda === NaN || form.descripcion_moneda === undefined || form.descripcion_moneda === "") {
        errors.descripcion_moneda = true;
    } else {
        errors.descripcion_moneda = false;
    }

    return errors;
}

export async function CAT_Centro(form) {
    let errors = {};

    if (form.clave_centro === null || form.clave_centro === 0 || form.clave_centro === NaN || form.clave_centro === undefined || form.clave_centro === "") {
        errors.clave_centro = true;
    } else {
        errors.clave_centro = false;
    }

    if (form.descripcion_centro === null || form.descripcion_centro === 0 || form.descripcion_centro === NaN || form.descripcion_centro === undefined || form.descripcion_centro === "") {
        errors.descripcion_centro = true;
    } else {
        errors.descripcion_centro = false;
    }

    return errors;
}

export async function CAT_Categoria(form) {
    let errors = {};

    if (form.descripcion_categoria === null || form.descripcion_categoria === 0 || form.descripcion_categoria === NaN || form.descripcion_categoria === undefined || form.descripcion_categoria === "") {
        errors.descripcion_categoria = false;
    } else {
        errors.descripcion_categoria = false;
    }

    if (form.id_tipo === null || form.id_tipo === 0 || form.id_tipo === NaN || form.id_tipo === undefined || form.id_tipo === "") {
        errors.id_tipo = true;
    } else {
        errors.id_tipo = false;
    }

    return errors;
}

export async function CAT_Tipo(form) {
    let errors = {};

    if (form.descripcion === null || form.descripcion === 0 || form.descripcion === NaN || form.descripcion === undefined || form.descripcion === "") {
        errors.descripcion = true;
    } else {
        errors.descripcion = false;
    }

    return errors;
}

export async function CAT_Departamento(form) {
    let errors = {};

    if (form.descripcion === null || form.descripcion === 0 || form.descripcion === NaN || form.descripcion === undefined || form.descripcion === "") {
        errors.descripcion = true;
    } else {
        errors.descripcion = false;
    }

    return errors;

}



