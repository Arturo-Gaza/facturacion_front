//REACT
import React, { useEffect, useState } from 'react';
//COMPONENTES MUI MATERIAL
import {
    Box,
    Checkbox,
    Grid,
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
import { GET_LIST_CAT_UBICACIONES, GET_LIST_CAT_UBICACIONES_PAGINATE } from '../../../Constants/ApiConstants';
import AlertaFilter from "../../../alerts/FilterCatalogos";
import requests from '../../AxiosCalls/AxiosCallsLocal';
import Acciones from '../Actions/6_Ubicacion'; //###
//ICONOS 
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
//ESTILOS
import { StyledTableCell, StyledTableRow } from '../../../Styles/Table/Table';
import { TextFieldGeneral } from '../../../Styles/TextField/TextField';
const Afectacion = (props) => {
    //::::::::::: MODALES ::::::::::::::::::::
    const [id, setId] = useState(null)
    const [open, setOpen] = useState(false)
    const [titulo, setTitulo] = useState("Ubicación")//### ** 

    const [_FiltroClaveUbicacion, setFiltroClaveUbicacion] = useState({
        clave_ubicacion: '',
        pageNumber: 1,
        pageSize: 10,
    })
    const handleOpen = (id) => {
        setOpen(!open)
        setId(id)
    }

    const handleClose = () => {
        setOpen(!open)
        GetListCatalogo(1);
        setId(null)
    }

    const handleCancel = () => {
        setOpen(!open)
        setId(null)
    }
    //::::::::::: OBTENER FILTRO ::::::::::::::::::::
    const [_ListCatalogo, setListCatalogo] = useState([])
    const GetListCatalogo = (p) => {
        requests
            //.getToken(GET_LIST_CAT_UBICACIONES) //### ** 
            .postToken(GET_LIST_CAT_UBICACIONES_PAGINATE + '?page=' + p, _FiltroClaveUbicacion) //Obtiene las ubicaciones por pagina 
            .then((response) => {
                // props.props.setMessageSnackBar(response.data.message, 'success');
                setListCatalogo(response.data.data.data)
                setInicio(response.data.data.current_page);
                setFin(response.data.data.last_page);
                setTotalItems(response.data.data.total);
                setTotalPages(response.data.data.last_page);
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {
                    props.props.setMessageSnackBar(element, 'warning');
                });
            }).finally(() => {
                props.props.setCloseLoadingScreen();
            });
    }

    //::::::::::: PAGINADO ::::::::::::::::::::
    let paginas = 0;
    const [_totalItems, setTotalItems] = useState(0);
    const [_totalPages, setTotalPages] = useState(0);
    const [page, setPage] = React.useState(1);
    const [inicio, setInicio] = React.useState(0);
    const [fin, setFin] = React.useState(10);
    const [tamanio, setTamanio] = React.useState(10);

    const handleChange = (event, value) => {
        setPage(value);
        GetListCatalogo(value);
        //setInicio(parseInt((value - 1) * tamanio))
        //setFin(parseInt(value * tamanio))
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
    const searcher0 = (e) => {
        _FiltroClaveUbicacion.clave_ubicacion = e.target.value;
        setInicio(0)
        setFin(10)
        setPage(1);
        GetListCatalogo(1);
    }

    const [stepFilter, setStepFilter] = useState(0);
    const porHabilitado = () => {
        setStepFilter(1);
        openFilter();
    };

    //::::::::::: USEEFECT ::::::::::::::::::::
    useEffect(() => {
        props.props.setOpenLoadingScreen()
        GetListCatalogo(1)
    }, [])


    return (
        <div style={{ padding: '1%' }}>
            <center>
                <h2>Catálogo {titulo}</h2>
            </center>

            <Grid container>
                <Grid item xs={12} sm={4} md={4}>
                    <Box
                        sx={{
                            display: { xs: "flex", sm: "flex", md: "flex" },
                            justifyContent: { xs: "center", sm: "flex-start", md: 'flex-start' }
                        }}
                    >
                        <TextFieldGeneral
                            className="inputTextSize50"
                            id="clave_ubicacion"
                            name="clave_ubicacion"
                            value={_FiltroClaveUbicacion.clave_ubicacion}
                            onChange={searcher0}
                            placeholder="Buscar por clave de ubicación"
                            inputProps={{
                                maxLength: 20,
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>

                    <Stack alignItems="center"
                        marginBottom={2}>
                        <Pagination count={_totalPages} page={page} onChange={handleChange} variant="outlined" shape="rounded" />
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                    <Box
                        sx={{
                            display: { xs: "flex", sm: "flex", md: "flex" },
                            justifyContent: { xs: "center", sm: "flex-end", md: 'flex-end' }
                        }}
                    >
                        <Tooltip title={"Agregar"} arrow>
                            <IconButton
                                onClick={function () { handleOpen(null); }}
                                aria-label="bloqueado"
                                color="primary"
                            >
                                <AddCircleIcon
                                    sx={{ color: "#0066CC", width: "40px", height: "30px" }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Grid>
            </Grid>

            <label className='textLabel1'>Total de Registros: {_totalItems} </label>
            <TableContainer component={Paper} >
                <Table sx={{ minWidth: 80, maxHeight: '300px', }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center"><label className='textLabel3'>{titulo}</label>
                            </StyledTableCell>

                            <StyledTableCell align="center">
                                <label className='textLabel3'>Descripción</label>
                            </StyledTableCell>

                            <StyledTableCell align="center" width="15%">
                                <label className='textLabel3'>Habilitado</label>
                                {/*<Tooltip title="Filtrar por Estatus">
                                    <IconButton onClick={porHabilitado} style={{ width: "30px", height: "30px" }}>
                                        <FilterAltIcon sx={{ color: "white" }} style={{ width: "20px", height: "20px", }} />
                                    </IconButton>
                                </Tooltip>*/}
                            </StyledTableCell>
                            <StyledTableCell align="center" width="10%"><label className='textLabel3'>Acciones</label></StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {_ListCatalogo.map((item) => {
                            return (
                                <StyledTableRow
                                    hover
                                    role="checkbox"
                                    //tabIndex2={-1}
                                    key={item.id}
                                    className="font-weight1"
                                >
                                    <StyledTableCell>
                                        <label className='textLabel4'>{item.clave_ubicacion}</label> {/* //### ** */}
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        <label className='textLabel4'>{item.descripcion_ubicacion}</label> {/* //### ** */}
                                    </StyledTableCell>

                                    <StyledTableCell align="center">
                                        <Checkbox
                                            disabled
                                            checked={item.habilitado}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton
                                            aria-label="editar"
                                            color="primary"
                                            onClick={function () {
                                                handleOpen(item.id); {/* //### ** */ }
                                            }}
                                        >
                                            <EditNoteIcon sx={{ color: "#0066CC" }} />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>

                </Table>
            </TableContainer>

            <Acciones
                open={open}
                props={props}
                handleClose={handleClose}
                handleCancel={handleCancel}
                id={id}
                titulo={titulo}
            />
        </div>
    );

}

export default Afectacion