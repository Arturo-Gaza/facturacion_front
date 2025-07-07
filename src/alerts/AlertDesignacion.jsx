import { Button, Dialog, DialogContent, Grid } from '@mui/material';
import React, { useState } from 'react';


import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { CAMBIO_ESTATUS_CABECERA, CREATE_DESIGNAR, GET_LIST_USER_ALL, GET_LIST_USER_ASINACION } from '../Constants/ApiConstants';
import { useUserContenidoContext } from '../hooks/UserConteProvider';
import { MenuItemGeneral, SelectGeneral } from '../Styles/Select/Select';


const AlertaDesignacion = (props) => {
    const user = useUserContenidoContext();
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xs');

    //::::::::::: OBTENER FILTRO_1 ::::::::::::::::::::
    const [_ListUsuarios, setListUsuarios] = useState([])
    const GetListUsuarios = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .getToken(GET_LIST_USER_ALL) //### ** 
            .then((response) => {
                // props.props.props.setMessageSnackBar(response.data.message, 'success');
                setListUsuarios(response.data.data)
                GetListUsuarios2();
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen()
            })
    }

    const [_AsigConteo, setAsigConteo] = useState({
        id_carga: 0,
        id_usuario: 0,
        conteo: props._numConteo,
        fecha_asignacion: "",
        fecha_inicio_conteo: null,
        fecha_fin_conteo: null,
        id_estatus: null,
        habilitado: true
    })//### **

    const handleLimpiar = () => {
        setAsigConteo({
            ..._AsigConteo,
            id_carga: 0,
            id_usuario: 0,
            conteo: props._numConteo,
            fecha_asignacion: "",
            fecha_inicio_conteo: null,
            fecha_fin_conteo: null,
            id_estatus: null,
            habilitado: true
        });//### **
        setEstatus(false);
    }

    const handleAsigConteo = (e) => {
        setAsigConteo({
            ..._AsigConteo,
            [e.target.name]: e.target.value,
            'id_carga': props.idCarga,
            'conteo': props._numConteo,
        });
    }

    //::::::::::: OBTENER FILTRO_2 ::::::::::::::::::::
    const [_ListUsuarios2, setListUsuarios2] = useState([])
    const GetListUsuarios2 = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .getToken(GET_LIST_USER_ASINACION + props.idCarga) //### ** 
            .then((response) => {
                // props.props.props.setMessageSnackBar(response.data.message, 'success');
                setListUsuarios2(response.data.data.filter((dato) => dato.id_estatus != 3))
                // setListUsuarios2(response.data.data)
                props.props.props.setCloseLoadingScreen()
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen()
            })
    }

    const [_usuarioDesignado, setUsuarioDesignado] = useState({
        id_usuario: 0,
        id_carga: 0,
    })

    const handleLimpiar2 = () => {
        setUsuarioDesignado({
            ..._usuarioDesignado,
            id_usuario: 0,
            id_carga: 0,
        });//### **
    }

    const handleUsuarioDesignado = (e) => {
        setUsuarioDesignado({
            ..._usuarioDesignado,
            [e.target.name]: e.target.value,
            'id_carga': props.idCarga,
        });
        setListUsuarios(_ListUsuarios.filter((dato) => dato.id != e.target.value))
    }

    const Cancelar = () => {
        props.close(false);
        handleLimpiar();
        handleLimpiar2();
    };

    const Continuar = () => {
        if (_AsigConteo.id_usuario == 0 || _usuarioDesignado.id_usuario == 0) {
            props.props.props.setMessageSnackBar('Ingrese todos los campos', 'warning');
        } else {
            props.close(false);
            props.props.props.setOpenLoadingScreen()
            requests
                .postToken(CREATE_DESIGNAR + _usuarioDesignado.id_usuario, _AsigConteo) //### ** 
                .then((response) => {
                    CambioEstatus(6)
                })
                .catch((error) => {
                    error.data.errors.forEach(element => {
                        props.props.props.setMessageSnackBar(element, 'warning');
                    });
                    props.props.props.setCloseLoadingScreen()
                })

            handleLimpiar();
            handleLimpiar2();
        }
    }

    const [_Estatus, setEstatus] = useState(false);
    if (props.open == true && props.idCarga != null && _Estatus == false) {
        setEstatus(true);
        GetListUsuarios();
    }

    //CAMBIO DE ESTATUS
    const CambioEstatus = (IdStatus) => {
        props.props.props.setOpenLoadingScreen()
        requests
            .putToken(CAMBIO_ESTATUS_CABECERA + props.idCarga, { "id_estatus": IdStatus }) //### ** 
            .then((response) => {
                props.GetListCatalogo();
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen()
            })
    }

    return (
        <div>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={props.open}
            >
                <Grid style={{ borderRadius: '10px' }}>
                    <Grid>
                        <DialogContent >
                            <center>
                                <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                    Reasignación
                                </p>
                            </center>
                            <Grid container className='marginComponets'>
                                <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                                    <label className='textLabel2'>{"Usuario Asignado (origen)"}</label>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <SelectGeneral
                                        // idprops={props.id}
                                        id="id_usuario"
                                        name='id_usuario'
                                        value={_usuarioDesignado.id_usuario}
                                        error={_usuarioDesignado.id_usuario == 0 ? true : false}
                                        onChange={handleUsuarioDesignado}
                                        className='inputSelectSize100'
                                    >
                                        <MenuItemGeneral key={0} value={0} disabled
                                        >
                                            Seleccione un Usuario
                                        </MenuItemGeneral>
                                        {_ListUsuarios2.map((item) => (
                                            <MenuItemGeneral
                                                key={item.id} // ### **
                                                value={item.id}
                                            >
                                                {item.user + " - " + item.name + " " + item.apellidoP + " " + item.apellidoM + " "}
                                            </MenuItemGeneral>
                                        ))}
                                    </SelectGeneral>
                                </Grid>
                            </Grid>
                            <br></br>
                            {_usuarioDesignado.id_usuario == 0 ? (null) : (
                                <Grid container className='marginComponets'>
                                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                                        <label className='textLabel2'>{"Reasignar a:"}</label>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <SelectGeneral
                                            // idprops={props.id}
                                            id="id_usuario"
                                            name='id_usuario'
                                            value={_AsigConteo.id_usuario}
                                            error={_AsigConteo.id_usuario == 0 ? true : false}
                                            onChange={handleAsigConteo}
                                            className='inputSelectSize100'
                                        >
                                            <MenuItemGeneral key={0} value={0} disabled
                                            >
                                                Seleccione un Usuario
                                            </MenuItemGeneral>
                                            {_ListUsuarios.map((item) => (
                                                <MenuItemGeneral
                                                    key={item.id} // ### **
                                                    value={item.id}
                                                >
                                                    {item.user + " - " + item.name + " " + item.apellidoP + " " + item.apellidoM + " "}
                                                </MenuItemGeneral>
                                            ))}
                                        </SelectGeneral>
                                    </Grid>
                                </Grid>
                            )}
                            <br></br>
                            <center>
                                <Grid container>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Button className='btn-aceptar' onClick={Continuar} variant={"contained"}>Continuar</Button>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Button className="btn-cancelar" onClick={Cancelar} variant={"contained"}>Cancelar</Button>
                                    </Grid>
                                </Grid>
                            </center>
                        </DialogContent>
                    </Grid>

                </Grid>
            </Dialog>
        </div>

    )
}
export default AlertaDesignacion
