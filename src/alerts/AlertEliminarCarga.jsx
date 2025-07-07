import { Button, Dialog, DialogContent, Grid } from '@mui/material';
import React, { useState } from 'react';


import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { DELETE_CARGA } from '../Constants/ApiConstants';
import { useUserContenidoContext } from '../hooks/UserConteProvider';


const AlertEliminarCarga = (props) => {
    const user = useUserContenidoContext();
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xs');
    const [step, setStep] = useState(1);

    const ContinuarSig = () => {
        setStep(2);
    }

    const ContinuarSig2 = () => {
        setStep(3);
    }


    const Cancelar = () => {
        props.close(false);
        setEstatus(false);
        setStep(1);
    };
    const Continuar = () => {
        props.close(false);
        EliminarCarga();
        setEstatus(false);
        setStep(1);
    }

    const EliminarCarga = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .deleteToken(DELETE_CARGA + props.idCarga) //### ** 
            .then((response) => {
                props.props.props.setMessageSnackBar(response.data.message, 'success');
                props.props.props.setCloseLoadingScreen()
                props.GetListCatalogo();
            })
            .catch((error) => {
                
                props.props.props.setMessageSnackBar(error, 'warning');
                props.props.props.setCloseLoadingScreen()
            })
    }
    const [_Estatus, setEstatus] = useState(false);
    if (props.open == true && props.idCarga != null && _Estatus == false) {
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
                            {step === 1 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                    {props.claveCarga}
                                        ¿Está seguro que  quiere eliminar la carga con clave {props.claveCarga}?.
                                    </p>

                                    <br />
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className='btn-aceptar' onClick={ContinuarSig} variant={"contained"}>Continuar</Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className="btn-cancelar" onClick={Cancelar} variant={"contained"}>Cancelar</Button>
                                        </Grid>
                                    </Grid>
                                </center>
                            )}
                            {step === 2 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        Está acción eliminará conteos, observaciones, asignaciones y la carga misma.
                                    </p>

                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        ¿Desea continuar con esta acción.?
                                    </p>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className="btn-cancelar" onClick={Cancelar} variant={"contained"}>Cancelar</Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className='btn-aceptar' onClick={ContinuarSig2} variant={"contained"}>Continuar</Button>
                                        </Grid>
                                    </Grid>
                                </center>
                            )}
                            {step === 3 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        Está acción es irreversible y no podrán recuperarse los datos. 
                                    </p>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        ¿Está usted completamente seguro de eliminar la carga?
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
                            )}

                        </DialogContent>
                    </Grid>

                </Grid>
            </Dialog>
        </div>

    )
}
export default AlertEliminarCarga
