import { Button, Dialog, DialogContent, Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';


import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { CAMBIO_ESTATUS_CABECERA, CERRAR_ALL_ASIGANDOS, GET_VALIDAR_CIERRE_USUARIOS } from '../Constants/ApiConstants';
import { useUserContenidoContext } from '../hooks/UserConteProvider';
import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';


const AlertaCerrarConteo = (props) => {
    const user = useUserContenidoContext();
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xs');
    const [step, setStep] = useState(0);

    const ContinuarSig = () => {
        setStep(2);
    }


    const Cancelar = () => {
        props.close(false);
        setEstatus(false);
        setStep(0);
    };
    const Continuar = () => {
        props.close(false);
        CambioEstatus(3);
        setEstatus(false);
        setStep(0);
    }
    const [_listUser, setListUser] = useState([]);
    const GetValidarCierreUser = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .getToken(GET_VALIDAR_CIERRE_USUARIOS + props.idCarga) //### ** 
            .then((response) => {
                if (response.data.length == 0) {
                    setStep(2);
                } else {
                    setListUser(response.data)
                    setStep(1);
                }
                props.props.props.setCloseLoadingScreen()

            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen()
            })
    }

    const CambioEstatus = (IdStatus) => {
        props.props.props.setOpenLoadingScreen()
        requests
            .putToken(CAMBIO_ESTATUS_CABECERA + props.idCarga, { "id_estatus": IdStatus }) //### ** 
            .then((response) => {
                CerrarAllAsigando();
                props.GetListCatalogo();
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen()
            })
    }

    const CerrarAllAsigando = (IdStatus) => {
        props.props.props.setOpenLoadingScreen()
        requests
            .putToken(CERRAR_ALL_ASIGANDOS + props.idCarga) //### ** 
            .then((response) => {
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen()
            })
    }
    const [_Estatus, setEstatus] = useState(false);
    if (props.open == true && props.idCarga != null && _Estatus == false) {
        setEstatus(true);
        GetValidarCierreUser();
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
                            {step === 1 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        Los siguientes usuarios todavía no han cerrado sus conteos.
                                    </p>

                                    <br />
                                    <TableContainer component={Paper} >
                                        <Table sx={{ minWidth: 80, maxHeight: '300px', }} aria-label="customized table">
                                            <TableHead>

                                                <TableRow>
                                                    <StyledTableCell align="center">
                                                        <label className='textLabel3'>Usuario</label>
                                                    </StyledTableCell>

                                                    <StyledTableCell align="center">
                                                        <label className='textLabel3'>Nombre completo</label>
                                                    </StyledTableCell>

                                                    <StyledTableCell align="center">
                                                        <label className='textLabel3'>Estatus</label>
                                                    </StyledTableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {_listUser.map((item) => {
                                                    return (
                                                        <StyledTableRow
                                                            hover
                                                            role="checkbox"
                                                            //tabIndex2={-1}
                                                            key={item.id}
                                                            className="font-weight1"
                                                        >
                                                            <StyledTableCell>
                                                                <label className='textLabel4'>{item.user}</label> {/* //### ** */}
                                                            </StyledTableCell>

                                                            <StyledTableCell>
                                                                <label className='textLabel4'>{item.name + " " + item.apellidoP + " " + item.apellidoM}</label> {/* //### ** */}
                                                            </StyledTableCell>

                                                            <StyledTableCell>
                                                                <label className='textLabel4'>{item.status_nombre}</label> {/* //### ** */}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    );
                                                })}
                                            </TableBody>

                                        </Table>
                                    </TableContainer>
                                    <br />
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        ¿Quieres cerrar el conteo de esta carga?
                                    </p>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className='btn-aceptar' onClick={ContinuarSig} variant={"contained"}>Continuar</Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className="btn-cancelar" onClick={Cancelar} variant={"contained"}>Cancelar</Button>
                                        </Grid>
                                    </Grid>
                                </center>
                            )}
                            {step === 2 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                        ¿Estás seguro de que deseas cerrar el conteo de esta carga?
                                    </p>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className='btn-aceptar' onClick={Continuar} variant={"contained"}>Continuar</Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Button className="btn-cancelar" onClick={Cancelar} variant={"contained"}>Cancelar</Button>
                                        </Grid>
                                    </Grid>
                                </center>
                            )}

                        </DialogContent>
                    </Grid>

                </Grid>
            </Dialog>
        </div>

    )
}
export default AlertaCerrarConteo
