import { Button, Dialog, DialogContent, Grid } from '@mui/material';
import React, { useState } from 'react';


import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { DELETE_CARGA, DELETE_USER, UPDATE_USER } from '../Constants/ApiConstants';
import { useUserContenidoContext } from '../hooks/UserConteProvider';


const AlertEliminarCarga = (props) => {
    const user = useUserContenidoContext();
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xs');
    const [_ArrayCatalogo, setArrayCatalogo] = useState({
        habilitado: false,
        user: ""
    })//### **

    const Cancelar = () => {
        props.handleClose();
    };
    const Continuar = () => {
        _ArrayCatalogo.user = props.nombre + '*'
        props.props.props.setOpenLoadingScreen();
        requests
            .putToken(DELETE_USER + props.id, _ArrayCatalogo)
            .then((response) => {
                props.props.props.setMessageSnackBar(response.data.message, 'success');
                props.props.props.setCloseLoadingScreen();
                props.handleClose();
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen();
            });
    }

    const [_Estatus, setEstatus] = useState(false);
    if (props.open == true && props.id != null && _Estatus == false) {
        setEstatus(true);
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
                                    {props.claveCarga}
                                    ¿Está seguro que quiere eliminar el siguiente usuario:  {props.nombre}?
                                </p>

                                <br />
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
export default AlertEliminarCarga
