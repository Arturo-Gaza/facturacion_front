export async function Usuarios(form, idEdit) {
    let errors = {};


    if (form.name === null || form.name === 0 || form.name === NaN || form.name === undefined || form.name === "") {
        errors.name = true;
    } else {
        errors.name = false;
    }

    if (form.apellidoP === null || form.apellidoP === 0 || form.apellidoP === NaN || form.apellidoP === undefined || form.apellidoP === "") {
        errors.apellidoP = true;
    } else {
        errors.apellidoP = false;
    }

    if (form.apellidoM === null || form.apellidoM === 0 || form.apellidoM === NaN || form.apellidoM === undefined || form.apellidoM === "") {
        errors.apellidoM = true;
    } else {
        errors.apellidoM = false;
    }

    //if (form.email === null || form.email === 0 || form.email === NaN || form.email === undefined || form.email === "") {
    //    errors.email = true;
    //} else {
    //    errors.email = false;
    //}

    if (idEdit == null) {
        if (form.password === null || form.password === 0 || form.password === NaN || form.password === undefined || form.password === "") {
            errors.password = true;
        } else {
            errors.password = false;
        }





    }

    if (form.user === null || form.user === 0 || form.user === NaN || form.user === undefined || form.user === "") {
        errors.user = true;
    } else {
        errors.user = false;
    }

    if (form.idRol === null || form.idRol === 0 || form.idRol === NaN || form.idRol === undefined || form.idRol === "") {
        errors.idRol = true;
    } else {
        errors.idRol = false;
    }

    return errors;
}


export async function ValidarCorreo(Vcorreo) {
    let errors = {};
    let Correo = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (Vcorreo === null || Vcorreo === "" || Vcorreo === NaN) {
        errors.correo = 'Este campo es obligatorio';
    }
    if (!Correo.test(Vcorreo)) {
        errors.correo = 'Introduzca un correo válido';
    }
    return errors;
}


export async function passwordValid(password, idEdit) {
    let errorsPassword = {};
    if (idEdit == null) {
        if (password === null || password === 0 || password === NaN || password === undefined || password === "") {
            errorsPassword.password = 'Este campo es obligatorio';
        }

        if (password !== null || password !== "") {
            let RegEx2 = /^(?=(?:.*[A-Z]){1})/
            if (!RegEx2.test(password)) {
                errorsPassword.password = 'Ingrese al menos una letra mayúscula';
            }

            let RegEx3 = /^(?=(?:.*[@$?¡!\-_]){1})/
            if (!RegEx3.test(password)) {
                errorsPassword.password = 'Ingrese un caracter especial (@,$,?,!,¡)';
            }

            let RegEx4 = /^(?=(?:.*\d){1})/
            if (!RegEx4.test(password)) {
                errorsPassword.password = 'Ingrese al menos un dígito';
            }
            let RegEx5 = /(?=(?:.*[a-z]){1})/
            if (!RegEx5.test(password)) {
                errorsPassword.password = 'Ingrese al menos una letra minúscula';
            }

            if (password?.length < 9) {
                errorsPassword.password = 'Ingrese mínimo 8 caracteres';
            }
        }
        // if (password2 !== form.password) {
        //     errors.password2 = 'Las contraseñas no coinciden'
        // }
    }

    if (password != null) {
        if (password === null || password === 0 || password === NaN || password === undefined || password === "") {
            errorsPassword.password = 'Este campo es obligatorio';
        }

        if (password !== null || password !== "") {
            if (password?.length < 9) {
                errorsPassword.password = 'Ingrese mínimo 8 caracteres';
            }

            let RegEx2 = /^(?=(?:.*[A-Z]){1})/
            if (!RegEx2.test(password)) {
                errorsPassword.password = 'Ingrese al menos una letra mayúscula';
            }

            let RegEx3 = /^(?=(?:.*[@$?¡!\-_]){1})/
            if (!RegEx3.test(password)) {
                errorsPassword.password = 'Ingrese un caracter especial (@,$,?,!,¡)';
            }

            let RegEx4 = /^(?=(?:.*\d){1})/
            if (!RegEx4.test(password)) {
                errorsPassword.password = 'Ingrese al menos un dígito';
            }
            let RegEx5 = /(?=(?:.*[a-z]){1})/
            if (!RegEx5.test(password)) {
                errorsPassword.password = 'Ingrese al menos una letra minúscula';
            }
        }
    }
    return errorsPassword;
}