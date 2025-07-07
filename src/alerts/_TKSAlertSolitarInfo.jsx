import { Box, Button, Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { TextFieldGeneral } from '../Styles/TextField/TextField';
import { CREATE_OBSERVACIONES_ARTICULOS_DETALLE } from '../Constants/ApiConstants';
import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { useEffect, useState } from 'react';
import { useUserContenidoContext } from '../hooks/UserConteProvider';

const AlertSolitarInfo = (props) => {
    //:::::::::::::::::::::: UserConteProvider :::::::::::::::::::::::

    const user = useUserContenidoContext();
    const [informacionArticulo, setInformacionArticulo] = useState({
        id_solicitud_detalle: 0,
        id_usuario: user.idUsuario,
        observacion: "",
    });

    const handleInformacioArticulo = (e) => {
        setInformacionArticulo({
            ...informacionArticulo,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (props.detalleSolicitud.id != 0) {
            setInformacionArticulo({
                ...informacionArticulo,
                "id_solicitud_detalle": props.detalleSolicitud.id
            });
        }
    }, [props.detalleSolicitud.id]);


    const handleGuardar = async () => {
        props.props.props.setOpenLoadingScreen();
        await Promise.all([
            requests.postToken(CREATE_OBSERVACIONES_ARTICULOS_DETALLE, informacionArticulo),
        ]).then(([createSDResponse]) => {
            setInformacionArticulo({
                ...informacionArticulo,
                id_solicitud_detalle: 0,
                id_usuario: user.idUsuario,
                observacion: "",
            });
            return props.handleEditar();
        }).catch((error) => {
            props.props.props.setMessageSnackBar(error.message, 'warning');
        }).finally(() => {
            props.handlecancelar();
            props.close();
            props.props.props.setCloseLoadingScreen();
        });
    }

    const handleSubmit = () => {
        handleGuardar();
    }

    const handlecancelar = () => {
        props.close();
        props.setDetalleSolicitud({
            ...props.detalleSolicitud,
            "cotizado": null
        });
    }
    return (
        <Dialog
            fullWidth
            maxWidth="md" // puedes probar también con "xl"
            open={props.open}
            onClose={handlecancelar}
        >
            {/* <Grid container className='containerCerrar'>
                <a className='cerrar'>
                    <IconButton aria-label="delete" size="small"
                        onClick={handlecancelar}

                    >
                        <DisabledByDefaultIcon sx={{ color: 'red' }} />
                    </IconButton>
                </a>
            </Grid> */}
            <DialogContent>
                <Box sx={{
                    borderRadius: 2,
                    maxHeight: '80vh',
                    overflow: 'auto',
                }}>
                    <Grid container>
                        Descripción de la solicitud de información
                    </Grid>
                    <br></br>
                    <Grid container xs={12} >
                        <TextFieldGeneral
                            //error={(errorSolicitudHeader.descripcion ? (true) : (false))}
                            className="inputTextSize100"
                            multiline
                            minRows={6}
                            label="Descripción de la solicitud de mayor información para la solicitud del Artículo"
                            value={informacionArticulo.observacion}
                            name='observacion'
                            onChange={handleInformacioArticulo}
                        />
                        {/* {errorSolicitudHeader.descripcion && (
                            <span className="label_Quest_Validaciones">{errorSolicitudHeader.descripcion}</span>
                        )} */}
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            disabled={informacionArticulo.observacion == "" ? true : false}
                            className={informacionArticulo.observacion == "" ? "btn-aceptar-disabled" : "btn-aceptar"}
                            onClick={handleSubmit}
                            variant={"contained"} sx={{ mr: 1 }}>
                            {'Guardar'}
                        </Button>

                        <Button onClick={handlecancelar} className="btn-cancelar" variant={"contained"}>Cancelar</Button>
                    </Box>
                </Box>

            </DialogContent>
        </Dialog>
    );
};

export default AlertSolitarInfo;
