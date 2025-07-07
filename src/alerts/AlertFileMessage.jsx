import { Button, Dialog, DialogContent, Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import React, { useState } from 'react';


import { CREATE_CABECERA_DETALLE_ARCHIVO, CREATE_CABECERA_INSERTFALTANTES, CREATE_CABECERA_NO_INSERTFALTANTES, CREATE_CATALOGO_PRODUCTO_ARCHIVO, CREATE_CATALOGOS_COMPLEMENTOS_ARCHIVO } from '../Constants/ApiConstants';
import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';
import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { useUserContenidoContext } from '../hooks/UserConteProvider';


const AlertaAyuda = (props) => {
    const user = useUserContenidoContext();

    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('md');

    const [step, setStep] = useState(0);

    const Siguiente1 = () => {
        setMaxWidth('xs');
        setStep(1);
    }
    const Siguiente2 = () => {
        setMaxWidth('xs');
        setStep(2);
    }
    const Siguiente3 = () => {
        setMaxWidth('xs');
        setStep(3);
    }

    const Continuar1 = () => {
        CargarCabInsertFalta();
        setMaxWidth('md');
        setStep(0);
        props.setOpenMessage(false);
    }
    const Continuar2 = () => {
        CargarCabNoInsertFalta();
        setMaxWidth('md');
        setStep(0);
        props.setOpenMessage(false);
    }
    const Continuar3 = () => {
        setMaxWidth('md');
        setStep(0);
        props.setOpenMessage(false);
        props.setFileNameExits(false)
    }

    const Atras1 = () => {
        setMaxWidth('md');
        setStep(0);
    }
    const Atras2 = () => {
        setMaxWidth('md');
        setStep(0);
    }
    const Atras3 = () => {
        setMaxWidth('md');
        setStep(0);
    }


    const Salir = () => { // SALIR DE TODOS LOS MODALES
        props.setOpenMessage(false);
    }

    const CargarCabeceraDetalle = () => {
        const formData = new FormData();
        formData.append('csv_file', props.file);
        props.props.props.setOpenLoadingScreen()
        requests
            .postFileToken(CREATE_CABECERA_DETALLE_ARCHIVO + user.idUsuario, formData)//### **
            .then((response) => {
                props.props.props.setMessageSnackBar("Datos cargados correctamente.", 'success');
                props.addObservaciones(response.data.data.id, "Una carga con registros incorporados");
                if (props._FileNameExits == true) {
                    props.addObservaciones(response.data.data.id, "El nombre del archivo insertado ya fue registrado.");
                    props.setFileNameExits(false)
                }
                CargarCatalog(response.data.data.id);

            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen();
            })
    }

    const CargarCatalog = (idCargaCabecera) => {
        const formData = new FormData();
        formData.append('csv_file', props.file);
        props.props.props.setOpenLoadingScreen()
        requests
            .postFileToken(CREATE_CATALOGOS_COMPLEMENTOS_ARCHIVO + idCargaCabecera, formData)//### **
            .then((response) => {
                props.props.props.setMessageSnackBar("Datos cargados correctamente.", 'success');
                CargarCatalogoProd();
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen();
            })
    }

    const CargarCatalogoProd = () => {
        const formData = new FormData();
        formData.append('csv_file', props.file);
        props.props.props.setOpenLoadingScreen()
        requests
            .postFileToken(CREATE_CATALOGO_PRODUCTO_ARCHIVO, formData)//### **
            .then((response) => {
                props.props.props.setMessageSnackBar("Datos cargados correctamente.", 'success');
                props.GetListCatalogo();
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen();
            })
    }

    const CargarTodo = () => {
        CargarCabeceraDetalle();
    }
    const CargarCabInsertFalta = () => {
        const formData = new FormData();
        formData.append('csv_file', props.file);
        props.props.props.setOpenLoadingScreen()
        requests
            .postFileToken(CREATE_CABECERA_INSERTFALTANTES + user.idUsuario, formData)//### **
            .then((response) => {
                props.addObservaciones(response.data.data.id, "Una carga con registros incorporados");
                if (props._FileNameExits == true) {
                    props.addObservaciones(response.data.data.id, "El nombre del archivo insertado ya fue registrado.");
                    props.setFileNameExits(false)
                }
                props.props.props.setMessageSnackBar("Datos cargados correctamente.", 'success');
                props.GetListCatalogo();
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen();
            })
    }

    const CargarCabNoInsertFalta = () => {
        const formData = new FormData();
        formData.append('csv_file', props.file);
        props.props.props.setOpenLoadingScreen()
        requests
            .postFileToken(CREATE_CABECERA_NO_INSERTFALTANTES + user.idUsuario, formData)//### **
            .then((response) => {
                props.addObservaciones(response.data.data.id, "Una carga con registros excluidos");
                if (props._FileNameExits == true) {
                    props.addObservaciones(response.data.data.id, "El nombre del archivo insertado ya fue registrado.");
                    props.setFileNameExits(false)
                }
                props.props.props.setMessageSnackBar("Datos cargados correctamente.", 'success');
                props.GetListCatalogo();
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen();
            })
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
                            {step === 0 && (
                                <center>
                                    <p style={{ fontWeight: '700', fontSize: '1rem' }}>
                                        El archivo que se va a cargar contiene {props.dataMessage.num_registros} registros.
                                    </p>
                                    <p style={{ fontWeight: '700', fontSize: '1rem' }}>
                                        Los siguientes datos no se encuentran en los catálogos correspondientes.
                                    </p>
                                    <Grid container>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <TableContainer component={Paper} >
                                                <Table sx={{ minWidth: 80, maxHeight: '300px', }} aria-label="customized table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell align="center" colSpan={4}>
                                                                DATOS FALTANTES
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2}>
                                            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                                <Table stickyHeader aria-label="sticky table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell align="center">
                                                                <label className='textLabel3'>Almacén</label>
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {props.dataAlmacen.map((item) => {
                                                            return (
                                                                <StyledTableRow
                                                                    hover
                                                                    role="checkbox"
                                                                    key={item.item}
                                                                    className="font-weight1"
                                                                >
                                                                    <StyledTableCell>
                                                                        <label className='textLabel4'>{item}</label> {/* //### ** */}
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2}>
                                            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                                <Table stickyHeader aria-label="sticky table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell align="center">
                                                                <label className='textLabel3'>UME</label>
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {props.dataUnidad_medida.map((item) => {
                                                            return (
                                                                <StyledTableRow
                                                                    hover
                                                                    role="checkbox"
                                                                    key={item.item}
                                                                    className="font-weight1"
                                                                >
                                                                    <StyledTableCell>
                                                                        <label className='textLabel4'>{item}</label> {/* //### ** */}
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={2}>
                                            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                                <Table stickyHeader aria-label="sticky table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell align="center">
                                                                <label className='textLabel3'>Grupo Artículos</label>
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {props.dataGrupoArticulo.map((item) => {
                                                            return (
                                                                <StyledTableRow
                                                                    hover
                                                                    role="checkbox"
                                                                    key={item.item}
                                                                    className="font-weight1"
                                                                >
                                                                    <StyledTableCell>
                                                                        <label className='textLabel4'>{item}</label> {/* //### ** */}
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6}>
                                            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                                <Table stickyHeader aria-label="sticky table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell align="center">
                                                                <label className='textLabel3'>Productos</label>
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {props.dataProductos.map((item) => {
                                                            return (
                                                                <StyledTableRow
                                                                    hover
                                                                    role="checkbox"
                                                                    key={item.item}
                                                                    className="font-weight1"
                                                                >
                                                                    <StyledTableCell>
                                                                        <label className='textLabel4'>{item}</label> {/* //### ** */}
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    </Grid>

                                    <Grid container sx={{ paddingTop: 2 }}>
                                        <Grid item xs={12} sm={4} md={4}>
                                            <Tooltip title={"Cargar Todo"} arrow>
                                                <Button className='btn-aceptar1' onClick={Siguiente1} variant={"contained"}>Cargar incluyendo faltantes</Button>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={12} sm={4} md={4}>
                                            <Tooltip title={"Cargar Archivo"} arrow>
                                                <Button className='btn-aceptar1' onClick={Siguiente2} variant={"contained"}>Cargar excluyendo faltantes</Button>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={12} sm={4} md={4}>
                                            <Tooltip title={"Cancelar"} arrow>
                                                <Button className="btn-cancelar" onClick={Siguiente3} variant={"contained"}>Cancelar</Button>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </center>
                            )}

                            {step === 1 && (
                                <>
                                    <center>
                                        <p>Se cargará los catálogos faltantes y el archivo correspondiente.</p>
                                        <Grid container>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <Button className='btn-aceptar' onClick={Continuar1} variant={"contained"}>Continuar</Button>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <Button className="btn-cancelar" onClick={Atras1} variant={"contained"}>Cancelar</Button>
                                            </Grid>
                                        </Grid>
                                    </center>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <center>
                                        <p>Se cargará el archivo omitiendo los registros que no coincida con los catálogos existentes.</p>
                                        <Grid container>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <Button className='btn-aceptar' onClick={Continuar2} variant={"contained"}>Continuar</Button>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <Button className="btn-cancelar" onClick={Atras2} variant={"contained"}>Cancelar</Button>
                                            </Grid>
                                        </Grid>
                                    </center>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <center>
                                        <p>Se cancelará la carga de archivo.</p>
                                        <Grid container>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <Button className='btn-aceptar' onClick={Continuar3} variant={"contained"}>Continuar</Button>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <Button className="btn-cancelar" onClick={Atras3} variant={"contained"}>Cancelar</Button>
                                            </Grid>
                                        </Grid>
                                    </center>
                                </>
                            )}



                        </DialogContent>
                    </Grid>

                </Grid>
            </Dialog>
        </div>

    )
}
export default AlertaAyuda
