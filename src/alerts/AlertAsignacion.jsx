import { Button, Dialog, DialogContent, Grid } from '@mui/material';
import React, { useState } from 'react';


import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { CAMBIO_ESTATUS_CABECERA, CREATE_ASIGNAR, GET_LIST_USER_ALMACEN, UPDATE_CABECERA_ESTATUS_CONTEO } from '../Constants/ApiConstants';
import { useUserContenidoContext } from '../hooks/UserConteProvider';
import { MenuItemGeneral, SelectGeneral } from '../Styles/Select/Select';


const AlertaAsignacion = (props) => {
    const user = useUserContenidoContext();
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xs');

    const [_AsigConteo, setAsigConteo] = useState({
        id_carga: props.idCarga,
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
            id_carga: props.idCarga,
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

    //::::::::::: OBTENER FILTRO ::::::::::::::::::::
    const [_ListUsuarios, setListUsuarios] = useState([])
    const GetListUsuarios = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .getToken(GET_LIST_USER_ALMACEN + props.idCarga) //### ** 
            .then((response) => {
                // props.props.props.setMessageSnackBar(response.data.message, 'success');
                setListUsuarios(response.data.data)
                props.props.props.setCloseLoadingScreen()
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen()
            })
    }

    const Cancelar = () => {
        props.close(false);
        handleLimpiar();
    };

    const Asignacion = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .postToken(CREATE_ASIGNAR, _AsigConteo) //### ** 
            .then((response) => {
                props.props.props.setCloseLoadingScreen()
                CambioEstatus(6);
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen()
            })


        props.close(false);
        handleLimpiar();
    }

    const Continuar = () => {
        if (_AsigConteo.id_usuario == 0) {
            props.props.props.setMessageSnackBar('Seleccioné un usuario.', 'warning');
        } else {
            if (props._numConteo == 0) {
                _AsigConteo.conteo = 1;
                props.props.props.setOpenLoadingScreen()
                requests
                    .putToken(UPDATE_CABECERA_ESTATUS_CONTEO + props.idCarga) //### ** 
                    .then((response) => {
                        Asignacion();
                    })
                    .catch((error) => {
                        error.data.errors.forEach(element => {
                            props.props.props.setMessageSnackBar(element, 'warning');
                        });
                        props.props.props.setCloseLoadingScreen()
                    })
            } else {
                _AsigConteo.conteo = props._numConteo;
                Asignacion();
            }
        }
    }

    const [_Estatus, setEstatus] = useState(false);
    if (props.open == true && props.idCarga != null && _Estatus == false) {
        setEstatus(true);
        GetListUsuarios()
    }


    //::::::::::: CAMBIO DE ESTATUS ::::::::::::::::::::
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
                                    Asignación
                                </p>
                            </center>
                            <Grid container className='marginComponets'>
                                <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                                    <label className='textLabel2'>{"Asignar a:"}</label>
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
        </div >

    )
}
export default AlertaAsignacion
