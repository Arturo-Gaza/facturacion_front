import { Button, Dialog, DialogContent, Grid } from '@mui/material';
//REACT
import React, { useState } from 'react';
//COMPONENTES MUI MATERIAL
import {
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
//ACCIONES
import { CREATE_OBSERVACIONES, GET_OBSERVACIONES_ID_CARGA, GET_OBSERVACIONES_ID_CARGA_USER } from '../Constants/ApiConstants';
import AlertaFilter from "../alerts/FilterCatalogos";
import requests from '../components/AxiosCalls/AxiosCallsLocal';
//ICONOS 
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//ESTILOS
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';
import { TextFieldGeneral } from '../Styles/TextField/TextField';



import moment from 'moment';
import { useUserContenidoContext } from '../hooks/UserConteProvider';


const AlertaObservaciones = (props) => {
    const user = useUserContenidoContext();
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('lg');
    //::::::::::: OBSERVACIONES ::::::::::::::::::::
    const [_Array, setArray] = useState({
        id_detalle_carga: props.idCarga,
        id_usuario: user.idUsuario,
        observacion: "",
        habilitado: true
    })//### **

    const handleLimpiar = () => {
        setArray({
            ..._Array,
            id_detalle_carga: props.idCarga,
            id_usuario: user.idUsuario,
            observacion: "",
            habilitado: true
        });//### **
    }

    const handleArrayCatalogo = (e) => {
        setArray({
            ..._Array,
            [e.target.name]: e.target.value,
            'id_detalle_carga': props.idCarga
        });
    }



    //::::::::::: MODALES ::::::::::::::::::::
    const [id, setId] = useState(null)
    const [open, setOpen] = useState(false)
    const [titulo, setTitulo] = useState("Almacén")//### ** 

    const handleOpen = (id) => {
        setOpen(!open)
        setId(id)
    }

    const handleClose = () => {
        setOpen(!open)
        GetListCatalogo();
        setId(null)
    }

    const handleCancel = () => {
        setOpen(!open)
        setId(null)
    }
    //::::::::::: OBTENER FILTRO ::::::::::::::::::::
    const [_ListCatalogo, setListCatalogo] = useState([])
    const GetListCatalogo = () => {
        let ObservacionesList = "";
        if (user.idRol == 2) {
            ObservacionesList = GET_OBSERVACIONES_ID_CARGA_USER + props.idCarga + "/" + user.idUsuario;
        } else {
            ObservacionesList = GET_OBSERVACIONES_ID_CARGA + props.idCarga;
        }
        props.props.props.setOpenLoadingScreen()
        requests
            .getToken(ObservacionesList) //### ** 
            .then((response) => {
                // props.props.props.setMessageSnackBar(response.data.message, 'success');
                setListCatalogo(response.data.data)
                props.props.props.setCloseLoadingScreen()
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen()
            })
    }

    //::::::::::: PAGINADO ::::::::::::::::::::
    let paginas = 0;
    const [page, setPage] = React.useState(1);
    const [inicio, setInicio] = React.useState(0);
    const [fin, setFin] = React.useState(5);
    const [tamanio, setTamanio] = React.useState(5);

    const handleChange = (event, value) => {
        setPage(value);
        setInicio(parseInt((value - 1) * tamanio))
        setFin(parseInt(value * tamanio))
    };

    //::::::::::: FILTROS ::::::::::::::::::::
    const [filter, setFilter] = useState(false);
    const openFilter = () => {
        setFilter(true);
    };
    const closeFilter = () => {
        setFilter(false);
    };

    const regresar = () => {
        setInicio(0)
        setFin(10)
        setPage(1);
    }

    const [stepFilter, setStepFilter] = useState(0);
    const porHabilitado = () => {
        setStepFilter(1);
        openFilter();
    };

    //::::::::::: FILTROS - SEARCH ::::::::::::::::::::
    const [search0, setSearch0] = useState('');
    const [search1, setSearch1] = useState("true");
    var results = _ListCatalogo.sort((a, b) => b.id - a.id);
    if (!search0 && !search1) {
        paginas = Math.ceil((results.length / tamanio));
    } else {
        if (search0 != "") {
            results = results.filter((dato) =>
                dato.user.toLowerCase().includes(search0.toLocaleLowerCase()) //### **
            );
        }
        if (search1 != "Mostrar todos") {
            if (search1 == 'true') {
                results = results.filter((dato) =>
                    dato.habilitado == true //###
                );
            }
            if (search1 == 'false') {
                results = results.filter((dato) =>
                    dato.habilitado == false //###
                );
            }
        } else {
            results = results.filter((dato) =>
                dato.habilitado != null //###
            );
        }
        paginas = Math.ceil((results.length / tamanio));
    }

    const searcher0 = (e) => {
        setSearch0(e.target.value);
        setInicio(0)
        setFin(10)
        setPage(1);
    }

    //::::::::::: FILTROS - ORDENAR POR ASC Y DESC ::::::::::::::::::::
    const [ascNombre, setASCNombre] = useState(false);
    const [descNombre, setDescNombre] = useState(false);

    if (ascNombre == true) {
        results = results.sort((a, b) => a.user.localeCompare(b.user)); //### **
    }

    if (descNombre == true) {
        results = results.sort((a, b) => b.user.localeCompare(a.user)); //### **
    }

    const NombreAsc = () => {
        setASCNombre(true);
        setDescNombre(false);
    };
    const NombreDesc = () => {
        setASCNombre(false);
        setDescNombre(true);
    };

    const [_Estatus, setEstatus] = useState(false);
    if (props.open == true && props.idCarga != null && _Estatus == false) {
        setEstatus(true);
        GetListCatalogo()
    }



    const Cancelar = () => {
        props.close(false);
        setListCatalogo([]);
        setEstatus(false);
        handleLimpiar();
    };
    const Continuar = () => {
        if (_Array.observacion == "") {
            props.props.props.setMessageSnackBar('Agregue una observación.', 'warning');
        } else {
            props.props.props.setOpenLoadingScreen()
            requests
                .postToken(CREATE_OBSERVACIONES, _Array) //### ** 
                .then((response) => {
                    setEstatus(false);
                    handleLimpiar();
                    GetListCatalogo();
                })
                .catch((error) => {
                    error.data.errors.forEach(element => {
                        props.props.props.setMessageSnackBar(element, 'warning');
                    });
                    props.props.props.setCloseLoadingScreen()
                })
        }
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
                        <Grid container className='containerCerrar'>
                            <a className='cerrar'>
                                <IconButton aria-label="delete" size="small"
                                    onClick={Cancelar}

                                >
                                    <DisabledByDefaultIcon sx={{ color: 'red' }} />
                                </IconButton>
                            </a>
                        </Grid>
                        <DialogContent >
                            <center>
                                {/* <p>{props.idCarga}</p> */}
                                <center>
                                    <h3>Observaciones</h3>
                                </center>

                                <AlertaFilter
                                    regresar={regresar}
                                    closeFilter={closeFilter}
                                    filter={filter}
                                    props={props}
                                    setSearch1={setSearch1}
                                    search1={search1}
                                    stepFilter={stepFilter}
                                />

                                <Grid container>
                                    <Grid item xs={12} sm={4} md={4}>
                                        <Box
                                            sx={{
                                                display: { xs: "flex", sm: "flex", md: "flex" },
                                                justifyContent: { xs: "center", sm: "flex-start", md: 'flex-start' }
                                            }}
                                        >
                                            <TextFieldGeneral
                                                className="inputTextSize75"
                                                value={search0}
                                                onChange={searcher0}
                                                placeholder="Buscar por usuario."
                                                inputProps={{
                                                    maxLength: 200,
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4}>

                                        <Stack alignItems="center"
                                            marginBottom={2}>
                                            <Pagination count={paginas} page={page} onChange={handleChange} variant="outlined" shape="rounded" />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4}>

                                    </Grid>
                                </Grid>

                                <label className='textLabel1'>Total de Registros: {results.length} </label>
                                <TableContainer component={Paper} >
                                    <Table sx={{ minWidth: 80, maxHeight: '300px', }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" width="50%">
                                                    <label className='textLabel3'>Observaciones</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Usuario</label>
                                                    <Tooltip title="Ordenar por Abecedario">
                                                        <IconButton onClick={NombreAsc} style={{ width: "30px", height: "30px" }}>
                                                            <ExpandLessIcon sx={{ color: "white" }} style={{ width: "20px", height: "20px" }} />
                                                        </IconButton>
                                                        <IconButton onClick={NombreDesc} style={{ width: "30px", height: "30px" }}>
                                                            <ExpandMoreIcon sx={{ color: "white" }} style={{ width: "20px", height: "20px" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Rol</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Nombre completo</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Fecha</label>
                                                </StyledTableCell>


                                                {/* <StyledTableCell align="center" >
                                                    <label className='textLabel3'>Habilitado</label>
                                                    <Tooltip title="Filtrar por Estatus">
                                                        <IconButton onClick={porHabilitado} style={{ width: "30px", height: "30px" }}>
                                                            <FilterAltIcon sx={{ color: "white" }} style={{ width: "20px", height: "20px", }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </StyledTableCell> */}

                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {results.slice(inicio, fin).map((item) => {
                                                return (
                                                    <StyledTableRow
                                                        hover
                                                        role="checkbox"
                                                        //tabIndex2={-1}
                                                        key={item.id}
                                                        className="font-weight1"
                                                    >
                                                        <StyledTableCell>
                                                            <label className='textLabel4'>{item.observacion}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell>
                                                            <label className='textLabel4'>{item.user}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell>
                                                            <label className='textLabel4'>{item.nombre}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell>
                                                            <label className='textLabel4'>{item.name + " " + item.apellidoP + " " + item.apellidoM}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell>
                                                            <label className='textLabel4'>{item.created_at}</label>
                                                            {/* <label className='textLabel4'>{moment(item.created_at.split('/').reverse().join('/')).format("YYYY-MM-DD")}</label> //### ** */}
                                                        </StyledTableCell>


                                                        {/* <StyledTableCell align="center">
                                                            <Checkbox
                                                                disabled
                                                                checked={item.habilitado}
                                                            />
                                                        </StyledTableCell> */}
                                                        {/* <StyledTableCell align="center">
                                                            <IconButton
                                                                aria-label="editar"
                                                                color="primary"
                                                                onClick={function () {
                                                                    handleOpen(item.id);
                                                                }}
                                                            >
                                                                <EditNoteIcon sx={{ color: "#0066CC" }} />
                                                            </IconButton>
                                                        </StyledTableCell> */}
                                                    </StyledTableRow>
                                                );
                                            })}
                                        </TableBody>

                                    </Table>
                                </TableContainer>
                            </center>
                            <br></br>
                            <center>
                                <textarea
                                    //disabled={getLocalRol() == 7 || getLocalRol() == 6 || getLocalRol() == 8 ? (true) : (false)}
                                    cols="70"
                                    rows="4"
                                    id="observacion"
                                    name='observacion'
                                    error={_Array.observacion == "" ? true : false}
                                    value={_Array.observacion}
                                    onChange={handleArrayCatalogo}
                                    placeholder="Escribe aquí tu Observación"
                                >
                                </textarea>
                                <br />
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Button className='btn-aceptar10' onClick={Continuar} variant={"contained"}>Guardar</Button>
                                    </Grid>
                                </Grid>
                            </center>
                        </DialogContent>
                    </Grid>

                </Grid>
            </Dialog>
        </div>

    )
}
export default AlertaObservaciones
