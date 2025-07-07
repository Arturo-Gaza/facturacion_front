import { Box, Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

const AlertDocumentoCotizacion = (props) => {
    return (
        <Dialog
            fullWidth
            maxWidth="lg" // puedes probar también con "xl"
            open={props.open}
            onClose={props.close}
        >
            <Grid container className='containerCerrar'>
                <a className='cerrar'>
                    <IconButton aria-label="delete" size="small"
                        onClick={props.close}

                    >
                        <DisabledByDefaultIcon sx={{ color: 'red' }} />
                    </IconButton>
                </a>
            </Grid>
            <DialogContent>
                {props.cotizacionSeleccionado && (
                    <Box sx={{
                        borderRadius: 2,
                        maxHeight: '80vh',
                        overflow: 'auto',
                    }}>
                        <h4>{props.cotizacionSeleccionado.nombre_cotizacion}</h4>
                        {props.cotizacionSeleccionado.tipoMime.startsWith('image') ? (
                            <img
                                src={props.cotizacionSeleccionado.archivo_cotizacion}
                                alt="Vista previa"
                                style={{ maxWidth: '100%', maxHeight: '70vh' }}
                            />
                        ) : props.cotizacionSeleccionado.tipoMime === 'application/pdf' ? (
                            <embed
                                src={props.cotizacionSeleccionado.archivo_cotizacion}
                                type="application/pdf"
                                width="100%"
                                height="600px"
                            />
                        ) : (
                            <>
                                <center>
                                    <p>No se puede mostrar una vista previa para este tipo de archivo.</p>
                                    <a href={props.cotizacionSeleccionado.archivo_cotizacion} download={props.cotizacionSeleccionado.nombre_cotizacion}>
                                        Descargar archivo
                                    </a>
                                </center>
                            </>
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AlertDocumentoCotizacion;
