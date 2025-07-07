import { Button, Dialog, DialogContent, Grid } from '@mui/material';
import React, { useState } from 'react';


import { DELETE_CONTEO_BY_IDS } from '../Constants/ApiConstants';
import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { useUserContenidoContext } from '../hooks/UserConteProvider';


const AlertaCerrarConteo = (props) => {
    const user = useUserContenidoContext();
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xs');

    const Cancelar1 = () => {
        props.close(false);
    };
    const Continuar1 = () => {
        props.close(false);
        props.CerrarConteo();
        // props.setStepAlerts(4);
    }

    const Continuar1Cerrar = () => {
        props.close(false);
        props.CerrarConteo();
    }

    const Cancelar2 = () => {
        props.close(false);
    };
    const Continuar2 = () => {
        props.setStepAlerts(3);
    }

    const Continuar2Delete = () => {
        props.props.props.setOpenLoadingScreen();
        requests
            .deleteToken(DELETE_CONTEO_BY_IDS + props.idConteo + '/' + user.idUsuario + '/' + props._numConte)
            .then((response) => {
                props.close(false);
                props.CancelarConteo();
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen();
            });
    }



    const Cancelar3 = () => {
        props.close(false);
    };
    const Continuar3 = () => {
        props.close(false);
        props.PausarConteo();
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
                            {props.step === 0 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        ¿Estás seguro de que deseas cerrar el conteo?
                                    </p>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className='btn-aceptar' onClick={Continuar1} variant={"contained"}>Continuar</Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className="btn-cancelar" onClick={Cancelar1} variant={"contained"}>Cancelar</Button>
                                        </Grid>
                                    </Grid>
                                </center>
                            )}

                            {props.step === 4 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        El conteo se cerrará y no podrás realizar modificaciones en este conteo.
                                    </p>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        ¿Deseas continua?
                                    </p>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className='btn-aceptar' onClick={Continuar1Cerrar} variant={"contained"}>Continuar</Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className="btn-cancelar" onClick={Cancelar1} variant={"contained"}>Cancelar</Button>
                                        </Grid>
                                    </Grid>
                                </center>
                            )}


                            {props.step === 2 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        ¿Estás seguro de que deseas pausar el conteo?
                                    </p>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className='btn-aceptar' onClick={Continuar3} variant={"contained"}>Continuar</Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className="btn-cancelar" onClick={Cancelar3} variant={"contained"}>Cancelar</Button>
                                        </Grid>
                                    </Grid>
                                </center>
                            )}

                            {props.step === 1 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        ¿Estás seguro de que deseas cancelar el conteo?
                                    </p>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className='btn-aceptar' onClick={Continuar2} variant={"contained"}>Continuar</Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className="btn-cancelar" onClick={Cancelar2} variant={"contained"}>Cancelar</Button>
                                        </Grid>
                                    </Grid>
                                </center>
                            )}

                            {props.step === 3 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        Se eliminarán todos los conteos que llevas registrado.
                                    </p>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        ¿Deseas continua?
                                    </p>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className='btn-aceptar' onClick={Continuar2Delete} variant={"contained"}>Continuar</Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className="btn-cancelar" onClick={Cancelar2} variant={"contained"}>Cancelar</Button>
                                        </Grid>
                                    </Grid>
                                </center>
                            )}

                        </DialogContent>
                    </Grid>

                </Grid>
            </Dialog>
        </div>

    )
}
export default AlertaCerrarConteo
