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

    
    const Continuar = () => {
        window.location.reload(); 
    }

    const [_Estatus, setEstatus] = useState(false);
    if (props.open == true && _Estatus == false) {
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
                                    El administrador cerro el conteo, te redireccionaremos a la página principal.
                                </p>

                                <br />
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Button className='btn-aceptar' onClick={Continuar} variant={"contained"}>OK</Button>
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
