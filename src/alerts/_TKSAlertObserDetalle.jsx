import { Box, Dialog, DialogContent, Grid, IconButton, Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useEffect, useState } from 'react';
import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';
import moment from 'moment';

const AlertObserDetalle = (props) => {
    const [tablaObservaciones, TablaObservaciones] = useState([])
    useEffect(() => {
        if (props.obserDetaInfo.length > 0) {
            TablaObservaciones(props.obserDetaInfo);
        }
    }, [props.obserDetaInfo]);
    return (
        <Dialog
            fullWidth
            maxWidth="lg" // puedes probar también con "xl"
            open={props.open}
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
                <center>
                    <h2>Observaciones</h2>
                </center>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                        <Table size="small">
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell align={'center'}><label className='textLabel3'>Observaciones</label></StyledTableCell>
                                    <StyledTableCell align={'center'}><label className='textLabel3'>Fecha de creación</label></StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {tablaObservaciones.map((row, i) => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell align={'center'}><label className='textLabel4'>{row.observacion}</label></StyledTableCell>
                                        <StyledTableCell align={'center'}><label className='textLabel4'>{row.created_at}</label></StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AlertObserDetalle;
