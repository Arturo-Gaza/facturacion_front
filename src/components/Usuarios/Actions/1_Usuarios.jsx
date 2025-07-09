import { Box, Button, Checkbox, Dialog, Grid, Slide } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CREATE_USER, GET_LIST_CAT_ROLES, GET_USER_BY_ID, UPDATE_USER, GET_LIST_DEPARTAMENTO } from "../../../Constants/ApiConstants";
import { MenuItemGeneral, SelectGeneral } from "../../../Styles/Select/Select";
import { TextFieldGeneral } from '../../../Styles/TextField/TextField';
import { passwordValid, Usuarios, ValidarCorreo } from "../../../Utils/Validacion/Usuarios";
import requests from '../../AxiosCalls/AxiosCallsLocal';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Afectacion = (props) => {
    const [_ListOptions, setListOptions] = useState([])
    const GetListOptionsCatalogo = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .getToken(GET_LIST_CAT_ROLES) //### ** 
            .then((response) => {
                setListOptions(response.data.data)
                props.props.props.setMessageSnackBar(response.data.message, 'success');
                props.props.props.setCloseLoadingScreen()
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
            })
            .finally(() => {
                props.props.props.setCloseLoadingScreen();
            });
    }

    const [_ListDepartamentos, setListDepartamentos] = useState([]);
    const GetListDepartamento = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .getToken(GET_LIST_DEPARTAMENTO)
            .then((response) => {
                setListDepartamentos(response.data.data)
                props.props.props.setCloseLoadingScreen()
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
            })
            .finally(() => {
                props.props.props.setCloseLoadingScreen();
            });
    }
    //::::::::::: ESTADOS ::::::::::::::::::::
    const [_Estatus, setEstatus] = useState(false);
    const [_checked, setChecked] = useState(true);
    const [_ArrayCatalogo, setArrayCatalogo] = useState({
        name: "",
        apellidoP: "",
        apellidoM: "",
        email: "",
        password: "",
        user: "",
        habilitado: true,
        idRol: 0,
        id_departamento: 0
    })//### **

    const handleLimpiar = () => {
        setArrayCatalogo({
            ..._ArrayCatalogo,
            name: "",
            apellidoP: "",
            apellidoM: "",
            email: "",
            password: "",
            user: "",
            habilitado: true,
            idRol: 0,
            id_departamento: 0
        });//### **
        setChecked(true);
    }

    const handleHabilitado = (e) => {
        setChecked(e.target.checked);
        if (e.target.checked === true) {
            _ArrayCatalogo.habilitado = true;
        }
        if (e.target.checked === false) {
            _ArrayCatalogo.habilitado = false;
        }
    };

    const handleArrayCatalogo = (e) => {
        setArrayCatalogo({
            ..._ArrayCatalogo,
            [e.target.name]: e.target.value,
        });
    }

    const handleArrayCatalogoUser = (e) => {
        setArrayCatalogo({
            ..._ArrayCatalogo,
            [e.target.name]: e.target.value.trim(),
        });
    }

    const handleArrayUserApellidosNom = (e) => {
        setArrayCatalogo({
            ..._ArrayCatalogo,
            [e.target.name]: e.target.value.toLocaleUpperCase(),
        });
    }

    const [errCorreo, setErrCorreo] = useState({});
    const handleArrayCorreo = (e) => {
        if (e.target.value !== "") {
            ValidarCorreo(e.target.value).then((resp) => {
                setErrCorreo(resp);
            });
        } else {
            setErrCorreo({});

        }
        setArrayCatalogo({
            ..._ArrayCatalogo,
            [e.target.name]: e.target.value.toLocaleLowerCase(),
        });
    };


    const [errPassword, setErrPassword] = useState({});
    const handleArrayPassword = (e) => {
        if (e.target.value == "") {
            passwordValid(null, props.id).then((resp) => {
                setErrPassword(resp);
            })

            setArrayCatalogo({
                ..._ArrayCatalogo,
                password: null,
            });//### **toLocaleLowerCase()
        } else {
            passwordValid(e.target.value, props.id).then((resp) => {
                setErrPassword(resp);
            })
            setArrayCatalogo({
                ..._ArrayCatalogo,
                [e.target.name]: e.target.value,
            });

        }

    }

    const handleCancel = () => {
        setEstatus(false);
        handleLimpiar();
        setErrPassword({});
        setErrCorreo({});
        props.handleCancel()
    }

    const handleClose = async () => {
        setEstatus(false);
        handleLimpiar();
        setErrPassword({});
        setErrCorreo({});
        await props.handleClose();
    }

    const Guardar = () => {
        if (!errPassword.password && !errCorreo.correo) {
            props.props.props.setOpenLoadingScreen();
            requests
                .postToken(CREATE_USER, _ArrayCatalogo)
                .then((response) => {
                    props.props.props.setMessageSnackBar(response.data.message, 'success');
                    props.GetListCatalogo();
                    return handleClose();
                })
                .catch((error) => {
                    error.response.data.errors.forEach(element => {
                        props.props.props.setMessageSnackBar(element, 'warning');
                    });
                })
                .finally(() => {
                    props.props.props.setCloseLoadingScreen();
                });
        } else {
            props.props.props.setMessageSnackBar('Ingrese una contraseña', 'warning');
        }
    }

    const Actualizar = async () => {
        if (!errPassword.password && !errCorreo.correo) {  // Solo verificas si la contraseña y el correo son válidos
            props.props.props.setOpenLoadingScreen();
            await requests
                .putToken(UPDATE_USER + props.id, _ArrayCatalogo)
                .then((response) => {
                    props.props.props.setMessageSnackBar(response.data.message, 'success');
                    props.GetListCatalogo();
                    return handleClose();
                })
                .catch((error) => {
                    error.response.data.errors.forEach(element => {  //forEach Ya quedo
                        props.props.props.setMessageSnackBar(element, 'warning');
                    });
                })
                .finally(() => {
                    props.props.props.setCloseLoadingScreen();
                });
        } else {
            props.props.props.setMessageSnackBar('Ingrese una contraseña', 'warning');
        }
    }



    const GetArrayCatalogoByID = async () => {
        props.props.props.setOpenLoadingScreen()
        await requests
            .getToken(GET_USER_BY_ID + props.id) //### **
            .then((response) => {
                setArrayCatalogo({
                    ..._ArrayCatalogo,
                    name: response.data.data.name,
                    apellidoP: response.data.data.apellidoP,
                    apellidoM: response.data.data.apellidoM,
                    email: response.data.data.email,
                    password: null,
                    user: response.data.data.user,
                    habilitado: response.data.data.habilitado,
                    idRol: response.data.data.idRol,
                    id_departamento: response.data.data.id_departamento
                });//### **

                setChecked(response.data.data.habilitado);
                props.props.props.setCloseLoadingScreen()
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
            })
            .finally(() => {
                props.props.props.setCloseLoadingScreen();
            });
    }

    const [errorsCAT, setErrorsCAT] = useState({});
    const handleSubmitValidado = (e) => {
        e.preventDefault();
        Usuarios(_ArrayCatalogo, props.id).then((resp) => {
            setErrorsCAT(resp);

            let boolValor = false;
            for (const el of Object.values(resp)) {
                if (el === true) {
                    boolValor = false;
                    break;
                } else {
                    boolValor = true;
                }
            }

            // Si el correo es opcional y está vacío, asegúrate de que no haya errores
            if (_ArrayCatalogo.email === "" || (boolValor && !errCorreo.correo)) {
                if (props.id == null) {
                    Guardar();
                } else {
                    Actualizar();
                }
            } else {
                props.props.props.setMessageSnackBar('Ingrese todos los datos', 'warning');
            }

        });
    };

    if (props.open == true && props.id != null && _Estatus == false) {
        setEstatus(true);
        GetArrayCatalogoByID()
    }

    //::::::::::: USEEFECT ::::::::::::::::::::
    useEffect(() => {
        GetListOptionsCatalogo();
        GetListDepartamento();
    }, [])


    return (
        <Dialog
            TransitionComponent={Transition}
            open={props.open}
            onClose={handleCancel}
            PaperProps={{
                style: {
                    backgroundColor: "#F6F6FF",
                    maxHeight: "150%",
                    minWidth: "550px",
                    maxWidth: "550px",
                },
            }}
        >
            <Box sx={{ padding: 5 }}>
                <h4 className="textLabel1">
                    <center>
                        {props.id == null ? (
                            <span>Nueva {props.titulo}</span>
                        ) : (
                            <span>Editar {props.titulo}</span>
                        )}
                    </center>
                </h4>
                {/* //### ** REVISAR BIEN MIS PARAMETROS A METER*/}
                <Grid container className='marginComponets'>
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className='textLabel2'>Nombre</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextFieldGeneral
                            className="inputTextSize100"
                            id="name"
                            name="name"
                            // idprops={props.id}
                            value={_ArrayCatalogo.name} /* //### ** */
                            error={errorsCAT.name}
                            onChange={handleArrayUserApellidosNom}
                            size="small"
                            inputProps={{
                                maxLength: 50,

                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container className='marginComponets'>
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className='textLabel2'>Apellido paterno</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextFieldGeneral
                            className="inputTextSize100"
                            id="apellidoP"
                            name="apellidoP"
                            // idprops={props.id}
                            value={_ArrayCatalogo.apellidoP} /* //### ** */
                            error={errorsCAT.apellidoP}
                            onChange={handleArrayUserApellidosNom}
                            size="small"
                            inputProps={{
                                maxLength: 50,

                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container className='marginComponets'>
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className='textLabel2'>Apellido materno</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextFieldGeneral
                            className="inputTextSize100"
                            id="apellidoM"
                            name="apellidoM"
                            // idprops={props.id}
                            value={_ArrayCatalogo.apellidoM} /* //### ** */
                            error={errorsCAT.apellidoM}
                            onChange={handleArrayUserApellidosNom}
                            size="small"
                            inputProps={{
                                maxLength: 50,

                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container className='marginComponets'>
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className='textLabel2'>Correo electrónico</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextFieldGeneral
                            //idprops={props.id}
                            className="inputTextSize100"
                            id="email"
                            name="email"
                            // idprops={props.id}
                            value={_ArrayCatalogo.email} /* //### ** */
                            error={(errCorreo.correo ? (true) : (false))}
                            onChange={handleArrayCorreo}
                            size="small"
                            inputProps={{
                                maxLength: 100,

                            }}
                        />
                        {errCorreo.correo && (
                            <span
                                style={{ float: "right", color: "red" }}
                                className="label_Quest "
                            >
                                {errCorreo.correo}
                            </span>
                        )}
                    </Grid>
                </Grid>

                <Grid container className='marginComponets'>
                    {props.id == null ? (null) : (_ArrayCatalogo.password == null || _ArrayCatalogo.password == "" ? (
                        null
                    ) : (
                        <span style={{ float: "left", color: "red" }} className="label_Quest ">
                            ¿Intentas cambiar de contraseña?
                        </span>
                    ))}
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className='textLabel2'>Contraseña</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>

                        <TextFieldGeneral
                            className="inputTextSize100"
                            id="password"
                            name="password"
                            // idprops={props.id}
                            value={_ArrayCatalogo.password} /* //### ** */
                            error={props.id == null ? (errorsCAT.password ? (true) : (errPassword.password ? (true) : (false))) : (errPassword.password ? (true) : (false))}
                            onChange={handleArrayPassword}
                            size="small"
                            inputProps={{
                                maxLength: 100,

                            }}
                        />
                        {errPassword.password && (
                            <span
                                style={{ float: "right", color: "red" }}
                                className="label_Quest "
                            >
                                {errPassword.password}
                            </span>
                        )}
                    </Grid>
                </Grid>

                <Grid container className='marginComponets'>
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className='textLabel2'>Usuario</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextFieldGeneral
                            idprops={props.id}
                            className="inputTextSize100"
                            id="user"
                            name="user"
                            value={_ArrayCatalogo.user} /* //### ** */
                            error={errorsCAT.user}
                            onChange={handleArrayCatalogoUser}
                            size="small"
                            inputProps={{
                                maxLength: 50,

                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container item xs={12} sm={12} md={12} spacing={2} className='marginComponets'>
                    <Grid item xs={6} sm={6} md={6}>
                        <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                            <label className='textLabel2'>Rol</label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <SelectGeneral
                                id="idRol"
                                name='idRol'
                                value={_ArrayCatalogo.idRol}
                                error={errorsCAT.idRol}
                                onChange={handleArrayCatalogo}
                                className='inputSelectSize100'
                            >
                                <MenuItemGeneral key={0} value={0} disabled
                                >
                                    Seleccione una Opción
                                </MenuItemGeneral>
                                {_ListOptions.map((item) => (
                                    <MenuItemGeneral
                                        key={item.id} // ### **
                                        value={item.id}
                                    >
                                        {item.nombre}
                                    </MenuItemGeneral>
                                ))}
                            </SelectGeneral>
                        </Grid>
                    </Grid>

                    <Grid item xs={6} sm={6} md={6}>
                        <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                            <label className='textLabel2'>Departamento</label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <SelectGeneral
                                id="id_departamento"
                                name='id_departamento'
                                value={_ArrayCatalogo.id_departamento}
                                error={errorsCAT.id_departamento}
                                onChange={handleArrayCatalogo}
                                className='inputSelectSize100'
                            >
                                <MenuItemGeneral key={0} value={0} disabled
                                >
                                    Seleccione una Opción
                                </MenuItemGeneral>
                                {_ListDepartamentos.map((item) => (
                                    <MenuItemGeneral
                                        key={item.id} // ### **
                                        value={item.id}
                                    >
                                        {item.descripcion}
                                    </MenuItemGeneral>
                                ))}
                            </SelectGeneral>
                        </Grid>
                    </Grid>
                </Grid>

                {props.id == null ? (null) : (
                    <Grid container className='marginComponets'>
                        <label className='textLabel2'>Habilitado</label>
                        <Checkbox
                            className="ckBox1"
                            id="habilitado"
                            name="habilitado"
                            checked={_checked}
                            onChange={handleHabilitado}
                            value={_checked}
                        ></Checkbox>
                    </Grid>
                )}
                <center>
                    <Grid container sx={{ marginTop: 3 }}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Button onClick={handleSubmitValidado} className='btn-aceptar' variant={"contained"}>
                                {props.id == null ? ('Guardar') : ('Actualizar')}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Button onClick={handleCancel} className="btn-cancelar" variant={"contained"}>Cancelar</Button>
                        </Grid>
                    </Grid>
                </center>
            </Box>
        </Dialog>
    );

}
export default Afectacion