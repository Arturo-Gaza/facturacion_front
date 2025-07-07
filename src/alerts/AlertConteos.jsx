import { Dialog, DialogContent, Grid } from '@mui/material';
//REACT
import React, { useState } from 'react';
//COMPONENTES MUI MATERIAL
import {
    Box,
    IconButton
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
import { GET_ALL_ASIGNACION_PERONALIZADO, GET_LIST_CONTEO_IDCARGA_IDUSER, GET_LIST_USER_ASINACION } from '../Constants/ApiConstants';
import AlertaFilter from "../alerts/FilterCatalogos";
import requests from '../components/AxiosCalls/AxiosCallsLocal';
//ICONOS 
//ESTILOS
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';
import { TextFieldGeneral } from '../Styles/TextField/TextField';



import { MenuItemGeneral, SelectGeneral } from '../Styles/Select/Select';
import { useUserContenidoContext } from '../hooks/UserConteProvider';


const AlertaVisualizar = (props) => {
    const user = useUserContenidoContext();
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('lg');

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
        // GetListCatalogo();
        setId(null)
    }

    const handleCancel = () => {
        setOpen(!open)
        setId(null)
    }

    //::::::::::: OBTENER FILTRO ::::::::::::::::::::
    const [_ListUsuarios, setListUsuarios] = useState([])
    const GetListUsuarios = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            //.getToken(GET_LIST_USER_ALL) //### ** 
            .getToken(GET_LIST_USER_ASINACION + props.idCarga) //### ** 
            .then((response) => {
                // props.props.props.setMessageSnackBar(response.data.message, 'success');
                setListUsuarios(response.data.data)
                props.props.props.setCloseLoadingScreen()
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen()
            })
    }

    //::::::::::: DETALLE ::::::::::::::::::::
    const [_ListUser, setListUser] = useState([])
    const GetListUserInfo = async (idUsuario) => {
        props.props.props.setOpenLoadingScreen();
        await requests
            .getToken(GET_ALL_ASIGNACION_PERONALIZADO + props.idCarga + '/' + idUsuario)
            .then((response) => {
                setListUser(response.data.data);
                // setUserInfo(response.data.data.cve_carga);
                GetListCatalogo(idUsuario);
            })
            .catch((error) => {
                error.data.errors.forEach(element => {
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
                props.props.props.setCloseLoadingScreen();
            });
    };

    //::::::::::: OBTENER FILTRO ::::::::::::::::::::
    const [_usuarioBusqueda, setUsuarioBusqueda] = useState({
        id_usuario: 0,
        id_carga: props.idCarga,
    })

    const handleUsuarioBusqueda = (e) => {
        setUsuarioBusqueda({
            ..._usuarioBusqueda,
            [e.target.name]: e.target.value,
            'id_carga': props.idCarga,
        });
        GetListUserInfo(e.target.value);
    }

    const [_ListCatalogo, setListCatalogo] = useState([])
    const GetListCatalogo = (idUsuario) => {
        props.props.props.setOpenLoadingScreen()
        requests
            .getToken(GET_LIST_CONTEO_IDCARGA_IDUSER + props.idCarga + '/' + idUsuario)
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
    const [fin, setFin] = React.useState(10);
    const [tamanio, setTamanio] = React.useState(10);

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
    var results = _ListCatalogo.sort((a, b) => a.id - b.id);
    if (!search0 && !search1) {
        paginas = Math.ceil((results.length / tamanio));
    } else {
        if (search0 != "") {
            results = results.filter((dato) =>
                dato.codigo.toLowerCase().includes(search0.toLocaleLowerCase()) //### **
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
        // GetListCatalogo();
        GetListUsuarios();
    }


    const Cancelar = () => {
        props.close(false);
        setListCatalogo([]);
        setListUser([]);
        setEstatus(false);
        setUsuarioBusqueda({
            ..._usuarioBusqueda,
            'id_usuario': 0,
            'id_carga': props.idCarga,
        });
    };


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
                            {/* <p>{props.idCarga}</p> */}
                            <center>
                                <h3>Detalle Conteos</h3>
                            </center>
                            <center>
                                <Grid container className='marginComponets'>
                                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                                        <label className='textLabel2'>{""}</label>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <SelectGeneral
                                            // idprops={props.id}
                                            id="id_usuario"
                                            name='id_usuario'
                                            value={_usuarioBusqueda.id_usuario}
                                            // error={_usuarioBusqueda.id_usuario == 0 ? true : false}
                                            onChange={handleUsuarioBusqueda}
                                            className='inputSelectSize25'
                                        >
                                            <MenuItemGeneral key={0} value={0} disabled
                                            >
                                                Seleccione un Usuario
                                            </MenuItemGeneral>
                                            {_ListUsuarios.map((item) => (
                                                <MenuItemGeneral
                                                    key={item.id} // ### **
                                                    value={item.id}
                                                >
                                                    {item.user + " - " + item.name + " " + item.apellidoP + " " + item.apellidoM + " "}
                                                </MenuItemGeneral>
                                            ))}
                                        </SelectGeneral>
                                    </Grid>
                                </Grid>

                            </center>
                            <br></br>
                            <center>
                                <AlertaFilter
                                    regresar={regresar}
                                    closeFilter={closeFilter}
                                    filter={filter}
                                    props={props}
                                    setSearch1={setSearch1}
                                    search1={search1}
                                    stepFilter={stepFilter}
                                />

                                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" colSpan={7}>
                                                    Encabezado Conteo
                                                </StyledTableCell>

                                            </TableRow>
                                            <TableRow>
                                                <StyledTableCell align="center" >
                                                    <label className='textLabel3'>CARGA</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>CONTEO</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>FECHA ASIGNACIÓN</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>FECHA DE INICIO CONTEO</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>FECHA DE FIN CONTEO</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center" >
                                                    <label className='textLabel3'>ESTATUS</label>
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {_ListUser.map((item) => {
                                                return (
                                                    <>
                                                        <StyledTableRow
                                                            key={item.title}
                                                        >
                                                            <StyledTableCell align="center">
                                                                <label className='textLabel4'> {item.cve_carga}</label> {/* //### ** */}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <label className='textLabel4'> {item.conteo}</label> {/* //### ** */}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <label className='textLabel4'> {item.fecha_asignacion}</label> {/* //### ** */}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <label className='textLabel4'> {item.fecha_inicio_conteo}</label> {/* //### ** */}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <label className='textLabel4'> {item.fecha_fin_conteo}</label> {/* //### ** */}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <label className='textLabel4'> {item.estatus}</label> {/* //### ** */}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    </>
                                                );
                                            })}

                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <br></br>

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
                                                placeholder="Buscar por código"
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
                                                <StyledTableCell align="center" colSpan={6}>
                                                    Conteo
                                                </StyledTableCell>

                                            </TableRow>
                                            <TableRow>
                                                {/* <StyledTableCell align="center" width="10%">
                                                        <label className='textLabel3'>USUARIO</label>
                                                    </StyledTableCell> */}
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>
                                                        CÓDIGO
                                                    </label>
                                                    {/* <Tooltip title="Ordenar por Abecedario">
                                    <IconButton onClick={NombreAsc} style={{ width: "30px", height: "30px" }}>
                                        <ExpandLessIcon sx={{ color: "white" }} style={{ width: "20px", height: "20px" }} />
                                    </IconButton>
                                    <IconButton onClick={NombreDesc} style={{ width: "30px", height: "30px" }}>
                                        <ExpandMoreIcon sx={{ color: "white" }} style={{ width: "20px", height: "20px" }} />
                                    </IconButton>
                                </Tooltip> */}
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>DESCRIPCIÓN</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>UME</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>CANTIDAD</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>UBICACIÓN</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>LOTE</label>
                                                </StyledTableCell>

                                                {/* <StyledTableCell align="center" width="15%">
                                        <label className='textLabel3'>Habilitado</label>
                                        <Tooltip title="Filtrar por Estatus">
                                            <IconButton onClick={porHabilitado} style={{ width: "30px", height: "30px" }}>
                                                <FilterAltIcon sx={{ color: "white" }} style={{ width: "20px", height: "20px", }} />
                                            </IconButton>
                                        </Tooltip>
                                    </StyledTableCell> */}

                                            </TableRow>
                                        </TableHead>
                                        {_usuarioBusqueda.id_usuario == 0 ? (null) : (
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
                                                            {/* <StyledTableCell>
                                                                <label className='textLabel4'>{item.user}</label>
                                                            </StyledTableCell> */}
                                                            <StyledTableCell>
                                                                <label className='textLabel4'>{item.codigo}</label> {/* //### ** */}
                                                            </StyledTableCell>

                                                            <StyledTableCell>
                                                                <label className='textLabel4'>{item.descripcion}</label> {/* //### ** */}
                                                            </StyledTableCell>

                                                            <StyledTableCell align="center">
                                                                <label className='textLabel4'>{item.ume}</label> {/* //### ** */}
                                                            </StyledTableCell>

                                                            <StyledTableCell align="right">
                                                                <label className='textLabel4'>{item.cantidad}</label> {/* //### ** */}
                                                            </StyledTableCell>

                                                            <StyledTableCell align="center">
                                                                <label className='textLabel4'>{item.ubicacion}</label> {/* //### ** */}
                                                            </StyledTableCell>

                                                            <StyledTableCell>
                                                                <label className='textLabel4'>{item.observaciones}</label> {/* //### ** */}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        )}
                                    </Table>
                                </TableContainer>
                            </center>

                        </DialogContent>
                    </Grid>

                </Grid>
            </Dialog>
        </div>

    )
}
export default AlertaVisualizar
