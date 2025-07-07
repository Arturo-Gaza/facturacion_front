import { Button, Dialog, DialogContent, Grid } from '@mui/material';
import React, { useState } from 'react';


import { useUserContenidoContext } from '../hooks/UserConteProvider';


const AlertaFileExist = (props) => {
    const user = useUserContenidoContext();

    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xs');

    const Continuar = () => {
        props.setFileNameExits(true);
        const formData = new FormData();
        formData.append('csv_file', props.file);
        props.setOpenArchivoEsxit(false);

        props.handleUpload(formData);
    }

    const cancelar = () => {
        props.setFileNameExits(false);
        props.setOpenArchivoEsxit(false);
    }

    return (
        <div>

            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={props.openArchivoEsxit}
            >
                <Grid style={{ borderRadius: '10px' }}>
                    <Grid>
                        <DialogContent >
                            <center>
                                <p>El nombre del archivo que seleccionaste ya fue seleccionado con anterioridad.</p>
                                <br></br>
                                <p>¿Deseas continuar con la carga del archivo?</p>
                                <Grid container>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Button className='btn-aceptar' onClick={Continuar} variant={"contained"}>Continuar</Button>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Button className="btn-cancelar" onClick={cancelar} variant={"contained"}>Cancelar</Button>
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
export default AlertaFileExist
