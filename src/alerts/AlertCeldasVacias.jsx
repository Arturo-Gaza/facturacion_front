import { Button, Dialog, DialogContent, Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import React, { useState } from 'react';

import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';
import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { useUserContenidoContext } from '../hooks/UserConteProvider';


const AlertaAyuda = (props) => {

    const [data, setData] = useState(props.data || []);
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xs');

    const Salir = () => { // SALIR DE TODOS LOS MODALES
        props.setOpenMessage(false);
    }


    return (
        <div>

            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={props.openMessage}
            >
                <Grid style={{ borderRadius: '10px' }}>
                    <Grid>
                        <DialogContent >
                            <center>
                                <p style={{ fontWeight: '50', fontSize: '1rem' }}>
                                    Las siguientes celdas se encuentran vacias.
                                </p>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                            <Table stickyHeader aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell align="center">
                                                            <label className='textLabel3'>Columna</label>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            <label className='textLabel3'>Fila</label>
                                                        </StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.map((item) => {
                                                        return (
                                                            <StyledTableRow
                                                                hover
                                                                role="checkbox"
                                                                key={item.item}
                                                                className="font-weight1"
                                                            >
                                                                <StyledTableCell>
                                                                    <label className='textLabel4'>{item.columna}</label> {/* //### ** */}
                                                                </StyledTableCell>
                                                                <StyledTableCell>
                                                                    <label className='textLabel4'>{item.fila}</label> {/* //### ** */}
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                                <center>
                                    <Grid container sx={{ paddingTop: 2 }}>
                                        <Grid item xs={12} sm={4} md={4}>
                                            <Tooltip title={"Cancelar"} arrow>
                                                <Button className="btn-cancelar" onClick={Salir} variant={"contained"}>Salir</Button>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </center>

                            </center>
                        </DialogContent>
                    </Grid>
                </Grid>
            </Dialog>
        </div>

    )
}
export default AlertaAyuda
