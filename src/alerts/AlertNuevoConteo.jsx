import { Button, Dialog, DialogContent, Grid } from '@mui/material';
import React, { useState } from 'react';


import { UPDATE_ASIGNACION_ESTATUS_CONTEO, UPDATE_CABECERA_ESTATUS_CONTEO } from '../Constants/ApiConstants';
import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { useUserContenidoContext } from '../hooks/UserConteProvider';


const AlertaCerrarConteo = (props) => {
    const user = useUserContenidoContext();
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xs');

    const Cancelar = () => {
        props.close(false);
    };
    const Continuar = () => {
        props.close(false);
        NuevoConteo();
    }

    const NuevoConteo = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .putToken(UPDATE_CABECERA_ESTATUS_CONTEO + props.idCarga) //### ** 
            .then((response) => {
                requests
                    .putToken(UPDATE_ASIGNACION_ESTATUS_CONTEO + props.idCarga) //### ** 
                    .then((response) => {
                        props.GetListCatalogo();
                    })
                    .catch((error) => {
                        error.data.errors.forEach(element => {
                            props.props.props.setMessageSnackBar(element, 'warning');
                        });
                        props.props.props.setCloseLoadingScreen()
                    })
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
                                    ¿Estás seguro de que deseas generar un nuevo conteo para esta carga?
                                </p>
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
export default AlertaCerrarConteo
