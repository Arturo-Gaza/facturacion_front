import { Dialog, DialogContent, Grid } from '@mui/material';
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
import { GET_ARCHIVO_CARGA_DETALLE } from '../Constants/ApiConstants';
import AlertaFilter from "../alerts/FilterCatalogos";
import requests from '../components/AxiosCalls/AxiosCallsLocal';
//ICONOS 
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//ESTILOS
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';
import { TextFieldGeneral } from '../Styles/TextField/TextField';



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
        props.props.props.setOpenLoadingScreen()
        requests
            .getToken(GET_ARCHIVO_CARGA_DETALLE + props.idCarga) //### ** 
            .then((response) => {
                if (response.data.data.length != 0) {
                    setListCatalogo(response.data.data)
                }
                // props.props.props.setMessageSnackBar(response.data.message, 'success');
                props.props.props.setCloseLoadingScreen()
            })
            .catch((error) => {
                props.props.props.setMessageSnackBar(error.data.message, 'warning');
                // error.data.errors.forEach(element => {
                //     props.props.props.setMessageSnackBar(element, 'warning');
                // });
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
                dato.descripcion_producto_material.toLowerCase().includes(search0.toLocaleLowerCase()) //### **
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
        results = results.sort((a, b) => a.clave_producto.localeCompare(b.clave_producto)); //### **
    }

    if (descNombre == true) {
        results = results.sort((a, b) => b.clave_producto.localeCompare(a.clave_producto)); //### **
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
                            <center>
                                {/* <p>{props.idCarga}</p> */}
                                <center>
                                    <h3>Detalle Carga Archivo</h3>
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
                                                placeholder="Buscar por texto breve de material."
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
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Almacén</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Material</label>
                                                    <Tooltip title="Ordenar por Abecedario">
                                                        <span>
                                                            <IconButton onClick={NombreAsc} style={{ width: "30px", height: "30px" }}>
                                                                <ExpandLessIcon sx={{ color: "white" }} style={{ width: "20px", height: "20px" }} />
                                                            </IconButton>
                                                            <IconButton onClick={NombreDesc} style={{ width: "30px", height: "30px" }}>
                                                                <ExpandMoreIcon sx={{ color: "white" }} style={{ width: "20px", height: "20px" }} />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Texto breve de material</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>UME</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Grupo de artículos</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Libre utilización</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>En control calidad</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Bloqueado</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Valor libre util.</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Valor en insp.cal.</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Valor stock bloq.</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Cantidad total (SAP)</label>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Importe unitario</label>
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    <label className='textLabel3'>Importe total</label>
                                                </StyledTableCell>

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
                                                            <label className='textLabel4'>{item.clave_almacen}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell>
                                                            <label className='textLabel4'>{item.clave_producto}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell>
                                                            <label className='textLabel4'>{item.descripcion_producto_material}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell align="center">
                                                            <label className='textLabel4'>{item.clave_unidad_medida}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell align="center">
                                                            <label className='textLabel4'>{item.clave_gpo_familia}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell align="right">
                                                            <label className='textLabel4'>{item.libre_utilizacion}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell align="right">
                                                            <label className='textLabel4'>{item.en_control_calidad}</label> {/* //### ** */}
                                                        </StyledTableCell>


                                                        <StyledTableCell align="right">
                                                            <label className='textLabel4'>{item.bloqueado}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell align="right">
                                                            <label className='textLabel4'>{item.valor_libre_util}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell align="right">
                                                            <label className='textLabel4'>{item.valor_insp_cal}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell align="right">
                                                            <label className='textLabel4'>{item.valor_stock_bloq}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell align="right">
                                                            <label className='textLabel4'>{item.cantidad_total}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell align="right">
                                                            <label className='textLabel4'>{item.importe_unitario}</label> {/* //### ** */}
                                                        </StyledTableCell>

                                                        <StyledTableCell align="right">
                                                            <label className='textLabel4'>{item.importe_total}</label> {/* //### ** */}
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
                        </DialogContent>
                    </Grid>

                </Grid>
            </Dialog>
        </div>

    )
}
export default AlertaVisualizar
