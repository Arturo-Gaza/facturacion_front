import {
    Autocomplete,
    Box,
    Button,
    Grid,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CREATE_TAB_SOLICITUDES, GET_CATEGORIA_ID_DEPARTAMENTO, GET_TAB_SOLICITUDES_BY_ID, GET_TIPO_ID_DEPARTAMENTO, UPDATE_TAB_SOLICITUDES } from '../../../../Constants/ApiConstants';
import { SOLICITUD } from '../../../../Constants/NavegacionRoutes';
import { TextFieldGeneral } from '../../../../Styles/TextField/TextField';
import { validateSolicitudHeader } from '../../../../Utils/Validacion/solicitudes';
import AlertJustificacionPrioridad from '../../../../alerts/_TKSAlertJustificacionPrioridad';
import { useUserContenidoContext } from '../../../../hooks/UserConteProvider';
import requests from '../../../AxiosCalls/AxiosCallsLocal';
import DetalleSolicitud from '../DetalleSolicitud/DetalleSolicitud';

const HeaderSolicitud = (props) => {

    //:::::::::::::::::::::: UserConteProvider :::::::::::::::::::::::
    const user = useUserContenidoContext();
    const navigate = useNavigate();
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    const [solicitud, setSolicitud] = useState(null);
    const location = useLocation();
    const valoridDep = location.state?.idDepartamentoUsuarioSoli || 0;

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return obtenerFechaActual();
        const fecha = new Date(fechaISO);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        return `${dia}/${mes}/${anio}`;
    }

    const [fechaSolicitud, setFechaSolicitud] = useState('');
    const obtenerFechaActual = () => {
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        return `${dia}/${mes}/${anio}`;
    };



    const [solicitudTabla, setSolicitudTabla] = useState(
        {
            id_usuario: user.idUsuario,
            descripcion: "",
            justificacion: "",
            prioridad: 0,
            id_categoria: 0,
            justificacion_prioridad: "",
            cotizacion_global: false,
            prioridadModificada: true,
        }
    );

    const handleSolicitud = (e) => {
        const { name, value } = e.target;

        setSolicitudTabla({
            ...solicitudTabla,
            ["prioridadModificada"]: true,
            [name]: value,
        });

        if (name === 'id_categoria') {
            const categoriaSeleccionada = listOptions1.find(c => c.id === parseInt(value));

            if (categoriaSeleccionada) {
                setTipo({ id: categoriaSeleccionada.id_tipo });
            }
        }

        // Si cambia la prioridad a alta, pedimos la justificación
        if (name === 'prioridad') {
            if (value === 1) {
                setOpenPriodidad(!openPrioridad);
            } else {
                setSolicitudTabla({
                    ...solicitudTabla,
                    ["justificacion_prioridad"]: "",
                    ["prioridadModificada"]: true,
                    [name]: value
                });
            }
        }
    };

    //modal prioridad alta
    const [openPrioridad, setOpenPriodidad] = useState(false);
    const Cancelar = () => {
        setSolicitudTabla({
            ...solicitudTabla,
            ["prioridad"]: 0,
            ["justificacion_prioridad"]: "",
            ["prioridadModificada"]: true,
        });
        setOpenPriodidad(!openPrioridad)
    }
    const Continuar = () => {
        setOpenPriodidad(!openPrioridad)
    }


    const [_ticket, setTicket] = useState(null);

    const [listOptions1, setListOptions1] = useState([]);
    const [listOptions2, setListOptions2] = useState([]);
    const [listOptions3, setListOptions3] = useState([
        { id: 1, prioridad: "Alta" },
        { id: 2, prioridad: "Media" },
        { id: 3, prioridad: "Baja" },
    ]);
    const [_Tipo, setTipo] = useState({
        id: 0,
    })//### **
    const [estatusCotizacionGlobla, setEstatusCotizacionGlobal] = useState(false);
    const [archivosCotizacionGlobla, setArchivosCotizacionGlobal] = useState([]);
    const [estatusSolicitud, setEstatusSolicitud] = useState(0)
    const GetByID = async (id,idDepa) => {
        try {
            const [categoriaResponse, tipoResponse,response] = await Promise.all([
                
                requests.getToken(GET_CATEGORIA_ID_DEPARTAMENTO + idDepa),
                requests.getToken(GET_TIPO_ID_DEPARTAMENTO + idDepa),
                requests.getToken(GET_TAB_SOLICITUDES_BY_ID + id)
            ]);

            const categoria = Array.isArray(categoriaResponse.data.data) ? categoriaResponse.data.data : [];
            const tipo = Array.isArray(tipoResponse.data.data) ? tipoResponse.data.data : [];

            if (categoria.length > 0) setListOptions1(categoria);
            if (tipo.length > 0) setListOptions2(tipo);

            const data = response.data.data;
            setEstatusCotizacionGlobal(data.cotizacion_global)
            setArchivosCotizacionGlobal(data.archivos_cotizaciones)
            setEstatusSolicitud(data.id_estatus_solicitud);
            setSolicitud(data);

            // Buscar categoría y tipo asociados
            const categoriaSeleccionada = categoria.find(c => c.id == data.id_categoria);
            const tipoSeleccionado = tipo.find(t => t.id == categoriaSeleccionada?.id_tipo);

            // Actualizar solicitudTabla
            setSolicitudTabla(prev => ({
                ...prev,
                id_usuario: user.idUsuario,
                descripcion: data.descripcion,
                justificacion: data.justificacion,
                prioridad: data.prioridad,
                id_categoria: data.id_categoria,
                justificacion_prioridad: data?.justificacion_prioridad || '',
                cotizacion_global: data.cotizacion_global,
                prioridadModificada: data.prioridadModificada,
            }));

            // Setear fecha y tipo
            setFechaSolicitud(formatearFecha(data.created_at));

            if (tipoSeleccionado) {
                setTipo({ ..._Tipo, id: tipoSeleccionado.id });
            }

        } catch (error) {
            props.setMessageSnackBar(error.message || 'Error al obtener solicitud', 'warning');
        }
    };

    const filteredCategorias = listOptions1.filter(c =>
        !_Tipo?.id || c.id_tipo === parseInt(_Tipo.id)
    );


    const getAll = async (idTicket, idDepa) => {
        props.setOpenLoadingScreen();

        try {

            if (idTicket != null) {
                await GetByID(idTicket, idDepa); // mejor control async
            }

        } catch (error) {
            props.setMessageSnackBar(error.message, 'warning');
        } finally {
            if (idTicket === null) {
                props.setCloseLoadingScreen();
            }
        }
    };

    const handleGuardar = () => {
        props.setOpenLoadingScreen();
        requests
            .postToken(CREATE_TAB_SOLICITUDES, solicitudTabla) //### ** 
            .then((response) => {
                props.setCloseLoadingScreen()
                setTicket(response.data.data.id);
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.setMessageSnackBar(element, 'warning');
                    props.setCloseLoadingScreen();
                });
            }).finally(() => {
                props.setCloseLoadingScreen();

            });
    }

    const handleEditar = () => {
        props.setOpenLoadingScreen();
        requests
            .putToken(UPDATE_TAB_SOLICITUDES + _ticket, solicitudTabla) //### ** 
            .then((response) => {
                props.setCloseLoadingScreen()
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.setMessageSnackBar(element, 'warning');
                    props.setCloseLoadingScreen();
                });
            }).finally(() => {
                props.setCloseLoadingScreen();
            });
    }

    const [errorSolicitudHeader, setErrorSolicitudHeader] = useState({});
    const handleSumit = () => {
        validateSolicitudHeader(solicitudTabla, _Tipo, _ticket).then((resp) => {
            if (Object.keys(resp).length === 0) {
                handleEditar();
            }
            setErrorSolicitudHeader(resp);

        });
    }



    const handleCancelar = () => {
        navigate(SOLICITUD);
    }

    const handleOptions2 = (e) => {
        const tipoSeleccionadoId = e.target.value;
        setTipo({
            ..._Tipo,
            [e.target.name]: tipoSeleccionadoId,
        });
        const categoriaRelacionada = listOptions1.find(categoria => categoria.id_tipo === tipoSeleccionadoId);

        if (categoriaRelacionada) {
            setSolicitudTabla(prev => ({
                ...prev,
                id_categoria: categoriaRelacionada.id
            }));
        }
    };


    useEffect(() => {
        setTicket(props.ticket);
        getAll(props.ticket, valoridDep);

        if (!props.ticket) {
            setFechaSolicitud(obtenerFechaActual());
        }
    }, []);

    return (
        <div>
            <Box
                sx={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: 2,
                    margin: 2,
                }}
            >
                <Grid container spacing={2}>
                    {/* Título y Ticket */}
                    <Grid item xs={6}>
                        <Typography variant="h6" fontWeight="bold">
                            Solicitud de Cotizaciones
                        </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="body1">
                            <strong>Ticket:</strong> {_ticket != null ? _ticket : "Sin registro"}
                        </Typography>
                    </Grid>

                    {/* Usuario y Departamento */}
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            <strong>Usuario:</strong> {solicitud?.usuario_solicitud?.name} {solicitud?.usuario_solicitud?.apellidoP} {solicitud?.usuario_solicitud?.apellidoM}

                        </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="body1">
                            <strong>Departamento:</strong> {solicitud?.usuario_solicitud?.descripcio_depatamento || "No especificado"}
                        </Typography>
                    </Grid>

                    {/* Correo y Fecha */}
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Correo electrónico: {solicitud?.usuario_solicitud?.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                            Fecha de Solicitud: {solicitud?.usuario_solicitud?.created_at?.substring(0, 10)}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box
                sx={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: 2,
                    margin: 2,
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            options={listOptions3}
                            getOptionLabel={(option) => option.prioridad}
                            renderInput={(params) =>
                                <TextFieldGeneral
                                    error={(errorSolicitudHeader.prioridad ? (true) : (false))}
                                    label={"Prioridad"}
                                    className="inputTextSize100"
                                    {...params}
                                    placeholder="Buscar.."
                                />}
                            value={listOptions3.find(option => option.id === solicitudTabla.prioridad) || null}
                            onChange={(event, value) =>
                                handleSolicitud({ target: { name: 'prioridad', value: value?.id } })
                            }
                            noOptionsText="No hay opciones"
                        />
                        {errorSolicitudHeader.prioridad && (
                            <span className="label_Quest_Validaciones">{errorSolicitudHeader.prioridad}</span>
                        )}
                    </Grid>

                    {/* <Grid container item xs={12} sm={8}>
                        <TextFieldGeneral
                            error={(errorSolicitudHeader.descripcion ? (true) : (false))}
                            className="inputTextSize100"
                            label="Descripción de la Solicitud"
                            value={solicitudTabla.descripcion}
                            name='descripcion'
                            onChange={handleSolicitud}
                        />
                        {errorSolicitudHeader.descripcion && (
                            <span className="label_Quest_Validaciones">{errorSolicitudHeader.descripcion}</span>
                        )}
                    </Grid> */}
                    {solicitudTabla.prioridad === 1 ? (
                        <Grid item xs={12}>
                            <TextFieldGeneral
                                error={(errorSolicitudHeader.justificacion_prioridad ? (true) : (false))}
                                className="inputTextSize100"
                                //multiline
                                //minRows={2}
                                label="Justificación de la Prioridad"
                                value={solicitudTabla.justificacion_prioridad}
                                name='justificacion_prioridad'
                                onChange={handleSolicitud}
                            />
                            {errorSolicitudHeader.justificacion_prioridad && (
                                <span className="label_Quest_Validaciones">{errorSolicitudHeader.justificacion_prioridad}</span>
                            )}
                        </Grid>
                    ) : (null)}
                    {/* <Grid item xs={12}>
                        <TextFieldGeneral
                            error={(errorSolicitudHeader.justificacion ? (true) : (false))}
                            className="inputTextSize100"
                            label="Justificación de la Solicitud"
                            value={solicitudTabla.justificacion}
                            name='justificacion'
                            onChange={handleSolicitud}
                        />
                        {errorSolicitudHeader.justificacion && (
                            <span className="label_Quest_Validaciones">{errorSolicitudHeader.justificacion}</span>
                        )}
                    </Grid> */}

                    {/* <Grid item container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                disabled={_ticket != null ? true : false}
                                options={filteredCategorias}
                                getOptionLabel={(option) => option.descripcion_categoria}
                                renderInput={(params) =>
                                    <TextFieldGeneral
                                        error={(errorSolicitudHeader.id_categoria ? (true) : (false))}
                                        idprops={_ticket}
                                        className={_ticket != null ? "inputTextSize100disabled" : "inputTextSize100"}
                                        label={"Categoria"}
                                        {...params}
                                        placeholder="Buscar.."
                                    />}
                                value={listOptions1.find(option => option.id === solicitudTabla.id_categoria) || null}
                                onChange={(event, value) =>
                                    handleSolicitud({ target: { name: 'id_categoria', value: value?.id } })
                                }
                                noOptionsText="No hay opciones"
                            />
                            {errorSolicitudHeader.id_categoria && (
                                <span className="label_Quest_Validaciones">{errorSolicitudHeader.id_categoria}</span>
                            )}
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                disabled={_ticket != null ? true : false}
                                options={listOptions2}
                                getOptionLabel={(option) => option.descripcion}
                                renderInput={(params) =>
                                    <TextFieldGeneral
                                        error={(errorSolicitudHeader.id ? (true) : (false))}
                                        idprops={_ticket}
                                        className={_ticket != null ? "inputTextSize100disabled" : "inputTextSize100"}
                                        label={"Tipo"}
                                        {...params}
                                        placeholder="Buscar.."
                                    />}
                                value={listOptions2.find(option => option.id === _Tipo.id) || null}
                                onChange={(event, value) =>
                                    handleOptions2({ target: { name: 'id', value: value?.id } })
                                }
                                noOptionsText="No hay opciones"
                            />
                            {errorSolicitudHeader.id && (
                                <span className="label_Quest_Validaciones">{errorSolicitudHeader.id}</span>
                            )}
                        </Grid>

                    </Grid> */}
                    <Grid item xs={12} sm={6} md={6} display="flex" justifyContent="flex-start">
                        <Button
                            onClick={handleSumit}
                            className="btn-aceptar"
                            variant="contained"
                        >
                            {_ticket == null ? 'Guardar' : 'Actualizar'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <AlertJustificacionPrioridad
                props={props}
                open={openPrioridad}
                Cancelar={Cancelar}
                Continuar={Continuar}
                handleSolicitud={handleSolicitud}
                setSolicitudTabla={setSolicitudTabla}
                solicitudTabla={solicitudTabla}
                estatusSolicitud={estatusSolicitud}
            />

            {_ticket != null ? (
                <DetalleSolicitud
                    listOptions2={listOptions2}
                    listOptions1={listOptions1}
                    _ticket={_ticket}
                    props={props}
                    _Tipo={_Tipo}
                    solicitudTabla={solicitudTabla}
                    setSolicitudTabla={setSolicitudTabla}
                    estatusSolicitud={estatusSolicitud}
                    setEstatusSolicitud={setEstatusSolicitud}
                    archivosCotizacionGlobla={archivosCotizacionGlobla}
                    setEstatusCotizacionGlobal={setEstatusCotizacionGlobal}
                    estatusCotizacionGlobla={estatusCotizacionGlobla}
                    getAll={getAll}
                    valoridDep={valoridDep}
                />) : (
                null
            )}

            {/* <center>
                <Grid container sx={{ marginTop: 3 }}>
                    <Grid item xs={12} sm={4} md={4}>
                        <Button onClick={handleSumit} className='btn-aceptar' variant={"contained"}>
                            {_ticket == null ? ('Guardar') : ('Actualizar')}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                        <Button onClick={handleCancelar} className="btn-cancelar" variant={"contained"}>Cancelar</Button>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                        <Button onClick={handleCancelar} className='btn-aceptar' variant={"contained"}>Guardar y Enviar</Button>
                    </Grid>
                </Grid>
            </center> */}
        </div>

    )
}

export default HeaderSolicitud