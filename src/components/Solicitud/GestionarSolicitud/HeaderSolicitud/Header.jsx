import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    Grid,
    Typography
} from '@mui/material';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { ASIGNAR_USUARIO_SOLICITUDES, CAMBIAR_ESTATUS, CREATE_TAB_SOLICITUDES, GET_CATEGORIA_ID_DEPARTAMENTO, GET_LIST_CAT_GRUPO_FAMILIA, GET_LIST_CAT_UNIDAD_MEDIDA, GET_TAB_SOLICITUDES_BY_ID, GET_TIPO_ID_DEPARTAMENTO, UPDATE_TAB_SOLICITUDES } from '../../../../Constants/ApiConstants';
import { SOLICITUD } from '../../../../Constants/NavegacionRoutes';
import { TextFieldGeneral } from '../../../../Styles/TextField/TextField';
import { validateSolicitudHeader } from '../../../../Utils/Validacion/solicitudes';
import AlertJustificacionPrioridad from '../../../../alerts/_TKSAlertJustificacionPrioridad';
import { useUserContenidoContext } from '../../../../hooks/UserConteProvider';
import requests from '../../../AxiosCalls/AxiosCallsLocal';
import DetalleSolicitud from '../DetalleSolicitud/DetalleSolicitud';
const HeaderSolicitud = (props) => {
    const [enviar, setEnviar] = useState(false)
    //:::::::::::::::::::::: UserConteProvider :::::::::::::::::::::::
    const user = useUserContenidoContext();
    const navigate = useNavigate();

    const [solicitud, setSolicitud] = useState(null);
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    const location = useLocation();
    const valorDesdeNavegacion = location.state?.habilitarPantalla || 0;
    const valorEditar = location.state?.habilitadoEditar || 0;
    const [habilitarPantalla, sethabilitarPantalla] = useState(valorDesdeNavegacion);
    const [habilitadoEditar, setHabilitadoEditar] = useState(valorEditar);

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
            prioridadModificada: false,
        }
    );

    const handleSolicitud = (e) => {

        const { name, value } = e.target;

        // Actualizamos el estado de solicitudTabla
        const updatedSolicitudTabla = {
            ...solicitudTabla,
            [name]: value,
        };
        setSolicitudTabla(updatedSolicitudTabla);

        // Si cambia la categoría, actualizamos el tipo
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
                    [name]: value
                });
            }
        }

        // Ejecutamos la validación después de actualizar el estado
        // (usamos updatedSolicitudTabla para validar el nuevo estado)
        if (errorGuardar === true) {
            validateSolicitudHeader(updatedSolicitudTabla, _Tipo, _ticket).then((resp) => {
                setErrorSolicitudHeader(resp);
            });
        }
    };

    //modal prioridad alta
    const [openPrioridad, setOpenPriodidad] = useState(false);
    const Cancelar = () => {
        setSolicitudTabla({
            ...solicitudTabla,
            ["prioridad"]: 0,
            ["justificacion_prioridad"]: "",
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
    const [estatusSolicutud, setEstatusSolicitud] = useState(0);
    const [detalles, setDetalles] = useState(0);
    const [unidadesMedida, setUnidadesMedida] = useState(0);
    const [gpoFamilia, setGpoFamilia] = useState(0);
    const GetByID = async (id, idDepa) => {
        try {

            const [categoriaResponse, tipoResponse, response, unidadM, gpoF] = await Promise.all([
                requests.getToken(GET_CATEGORIA_ID_DEPARTAMENTO + idDepa),
                requests.getToken(GET_TIPO_ID_DEPARTAMENTO + idDepa),
                requests.getToken(GET_TAB_SOLICITUDES_BY_ID + id),
                requests.getToken(GET_LIST_CAT_UNIDAD_MEDIDA),
                requests.getToken(GET_LIST_CAT_GRUPO_FAMILIA)
            ]);

            const categoria = Array.isArray(categoriaResponse.data.data) ? categoriaResponse.data.data : [];
            const tipo = Array.isArray(tipoResponse.data.data) ? tipoResponse.data.data : [];

            if (categoria.length > 0) setListOptions1(categoria);
            if (tipo.length > 0) setListOptions2(tipo);


            const data = response.data.data;
            setDetalles(data.detalles)
            setUnidadesMedida(unidadM.data.data)
            setGpoFamilia(gpoF.data.data)

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
                prioridadModificada: data.prioridadModificada
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
    const GetByIDSinTicket = async (idDepa) => {
        try {

            const [categoriaResponse, tipoResponse, unidadM, gpoF] = await Promise.all([
                requests.getToken(GET_CATEGORIA_ID_DEPARTAMENTO + idDepa),
                requests.getToken(GET_TIPO_ID_DEPARTAMENTO + idDepa),

                requests.getToken(GET_LIST_CAT_UNIDAD_MEDIDA),
                requests.getToken(GET_LIST_CAT_GRUPO_FAMILIA)
            ]);

            const categoria = Array.isArray(categoriaResponse.data.data) ? categoriaResponse.data.data : [];
            const tipo = Array.isArray(tipoResponse.data.data) ? tipoResponse.data.data : [];

            if (categoria.length > 0) setListOptions1(categoria);
            if (tipo.length > 0) setListOptions2(tipo);

            setUnidadesMedida(unidadM.data.data)
            setGpoFamilia(gpoF.data.data)



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
            } else {
                await GetByIDSinTicket(idDepa);
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
                setTicket(response.data.data.id);
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.setMessageSnackBar(element, 'warning');
                    props.setCloseLoadingScreen();
                });
                //props.setMessageSnackBar(error.Message, 'warning');
            }).finally(() => {
                // props.setCloseLoadingScreen();

            });
    }


    const handleEditar = () => {
        props.setOpenLoadingScreen();
        requests
            .putToken(UPDATE_TAB_SOLICITUDES + _ticket, solicitudTabla) //### ** 
            .then((response) => {
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

    const handleEditaryEnviar = async () => {
        try {
            props.setOpenLoadingScreen();
            // Paso 1: Actualizar la solicitud
            await requests.putToken(UPDATE_TAB_SOLICITUDES + _ticket, solicitudTabla);
            // Paso 2: Asignar usuario

            // Paso 3 (opcional): Cambiar estatus si es necesario
            if (estatusSolicutud === 5) {
                try {
                    await requests.postToken(CAMBIAR_ESTATUS, {
                        id_estatus: 6,
                        id_solicitud: _ticket
                    });
                } catch (error) {
                    console.error('Error al cambiar estatus:', error?.response?.data || error.message);
                }
            }
            else {
                await requests.postToken(ASIGNAR_USUARIO_SOLICITUDES, { id_solicitud: _ticket });
            }
            // Paso 4: Redirigir
            navigate(SOLICITUD);
        } catch (error) {
            props.setMessageSnackBar(error?.Message || 'Error al procesar la solicitud', 'warning');
        } finally {
            props.setCloseLoadingScreen();
        }
    };

    const [errorGuardar, setErrorGuardar] = useState(false)
    const [errorSolicitudHeader, setErrorSolicitudHeader] = useState({});
    const handleSumit = () => {
        validateSolicitudHeader(solicitudTabla, _Tipo, _ticket).then((resp) => {
            if (Object.keys(resp).length === 0) {
                if (_ticket == null) {
                    handleGuardar();
                } else {
                    handleEditar();
                }
            }
            setErrorSolicitudHeader(resp);
            setErrorGuardar(true);
        });
    }


    const handleSumitAndSend = () => {
        validateSolicitudHeader(solicitudTabla, _Tipo, _ticket).then((resp) => {
            if (Object.keys(resp).length === 0) {
                handleEditaryEnviar();
            }
            setErrorSolicitudHeader(resp);
            setErrorGuardar(true);
        });
    }



    const handleCancelar = () => {
        navigate(SOLICITUD);
    }

    const handleOptions2 = (e) => {
        const { name, value } = e.target;

        const updatedTipo = {
            ..._Tipo,
            [name]: value,
        };

        setTipo(updatedTipo);
        const categoriaRelacionada = listOptions1.find(categoria => categoria.id_tipo === value);

        if (categoriaRelacionada) {
            const updatedCategoria = {
                ...solicitudTabla,
                id_categoria: categoriaRelacionada.id
            };
            setSolicitudTabla(updatedCategoria);
            if (errorGuardar === true) {
                validateSolicitudHeader(updatedCategoria, updatedTipo, _ticket).then((resp) => {
                    setErrorSolicitudHeader(resp);
                });
            }
        }
    };


    useEffect(() => {
        if (habilitarPantalla === 1 || habilitadoEditar === 1) {
            setTicket(props.ticket);
            getAll(props.ticket, valoridDep);

            if (!props.ticket) {
                setFechaSolicitud(obtenerFechaActual());
            }

        } else {
            setTicket(props.ticket);
            getAll(props.ticket, user.idDepartamento);

            if (!props.ticket) {
                setFechaSolicitud(obtenerFechaActual());
            }
        }
    }, []);

    const [open, setOpen] = useState(false);

    const handleOpenDialog = () => {
        setOpen(true);
    }


    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
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
                            Una vez enviado, no podrás realizar cambios. ¿Estás seguro de que deseas continuar?
                        </p>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button className='btn-aceptar' onClick={handleSumitAndSend} variant={"contained"} sx={{ mr: 1 }}>Enviar</Button>
                            <Button className="btn-cancelar" onClick={handleCloseDialog} variant={"contained"} sx={{ mr: 1 }}>Cancelar</Button>
                        </Box>
                    </center>
                </Box>
            </Dialog>


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
                            <strong>Usuario:</strong> {solicitud
                                ? `${solicitud?.usuario_solicitud?.name || ''} ${solicitud?.usuario_solicitud?.apellidoP || ''} ${solicitud?.usuario_solicitud?.apellidoM || ''}`
                                : user.nombre}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="body1">
                            <strong>Departamento:</strong> {solicitud
                                ? solicitud?.usuario_solicitud?.descripcio_depatamento || "No especificado"
                                : user.departamento}
                        </Typography>
                    </Grid>

                    {/* Correo y Fecha */}
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Correo electrónico: {" "}
                            {solicitud
                                ? solicitud?.usuario_solicitud?.email || "No especificado"
                                : user.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                            Fecha de Solicitud: {solicitud
                                ? solicitud?.created_at?.substring(0, 10) || "No disponible"
                                : fechaSolicitud}
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
                    {/* Prioridad */}
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            filterOptions={(options, state) =>
                                options.filter((option) =>
                                    option.prioridad?.toLowerCase().startsWith(state.inputValue.toLowerCase())
                                )
                            }

                            disabled={habilitarPantalla === 1 ? (true) : (parseInt(user.idRol, 10) === 4 && solicitudTabla.prioridadModificada === true ? true : false)}
                            options={listOptions3.slice(0, 100)}
                            getOptionLabel={(option) => option.prioridad}
                            renderInput={(params) =>
                                <TextFieldGeneral
                                    className={habilitarPantalla === 1 ? "inputTextSize100disabled" : (parseInt(user.idRol, 10) === 4 && solicitudTabla.prioridadModificada === true ? "inputTextSize100disabled" : "inputTextSize100")}
                                    error={(errorSolicitudHeader.prioridad ? (true) : (false))}
                                    label={"Prioridad"}
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

                    {/* Descripción */}
                    <Grid container item xs={12} sm={8}>
                        <TextFieldGeneral
                            disabled={habilitarPantalla === 1}
                            error={(errorSolicitudHeader.descripcion ? (true) : (false))}
                            className={habilitarPantalla === 1 ? "inputTextSize100disabled" : "inputTextSize100"}
                            //multiline
                            //minRows={2}
                            label="Detalle de compra"
                            value={solicitudTabla.descripcion}
                            name='descripcion'
                            onChange={handleSolicitud}
                        />
                        {errorSolicitudHeader.descripcion && (
                            <span className="label_Quest_Validaciones">{errorSolicitudHeader.descripcion}</span>
                        )}
                    </Grid>
                    {solicitudTabla.prioridad === 1 ? (
                        <Grid item xs={12}>
                            <TextFieldGeneral
                                disabled={habilitarPantalla === 1 ? (true) : (parseInt(user.idRol, 10) === 4 && solicitudTabla.prioridadModificada === true ? true : false)}
                                error={(errorSolicitudHeader.justificacion_prioridad ? (true) : (false))}
                                className={habilitarPantalla === 1 ? "inputTextSize100disabled" : (parseInt(user.idRol, 10) === 4 && solicitudTabla.prioridadModificada === true ? "inputTextSize100disabled" : "inputTextSize100")}
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
                    <Grid item xs={12}>
                        <TextFieldGeneral
                            disabled={habilitarPantalla === 1}
                            error={(errorSolicitudHeader.justificacion ? (true) : (false))}
                            className={habilitarPantalla === 1 ? "inputTextSize100disabled" : "inputTextSize100"}
                            //multiline
                            //minRows={2}
                            label="Justificación de la Solicitud"
                            value={solicitudTabla.justificacion}
                            name='justificacion'
                            onChange={handleSolicitud}
                        />
                        {errorSolicitudHeader.justificacion && (
                            <span className="label_Quest_Validaciones">{errorSolicitudHeader.justificacion}</span>
                        )}
                    </Grid>




                    <Grid item container spacing={2}>


                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                filterOptions={(options, state) =>
                                    options.filter((option) =>
                                        option.descripcion?.toLowerCase().startsWith(state.inputValue.toLowerCase())
                                    )
                                }

                                disabled={_ticket != null ? true : false}
                                options={listOptions2.slice(0, 100)}
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
                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                filterOptions={(options, state) =>
                                    options.filter((option) =>
                                        option.descripcion_categoria?.toLowerCase().startsWith(state.inputValue.toLowerCase())
                                    )
                                }

                                disabled={_ticket != null ? true : false}
                                options={filteredCategorias.slice(0, 100)}
                                getOptionLabel={(option) => option.descripcion_categoria}
                                renderInput={(params) =>
                                    <TextFieldGeneral
                                        error={(errorSolicitudHeader.id_categoria ? (true) : (false))}
                                        idprops={_ticket}
                                        className={_ticket != null ? "inputTextSize100disabled" : "inputTextSize100"}
                                        label={"Categoría"}
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
                        <Grid item xs={12} sm={6} md={6} display="flex" justifyContent="flex-end">
                            {habilitarPantalla !== 1 && (
                                <Button
                                    onClick={handleSumit}
                                    className="btn-aceptar"
                                    variant="contained"
                                >
                                    {_ticket == null ? 'Guardar' : 'Actualizar'}
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {_ticket != null ? (
                <DetalleSolicitud
                    listOptions2={listOptions2}
                    listOptions1={listOptions1}
                    _ticket={_ticket}
                    props={props}
                    _Tipo={_Tipo}
                    solicitudTabla={solicitudTabla}
                    detalles={detalles}
                    unidadesMedida={unidadesMedida}
                    gpoFamilia={gpoFamilia}
                    setEnviar={setEnviar}
                    archivosCotizacionGlobla={archivosCotizacionGlobla}
                    setEstatusCotizacionGlobal={setEstatusCotizacionGlobal}
                    estatusCotizacionGlobla={estatusCotizacionGlobla}
                />) : (
                null
            )}

            <center>
                <Grid container sx={{ marginTop: 3 }}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center">
                            <Button
                                onClick={handleCancelar}
                                className="btn-cancelar"
                                variant="contained"
                                sx={{ mr: 1 }}
                            >
                                Regresar
                            </Button>
                            {habilitarPantalla !== 1 && (
                                <Button
                                    disabled={enviar === false ? true : false}
                                    onClick={handleOpenDialog}
                                    className={enviar === false ? "btn-aceptar-disabled" : "btn-aceptar"}
                                    variant="contained"
                                >
                                    {_ticket == null ? 'Enviar' : 'Enviar'}
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </center>

            <div>
                <AlertJustificacionPrioridad
                    props={props}
                    open={openPrioridad}
                    Cancelar={Cancelar}
                    Continuar={Continuar}
                    handleSolicitud={handleSolicitud}
                    setSolicitudTabla={setSolicitudTabla}
                    solicitudTabla={solicitudTabla}
                    estatusSolicutud={estatusSolicutud}
                />

            </div>
        </div >

    )
}

export default HeaderSolicitud