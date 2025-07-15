import { Box, Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useMemo } from 'react';

const AlertDocumentoCotizacion = (props) => {
    const base64ToBlobUrl = (base64Data, mimeType) => {
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteArrays = [];

        for (let i = 0; i < byteCharacters.length; i += 512) {
            const slice = byteCharacters.slice(i, i + 512);
            const byteNumbers = new Array(slice.length);
            for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: mimeType });
        return URL.createObjectURL(blob);
    };

    const archivoUrl = useMemo(() => {
        const c = props.cotizacionSeleccionado;
        if (!c || !c.archivo_cotizacion || !c.tipoMime) return null;
        if (c.tipoMime.startsWith('image') || c.tipoMime === 'application/pdf') {
            return base64ToBlobUrl(c.archivo_cotizacion, c.tipoMime);
        }
        return null;
    }, [props.cotizacionSeleccionado]);

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
                                src={archivoUrl}
                                alt="Vista previa"
                                style={{ maxWidth: '100%', maxHeight: '70vh' }}
                            />
                        ) : props.cotizacionSeleccionado.tipoMime === 'application/pdf' ? (
                            <embed
                                src={archivoUrl}
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
