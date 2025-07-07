import { Box, Button, Dialog, DialogContent, Grid, IconButton, Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useEffect, useState } from 'react';
import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AlertDocumentoCotizacion = (props) => {
    const [step, setStep] = useState(0)
    const [tablaCotizacion, TablaCotizaciones] = useState([])
    useEffect(() => {
        if (props.cotizaDetaInfo.length > 0) {
            TablaCotizaciones(props.cotizaDetaInfo);
        }
    }, [props.cotizaDetaInfo]);

    const [cotizacionSeleccionado, setCotizacionSeleccionado] = useState(null);

    const verImagenCotizacion = (index, archivo) => {
        const tipoMime = archivo.archivo_cotizacion.split(';')[0].split(':')[1]; // extrae el tipo MIME
        setCotizacionSeleccionado({ ...archivo, tipoMime });
        setStep(1);
    };

    const cerrar = () => {
        props.close();
        setCotizacionSeleccionado(null);
        setStep(0);
    }


    return (
        <Dialog
            fullWidth
            maxWidth="lg" // puedes probar también con "xl"
            open={props.open}
        >
            <Grid container className='containerCerrar'>
                <a className='cerrar'>
                    <IconButton aria-label="delete" size="small"
                        onClick={cerrar}

                    >
                        <DisabledByDefaultIcon sx={{ color: 'red' }} />
                    </IconButton>
                </a>
            </Grid>
            <DialogContent>
                {step == 0 && (
                    <Box sx={{
                        borderRadius: 2,
                        maxHeight: '80vh',
                        overflow: 'auto',
                    }}>
                        <center>
                            <h2>Cotizaciones</h2>
                        </center>
                        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                            <Table size="small">
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell align={'center'}><label className='textLabel3'>Nombre Archivo</label></StyledTableCell>
                                        <StyledTableCell align={'center'}><label className='textLabel3'>Fecha de creación</label></StyledTableCell>
                                        <StyledTableCell align={'center'}><label className='textLabel3'>Archivo recomendado</label></StyledTableCell>
                                        <StyledTableCell align={'center'}><label className='textLabel3'>Justificación  de la recomendación</label></StyledTableCell>
                                        <StyledTableCell align={'center'}><label className='textLabel3'>Documento</label></StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {[...tablaCotizacion]
                                        .sort((a, b) => (b.recomendada === true) - (a.recomendada === true))
                                        .map((row, index) => (
                                            <StyledTableRow key={row.id}>
                                                <StyledTableCell align={'center'}><label className='textLabel4'>{row.nombre_cotizacion}</label></StyledTableCell>
                                                <StyledTableCell align={'center'}><label className='textLabel4'>{row.created_at }</label></StyledTableCell>
                                                <StyledTableCell align={'center'}><label className='textLabel4'>{row.recomendada === true ? "Si" : "No"}</label></StyledTableCell>
                                                <StyledTableCell align={'center'}><label className='textLabel4'>{row.justificacion === null ? "Sin Justificación" : row.justificacion}</label></StyledTableCell>
                                                <StyledTableCell align={'center'}>
                                                    <IconButton size="small" onClick={() => verImagenCotizacion(index, row)}>
                                                        <VisibilityIcon fontSize="small" sx={{ color: "#0066CC" }} />
                                                    </IconButton>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>)}
                {step == 1 && (
                    cotizacionSeleccionado && (
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
                                        src={cotizacionSeleccionado.archivo_cotizacion}
                                        alt="Vista previa"
                                        style={{ maxWidth: '100%', maxHeight: '60vh' }}
                                    />
                                ) : cotizacionSeleccionado.tipoMime === 'application/pdf' ? (
                                    <embed
                                        src={cotizacionSeleccionado.archivo_cotizacion}
                                        type="application/pdf"
                                        width="100%"
                                        height="500px"
                                    />
                                ) : (
                                    <>
                                        <center>
                                            <p>No se puede mostrar una vista previa para este tipo de archivo.</p>
                                            <a href={cotizacionSeleccionado.archivo_cotizacion} download={cotizacionSeleccionado.nombre_cotizacion}>
                                                Descargar archivo
                                            </a>
                                        </center>
                                    </>
                                )}
                            </Box>
                            <center>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button className="btn-cancelar" onClick={() => setStep(0)} variant={"contained"}>
                                        Regresar
                                    </Button>
                                </Box>
                            </center>
                        </>
                    ))}
            </DialogContent>
        </Dialog >
    );
};

export default AlertDocumentoCotizacion;
