import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead
} from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useEffect, useMemo, useState } from 'react';
import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AlertDocumentoCotizacion = (props) => {
    const [step, setStep] = useState(0);
    const [tablaCotizacion, TablaCotizaciones] = useState([]);
    const [cotizacionSeleccionado, setCotizacionSeleccionado] = useState(null);

    useEffect(() => {
        if (props.cotizaDetaInfo.length > 0) {
            TablaCotizaciones(props.cotizaDetaInfo);
        }
    }, [props.cotizaDetaInfo]);

    const verImagenCotizacion = (index, archivo) => {
        const tipoMime = archivo.archivo_cotizacion.split(';')[0].split(':')[1]; // extrae el tipo MIME
        setCotizacionSeleccionado({ ...archivo, tipoMime });
        setStep(1);
    };

    const cerrar = () => {
        props.close();
        setCotizacionSeleccionado(null);
        setStep(0);
    };

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
        if (!cotizacionSeleccionado) return null;
        const { archivo_cotizacion, tipoMime } = cotizacionSeleccionado;
        if (tipoMime && (tipoMime.startsWith('image') || tipoMime === 'application/pdf')) {
            return base64ToBlobUrl(archivo_cotizacion, tipoMime);
        }
        return null;
    }, [cotizacionSeleccionado]);

    useEffect(() => {
        return () => {
            if (archivoUrl) {
                URL.revokeObjectURL(archivoUrl);
            }
        };
    }, [archivoUrl]);

    return (
        <Dialog fullWidth maxWidth="lg" open={props.open}>
            <Grid container className='containerCerrar'>
                <a className='cerrar'>
                    <IconButton aria-label="delete" size="small" onClick={cerrar}>
                        <DisabledByDefaultIcon sx={{ color: 'red' }} />
                    </IconButton>
                </a>
            </Grid>
            <DialogContent>
                {step === 0 && (
                    <Box sx={{ borderRadius: 2, maxHeight: '80vh', overflow: 'auto' }}>
                        <center>
                            <h2>Cotizaciones</h2>
                        </center>
                        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                                <Table size="small">
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell align="center">Nombre Archivo</StyledTableCell>
                                            <StyledTableCell align="center">Fecha de creación</StyledTableCell>
                                            <StyledTableCell align="center">Archivo recomendado</StyledTableCell>
                                            <StyledTableCell align="center">Justificación</StyledTableCell>
                                            <StyledTableCell align="center">Documento</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {[...tablaCotizacion]
                                            .sort((a, b) => (b.recomendada === true) - (a.recomendada === true))
                                            .map((row, index) => (
                                                <StyledTableRow key={row.id}>
                                                    <StyledTableCell align="center">{row.nombre_cotizacion}</StyledTableCell>
                                                    <StyledTableCell align="center">{row.created_at}</StyledTableCell>
                                                    <StyledTableCell align="center">{row.recomendada ? "Sí" : "No"}</StyledTableCell>
                                                    <StyledTableCell align="center">{row.justificacion || "Sin Justificación"}</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <IconButton size="small" onClick={() => verImagenCotizacion(index, row)}>
                                                            <VisibilityIcon fontSize="small" sx={{ color: "#0066CC" }} />
                                                        </IconButton>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                )}

                {step === 1 && cotizacionSeleccionado && (
                    <>
                        <Box
                            sx={{
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: 2,
                                margin: 2,
                                maxHeight: '80vh',
                                overflow: 'auto',
                            }}
                        >
                            <h4>{cotizacionSeleccionado.nombre_cotizacion}</h4>
                            {cotizacionSeleccionado.tipoMime.startsWith('image') ? (
                                <img
                                    src={archivoUrl}
                                    alt="Vista previa"
                                    style={{ maxWidth: '100%', maxHeight: '60vh' }}
                                />
                            ) : cotizacionSeleccionado.tipoMime === 'application/pdf' ? (
                                <embed
                                    src={archivoUrl}
                                    type="application/pdf"
                                    width="100%"
                                    height="500px"
                                />
                            ) : (
                                <center>
                                    <p>No se puede mostrar una vista previa para este tipo de archivo.</p>
                                    <a
                                        href={cotizacionSeleccionado.archivo_cotizacion}
                                        download={cotizacionSeleccionado.nombre_cotizacion}
                                    >
                                        Descargar archivo
                                    </a>
                                </center>
                            )}
                        </Box>
                        <center>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button className="btn-cancelar" onClick={() => setStep(0)} variant="contained">
                                    Regresar
                                </Button>
                            </Box>
                        </center>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AlertDocumentoCotizacion;