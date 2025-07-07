import { Box, Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

const AlertDocumento = (props) => {
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
                {props.archivoSeleccionado && (
                    <Box sx={{
                        borderRadius: 2,
                        maxHeight: '80vh',
                        overflow: 'auto',
                    }}>
                        <h4>{props.archivoSeleccionado.nombre}</h4>
                        {props.archivoSeleccionado.tipoMime.startsWith('image') ? (
                            <img
                                src={props.archivoSeleccionado.archivo}
                                alt="Vista previa"
                                style={{ maxWidth: '100%', maxHeight: '70vh' }}
                            />
                        ) : props.archivoSeleccionado.tipoMime === 'application/pdf' ? (
                            <embed
                                src={props.archivoSeleccionado.archivo}
                                type="application/pdf"
                                width="100%"
                                height="600px"
                            />
                        ) : (
                            <>
                                <center>
                                    <p>No se puede mostrar una vista previa para este tipo de archivo.</p>
                                    <a href={props.archivoSeleccionado.archivo} download={props.archivoSeleccionado.nombre}>
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

export default AlertDocumento;
