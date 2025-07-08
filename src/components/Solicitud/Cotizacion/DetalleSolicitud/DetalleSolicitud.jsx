import {
    Autocomplete,
    Box,
    Button, FormControl, Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { CAMBIAR_ESTATUS, CREATE_ARCHIVO, CREATE_ARCHIVO_COTIZACIONES, CREATE_ARCHIVO_COTIZACIONES_GENERAL, CREATE_TAB_SOLICITUDES_DETALLE, DELETE_ARCHIVO, DELETE_ARCHIVO_COTIZACIONES, DELETE_ARCHIVO_COTIZACIONES_GENERAL, GET_ARCHIVO_BY_ID_SOLICITUD_DETALLE, GET_CAT_PRODUCTOSBY_ID_CATEGORIA, GET_LIST_CAT_GRUPO_FAMILIA, GET_LIST_CAT_UNIDAD_MEDIDA, GET_TAB_SOLICITUDES_DETALLE_BY_ID_SOLICITUD, UPDATE_ARCHIVO_COTIZACIONES, UPDATE_ARCHIVO_COTIZACIONES_GENERAL, UPDATE_TAB_SOLICITUDES_DETALLE } from '../../../../Constants/ApiConstants';
import { TextFieldGeneral, TextFieldGeneral2, TextFieldNumber } from '../../../../Styles/TextField/TextField';
import requests from '../../../AxiosCalls/AxiosCallsLocal';

import EditNoteIcon from '@mui/icons-material/EditNote';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { StyledTableCell, StyledTableRow } from '../../../../Styles/Table/Table';
import moment from 'moment';

import AlertaDocumentoCotizacion from '../../../../alerts/_TKSAlertDocumentoCotizacion';
import AlertaDocumentoCotizacionGeneral from '../../../../alerts/_TKSAlertDocumentoCotizacion';
import AlertaEnviarCotizacion from '../../../../alerts/_TKSAlertEnviarCotizacion';
import AlertaChangeCotizacion from '../../../../alerts/_TKSAlertchangeCotizacion';
import AlertaDocumento from '../../../../alerts/_TKSAlertDocumento';
import AlertaSolicitarInformacion from '../../../../alerts/_TKSAlertSolitarInfo';
import { validateSolicitudDetalle, validateSolicitudDetalle2 } from '../../../../Utils/Validacion/solicitudes';
import { SOLICITUD } from '../../../../Constants/NavegacionRoutes';
import { useNavigate } from 'react-router-dom';

const DetalleSolicitud = (props) => {
    const [enviar, setEnviar] = useState(false)
    const [listOptions1, setListOptions1] = useState([]);//clave articulo
    const [listOptions2, setListOptions2] = useState([]);// unidad de medida
    const [listOptions3, setListOptions3] = useState([]);// grupo articulo

    const [filterOptions1, setFilterOptions1] = useState([]);//clave articulo
    const [filterOptions2, setFilterOptions2] = useState([]);// unidad de medida
    const [filterOptions3, setFilterOptions3] = useState([]);// grupo articulo

    const [listSolicitudDetalle, setListSolicitudDetalle] = useState([]);// grupo articulo

    const [detalleSolicitud, setDetalleSolicitud] = useState({
        id: 0,
        id_producto: 0,
        id_solicitud: props._ticket,
        descripcion: "",
        marca: "",
        modelo: "",
        cantidad: 1,
        observacion: "",
        cotizado: null,
        habilitado: true,
    });

    const [articulosSet, setArticulosSet] = useState({
        id: 0,
        descripcion_producto: "",
        id_unidad_medida: 0,
        id_moneda: 0,
        id_gpo_familia: 0,
        descripcion_gpo_familia: "",
    });

    const [reqMarcaModelo, setReqMarcaModelo] = useState(false)
    useEffect(() => {
        if (props.solicitudTabla.id_categoria != 0) {
            let idCategoria = props.solicitudTabla.id_categoria;
            let idTipo = props.listOptions1.filter(categoria => categoria.id == idCategoria)[0].id_tipo;
            setReqMarcaModelo(props.listOptions2.filter(tipo => tipo.id == idTipo)[0].req_marca_modelo);

            getAll(idCategoria, props._ticket);
            if (props.archivosCotizacionGlobla.length > 0) { /// COTIZACION GENERARL DEFINIR
                setCotizacionGeneralBase64(props.archivosCotizacionGlobla);
                setCotizacionGeneral(true);
            } else {
                setCotizacionGeneralBase64([]);
                setCotizacionGeneral(false);
            }
        }
    }, [props._Tipo, props.solicitudTabla.id_categoria]);

    // const [position, setPosition] = useState(0)
    // useEffect(() => {
    //     if (listOptions1.length != 0 && listSolicitudDetalle.length != 0) {
    //         ListFilterOptions(listOptions1, listOptions2, listOptions3, 'id', listSolicitudDetalle[position].id_producto,)
    //         setDetalleSolicitud({
    //             ...detalleSolicitud,
    //             ["id"]: listSolicitudDetalle[position].id,
    //             ["id_producto"]: listSolicitudDetalle[position].id_producto,
    //             ["id_solicitud"]: listSolicitudDetalle[position].id_solicitud,
    //             ["descripcion"]: listSolicitudDetalle[position].descripcion,
    //             ["marca"]: listSolicitudDetalle[position].marca,
    //             ["modelo"]: listSolicitudDetalle[position].modelo,
    //             ["cantidad"]: listSolicitudDetalle[position].cantidad,
    //             ["observacion"]: listSolicitudDetalle[position].observacion,
    //             ["cotizado"]: listSolicitudDetalle[position].cotizado,
    //             ["habilitado"]: listSolicitudDetalle[position].habilitado,
    //         });
    //         setArchivosBase64(listSolicitudDetalle[position].archivos);
    //         setCotizacionBase64(listSolicitudDetalle[position].archivos_cotizaciones); //DEFINIR OSCAR
    //     }
    // }, [listOptions1, listSolicitudDetalle]);

    const getAllSolicitudDetalle = async (listaArticulos) => {
        //props.props.setOpenLoadingScreen();
        try {
            const detalleSolicitudResponse = await requests.getToken(GET_TAB_SOLICITUDES_DETALLE_BY_ID_SOLICITUD + props._ticket);
            const solicitudDetalle = detalleSolicitudResponse.data.data || [];

            setListSolicitudDetalle(solicitudDetalle);

            let enviar = solicitudDetalle.length > 0 &&
                solicitudDetalle
                    .filter(detalle => detalle.habilitado === true)
                    .every(detalle => detalle.cotizado === false || detalle.cotizado === true)
            setEnviar(enviar);
            // Si ya puede enviarse y está en estatus 5, cambia estatus
            if (enviar && props.estatusSolicutud === 5) {
                const estatus = {
                    id_estatus: 1,
                    id_solicitud: props._ticket
                };
                try {
                    await requests.postToken(CAMBIAR_ESTATUS, estatus);
                } catch (error) {
                    console.error('Error al cambiar estatus:', error?.response?.data || error.message);
                }
            }

            let cotizacionGlobal = solicitudDetalle.length > 0 &&
                solicitudDetalle
                    .filter(detalle => detalle.habilitado === true)
                    .some(detalle => detalle.cotizado === true || detalle.cotizado === false);

            if (props.estatusCotizacionGlobla == false) {
                if (cotizacionGlobal === false) {
                    props.setEstatusCotizacionGlobal(false);
                } else {
                    props.setEstatusCotizacionGlobal(true);
                }
            } else {
                props.setEstatusCotizacionGlobal(true);
            }

        } catch (error) {
            props.props.setMessageSnackBar(error.message, 'warning');
        } finally {
            props.props.setCloseLoadingScreen();
        }
    };

    const FiltrosExist = (solicitudDetalle, listaArticulos, idProducto) => {
        const idsEnDetalle = solicitudDetalle
            .filter(detalle => detalle.id_producto !== idProducto) // excluye el que se está editando
            .map(detalle => detalle.id_producto);
        const articulosFiltrados = listaArticulos.filter(articulo =>
            !idsEnDetalle.includes(articulo.id)
        );
        setFilterOptions1(articulosFiltrados);
    }

    const getAll = async (idCategoria, idSolicitud, id = null) => {
        //props.props.setOpenLoadingScreen();

        try {
            // Si estas dos no cambian, deberías obtenerlas solo una vez en toda la app
            const [productosResponse, unidadMedidaResponse, grupoFamiliaResponse] = await Promise.all([
                requests.getToken(GET_CAT_PRODUCTOSBY_ID_CATEGORIA + idCategoria),
                requests.getToken(GET_LIST_CAT_UNIDAD_MEDIDA),
                requests.getToken(GET_LIST_CAT_GRUPO_FAMILIA)
            ]);

            // Optimizado: evitar O(n²) usando Set
            const seenArticulos = new Set();
            const articuloListSinDuplicados = productosResponse.data.data.filter(item => {
                const key = `${(item.descripcion_producto || '').toLowerCase()}|${(item.clave_producto || '').toLowerCase()}`;
                if (seenArticulos.has(key)) return false;
                seenArticulos.add(key);
                return true;
            });

            const seenUnidades = new Set();
            const unidadMedidaListSinDuplicados = unidadMedidaResponse.data.data.filter(item => {
                const key = (item.clave_unidad_medida || '').toLowerCase();
                if (seenUnidades.has(key)) return false;
                seenUnidades.add(key);
                return true;
            });

            const seenGrupos = new Set();
            const grupoFamiliaListSinDuplicados = grupoFamiliaResponse.data.data.filter(item => {
                const key = (item.clave_gpo_familia || '').toLowerCase();
                if (seenGrupos.has(key)) return false;
                seenGrupos.add(key);
                return true;
            });

            // Setea las opciones y filtros
            setListOptions1(articuloListSinDuplicados);
            setListOptions2(unidadMedidaListSinDuplicados);
            setListOptions3(grupoFamiliaListSinDuplicados);

            setFilterOptions1(articuloListSinDuplicados);
            setFilterOptions2(unidadMedidaListSinDuplicados);
            setFilterOptions3(grupoFamiliaListSinDuplicados);
            // Ejecuta la carga de detalles después (sin bloquear la vista)
            setTimeout(() => getAllSolicitudDetalle(articuloListSinDuplicados), 100);

        } catch (error) {
            props.props.setMessageSnackBar(error.message, 'warning');
        } finally {
            //props.props.setCloseLoadingScreen();
        }
    };

    const handleDetalleSolicitud = (e) => {
        setDetalleSolicitud({
            ...detalleSolicitud,
            [e.target.name]: e.target.value,
        });
    };

    const handleDetalleSolicitudCantidad = (e) => {
        if (e.target.value === 0 || e.target.value === "0") {
            setDetalleSolicitud({
                ...detalleSolicitud,
                [e.target.name]: 1,
            });
        } else {
            setDetalleSolicitud({
                ...detalleSolicitud,
                [e.target.name]: e.target.value,
            });
        }
    }

    const handleArticulos = (e) => {
        setArticulosSet({
            ...articulosSet,
            [e.target.name]: e.target.value,
        });
        ListFilterOptions(listOptions1, listOptions2, listOptions3, e.target.name, e.target.value,)
    };

    const ListFilterOptions = (articuloList, unidadMedidaList, grupoFamiliaList, nombre, valor) => {
        if (nombre === 'id') {
            if (valor !== undefined) {
                let filteropstions1 = articuloList.filter(articulos => articulos.id == valor);
                let filteropstions2 = unidadMedidaList.filter(unidadMedida => unidadMedida.id == filteropstions1[0].id_unidad_medida);
                let filteropstions3 = grupoFamiliaList.filter(grupoFamilia => grupoFamilia.id == filteropstions1[0].id_gpo_familia);

                setFilterOptions1(filteropstions1);
                setFilterOptions2(filteropstions2);
                setFilterOptions3(filteropstions3);

                setArticulosSet({
                    ...articulosSet,
                    id: valor,
                    descripcion_producto: filteropstions1[0].descripcion_producto,
                    id_unidad_medida: filteropstions1[0].id_unidad_medida,
                    id_moneda: 0,
                    id_gpo_familia: filteropstions1[0].id_gpo_familia,
                    descripcion_gpo_familia: grupoFamiliaList[0].descripcion_gpo_familia,
                });

                setDetalleSolicitud({
                    ...detalleSolicitud,
                    "id_producto": valor,
                });
            } else {
                setFilterOptions1(listOptions1);
                setFilterOptions2(listOptions2);
                setFilterOptions3(listOptions3);

                setArticulosSet({
                    ...articulosSet,
                    id: 0,
                    descripcion_producto: "",
                    id_unidad_medida: 0,
                    id_moneda: 0,
                    id_gpo_familia: 0,
                    descripcion_gpo_familia: "",
                });
            }
        }
        if (nombre === 'descripcion_producto') {
            if (valor !== "") {
                let filteropstions1 = articuloList.filter(articulo =>
                    articulo.descripcion_producto?.toLowerCase().includes(valor.toLowerCase())
                );
                if (filteropstions1.length > 0) {
                    let idsUnidadMedida = filteropstions1.map(item => item.id_unidad_medida);
                    let filteropstions2 = unidadMedidaList.filter(unidad =>
                        idsUnidadMedida.includes(unidad.id)
                    );

                    let idsGrupoFamilia = filteropstions1.map(item => item.id_gpo_familia);
                    let filteropstions3 = grupoFamiliaList.filter(grupoFamilia =>
                        idsGrupoFamilia.includes(grupoFamilia.id)
                    );

                    setFilterOptions1(filteropstions1);
                    setFilterOptions2(filteropstions2);
                    setFilterOptions3(filteropstions3);

                    if (filteropstions1.length <= 1) {
                        setArticulosSet({
                            ...articulosSet,
                            id: filteropstions1[0].id,
                            descripcion_producto: valor,
                            id_unidad_medida: filteropstions1[0].id_unidad_medida,
                            id_moneda: 0,
                            id_gpo_familia: filteropstions1[0].id_gpo_familia,
                            descripcion_gpo_familia: grupoFamiliaList[0].descripcion_gpo_familia,
                        });

                        setDetalleSolicitud({
                            ...detalleSolicitud,
                            "id_producto": filteropstions1[0].id,
                        });
                    } else {
                        setArticulosSet({
                            ...articulosSet,
                            id: 0,
                            descripcion_producto: valor,
                            id_unidad_medida: 0,
                            id_moneda: 0,
                            id_gpo_familia: 0,
                            descripcion_gpo_familia: "",
                        });
                    }
                } else {
                    setFilterOptions1([]);
                    setFilterOptions2([]);
                    setFilterOptions3([]);
                }
            } else {
                setFilterOptions1(listOptions1);
                setFilterOptions2(listOptions2);
                setFilterOptions3(listOptions3);
                setArticulosSet({
                    ...articulosSet,
                    id: 0,
                    descripcion_producto: valor,
                    id_unidad_medida: 0,
                    id_moneda: 0,
                    id_gpo_familia: 0,
                    descripcion_gpo_familia: "",
                });
            }
        }

        if (nombre === 'id_gpo_familia') {
            if (valor !== undefined) {
                let filteropstions1 = articuloList.filter(articulo =>
                    articulo.id_gpo_familia == valor
                );
                setFilterOptions1(filteropstions1);
            } else {
                setFilterOptions1(listOptions1);
                setFilterOptions2(listOptions2);
                setFilterOptions3(listOptions3);

                setArticulosSet({
                    ...articulosSet,
                    id: 0,
                    descripcion_producto: "",
                    id_unidad_medida: 0,
                    id_moneda: 0,
                    id_gpo_familia: valor,
                    descripcion_gpo_familia: "",
                });
            }
        }
    }

    const handleGuardar = async () => {
        props.props.setOpenLoadingScreen();
        await Promise.all([
            requests.postToken(CREATE_TAB_SOLICITUDES_DETALLE, detalleSolicitud),
            requests.postToken(DELETE_ARCHIVO_COTIZACIONES, deleteFile)
        ]).then(([createSDResponse]) => {
            handlecancelar();
            let createSolicitudDetalle = createSDResponse.data.data;
            return handledGuardaCotizacion(createSolicitudDetalle.id);
        }).catch((error) => {
            error.response.data.errors.forEach(element => {  //forEach Ya quedo
                props.props.setMessageSnackBar(element, 'warning');
                props.props.setCloseLoadingScreen();
            });
        }).finally(() => {
            props.props.setCloseLoadingScreen();
        });
    }

    const handleEditar = async () => {
        props.props.setOpenLoadingScreen();
        await Promise.all([
            requests.putToken(UPDATE_TAB_SOLICITUDES_DETALLE + detalleSolicitud.id, detalleSolicitud),
            requests.postToken(DELETE_ARCHIVO_COTIZACIONES, deleteFileCotizacion)/// COTIZACION GENERARL DEFINIR
        ]).then(([editSDResponse, deleteResponse]) => {
            handlecancelar();
            return handledGuardaCotizacion(detalleSolicitud.id); /// COTIZACION GENERARL DEFINIR
        }).catch((error) => {
            error.response.data.errors.forEach(element => {  //forEach Ya quedo
                props.props.setMessageSnackBar(element, 'warning');
                props.props.setCloseLoadingScreen();
            });
        }).finally(() => {
            props.props.setCloseLoadingScreen();
        });
    }

    const handlecancelar = () => {
        setArticulosSet({
            ...articulosSet,
            id: 0,
            descripcion_producto: "",
            id_unidad_medida: 0,
            id_moneda: 0,
            id_gpo_familia: 0,
            descripcion_gpo_familia: "",
        });

        setDetalleSolicitud({
            ...detalleSolicitud,
            id: 0,
            id_producto: 0,
            id_solicitud: props._ticket,
            descripcion: "",
            marca: "",
            modelo: "",
            cantidad: 1,
            observacion: "",
            cotizado: null,
            habilitado: true,
        });
        setFilterOptions1(listOptions1);
        setFilterOptions2(listOptions2);
        setFilterOptions3(listOptions3);
        setArchivosBase64([]);
        setCotizacionBase64([]);
        setCotizacionGeneralBase64([]);
        //FiltrosExist(listSolicitudDetalle, listOptions1, 0);
    }

    const [errorSolicitudDetalle, setErrorSolicitudDetalle] = useState({});
    const handleSubmit = () => {
        const yaExiste = listSolicitudDetalle.some(detalle =>
            detalle.id_producto === detalleSolicitud.id_producto &&
            detalle.id !== detalleSolicitud.id
        );
        if (yaExiste) {
            props.props.setMessageSnackBar(`El artículo "${articulosSet.descripcion_producto}" ya ha sido agregado y no puede registrarse nuevamente.`, 'warning');
            props.props.setCloseLoadingScreen();
            return false;
        } else {
            validateSolicitudDetalle(detalleSolicitud, articulosSet, reqMarcaModelo, cotizacionBase64).then((resp) => {
                if (Object.keys(resp).length === 0) {
                    if (detalleSolicitud.id == 0) {
                        handleGuardar();
                    } else {
                        handleEditar();
                    }
                    cambioEstatus();
                }
                setErrorSolicitudDetalle(resp);
            });
        }
    }

    const navigate = useNavigate();
    const handleCancelar = () => {
        navigate(SOLICITUD);
    }
    const handleEnviar = () => {
        if (numberEnviar === 1) {
            let cotizacionFalse = listSolicitudDetalle.filter(cotizacion =>
                cotizacion.cotizado === false || cotizacion.cotizado === null
            ).length;
            if (cotizacionFalse != 0) {
                cambiarEstatus(5, detalleSolicitud.id_solicitud);
            } else {
                cambiarEstatus(4, detalleSolicitud.id_solicitud);
            }
        }

        if (numberEnviar === 2) {
            if (props.estatusCotizacionGlobla == false) {
                cambiarEstatus(5, detalleSolicitud.id_solicitud);
            } else {
                cambiarEstatus(4, detalleSolicitud.id_solicitud);
            }
        }
    }
    const cambiarEstatus = (estatus_id, id) => {
        props.props.setOpenLoadingScreen();
        const estatus = {
            id_estatus: estatus_id,
            id_solicitud: id
        };
        requests
            .postToken(CAMBIAR_ESTATUS, estatus)
            .then((response) => {
                navigate(SOLICITUD);
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.props.setMessageSnackBar(element, 'warning');
                    props.props.setCloseLoadingScreen();
                });
            }).finally(() => {
                props.props.setCloseLoadingScreen();
            });
    }

    const editarDetalle = (item, i) => {
        // handlecancelar();
        detalleSolicitud.id = item.id ?? null;
        detalleSolicitud.id_producto = item.id_producto ?? null;
        detalleSolicitud.id_solicitud = item.id_solicitud ?? null;
        detalleSolicitud.descripcion = item.descripcion ?? "";
        detalleSolicitud.marca = item.marca ?? "";
        detalleSolicitud.modelo = item.modelo ?? "";
        detalleSolicitud.cantidad = item.cantidad ?? 0;
        detalleSolicitud.observacion = item.observacion ?? "";
        detalleSolicitud.cotizado = item.cotizado;
        detalleSolicitud.habilitado = item.habilitado;
        ListFilterOptions(listOptions1, listOptions2, listOptions3, 'id', item.id_producto,)
        setArchivosBase64(item.archivos);
        setDeleteFile([]);
        if (item.archivos_cotizaciones.length > 0) { /// COTIZACION GENERARL DEFINIR
            setCotizacionBase64(item.archivos_cotizaciones);

        } else {
            setCotizacionBase64([]);

        }
        //setPosition(i)
    }

    //ARCHIVOS
    const [archivosBase64, setArchivosBase64] = useState([]);
    const handleArchivos = (event) => {
        const archivos = Array.from(event.target.files);
        const nuevosArchivos = [];

        const archivoSeleccionado = event.target.files[0];

        if (!archivoSeleccionado) {
            props.props.setMessageSnackBar('No se seleccionó ningún archivo.', 'warning');
            return;
        }

        const yaExiste = archivosBase64.some(file => file.nombre === archivoSeleccionado.name);
        if (!yaExiste) {
            archivos.forEach((archivo) => {
                if (archivo.size <= 1024 * 1024 * 5) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        nuevosArchivos.push({
                            id: 0,
                            archivo: reader.result,
                            nombre: archivo.name
                        });

                        if (nuevosArchivos.length === archivos.length) {
                            setArchivosBase64((prev) => [...prev, ...nuevosArchivos]);
                        }
                    };
                    reader.readAsDataURL(archivo);
                } else {
                    props.props.setMessageSnackBar(`"${archivo.name}" excede 5MB y no fue agregado.`, 'warning');
                }
            });
        } else {
            props.props.setMessageSnackBar('El archivo ya existe y no será agregado', 'warning');
        }
    };

    const [deleteFile, setDeleteFile] = useState([]);
    const eliminarArchivo = async (index, archivo) => {
        if (archivo.id === 0) {
            setArchivosBase64(prev => prev.filter((_, i) => i !== index));
        } else {
            setDeleteFile(prev => [...prev, { id: archivo.id }]);
            setArchivosBase64(prev => prev.filter((_, i) => i !== index));
        }
    };

    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    const verImagen = (index, archivo) => {
        const tipoMime = archivo.archivo.split(';')[0].split(':')[1]; // extrae el tipo MIME
        setArchivoSeleccionado({ ...archivo, tipoMime });
        setModalAbierto(true);
    };

    const handledGuardaFile = async (idSolicitud) => {
        const archivos = archivosBase64
            .filter(archivo => archivo.id === 0)
            .map(archivo => ({
                ...archivo,
                id_solicitud_detalle: idSolicitud
            }));
        await requests
            .postToken(CREATE_ARCHIVO, archivos) //### ** 
            .then((response) => {
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.props.setMessageSnackBar(element, 'warning');
                    props.props.setCloseLoadingScreen();
                });
            })
        return getAllSolicitudDetalle(listOptions1);
    }

    //// COTIZACIONES setCotizacionBase64 

    const [cotizacionBase64, setCotizacionBase64] = useState([]);
    const handleCotizar = (event) => {
        const archivos = Array.from(event.target.files);
        const nuevosArchivos = [];

        const archivoSeleccionado = event.target.files[0];

        if (!archivoSeleccionado) {
            props.props.setMessageSnackBar('No se seleccionó ningún archivo.', 'warning');
            return;
        }

        const yaExiste = cotizacionBase64.some(file => file.nombre_cotizacion === archivoSeleccionado.name);
        if (!yaExiste) {
            archivos.forEach((archivo) => {
                if (archivo.size <= 1024 * 1024 * 5) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        nuevosArchivos.push({
                            id: 0,
                            archivo_cotizacion: reader.result,
                            nombre_cotizacion: archivo.name,
                            justificacion: "",
                            recomendada: false,
                            id_usuario: 1
                        });

                        if (nuevosArchivos.length === archivos.length) {
                            setCotizacionBase64((prev) => [...prev, ...nuevosArchivos]);
                        }
                        if (nuevosArchivos.length > 0) {
                            setDetalleSolicitud({
                                ...detalleSolicitud,
                                "cotizado": true
                            });
                        }
                    };
                    reader.readAsDataURL(archivo);
                } else {
                    props.props.setMessageSnackBar(`"${archivo.name}" excede 5MB y no fue agregado.`, 'warning');
                }
            });
        } else {
            props.props.setMessageSnackBar('El archivo ya existe y no será agregado', 'warning');
        }
        cambioEstatus();
    };

    const [deleteFileCotizacion, setDeleteFileCotizacion] = useState([]);
    const eliminarCotizacion = async (index, archivo) => {
        let nuevaLista = cotizacionBase64.filter((_, i) => i !== index);

        if (archivo.id === 0) {
            setCotizacionBase64(nuevaLista);
        } else {
            setDeleteFileCotizacion(prev => [...prev, { id: archivo.id }]);
            setCotizacionBase64(nuevaLista);
        }
        // Ahora sí validamos si quedó vacío
        if (nuevaLista.length === 0) {
            setDetalleSolicitud(prev => ({
                ...prev,
                cotizado: null
            }));
        }
    };

    const [openModalJustificacion, setOpenModalJustificacion] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [justificacion, setJustificacion] = useState('');

    const handleOpenModalJustificacion = (index) => {
        setSelectedIndex(index);
        setJustificacion(''); // limpiar justificación
        setOpenModalJustificacion(true);
    }

    const handleGuardarJustificacion = () => {
        const nuevasCotizaciones = cotizacionBase64.map((archivo, index) => {
            return {
                ...archivo,
                recomendada: index === selectedIndex,
                justificacion: index === selectedIndex ? justificacion : archivo.justificacion
            }
        });
        setCotizacionBase64(nuevasCotizaciones);
        setOpenModalJustificacion(false);
    }

    const handleCancelarJustificacion = () => {
        setOpenModalJustificacion(false);
        setSelectedIndex(null);
        setJustificacion('');
    }

    const hadleJustificacion = (valor, indexEvento) => {
        const nuevasCotizaciones = cotizacionBase64.map((archivo, index) => {
            return {
                ...archivo,
                justificacion: index === indexEvento ? valor : archivo.justificacion
            }
        });
        setCotizacionBase64(nuevasCotizaciones);

    }

    // const handleRecomendada = (indexSeleccionado, archivoSeleccionado) => {
    //     const nuevasCotizaciones = cotizacionBase64.map((archivo, index) => {
    //         return {
    //             ...archivo,
    //             recomendada: index === indexSeleccionado
    //         }
    //     });
    //     setCotizacionBase64(nuevasCotizaciones);
    // }

    const handledGuardaCotizacion = async (idSolicitud) => {
        const GuardarArchivos = cotizacionBase64
            .filter(archivo => archivo.id === 0)
            .map(archivo => ({
                ...archivo,
                id_solicitud_detalle: idSolicitud
            }));

        const ActualizarArchivos = cotizacionBase64
            .filter(archivo => archivo.id > 0)
            .map(archivo => ({
                ...archivo,
                id_solicitud_detalle: idSolicitud
            }));
        if (GuardarArchivos.length > 0) {
            await requests
                .postToken(CREATE_ARCHIVO_COTIZACIONES, GuardarArchivos) //### ** 
                .then((response) => {
                })
                .catch((error) => {
                    error.response.data.errors.forEach(element => {  //forEach Ya quedo
                        props.props.setMessageSnackBar(element, 'warning');
                        props.props.setCloseLoadingScreen();
                    });
                })
        }
        if (ActualizarArchivos.length > 0) {
            await requests
                .putToken(UPDATE_ARCHIVO_COTIZACIONES, ActualizarArchivos) //### ** 
                .then((response) => {
                })
                .catch((error) => {
                    error.response.data.errors.forEach(element => {  //forEach Ya quedo
                        props.props.setMessageSnackBar(element, 'warning');
                        props.props.setCloseLoadingScreen();
                    });
                })
        }

        return getAllSolicitudDetalle(listOptions1);
    }

    const [cotizacionSeleccionado, setCotizacionSeleccionado] = useState(null);
    const [modalAbiertoCotizacion, setModalAbiertoCotizacion] = useState(false);

    const verImagenCotizacion = (index, archivo) => {
        const tipoMime = archivo.archivo_cotizacion.split(';')[0].split(':')[1]; // extrae el tipo MIME
        setCotizacionSeleccionado({ ...archivo, tipoMime });
        setModalAbiertoCotizacion(true);
    };

    //// SOLICITAR INFORMCACION

    const [solicitarInfo, setSolicitarInfo] = useState(false);
    const SolicitarInformacion = () => {
        setSolicitarInfo(true);
        setDetalleSolicitud({
            ...detalleSolicitud,
            "cotizado": false
        });
        cambioEstatus();
    }

    const [alertEnviar, setAlertEnviar] = useState(false);
    const [numberEnviar, setNumberEnviar] = useState(0);
    const EnviarCotizacion = (numberItem) => {
        setNumberEnviar(numberItem);
        setAlertEnviar(true);
    }

    const cambioEstatus = () => {
        if (props.estatusSolicitud === 7) {
            props.setEstatusSolicitud(0);
            const estatus = {
                id_estatus: 8,
                id_solicitud: props._ticket
            };
            requests
                .postToken(CAMBIAR_ESTATUS, estatus)
                .then((response) => {
                })
                .catch((error) => {
                    error.response.data.errors.forEach(element => {  //forEach Ya quedo
                        props.props.setMessageSnackBar(element, 'warning');
                        props.props.setCloseLoadingScreen();
                    });
                });
        }
    }

    ///////////////////////////////////////COTIZACION GENERAL
    const [cotizacionGeneral, setCotizacionGeneral] = useState(false);
    const [changecotizacion, setChangeCotizacion] = useState(false)
    const [evetoTarget, setEventoTarget] = useState('null')
    const handleChange = (event) => {
        setEventoTarget(event.target.value)
        if (props.estatusCotizacionGlobla === true) {
            setChangeCotizacion(true)
        } else {
            const value = event.target.value;
            setCotizacionGeneral(value === "articulo");
        }
    };

    const [errorcotizacionGeneral, setErrorcotizacionGeneral] = useState({});
    const handleSubmitCotizacioGeneral = () => {

        validateSolicitudDetalle2(cotizacionGeneralBase64).then((resp) => {
            if (Object.keys(resp).length === 0) {
                handledGuardaCotizacionGeneral();
                cambioEstatus();
            }
            setErrorcotizacionGeneral(resp);
        });
    }

    const [cotizacionGeneralBase64, setCotizacionGeneralBase64] = useState([]);
    const handleCotizarGenaral = (event) => {
        const archivos = Array.from(event.target.files);
        const nuevosArchivos = [];

        const archivoSeleccionado = event.target.files[0];

        if (!archivoSeleccionado) {
            props.props.setMessageSnackBar('No se seleccionó ningún archivo.', 'warning');
            return;
        }

        const yaExiste = cotizacionGeneralBase64.some(file => file.nombre_cotizacion === archivoSeleccionado.name);
        if (!yaExiste) {
            archivos.forEach((archivo) => {
                if (archivo.size <= 1024 * 1024 * 5) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        nuevosArchivos.push({
                            id: 0,
                            archivo_cotizacion: reader.result,
                            nombre_cotizacion: archivo.name,
                            justificacion_general: "",
                            recomendada: false,
                            id_usuario: 1
                        });

                        if (nuevosArchivos.length === archivos.length) {
                            setCotizacionGeneralBase64((prev) => [...prev, ...nuevosArchivos]);
                        }
                    };
                    reader.readAsDataURL(archivo);
                } else {
                    props.props.setMessageSnackBar(`"${archivo.name}" excede 5MB y no fue agregado.`, 'warning');
                }
            });
        } else {
            props.props.setMessageSnackBar('El archivo ya existe y no será agregado', 'warning');
        }
        cambioEstatus();
    };

    const [deleteFileCotizacionGeneral, setDeleteFileCotizacionGeneral] = useState([]); // Aplicar el delete
    const eliminarCotizacionGeneral = async (index, archivo) => {
        let nuevaLista = cotizacionGeneralBase64.filter((_, i) => i !== index);

        if (archivo.id === 0) {
            setCotizacionGeneralBase64(nuevaLista);
        } else {
            setDeleteFileCotizacionGeneral(prev => [...prev, { id: archivo.id }]);
            setCotizacionGeneralBase64(nuevaLista);
        }
    };

    const [openModalJustificacionGeneral, setOpenModalJustificacionGeneral] = useState(false);
    const [selectedIndexGeneral, setSelectedIndexGeneral] = useState(null);
    const [justificacion_general, setJustificacionGeneral] = useState('');

    const handleOpenModalJustificacionGeneral = (index) => {
        setSelectedIndexGeneral(index);
        setJustificacionGeneral(''); // limpiar justificación
        setOpenModalJustificacionGeneral(true);
    }

    const handleGuardarJustificacionGeneral = () => {
        const nuevasCotizaciones = cotizacionGeneralBase64.map((archivo, index) => {
            return {
                ...archivo,
                recomendada: index === selectedIndexGeneral,
                justificacion_general: index === selectedIndexGeneral ? justificacion_general : archivo.justificacion_general
            }
        });
        setCotizacionGeneralBase64(nuevasCotizaciones);
        setOpenModalJustificacionGeneral(false);
    }

    const handleCancelarJustificacionGeneral = () => {
        setOpenModalJustificacionGeneral(false);
        setSelectedIndexGeneral(null);
        setJustificacionGeneral('');
    }

    const hadleJustificacionGeneral = (valor, indexEvento) => {
        const nuevasCotizaciones = cotizacionGeneralBase64.map((archivo, index) => {
            return {
                ...archivo,
                justificacion_general: index === indexEvento ? valor : archivo.justificacion_general
            }
        });
        setCotizacionGeneralBase64(nuevasCotizaciones);
    }

    const handledGuardaCotizacionGeneral = async () => { /// ver donde lo pongo :V
        const GuardarArchivos = cotizacionGeneralBase64
            .filter(archivo => archivo.id === 0)
            .map(archivo => ({
                ...archivo,
                id_solicitud: props._ticket
            }));

        const ActualizarArchivos = cotizacionGeneralBase64
            .filter(archivo => archivo.id > 0)
            .map(archivo => ({
                ...archivo,
                id_solicitud: props._ticket
            }));

        if (GuardarArchivos.length > 0) {
            props.props.setOpenLoadingScreen();
            await Promise.all([
                requests.postToken(DELETE_ARCHIVO_COTIZACIONES_GENERAL, deleteFileCotizacionGeneral),
                requests.postToken(CREATE_ARCHIVO_COTIZACIONES_GENERAL, GuardarArchivos)
            ]).then(([deleteResponse, addResponse]) => {
                props.setEstatusCotizacionGlobal(true);
                props.getAll(props.props.ticket, props.valoridDep)
            }).catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.props.setMessageSnackBar(element, 'warning');
                    props.props.setCloseLoadingScreen();
                });
            }).finally(() => {
                props.props.setCloseLoadingScreen();
            });
        }
        if (ActualizarArchivos.length > 0) {
            props.props.setOpenLoadingScreen();
            await Promise.all([
                requests.postToken(DELETE_ARCHIVO_COTIZACIONES_GENERAL, deleteFileCotizacionGeneral),
                requests.putToken(UPDATE_ARCHIVO_COTIZACIONES_GENERAL, ActualizarArchivos)
            ]).then(([deleteResponse, editResponse]) => {
                props.setEstatusCotizacionGlobal(true);
                props.getAll(props.props.ticket, props.valoridDep)
            }).catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.props.setMessageSnackBar(element, 'warning');
                    props.props.setCloseLoadingScreen();
                });
            }).finally(() => {
                props.props.setCloseLoadingScreen();
            });
        }
        if (ActualizarArchivos.length <= 0) {
            props.props.setOpenLoadingScreen();
            await Promise.all([
                requests.postToken(DELETE_ARCHIVO_COTIZACIONES_GENERAL, deleteFileCotizacionGeneral),
            ]).then(([deleteResponse]) => {
                props.setEstatusCotizacionGlobal(true);
                props.getAll(props.props.ticket, props.valoridDep)
            }).catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.props.setMessageSnackBar(element, 'warning');
                    props.props.setCloseLoadingScreen();
                });
            }).finally(() => {
                props.props.setCloseLoadingScreen();
            });
        }
    }

    const [cotizacionSeleccionadoGeneral, setCotizacionSeleccionadoGeneral] = useState(null);
    const [modalAbiertoCotizacionGeneral, setModalAbiertoCotizacionGeneral] = useState(false);

    const verImagenCotizacionGeneral = (index, archivo) => {
        const tipoMime = archivo.archivo_cotizacion.split(';')[0].split(':')[1]; // extrae el tipo MIME
        setCotizacionSeleccionadoGeneral({ ...archivo, tipoMime });
        setModalAbiertoCotizacionGeneral(true);
    };

    return (
        <div>
            <Grid container justifyContent="right" sx={{ paddingRight: 4, margin: 2 }}>

                <FormControl sx={{ minWidth: 220 }} size="small">
                    <InputLabel id="cotizacion-select-label">Tipo de Cotización</InputLabel>
                    <Select
                        labelId="cotizacion-select-label"
                        id="cotizacion-select"
                        value={cotizacionGeneral ? "articulo" : "general"}
                        label="Tipo de Cotización"
                        onChange={handleChange}
                    >
                        <MenuItem value="general">Cotización por artículo</MenuItem>
                        <MenuItem value="articulo">Cotización General</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Box
                sx={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: 2,
                    margin: 2,
                    maxHeight: '300px', // límite de altura
                    overflow: 'auto',  // scroll vertical interno
                }}
            >
                <Table size="small">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell align={'center'}><label className='textLabel3'>Clave</label></StyledTableCell>
                            <StyledTableCell align={'center'}><label className='textLabel3'>Producto</label></StyledTableCell>
                            <StyledTableCell align={'center'}><label className='textLabel3'>Descripción</label></StyledTableCell>
                            <StyledTableCell align={'center'}><label className='textLabel3'>Cantidad</label></StyledTableCell>
                            <StyledTableCell align={'center'}><label className='textLabel3'>Marca</label></StyledTableCell>
                            <StyledTableCell align={'center'}><label className='textLabel3'>Modelo</label></StyledTableCell>
                            <StyledTableCell align={'center'}><label className='textLabel3'>Observación</label></StyledTableCell>
                            <StyledTableCell align={'center'}><label className='textLabel3'>Fecha de creación</label></StyledTableCell>
                            {cotizacionGeneral != true ? (
                                <StyledTableCell align={'center'}><label className='textLabel3'>Estatus Cotizado</label></StyledTableCell>
                            ) : (null)}
                            <StyledTableCell align={'center'}><label className='textLabel3'>Acción</label></StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {listSolicitudDetalle.map((row, i) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell align={'right'}><label className='textLabel4'>{row.producto.clave_producto}</label></StyledTableCell>
                                <StyledTableCell align={'center'}><label className='textLabel4'>{row.descripcion_producto}</label></StyledTableCell>
                                <StyledTableCell align={'center'}><Box sx={{ textAlign: 'justify' }}><label className='textLabel4'> {typeof row.descripcion === 'string' ? row.descripcion.length > 300 ? row.descripcion.substring(0, 300) + '...' : row.descripcion : ''}</label></Box></StyledTableCell>
                                <StyledTableCell align={'right'}><label className='textLabel4'>{row.cantidad}</label></StyledTableCell>
                                <StyledTableCell align={'center'}><label className='textLabel4'>{row.marca}</label></StyledTableCell>
                                <StyledTableCell align={'center'}><label className='textLabel4'>{row.modelo}</label></StyledTableCell>
                                <StyledTableCell align={'center'}><Box sx={{ textAlign: 'justify' }}><label className='textLabel4'>{typeof row.observacion === 'string' ? row.observacion.length > 300 ? row.observacion.substring(0, 300) + '...' : row.observacion : ''}</label></Box></StyledTableCell>
                                <StyledTableCell align={'center'} sx={{ whiteSpace: 'nowrap' }}><label className='textLabel4'>{row.created_at}</label></StyledTableCell>
                                {cotizacionGeneral != true ? (
                                    <StyledTableCell align={'center'} sx={{ whiteSpace: 'nowrap' }}><label className='textLabel4'>{row.cotizado == null ? 'Sin revisión' : row.cotizado ? 'Cotizado' : 'Con observaciones'}</label></StyledTableCell>
                                ) : (null)}
                                <StyledTableCell>
                                    <IconButton
                                        onClick={() => editarDetalle(row, i)}
                                    >
                                        <FindInPageIcon sx={{ color: "#0066CC" }} />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
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
                    <Grid item xs={2}>
                        <Autocomplete
                            disabled
                            options={filterOptions1}
                            getOptionLabel={(option) => {
                                const duplicados = filterOptions1.filter(o => o.clave_producto?.toLowerCase() === option.clave_producto?.toLowerCase());
                                if (duplicados.length > 1) {
                                    const index = duplicados.findIndex(o => o.id === option.id);
                                    return `${option.clave_producto || 'N/A'} (${index + 1})`;
                                }
                                return option.clave_producto || 'N/A';
                            }}
                            renderInput={(params) =>
                                <TextFieldGeneral
                                    idprops={true}
                                    error={(errorSolicitudDetalle.id ? (true) : (false))}
                                    label={"Articulos"}
                                    className="inputTextSize100disabled"
                                    {...params}
                                    placeholder="Buscar.."
                                />}
                            value={(filterOptions1?.find(option => option.id === articulosSet.id)) || null}
                            onChange={(event, value) =>
                                handleArticulos({ target: { name: 'id', value: value?.id } })
                            }
                            noOptionsText="No hay opciones"
                        />
                        {errorSolicitudDetalle.id && (
                            <span className="label_Quest_Validaciones">{errorSolicitudDetalle.id}</span>
                        )}
                    </Grid>
                    <Grid item xs={7}>
                        <TextFieldGeneral
                            idprops={true}
                            error={(errorSolicitudDetalle.descripcion_producto ? (true) : (false))}
                            className="inputTextSize100disabled"
                            //multiline
                            //minRows={2}
                            label="Descripción del articulo"
                            value={articulosSet.descripcion_producto}
                            name='descripcion_producto'
                            onChange={handleArticulos}
                        />
                        {errorSolicitudDetalle.descripcion_producto && (
                            <span className="label_Quest_Validaciones">{errorSolicitudDetalle.descripcion_producto}</span>
                        )}
                    </Grid>
                    <Grid item xs={2}>
                        <Autocomplete
                            disabled
                            options={filterOptions2}
                            getOptionLabel={(option) => option.clave_unidad_medida}
                            renderInput={(params) =>
                                <TextFieldGeneral
                                    idprops={true}
                                    className="inputTextSize100disabled"
                                    label={"Unidad Medida"}
                                    {...params}
                                    placeholder="Buscar.."
                                />}
                            value={filterOptions2?.find(option => option.id === articulosSet.id_unidad_medida) || null}
                            onChange={(event, value) =>
                                handleArticulos({ target: { name: 'id_unidad_medida', value: value?.id } })
                            }
                            noOptionsText="No hay opciones"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextFieldNumber
                            idprops={true}
                            error={(errorSolicitudDetalle.cantidad ? (true) : (false))}
                            className="inputTextSize100disabled"
                            label="cantidad"
                            value={detalleSolicitud.cantidad}
                            name='cantidad'
                            onChange={handleDetalleSolicitudCantidad}
                        />
                        {errorSolicitudDetalle.cantidad && (
                            <span className="label_Quest_Validaciones">{errorSolicitudDetalle.Rol}</span>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <TextFieldGeneral
                            idprops={true}
                            error={(errorSolicitudDetalle.descripcion ? (true) : (false))}
                            className="inputTextSize100disabled"
                            label="Descripción de la Solicitud"
                            value={detalleSolicitud.descripcion}
                            name='descripcion'
                            onChange={handleDetalleSolicitud}
                        />
                        {errorSolicitudDetalle.descripcion && (
                            <span className="label_Quest_Validaciones">{errorSolicitudDetalle.descripcion}</span>
                        )}
                    </Grid>
                    {reqMarcaModelo == false ? (null) : (
                        <>
                            <Grid item xs={2}>
                                <TextFieldGeneral
                                    idprops={true}
                                    error={(errorSolicitudDetalle.marca ? (true) : (false))}
                                    className="inputTextSize100disabled"
                                    label="Marca"
                                    value={detalleSolicitud.marca}
                                    name='marca'
                                    onChange={handleDetalleSolicitud}
                                />
                                {errorSolicitudDetalle.marca && (
                                    <span className="label_Quest_Validaciones">{errorSolicitudDetalle.marca}</span>
                                )}
                            </Grid>
                            <Grid item xs={2}>
                                <TextFieldGeneral
                                    idprops={true}
                                    error={(errorSolicitudDetalle.modelo ? (true) : (false))}
                                    className="inputTextSize100disabled"
                                    label="Modelo y/o No Parte"
                                    value={detalleSolicitud.modelo}
                                    name='modelo'
                                    onChange={handleDetalleSolicitud}
                                />
                                {errorSolicitudDetalle.modelo && (
                                    <span className="label_Quest_Validaciones">{errorSolicitudDetalle.modelo}</span>
                                )}
                            </Grid>
                        </>
                    )}

                    <Grid container item spacing={2} xs={8}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={filterOptions3}
                                getOptionLabel={(option) => option.clave_gpo_familia + "/" + option.descripcion_gpo_familia}
                                disabled
                                renderInput={(params) =>
                                    <TextFieldGeneral
                                        idprops={true}
                                        error={(errorSolicitudDetalle.id_gpo_familia ? (true) : (false))}
                                        label={"Grupo de artículos"}
                                        className="inputTextSize100disabled"
                                        {...params}
                                        placeholder="Buscar.."
                                    />}
                                value={filterOptions3?.find(option => option.id === articulosSet.id_gpo_familia) || null}
                                onChange={(event, value) =>
                                    handleArticulos({ target: { name: 'id_gpo_familia', value: value?.id } })
                                }
                                noOptionsText="No hay opciones"
                            />
                            {errorSolicitudDetalle.id_gpo_familia && (
                                <span className="label_Quest_Validaciones">{errorSolicitudDetalle.id_gpo_familia}</span>
                            )}
                        </Grid>
                        {/* <Grid item xs={9}>
                            <TextFieldGeneral
                                idprops={true}
                                className="inputTextSize100disabled"
                                //multiline
                                //minRows={2}
                                label="Descripción de Grupo Familia"
                                value={articulosSet.descripcion_gpo_familia}
                                name='descripcion_gpo_familia'
                                onChange={handleArticulos}

                            />
                        </Grid> */}
                    </Grid>

                    <Grid item xs={12}>
                        <TextFieldGeneral
                            idprops={true}
                            error={(errorSolicitudDetalle.observacion ? (true) : (false))}
                            className="inputTextSize100disabled"
                            //multiline
                            //minRows={2}
                            label="Observación de la Solicitud"
                            value={detalleSolicitud.observacion}
                            name='observacion'
                            onChange={handleDetalleSolicitud}
                        />
                        {errorSolicitudDetalle.observacion && (
                            <span className="label_Quest_Validaciones">{errorSolicitudDetalle.observacion}</span>
                        )}
                    </Grid>
                    <Grid container item >
                        <Grid item xs={12}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography variant="body2">
                                        Número de archivos adjuntado por el usuario: {archivosBase64.length}
                                    </Typography>
                                </Box>
                            </Grid>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 4 }}>
                                {archivosBase64.map((archivo, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: '#f0f0f0',
                                        padding: '4px 8px',
                                        borderRadius: 6,
                                        fontSize: '0.8rem'
                                    }}>
                                        {archivo.nombre}
                                        <IconButton size="small" onClick={() => verImagen(index, archivo)}>
                                            <VisibilityIcon fontSize="small" sx={{ color: "#0066CC" }} />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            {detalleSolicitud.id > 0 && cotizacionGeneral == false ? (
                <>
                    <Box
                        sx={{
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: 2,
                            margin: 2,
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid container item>
                                <Grid item xs={9}>
                                    <Grid item xs={3}>
                                        <Button
                                            disabled={detalleSolicitud.cotizado === false ? true : false}
                                            variant="outlined"
                                            component="label"
                                            fullWidth
                                            sx={
                                                detalleSolicitud.cotizado === false ? (
                                                    { backgroundColor: 'grey', color: '#000', '&:hover': { backgroundColor: 'grey' } }
                                                ) : (
                                                    { backgroundColor: '#97d95c', color: '#000', '&:hover': { backgroundColor: '#85c850' } }
                                                )
                                            }
                                        >
                                            Adjuntar cotizaciones
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png,.jpeg,.eml,.msg"
                                                onChange={handleCotizar}
                                            />
                                        </Button>
                                    </Grid>

                                    <Grid item xs={9}>
                                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 4 }}>
                                            {cotizacionBase64.map((archivo, index) => (
                                                <div key={index} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    background: '#f0f0f0',
                                                    padding: '4px 8px',
                                                    borderRadius: 6,
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {archivo.nombre_cotizacion}
                                                    <Tooltip title="Ver cotización">
                                                        <IconButton size="small" onClick={() => verImagenCotizacion(index, archivo)}>
                                                            <VisibilityIcon fontSize="small" sx={{ color: "#0066CC" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar cotización">
                                                        <IconButton size="small" onClick={() => eliminarCotizacion(index, archivo)}>
                                                            <DeleteForeverIcon fontSize="small" sx={{ color: "red" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Asignar como cotización recomendado">
                                                        <IconButton disabled={archivo.recomendada == true ? true : false} size="small" onClick={() => handleOpenModalJustificacion(index)}>
                                                            <StarIcon fontSize="small" sx={{ color: archivo.recomendada == true ? "#FFCC00" : "#0066CC" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            ))}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3} spacing={1}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            disabled={detalleSolicitud.cotizado === true ? true : false}
                                            onClick={SolicitarInformacion}
                                            //className="btn-aceptar"
                                            variant="contained"
                                            sx={
                                                detalleSolicitud.cotizado === true ? (
                                                    { backgroundColor: 'grey', color: '#000', '&:hover': { backgroundColor: 'grey' } }
                                                ) : (
                                                    { backgroundColor: '#97d95c', color: '#000', '&:hover': { backgroundColor: '#85c850' } }
                                                )
                                            }
                                        >
                                            {'Solicitar información adicional a usuario'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} spacing={2} alignItems="center" >
                                {cotizacionBase64.map((archivo, index) => (
                                    archivo.recomendada === true && (
                                        <>
                                            <TextFieldGeneral2
                                                error={(errorSolicitudDetalle.justificacion ? (true) : (false))}
                                                label="Justificación de la cotización recomendada"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={cotizacionBase64[index].justificacion}
                                                onChange={(e) => hadleJustificacion(e.target.value, index)}
                                            />
                                            {errorSolicitudDetalle.justificacion && (
                                                <span className="label_Quest_Validaciones">{errorSolicitudDetalle.justificacion}</span>
                                            )}
                                        </>

                                    )
                                ))}
                            </Grid>
                        </Grid>
                        {detalleSolicitud.cotizado === true ? (
                            <center>
                                <Grid container sx={{ marginTop: 1 }} justifyContent="center">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={cotizacionGeneral == true ? true : false}
                                        className={cotizacionGeneral == true ? "btn-aceptar-disabled" : "btn-aceptar"}
                                        variant={"contained"}
                                        sx={{ mr: 1 }}
                                    >
                                        Guardar
                                    </Button>
                                </Grid>
                            </center>
                        ) : (null)}
                    </Box>
                </>
            ) : null}

            {cotizacionGeneral == true ? (
                <>
                    <Box
                        sx={{
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: 2,
                            margin: 2,
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid container item>
                                <Grid item xs={9}>
                                    <Grid item xs={3}>
                                        <Button
                                            disabled={detalleSolicitud.cotizado === false ? true : false}
                                            variant="outlined"
                                            component="label"
                                            fullWidth
                                            sx={
                                                detalleSolicitud.cotizado === false ? (
                                                    { backgroundColor: 'grey', color: '#000', '&:hover': { backgroundColor: 'grey' } }
                                                ) : (
                                                    { backgroundColor: '#97d95c', color: '#000', '&:hover': { backgroundColor: '#85c850' } }
                                                )
                                            }
                                        >
                                            Adjuntar cotización general
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png,.jpeg,.eml,.msg"
                                                onChange={handleCotizarGenaral}
                                            />
                                        </Button>
                                    </Grid>

                                    <Grid item xs={9}>
                                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 4 }}>
                                            {cotizacionGeneralBase64.map((archivo, index) => (
                                                <div key={index} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    background: '#f0f0f0',
                                                    padding: '4px 8px',
                                                    borderRadius: 6,
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {archivo.nombre_cotizacion}
                                                    <Tooltip title="Ver cotización">
                                                        <IconButton size="small" onClick={() => verImagenCotizacionGeneral(index, archivo)}>
                                                            <VisibilityIcon fontSize="small" sx={{ color: "#0066CC" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar cotización">
                                                        <IconButton size="small" onClick={() => eliminarCotizacionGeneral(index, archivo)}>
                                                            <DeleteForeverIcon fontSize="small" sx={{ color: "red" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Asignar como cotización recomendado">
                                                        <IconButton disabled={archivo.recomendada == true ? true : false} size="small" onClick={() => handleOpenModalJustificacionGeneral(index)}>
                                                            <StarIcon fontSize="small" sx={{ color: archivo.recomendada == true ? "#FFCC00" : "#0066CC" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            ))}
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} spacing={2} alignItems="center" >
                                {cotizacionGeneralBase64.map((archivo, index) => (
                                    archivo.recomendada === true && (
                                        <>
                                            <TextFieldGeneral2
                                                error={(errorcotizacionGeneral.justificacion_general ? (true) : (false))}
                                                label="Justificación de la cotización recomendada"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={cotizacionGeneralBase64[index].justificacion_general}
                                                onChange={(e) => hadleJustificacionGeneral(e.target.value, index)}
                                            />
                                            {errorcotizacionGeneral.justificacion_general && (
                                                <span className="label_Quest_Validaciones">{errorcotizacionGeneral.justificacion_general}</span>
                                            )}
                                        </>

                                    )
                                ))}
                            </Grid>
                        </Grid>
                        {cotizacionGeneralBase64.length > 0 ? (
                            <center>
                                <Grid container sx={{ marginTop: 1 }} justifyContent="center">
                                    <Button
                                        onClick={handleSubmitCotizacioGeneral}
                                        disabled={cotizacionGeneral == true ? false : true}
                                        className={cotizacionGeneral == true ? "btn-aceptar" : "btn-aceptar-disabled"}
                                        variant={"contained"}
                                        sx={{ mr: 1 }}
                                    >
                                        Guardar
                                    </Button>
                                </Grid>
                            </center>
                        ) : (null)}
                    </Box>
                </>
            ) : null}
            <center>
                <Grid container sx={{ marginTop: 1 }} justifyContent="center">
                    <Button
                        onClick={handleCancelar}
                        className="btn-cancelar"
                        ariant={"contained"}
                        sx={{ mr: 1 }}
                    >
                        Regresar
                    </Button>
                    {cotizacionGeneral == true ? (
                        <Button
                            //disabled={props.estatusCotizacionGlobla != true ? true : false}
                            //className={props.estatusCotizacionGlobla != true ? "btn-aceptar-disabled" : "btn-aceptar"}
                            className={"btn-aceptar"}
                            onClick={() => EnviarCotizacion(2)}
                            variant={"contained"}
                        >
                            Enviar
                        </Button>
                    ) : (
                        <Button
                            //disabled={props.estatusCotizacionGlobla != true ? true : false}
                            //className={props.estatusCotizacionGlobla != true ? "btn-aceptar-disabled" : "btn-aceptar"}
                            className={"btn-aceptar"}
                            onClick={() => EnviarCotizacion(1)}
                            variant={"contained"}
                        >
                            Enviar
                        </Button>
                    )}
                </Grid>
            </center>
            <AlertaEnviarCotizacion
                props={props}
                open={alertEnviar}
                close={() => setAlertEnviar(false)}
                handleEnviar={handleEnviar}
            />

            <AlertaChangeCotizacion
                props={props}
                open={changecotizacion}
                close={() => setChangeCotizacion(false)}
                setCotizacionGeneral={setCotizacionGeneral}
                evetoTarget={evetoTarget}
                getAllSolicitudDetalle={getAllSolicitudDetalle}
                handlecancelar={handlecancelar}
            />


            <AlertaDocumentoCotizacion
                props={props}
                open={modalAbiertoCotizacion}
                close={() => setModalAbiertoCotizacion(false)}
                cotizacionSeleccionado={cotizacionSeleccionado}
            />
            <AlertaDocumentoCotizacionGeneral
                props={props}
                open={modalAbiertoCotizacionGeneral}
                close={() => setModalAbiertoCotizacionGeneral(false)}
                cotizacionSeleccionado={cotizacionSeleccionadoGeneral}
            />

            <AlertaDocumento
                props={props}
                open={modalAbierto}
                close={() => setModalAbierto(false)}
                archivoSeleccionado={archivoSeleccionado}
            />

            <AlertaSolicitarInformacion
                props={props}
                open={solicitarInfo}
                close={() => setSolicitarInfo(false)}

                setDetalleSolicitud={setDetalleSolicitud}
                detalleSolicitud={detalleSolicitud}
                //handleSubmit={handleSubmit}
                handleEditar={handleEditar}
                handlecancelar={handlecancelar}
            />

            <Modal open={openModalJustificacion} onClose={handleCancelarJustificacion}>
                <Box sx={{ width: 400, p: 3, bgcolor: 'white', mx: 'auto', my: '20%' }}>
                    <center>
                        <Typography variant="h6">Agregar justificación de la cotización recomenda</Typography>
                    </center>
                    <br />
                    <TextFieldGeneral
                        label="Justificación"
                        fullWidth
                        multiline
                        rows={4}
                        value={justificacion}
                        onChange={(e) => setJustificacion(e.target.value)}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            disabled={justificacion == "" ? true : false}
                            className={justificacion == "" ? "btn-aceptar-disabled" : "btn-aceptar"}
                            onClick={handleGuardarJustificacion} sx={{ mr: 1 }}>Guardar</Button>
                        <Button className="btn-cancelar" onClick={handleCancelarJustificacion} sx={{ mr: 1 }}>Cancelar</Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={openModalJustificacionGeneral} onClose={handleCancelarJustificacionGeneral}>
                <Box sx={{ width: 400, p: 3, bgcolor: 'white', mx: 'auto', my: '20%' }}>
                    <center>
                        <Typography variant="h6">Agregar justificación de la cotización general recomenda</Typography>
                    </center>
                    <br />
                    <TextFieldGeneral
                        label="Justificación"
                        fullWidth
                        multiline
                        rows={4}
                        value={justificacion_general}
                        onChange={(e) => setJustificacionGeneral(e.target.value)}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            disabled={justificacion_general == "" ? true : false}
                            className={justificacion_general == "" ? "btn-aceptar-disabled" : "btn-aceptar"}
                            onClick={handleGuardarJustificacionGeneral} sx={{ mr: 1 }}>Guardar</Button>
                        <Button className="btn-cancelar" onClick={handleCancelarJustificacionGeneral} sx={{ mr: 1 }}>Cancelar</Button>
                    </Box>
                </Box>
            </Modal>

        </div >
    )
}

export default DetalleSolicitud