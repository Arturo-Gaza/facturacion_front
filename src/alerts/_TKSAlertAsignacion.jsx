import { Autocomplete, Box, Button, Dialog, DialogContent, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';


import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { ASIGNAR_USUARIO_SOLICITUDES, CAMBIO_ESTATUS_CABECERA, REASIGNAR_USUARIO_SOLICITUDES, GET_LIST_USER, GET_LIST_USER_ALL, GET_LIST_USER_ALMACEN, UPDATE_CABECERA_ESTATUS_CONTEO } from '../Constants/ApiConstants';
import { useUserContenidoContext } from '../hooks/UserConteProvider';
import { MenuItemGeneral, SelectGeneral } from '../Styles/Select/Select';
import { TextFieldGeneral } from '../Styles/TextField/TextField';


const AlertaAsignacion = (props) => {
    const user = useUserContenidoContext();
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xs');

    const [_AsigUsuario, setAsigUsuario] = useState({
        id_solicitud: 0,
        id_usuario: 0,
    })//### **

    useEffect(() => {
        if (props.open === true) {
            if (props.solicitudItem != undefined) {
                GetListUsuarios()
                setAsigUsuario({
                    ..._AsigUsuario,
                    id_solicitud: props.solicitudItem.id,
                    id_usuario: props.solicitudItem.id_usuario_asignacion
                });
            }
        }
    }, [props.solicitudItem, props.open]);

    const handleLimpiar = () => {
        setAsigUsuario({
            ..._AsigUsuario,
            id_solicitud: 0,
            id_usuario: 0
        });//### **
    }

    const handleAsigUsuario = (e) => {
        setAsigUsuario({
            ..._AsigUsuario,
            [e.target.name]: e.target.value
        });
    }

    //::::::::::: OBTENER FILTRO ::::::::::::::::::::
    const [_ListUsuarios, setListUsuarios] = useState([])
    const GetListUsuarios = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .getToken(GET_LIST_USER) //### ** 
            .then((response) => {
                // props.props.props.setMessageSnackBar(response.data.message, 'success');
                setListUsuarios(response.data.data.filter(user => user.idRol === 3))
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
            .postToken(REASIGNAR_USUARIO_SOLICITUDES, _AsigUsuario) //### ** 
            .then((response) => {
                props.props.props.setCloseLoadingScreen()
                return props.GetListCatalogo()
            })
            .catch((error) => {
                props.props.props.setMessageSnackBar(error.Message, 'warning');
                props.props.props.setCloseLoadingScreen()
            })
        props.close(false);
        handleLimpiar();
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
                                    <Autocomplete
                                        options={_ListUsuarios}
                                        getOptionLabel={(option) => option.user + " - " + option.name + " " + option.apellidoP + " " + option.apellidoM + " "}
                                        renderInput={(params) =>
                                            <TextFieldGeneral
                                                className="inputTextSize100"
                                                label={"Usuario"}
                                                {...params}
                                                placeholder="Buscar.."
                                            />}
                                        value={_ListUsuarios?.find(option => option.id === _AsigUsuario.id_usuario) || null}
                                        onChange={(event, value) =>
                                            handleAsigUsuario({ target: { name: 'id_usuario', value: value?.id } })
                                        }
                                        noOptionsText="No hay opciones"
                                    />
                                </Grid>
                            </Grid>
                            <br></br>
                            <center>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button className='btn-aceptar' onClick={Asignacion} variant={"contained"} sx={{ mr: 1 }}>Continuar</Button>

                                    <Button className="btn-cancelar" onClick={Cancelar} variant={"contained"}>Cancelar</Button>
                                </Box>
                            </center>
                        </DialogContent>
                    </Grid>

                </Grid>
            </Dialog>
        </div >

    )
}
export default AlertaAsignacion
