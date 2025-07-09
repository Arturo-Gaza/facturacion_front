//REACT
import React, { useEffect, useState } from 'react';
//COMPONENTES MUI MATERIAL
import {
    Box,
    Button,
    Grid,
    IconButton,
    Tooltip, Dialog
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import moment from "moment";
//ACCIONES
import { GET_LIST_TAB_SOLICITUDES, CAMBIAR_ESTATUS, GET_TAB_SOLICITUDES_DETALLE_BY_ID_SOLICITUD, UPDATE_TAB_SOLICITUDES, ASIGNAR_USUARIO_SOLICITUDES, TABLA_REPORTE } from '../../../Constants/ApiConstants';

import requests from '../../AxiosCalls/AxiosCallsLocal';
//import Acciones from '../Actions/1_CargaAlmacen'; //###
//ICONOS 
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BlockIcon from '@mui/icons-material/Block';
import SendIcon from '@mui/icons-material/Send';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";

//ESTILOS
import { StyledTableCell, StyledTableRow } from '../../../Styles/Table/Table';
import { TextFieldGeneral, TextFieldGeneral2 } from '../../../Styles/TextField/TextField';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useUserContenidoContext } from '../../../hooks/UserConteProvider';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import LockIcon from '@mui/icons-material/Lock';
import AlertaAsignacion from '../../../alerts/_TKSAlertAsignacion';


import { useNavigate } from 'react-router-dom';
import AlertaObservaciones from '../../../alerts/_TKSAlertObservaciones';
import AlertaVisualizar from '../../../alerts/AlertVisualizar';
import { COTIZARSOLICITUD, CREARSOLICITUD, EDITARSOLICITUD } from '../../../Constants/NavegacionRoutes';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import AlertaCerrarSolicitud from '../../../alerts/_TKSAlertCerrarSolicitud';
import AlertEliminarSolicitud from '../../../alerts/_TKSAlertEliminarSolicitud';

import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const ConsolaSolicitud = (props) => {
    const user = useUserContenidoContext();
    const [openDialog, setOpenDialog] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

    const columnas = [
        { label: 'Ticket', key: 'id', opcion1: 'left', visible: true },
        { label: 'Usuario', key: 'user_solicitud', opcion1: 'center', visible: true },
        { label: 'Usuario Asignado', key: 'user_asignacion', opcion1: 'center', visible: [1, 2].includes(parseInt(user.idRol, 10)) },
        { label: 'Prioridad', key: 'prioridad_valor', opcion1: 'center', visible: true },
        { label: 'Descripción', key: 'descripcion', opcion1: 'center', visible: true },
        { label: 'Categoría', key: 'descripcion_categoria', opcion1: 'center', visible: true },
        { label: 'Departamento', key: 'descripcion_departamento', opcion1: 'center', visible: parseInt(user.idRol, 10) !== 4 },
        { label: 'Tipo', key: 'descripcion_tipo', opcion1: 'center', visible: true },
        { label: 'Fecha de creación', key: 'created_at', opcion1: 'center', visible: true, whiteSpace: 'nowrap' },
        { label: 'Fecha de actualización', key: 'updated_at', opcion1: 'center', visible: true, whiteSpace: 'nowrap' },
        { label: 'Estatus', key: 'descripcion_estatus_solicitud', opcion1: 'center', visible: true },
        { label: 'idEstatus', key: 'id_estatus_solicitud', opcion1: 'center', visible: false },
        { label: 'Acciones', key: 'Acciones', opcion1: 'center', visible: true, whiteSpace: 'nowrap' },
        { label: 'Observaciones', key: 'Observaciones', opcion1: 'center', visible: true }
    ];
    //::::::::::::::::::::::::::::::::::::::::::
    const [openAsigSoli, setOpenAsigSoli] = useState(false);
    const [openVisualSoli, setOpenVisualSoli] = useState(false);
    const [openCerrarSoli, setOpenCerrarSoli] = useState(false);
    const [openDeleteSoli, setOpenDeleteSoli] = useState(false);
    const [openObserv, setOpenObserv] = useState(false);
    const [solicitudItem, setSolicitudItem] = useState();

    const Editar = (item) => {
        navigate(EDITARSOLICITUD + item.id, {
            state: {
                habilitadoEditar: 1,
                idDepartamentoUsuarioSoli: item.usuario_solicitud.departamento.id,
                solicitudItem: item
            }
        });
    }

    const Asignacion = (item) => {
        setSolicitudItem(item);
        setOpenAsigSoli(true);
    }
    //Visualizar y cambiar estatus
    const Visualizar = (item) => {
        navigate(EDITARSOLICITUD + item.id, {
            state: {
                habilitarPantalla: 1,
                idDepartamentoUsuarioSoli: item.usuario_solicitud.departamento.id,
                solicitudItem: item
            }
        });
        if (item.id_estatus_solicitud === 2 || item.id_estatus_solicitud === 10) {
            cambiarEstatus(7, item.id)
        }


    }

    const Cerrar = (item) => {
        setSolicitudItem(item);
        setOpenCerrarSoli(true);
    }

    const Eliminar = (item) => {
        setSolicitudItem(item);
        setOpenDeleteSoli(true)
    }

    const Cotizar = (item) => {
        navigate(COTIZARSOLICITUD + item.id, {
            state: {
                idDepartamentoUsuarioSoli: item.usuario_solicitud.departamento.id,
                solicitudItem: item
            }
        });
        if (item.id_estatus_solicitud === 2 || item.id_estatus_solicitud === 10) {
            cambiarEstatus(7, item.id)
        }
    }

    const Observaciones = (item) => {
        setSolicitudItem(item);
        setOpenObserv(true);
    }

    const cambiarEstatus = (estatus_id, id) => {
        if (parseInt(user.idRol) === 3) {

            const estatus = {
                id_estatus: estatus_id,
                id_solicitud: id
            };
            requests
                .postToken(CAMBIAR_ESTATUS, estatus)
                .then((response) => {
                })
                .catch((error) => {
                    error.response.data.errors.forEach(element => {
                        props.props.setMessageSnackBar(element, 'warning');
                        props.props.setCloseLoadingScreen()
                    });
                });
        }


    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const [titulo, seTitulot] = useState("Solicitud de cotizaciones de compras")//### ** 

    //::::::::::: OBTENER FILTRO ::::::::::::::::::::
    const [_ListCatalogo, setListCatalogo] = useState([])
    const GetListCatalogo = () => {
        props.props.setOpenLoadingScreen()
        requests
            .getToken(GET_LIST_TAB_SOLICITUDES) //### ** 
            .then((response) => {
                // props.props.setMessageSnackBar(response.data.message, 'success');
                setListCatalogo(response.data.data)
                props.props.setCloseLoadingScreen()
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {
                    props.props.setMessageSnackBar(element, 'warning');
                    props.props.setCloseLoadingScreen()
                });
            })
    }
    const enviarSolicitud = async (idSolicitud, estatusSolicitud) => {
        props.props.setOpenLoadingScreen();
        try {

            if (estatusSolicitud === 5) {
                await requests.postToken(CAMBIAR_ESTATUS, {
                    id_estatus: 6,
                    id_solicitud: idSolicitud
                });
            } else {
                await requests.postToken(ASIGNAR_USUARIO_SOLICITUDES, {
                    id_solicitud: idSolicitud
                });
            }
            props.props.setMessageSnackBar("Solicitud enviada correctamente", "success");
            GetListCatalogo();
        } catch (error) {
            console.error("Error al enviar solicitud:", error);
            props.props.setMessageSnackBar(error?.message || "Error al enviar solicitud", "warning");
        } finally {
            props.props.setCloseLoadingScreen();
        }
    };

    // const addObservaciones = (idCarga, observacionTex) => {
    //     props.props.setOpenLoadingScreen()
    //     requests
    //         .postToken(CREATE_OBSERVACIONES, {
    //             "id_detalle_carga": idCarga,
    //             "id_usuario": user.idUsuario,
    //             "observacion": observacionTex,
    //             "habilitado": true
    //         }) //### ** 
    //         .then((response) => {
    //         })
    //         .catch((error) => {
    //             error.data.errors.forEach(element => {
    //                 props.props.setMessageSnackBar(element, 'warning');
    //             });
    //             props.props.setCloseLoadingScreen()
    //         })
    // }

    const navigate = useNavigate();

    const handleNuevaSolicitud = () => {
        navigate(CREARSOLICITUD, {
            state: {
                crear: true
            }
        });
    }

    useEffect(() => {
        GetListCatalogo();
    }, []);

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

    //::::::::::: FILTROS - SEARCH ::::::::::::::::::::
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [searchTicket, setSearchTicket] = useState('');
    const [searchPrioridad, setSearchPrioridad] = useState('');
    const [searchEstatus, setSearchEstatus] = useState('');
    const [searchFechaAct, setSearchFechaAct] = useState('');
    const [searchDepartamento, setSearchDepartamento] = useState('');
    const [searchUsuario, setSearchusuario] = useState('');
    let results = _ListCatalogo;
    if (searchTicket) {
        results = results.filter(d =>
            (d.id || '').toString().toLowerCase().startsWith(searchTicket.toLowerCase())
        );
    }
    if (searchUsuario) {
        results = results.filter(d =>
            (d.user_solicitud || '').toString().toLowerCase().startsWith(searchUsuario.toLowerCase())
        );
    }
    if (searchPrioridad) {
        results = results.filter(d =>
            (d.prioridad_valor || '').toString().toLowerCase().startsWith(searchPrioridad.toLowerCase())
        );
    }
    if (searchEstatus) {
        results = results.filter(d =>
            (d.descripcion_estatus_solicitud || '').toString().toLowerCase().startsWith(searchEstatus.toLowerCase())
        );
    }
    if (searchFechaAct) {
        results = results.filter(d =>
            (d.updated_at || '').toString().toLowerCase().includes(searchFechaAct.toLowerCase())
        );
    }
    if (searchDepartamento) {
        results = results.filter(d =>
            (d.descripcion_departamento || '').toString().toLowerCase().startsWith(searchDepartamento.toLowerCase())
        );
    }

    // Paginación
    paginas = Math.ceil(results.length / tamanio);

    //::::::::::: FILTROS - ORDENAR POR ASC Y DESC ::::::::::::::::::::
    const [ascFecha, setAscFecha] = useState(false);
    const [descFecha, setDescFecha] = useState(false);

    if (ascFecha) {
        results = results.sort((a, b) => {
            const fechaA = new Date(a.updated_at.split('/').reverse().join('/'));
            const fechaB = new Date(b.updated_at.split('/').reverse().join('/'));
            return fechaA - fechaB;
        });
    }

    if (descFecha) {
        results = results.sort((a, b) => {
            const fechaA = new Date(a.updated_at.split('/').reverse().join('/'));
            const fechaB = new Date(b.updated_at.split('/').reverse().join('/'));
            return fechaB - fechaA;
        });
    }

    const OrdenarFechaAsc = () => {
        setAscFecha(true);
        setDescFecha(false);
    };

    const OrdenarFechaDesc = () => {
        setAscFecha(false);
        setDescFecha(true);
    };

    const descargarExcel = () => {
        props.props.setOpenLoadingScreen();
        var data = {
            datos: results,
            filtros: {
                Ticket: searchTicket,
                Prioridad: searchPrioridad,
                Estatud: searchEstatus,
                Fecha: searchFechaAct,
                Departamento: searchDepartamento,
                Usuario: searchUsuario
            }
        }
        requests
            .postToken(TABLA_REPORTE, data) //### **
            .then((response) => {
                //props.props.setMessageSnackBar(response.data.message, 'success');

                const link = document.createElement("a");
                link.href = `data:${response.data.data.mime_type};base64,${response.data.data.base64}`;
                link.download = response.data.data.file_name;
                link.click();
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {
                    props.props.setMessageSnackBar(element, 'warning');
                    props.props.setCloseLoadingScreen()
                });
            }).finally(() => {
                props.props.setCloseLoadingScreen();
            });
    }

    return (
        <div style={{ padding: '1%' }}>
            <center>
                <h2> {titulo}</h2>
            </center>

            <AlertaAsignacion
                props={props}
                open={openAsigSoli}
                close={setOpenAsigSoli}
                solicitudItem={solicitudItem}
                GetListCatalogo={GetListCatalogo}
            />

            <AlertaVisualizar
                props={props}
                open={openVisualSoli}
                close={setOpenVisualSoli}
                solicitudItem={solicitudItem}
                GetListCatalogo={GetListCatalogo}
            />

            <AlertaCerrarSolicitud
                props={props}
                open={openCerrarSoli}
                close={setOpenCerrarSoli}
                solicitudItem={solicitudItem}
                GetListCatalogo={GetListCatalogo}
            />

            <AlertEliminarSolicitud
                props={props}
                open={openDeleteSoli}
                close={setOpenDeleteSoli}
                solicitudItem={solicitudItem}
                GetListCatalogo={GetListCatalogo}
            />

            <AlertaObservaciones
                props={props}
                open={openObserv}
                close={setOpenObserv}
                solicitudItem={solicitudItem}
                GetListCatalogo={GetListCatalogo}
            />

            <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                    <Box
                        sx={{
                            display: { xs: "flex", sm: "flex", md: "flex" },
                            justifyContent: { xs: "center", sm: "flex-start", md: 'flex-start' }
                        }}
                    >
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1, gap: 1 }}>
                                    <Box sx={{ fontWeight: 'bold' }}>Filtrar resultados</Box>
                                    <IconButton onClick={() => setMostrarFiltros(!mostrarFiltros)}>
                                        {mostrarFiltros ? (
                                            <Tooltip title="Cerrar Filtro">
                                                <CloseIcon sx={{ color: 'black' }} />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Abrir Filtro">
                                                <FilterListIcon sx={{ color: 'black' }} />
                                            </Tooltip>
                                        )}
                                    </IconButton>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={10}></Grid>

                            {mostrarFiltros && (
                                <Grid item xs={12}>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={12} md={2}>
                                            <TextFieldGeneral2
                                                value={searchTicket}
                                                onChange={(e) => {
                                                    setSearchTicket(e.target.value);
                                                    setInicio(0);
                                                    setFin(10);
                                                    setPage(1);
                                                }}
                                                label="Buscar por ticket"
                                                placeholder="Buscar por ticket"
                                                inputProps={{ maxLength: 100 }}
                                                fullWidth
                                            />
                                        </Grid>

                                        {parseInt(user.idRol, 10) !== 4 && (
                                            <Grid item xs={12} md={2}>
                                                <TextFieldGeneral2
                                                    value={searchUsuario}
                                                    onChange={(e) => {
                                                        setSearchusuario(e.target.value);
                                                        setInicio(0);
                                                        setFin(10);
                                                        setPage(1);
                                                    }}
                                                    label="Buscar por usuario"
                                                    placeholder="Buscar por usuario"
                                                    inputProps={{ maxLength: 100 }}
                                                    fullWidth
                                                />
                                            </Grid>
                                        )}

                                        <Grid item xs={12} md={2}>
                                            <TextFieldGeneral2
                                                value={searchPrioridad}
                                                onChange={(e) => {
                                                    setSearchPrioridad(e.target.value);
                                                    setInicio(0);
                                                    setFin(10);
                                                    setPage(1);
                                                }}
                                                label="Buscar por prioridad"
                                                placeholder="Buscar por prioridad"
                                                inputProps={{ maxLength: 100 }}
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={2}>
                                            <TextFieldGeneral2
                                                value={searchEstatus}
                                                onChange={(e) => {
                                                    setSearchEstatus(e.target.value);
                                                    setInicio(0);
                                                    setFin(10);
                                                    setPage(1);
                                                }}
                                                label="Buscar por estatus"
                                                placeholder="Buscar por estatus"
                                                inputProps={{ maxLength: 100 }}
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={2}>
                                            <TextFieldGeneral2
                                                value={searchFechaAct}
                                                onChange={(e) => {
                                                    setSearchFechaAct(e.target.value);
                                                    setInicio(0);
                                                    setFin(10);
                                                    setPage(1);
                                                }}
                                                label="Buscar por fecha de actualización"
                                                placeholder="Buscar por fecha de actualización"
                                                inputProps={{ maxLength: 100 }}
                                                fullWidth
                                            />
                                        </Grid>

                                        {parseInt(user.idRol, 10) !== 4 && (
                                            <Grid item xs={12} md={2}>
                                                <TextFieldGeneral2
                                                    value={searchDepartamento}
                                                    onChange={(e) => {
                                                        setSearchDepartamento(e.target.value);
                                                        setInicio(0);
                                                        setFin(10);
                                                        setPage(1);
                                                    }}
                                                    label="Buscar por departamento"
                                                    placeholder="Buscar por departamento"
                                                    inputProps={{ maxLength: 100 }}
                                                    fullWidth
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>

                    <Stack alignItems="center"
                        marginBottom={2}>
                        <Pagination count={paginas} page={page} onChange={handleChange} variant="outlined" shape="rounded" />
                    </Stack>

                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                    <Box
                        sx={{
                            display: { xs: "flex", sm: "flex", md: "flex" },
                            justifyContent: { xs: "center", sm: "flex-end", md: 'flex-end' }
                        }}
                    >

                        {[1, 2, 3].includes(parseInt(user.idRol, 10)) && (
                            <>
                                <Tooltip title={"Descargar Excel"} arrow>
                                    <IconButton
                                        onClick={descargarExcel}
                                        aria-label="bloqueado"
                                        color="primary"
                                    >
                                        <SimCardDownloadIcon
                                            sx={{ color: "#0066CC", width: "30px", height: "30px" }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {[1, 4].includes(parseInt(user.idRol, 10)) && (
                            <>
                                <Tooltip title={"Nueva Solicitud"} arrow>
                                    <Button
                                        onClick={handleNuevaSolicitud}
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                        style={{ width: '40%', height: "35px" }}
                                    >
                                        Nueva Solicitud
                                    </Button>
                                </Tooltip>
                            </>
                        )}

                    </Box>
                </Grid>
            </Grid>

            <label className='textLabel1'>Total de Registros: {results.length} </label>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 80 }} aria-label="customized table">
                    <TableHead>
                        <StyledTableRow>
                            {columnas.map((col) => (
                                <StyledTableCell key={col.key} align={col.opcion1} sx={{ whiteSpace: col.whiteSpace }}>
                                    {col.visible === true ? (
                                        col.key === "updated_at" ? (
                                            <>
                                                <label className="textLabel3">{col.label}</label>
                                                <IconButton onClick={OrdenarFechaAsc} style={{ width: "10px", height: "30px" }}>
                                                    <ExpandLessIcon sx={{ color: "black" }} style={{ width: "20px", height: "20px" }} />
                                                </IconButton>
                                                <IconButton onClick={OrdenarFechaDesc} style={{ width: "10px", height: "30px" }}>
                                                    <ExpandMoreIcon sx={{ color: "black" }} style={{ width: "20px", height: "20px" }} />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <label className="textLabel3">{col.label}</label>
                                        )
                                    ) : null}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {results.slice(inicio, fin).map((fila, i) => (
                            <StyledTableRow key={fila.key}>
                                {columnas.map((col) => (
                                    <StyledTableCell key={`${fila.key}-${col.key}`} align={col.opcion1} sx={{ whiteSpace: col.whiteSpace }}>
                                        {

                                            col.key === "descripcion" && col.visible === true ? (
                                                <Box sx={{ textAlign: 'justify' }}>
                                                    <label className='textLabel4'>
                                                        {typeof fila.descripcion === 'string' ? fila.descripcion.length > 300 ? fila.descripcion.substring(0, 300) + '...' : fila.descripcion : ''}
                                                    </label>
                                                </Box>
                                            ) : col.key === "descripcion_estatus_solicitud" && col.visible === true ? (
                                                <label className='textLabel4'>
                                                    {fila.id_estatus_solicitud === 3 || fila.id_estatus_solicitud === 4 ?
                                                        (fila.descripcion_estatus_solicitud + " por: " + fila.usuario_ultima_actualizacion) :
                                                        (fila.descripcion_estatus_solicitud)
                                                    }

                                                </label>
                                            ) : col.key === "user_asignacion" && col.visible === true ? (
                                                <label className='textLabel4'>
                                                    {
                                                        fila[col.key] === null ? "Sin asignar" : typeof fila[col.key] === 'object' ?
                                                            (fila[col.key].name || fila[col.key].nombre || "Usuario sin nombre") : fila[col.key]
                                                    }
                                                </label>
                                            ) : col.key === "updated_at" || col.key === "created_at" && col.visible === true ? (
                                                <label className='textLabel4'>
                                                    {fila[col.key]}
                                                </label>
                                            ) : col.key === "Acciones" && col.visible === true ? (
                                                <>
                                                    {[1, 4].includes(parseInt(user.idRol, 10)) && (
                                                        <Tooltip title="Editar Solicitud">
                                                            <IconButton
                                                                disabled={[2, 3, 4, 7, 8].includes(fila.id_estatus_solicitud)}
                                                                color="primary"
                                                                onClick={() => Editar(fila)}
                                                            >
                                                                <EditNoteIcon sx={{ color: [2, 3, 4, 7, 8].includes(fila.id_estatus_solicitud) ? "grey" : "#0066CC" }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {[1, 2].includes(parseInt(user.idRol, 10)) && (
                                                        <Tooltip title="Asignación de Solicitud">
                                                            <IconButton
                                                                disabled={[3, 4].includes(fila.id_estatus_solicitud)}
                                                                color="primary"
                                                                onClick={() => Asignacion(fila)}
                                                            >
                                                                <AssignmentIndIcon sx={{ color: [3, 4].includes(fila.id_estatus_solicitud) ? "grey" : "#0066CC" }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {[1, 2, 3, 4].includes(parseInt(user.idRol, 10)) && (
                                                        <Tooltip title="Visualizar Solicitud">
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => Visualizar(fila)}
                                                            >
                                                                <FindInPageIcon sx={{ color: "#0066CC" }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {[1, 2, 3].includes(parseInt(user.idRol, 10)) && (
                                                        <Tooltip title="Cotizar Solicitud">
                                                            <IconButton
                                                                disabled={[2, 3, 4, 5, 9].includes(fila.id_estatus_solicitud)}
                                                                color="primary"
                                                                onClick={() => Cotizar(fila)}
                                                            >
                                                                <AnalyticsIcon sx={{ color: [2, 3, 4, 5, 9].includes(fila.id_estatus_solicitud) ? "grey" : "#0066CC" }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {[1, 2, 3, 4].includes(parseInt(user.idRol, 10)) && (
                                                        <Tooltip title="Cancelar Solicitud">
                                                            <IconButton
                                                                disabled={[3, 4].includes(fila.id_estatus_solicitud)}
                                                                color="primary"
                                                                onClick={() => Eliminar(fila)}
                                                            >
                                                                <BlockIcon sx={{ color: [3, 4].includes(fila.id_estatus_solicitud) ? "grey" : "red" }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {/* {[1, 2, 3, 4].includes(parseInt(user.idRol, 10)) && (
                                                    <Tooltip title="Concluido">
                                                        <IconButton
                                                            disabled={[1, 2, 3, 4, 5, 6, 7, 8].includes(fila.id_estatus_solicitud)}
                                                            color="primary"
                                                            onClick={() => Cerrar(fila)}
                                                        >
                                                            <LockIcon sx={{ color: [1, 2, 3, 4, 5, 6, 7, 8].includes(fila.id_estatus_solicitud) ? "grey" : "#0066CC" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )} */}
                                                    {/* {parseInt(user.idRol, 10) === 4 && fila.id_estatus_solicitud === 1  && ( */}
                                                    {[4].includes(parseInt(user.idRol, 10)) && (
                                                        [1, 5].includes(fila.id_estatus_solicitud) && (
                                                            <Tooltip title="Enviar Solicitud">
                                                                <IconButton
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        setSolicitudSeleccionada({ id: fila.id, estatus: fila.id_estatus_solicitud });
                                                                        setOpenDialog(true);
                                                                    }}
                                                                >
                                                                    <SendIcon sx={{ color: "#0066CC" }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        ))}

                                                </>
                                            ) : col.key === "Observaciones" && col.visible === true ? (
                                                (() => {
                                                    const idRol = parseInt(user.idRol, 10);
                                                    const estatus = parseInt(fila.id_estatus_solicitud, 10);

                                                    const deshabilitar =
                                                        [4, 9].includes(estatus) || // Concluida o Cotizada: nadie puede
                                                        (estatus === 5 && idRol !== 4); // Requiere información: solo el rol 4

                                                    return (
                                                        <IconButton
                                                            aria-label="editar"
                                                            color="primary"
                                                            onClick={() => Observaciones(fila)}
                                                            disabled={deshabilitar}
                                                        >
                                                            <EditNoteIcon
                                                                sx={{
                                                                    color: deshabilitar ? "#A0A0A0" : "#0066CC"
                                                                }}
                                                            />
                                                        </IconButton>
                                                    );
                                                })()
                                            ) : col.visible === true ? (
                                                <label className='textLabel4'>
                                                    {fila[col.key]}
                                                </label>
                                            ) : (null)
                                        }
                                    </StyledTableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    style: {
                        backgroundColor: "#F6F6FF",
                        maxHeight: "90vh",
                        minWidth: "450px",
                        maxWidth: "450px",
                    },
                }}
            >
                <Box sx={{ padding: 5 }}>
                    <center>
                        <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                            Una vez enviada, no podrás realizar cambios. ¿Estás seguro de que deseas continuar?
                        </p>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                className='btn-aceptar'
                                onClick={() => {
                                    enviarSolicitud(solicitudSeleccionada.id, solicitudSeleccionada.estatus);
                                    setOpenDialog(false);
                                }}
                                variant="contained"
                                sx={{ mr: 1 }}
                            >
                                Enviar
                            </Button>

                            <Button
                                className="btn-cancelar"
                                onClick={() => setOpenDialog(false)}
                                variant="contained"
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </center>
                </Box>
            </Dialog>

        </div>

    );


}

export default ConsolaSolicitud