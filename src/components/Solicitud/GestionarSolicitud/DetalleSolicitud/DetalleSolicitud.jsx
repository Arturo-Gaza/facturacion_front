import {
    Autocomplete,
    Box,
    Button, Grid,
    IconButton,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
    CREATE_ARCHIVO, CREATE_TAB_SOLICITUDES_DETALLE, DELETE_ARCHIVO,
    GET_ARCHIVO_BY_ID_SOLICITUD_DETALLE, GET_CAT_PRODUCTOSBY_ID_CATEGORIA,
    GET_LIST_CAT_GRUPO_FAMILIA, GET_LIST_CAT_UNIDAD_MEDIDA, GET_TAB_SOLICITUDES_DETALLE_BY_ID_SOLICITUD,
    UPDATE_TAB_SOLICITUDES_DETALLE, DELETE_TAB_SOLICITUDES_DETALLE,
    CAMBIAR_ESTATUS
} from '../../../../Constants/ApiConstants';
import { TextFieldGeneral, TextFieldGeneral2, TextFieldNumber } from '../../../../Styles/TextField/TextField';
import requests from '../../../AxiosCalls/AxiosCallsLocal';

import EditNoteIcon from '@mui/icons-material/EditNote';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { StyledTableCell, StyledTableRow } from '../../../../Styles/Table/Table';
import moment from 'moment';
import FindInPageIcon from '@mui/icons-material/FindInPage';

import AlertaDocumento from '../../../../alerts/_TKSAlertDocumento';
import AlertObserDetalle from '../../../../alerts/_TKSAlertObserDetalle';
import AlertCotizacionDetalle from '../../../../alerts/_TKSAlertCotizacionDetalle';
import AlertCotizacionGeneralDetalle from '../../../../alerts/_TKSAlertCotizacionGeneralDetalle';
import { validateSolicitudDetalle } from '../../../../Utils/Validacion/solicitudes';

import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation } from 'react-router-dom';

import NuevoProducto from '../../../Catalogos/Actions/4_Producto'; //###

const DetalleSolicitud = (props) => {
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

    const [datosIniciales, setDatosIniciales] = useState({
        clave_producto: "",
        descripcion_producto: "",
        id_categoria: 0,
        id_tipo: 0,
        id_gpo_familia: 1

    });


    const [reqMarcaModelo, setReqMarcaModelo] = useState(false)

    useEffect(() => {
        if (props.solicitudTabla.id_categoria != 0) {
            let idCategoria = props.solicitudTabla.id_categoria;
            let idTipo = props.listOptions1.filter(categoria => categoria.id == idCategoria)[0].id_tipo;
            setDatosIniciales(prev => ({
                ...prev,
                id_categoria: idCategoria
            }));
            setDatosIniciales(prev => ({
                ...prev,
                id_tipo: idTipo
            }));
            setReqMarcaModelo(props.listOptions2.filter(tipo => tipo.id == idTipo)[0].req_marca_modelo);

            getAll(idCategoria, props._ticket);

        }
    }, [props._Tipo, props.solicitudTabla.id_categoria]);
    let solicitudDetalle = props.detalles || [];
    const getAllSolicitudDetalle = async (listaArticulos) => {
        //props.props.setOpenLoadingScreen();
        try {



            setListSolicitudDetalle(solicitudDetalle);

            const enviar = solicitudDetalle.length > 0 &&
                solicitudDetalle
                    .filter(detalle => detalle.habilitado === true)
                    .every(detalle => detalle.cotizado === null || detalle.cotizado === true);

            props.setEnviar(enviar);

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

            setLoadProdcuto(true);
            // FiltrosExist(solicitudDetalle, listaArticulos, 0); // podrías reactivarlo si lo usas

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

    const [loadProduct, setLoadProdcuto] = useState(false)
    const getAll = async (idCategoria, idSolicitud, id = null) => {
        if (estatusCrear == true) {
            props.props.setOpenLoadingScreen();
        }

        try {
            // Si estas dos no cambian, deberías obtenerlas solo una vez en toda la app
            const [productosResponse,] = await Promise.all([
                requests.getToken(GET_CAT_PRODUCTOSBY_ID_CATEGORIA + idCategoria),

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
            const unidadMedidaListSinDuplicados = props.unidadesMedida.filter(item => {
                const key = (item.clave_unidad_medida || '').toLowerCase();
                if (seenUnidades.has(key)) return false;
                seenUnidades.add(key);
                return true;
            });

            const seenGrupos = new Set();
            const grupoFamiliaListSinDuplicados = props.gpoFamilia.filter(item => {
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

            // Lógica adicional si estás editando
            if (id) {
                handleArticulosModal(id, articuloListSinDuplicados);
            }

            // Ejecuta la carga de detalles después (sin bloquear la vista)
            setTimeout(() => getAllSolicitudDetalle(articuloListSinDuplicados), 100);

        } catch (error) {
            props.props.setMessageSnackBar(error.message, 'warning');
        } finally {
            if (estatusCrear == true) {
                props.props.setCloseLoadingScreen();
            }
        }
    };

    const handleDetalleSolicitud = (e) => {
        const { name, value } = e.target;

        const updatedSolicitud = {
            ...detalleSolicitud,
            [name]: value,
        };

        setDetalleSolicitud(updatedSolicitud);
        if (errorGuardar === true) {
            validateSolicitudDetalle(updatedSolicitud, articulosSet, reqMarcaModelo).then((resp) => {
                setErrorSolicitudDetalle(resp);
            });
        }

    };

    const handleDatosInicales = (name, value) => {

        setDatosIniciales({
            ...datosIniciales,
            [name]: value,
        });
    };
    const handleArticulosModal = (value, listOptions) => {

        setArticulosSet({
            ...articulosSet,
            ["id"]: value,
        });
        ListFilterOptions(listOptions, listOptions2, listOptions3, "id", value, detalleSolicitud)
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
        const { name, value } = e.target;

        const updatedArticulos = {
            ...articulosSet,
            [name]: value,
        };
        if (errorGuardar === true) {
            validateSolicitudDetalle(detalleSolicitud, updatedArticulos, reqMarcaModelo).then((resp) => {
                setErrorSolicitudDetalle(resp);
            });
        }

        setArticulosSet(updatedArticulos);
        ListFilterOptions(listOptions1, listOptions2, listOptions3, name, value, detalleSolicitud)
    };

    const ListFilterOptions = (articuloList, unidadMedidaList, grupoFamiliaList, nombre, valor, validacionSolicitud) => {
        if (nombre === 'id') {
            if (valor !== undefined) {
                let filteropstions1 = articuloList.filter(articulos => articulos.id == valor);
                let filteropstions2 = unidadMedidaList.filter(unidadMedida => unidadMedida.id == filteropstions1[0].id_unidad_medida);
                let filteropstions3 = grupoFamiliaList.filter(grupoFamilia => grupoFamilia.id == filteropstions1[0].id_gpo_familia);

                const newArticulosSet = {
                    ...articulosSet,
                    id: valor,
                    descripcion_producto: filteropstions1[0].descripcion_producto,
                    id_unidad_medida: filteropstions1[0].id_unidad_medida,
                    id_moneda: 0,
                    id_gpo_familia: filteropstions1[0].id_gpo_familia,
                    descripcion_gpo_familia: grupoFamiliaList[0].descripcion_gpo_familia,
                };

                const newDetalleSolicitud = {
                    ...detalleSolicitud,
                    id_producto: valor,
                };

                setFilterOptions1(filteropstions1);
                setFilterOptions2(filteropstions2);
                setFilterOptions3(filteropstions3);
                setArticulosSet(newArticulosSet);
                setDetalleSolicitud(newDetalleSolicitud);
                if (errorGuardar === true) {
                    validateSolicitudDetalle(validacionSolicitud, newArticulosSet, reqMarcaModelo).then((resp) => {
                        setErrorSolicitudDetalle(resp);
                    });
                }
            } else {
                setFilterOptions1(listOptions1);
                setFilterOptions2(listOptions2);
                setFilterOptions3(listOptions3);

                const newArticulosSet = {
                    ...articulosSet,
                    id: 0,
                    descripcion_producto: "",
                    id_unidad_medida: 0,
                    id_moneda: 0,
                    id_gpo_familia: 0,
                    descripcion_gpo_familia: "",
                };

                setArticulosSet(newArticulosSet);
                if (errorGuardar === true) {
                    validateSolicitudDetalle(validacionSolicitud, newArticulosSet, reqMarcaModelo).then((resp) => {
                        setErrorSolicitudDetalle(resp);
                    });
                }
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
                        const newArticulosSet = {
                            ...articulosSet,
                            id: filteropstions1[0].id,
                            descripcion_producto: valor,
                            id_unidad_medida: filteropstions1[0].id_unidad_medida,
                            id_moneda: 0,
                            id_gpo_familia: filteropstions1[0].id_gpo_familia,
                            descripcion_gpo_familia: grupoFamiliaList[0].descripcion_gpo_familia,
                        };

                        const newDetalleSolicitud = {
                            ...detalleSolicitud,
                            id_producto: filteropstions1[0].id,
                        };

                        setArticulosSet(newArticulosSet);
                        setDetalleSolicitud(newDetalleSolicitud);

                        if (errorGuardar === true) {
                            validateSolicitudDetalle(validacionSolicitud, newArticulosSet, reqMarcaModelo).then((resp) => {
                                setErrorSolicitudDetalle(resp);
                            });
                        }
                    } else {
                        const newArticulosSet = {
                            ...articulosSet,
                            id: 0,
                            descripcion_producto: valor,
                            id_unidad_medida: 0,
                            id_moneda: 0,
                            id_gpo_familia: 0,
                            descripcion_gpo_familia: "",
                        };

                        setArticulosSet(newArticulosSet);
                        if (errorGuardar === true) {
                            validateSolicitudDetalle(validacionSolicitud, newArticulosSet, reqMarcaModelo).then((resp) => {
                                setErrorSolicitudDetalle(resp);
                            });
                        }
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

                const newArticulosSet = {
                    ...articulosSet,
                    id: 0,
                    descripcion_producto: valor,
                    id_unidad_medida: 0,
                    id_moneda: 0,
                    id_gpo_familia: 0,
                    descripcion_gpo_familia: "",
                };

                setArticulosSet(newArticulosSet);
                if (errorGuardar === true) {
                    validateSolicitudDetalle(validacionSolicitud, newArticulosSet, reqMarcaModelo).then((resp) => {
                        setErrorSolicitudDetalle(resp);
                    });
                }
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

                const newArticulosSet = {
                    ...articulosSet,
                    id: 0,
                    descripcion_producto: "",
                    id_unidad_medida: 0,
                    id_moneda: 0,
                    id_gpo_familia: valor,
                    descripcion_gpo_familia: "",
                };

                setArticulosSet(newArticulosSet);
                if (errorGuardar === true) {
                    validateSolicitudDetalle(validacionSolicitud, newArticulosSet, reqMarcaModelo).then((resp) => {
                        setErrorSolicitudDetalle(resp);
                    });
                }
            }
        }
    }


    const handleGuardar = async () => {
        props.props.setOpenLoadingScreen();
        await Promise.all([
            requests.postToken(CREATE_TAB_SOLICITUDES_DETALLE, detalleSolicitud),
            requests.postToken(DELETE_ARCHIVO, deleteFile)
        ]).then(([createSDResponse]) => {
            solicitudDetalle = createSDResponse.data.data2;
            handlecancelar();
            let createSolicitudDetalle = createSDResponse.data.data;
            return handledGuardaFile(createSolicitudDetalle.id);
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
            requests.postToken(DELETE_ARCHIVO, deleteFile)
        ]).then(([editSDResponse, deleteResponse]) => {
            solicitudDetalle = editSDResponse.data.data2;
            handlecancelar();
            return handledGuardaFile(detalleSolicitud.id);
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
            id: 0,
            id_producto: 0,
            id_solicitud: props._ticket,
            descripcion: "",
            marca: "",
            modelo: "",
            cantidad: 1,
            observacion: "",
            habilitado: true,
        });
        setFilterOptions1(listOptions1);
        setFilterOptions2(listOptions2);
        setFilterOptions3(listOptions3);
        setArchivosBase64([]);
        setErrorSolicitudDetalle({})
        setErrorGuardar(false);
        setBloqueoEdit(false);
        //FiltrosExist(listSolicitudDetalle, listOptions1, 0);
    }
    const [errorGuardar, setErrorGuardar] = useState(false)
    const [errorSolicitudDetalle, setErrorSolicitudDetalle] = useState({});
    const handleSubmit = () => {
        const yaExiste = listSolicitudDetalle.some(detalle =>
            detalle.id_producto === detalleSolicitud.id_producto &&
            detalle.id !== detalleSolicitud.id
        );
        if (yaExiste) {
            props.props.setMessageSnackBar(`El artículo "${articulosSet.descripcion_producto}" ya ha sido agregado y no puede registrarse nuevamente.`, 'warning');
            return false;
        } else {
            validateSolicitudDetalle(detalleSolicitud, articulosSet, reqMarcaModelo).then((resp) => {
                if (Object.keys(resp).length === 0) {
                    if (detalleSolicitud.id == 0) {
                        handleGuardar();
                    } else {
                        handleEditar();
                    }
                }
                setErrorSolicitudDetalle(resp);
                setErrorGuardar(true);
            });
        }
    }

    const [bloqueoEdit, setBloqueoEdit] = useState(false)
    const editarDetalle = (item) => {
        setBloqueoEdit(true);
        const updatedSolicitud = {
            id: item.id ?? null,
            id_producto: item.id_producto ?? null,
            id_solicitud: item.id_solicitud ?? null,
            descripcion: item.descripcion ?? "",
            marca: item.marca ?? "",
            modelo: item.modelo ?? "",
            cantidad: item.cantidad ?? 0,
            observacion: item.observacion ?? "",
            habilitado: item.habilitado ?? true,
        };

        //FiltrosExist(listSolicitudDetalle, listOptions1, 0);
        ListFilterOptions(listOptions1, listOptions2, listOptions3, 'id', item.id_producto, updatedSolicitud)
        setDetalleSolicitud(updatedSolicitud);
        setArchivosBase64(item.archivos);
        setDeleteFile([]);

    }

    const inputRef = useRef();
    const [archivosBase64, setArchivosBase64] = useState([]);
    const handleArchivos = (event) => {
        // event.target.value = null;
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
                if (archivo.size <= 1024 * 1024) {
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
                    props.props.setMessageSnackBar(`"${archivo.name}" excede 1MB y no fue agregado.`, 'warning');
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
        const data = {
            'archivos': archivos,
            'id': props._ticket
        }
        await requests
            .postToken(CREATE_ARCHIVO, data) //### ** 
            .then((response) => {
                solicitudDetalle = response.data.data2;
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.props.setMessageSnackBar(element, 'warning');
                    props.props.setCloseLoadingScreen();
                });
            })
        return getAllSolicitudDetalle(listOptions1);
    }

    const location = useLocation();
    const estatusCrear = location.state?.crear || false;
    const valorDesdeNavegacion = location.state?.habilitarPantalla || 0;
    const [habilitarPantalla, sethabilitarPantalla] = useState(valorDesdeNavegacion);

    const [open, setOpen] = useState(false)
    const onAgregarClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        if (open === false) {
            props.props.setOpenLoadingScreen();
        }
    }, [open]);

    const handleClose = (id) => {
        let idCategoria = props.solicitudTabla.id_categoria;
        setOpen(!open)
        getAll(idCategoria, props._ticket, id);
    }

    const handleCancel = () => {
        setOpen(!open)
        setTimeout(() => {
            props.props.setCloseLoadingScreen();
        }, 2000); // 2000 milisegundos = 2 segundos
    }

    const [obserDetalleAlert, setObserDetalleAlert] = useState(false)
    const [obserDetaInfo, setObserDetaInfo] = useState([])
    const handleVerObservaciones = (item) => {
        setObserDetalleAlert(true);
        setObserDetaInfo(item.observacion_detalle);
    }

    const [cotizaDetalleAlert, setCotizaDetalleAlert] = useState(false)
    const [cotizaDetaInfo, setCotizaDetaInfo] = useState([])
    const handleVerCotizacion = (item) => {
        setCotizaDetalleAlert(true);
        setCotizaDetaInfo(item.archivos_cotizaciones);
    }

    //COTIZACION GENERAL
    const [cotizaGeneralDetalleAlert, setCotizaGeneralDetalleAlert] = useState(false)
    const [cotizaGeneralDetaInfo, setCotizaGeneralDetaInfo] = useState([])
    const handleVerCotizacionGeneral = () => {
        setCotizaGeneralDetalleAlert(true);
        setCotizaGeneralDetaInfo(props.archivosCotizacionGlobla);
    }

    const eliminarFila = (id) => {
        props.props.setOpenLoadingScreen();
        requests
            .putToken(DELETE_TAB_SOLICITUDES_DETALLE + id).then((response) => {
                solicitudDetalle = response.data.data2;
                setListSolicitudDetalle((prevDetalles) =>
                    prevDetalles.filter((detalle) => detalle.id !== id)
                );
                return getAllSolicitudDetalle();
            })
            .catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.props.setMessageSnackBar(element, 'warning');
                    props.props.setCloseLoadingScreen();
                });
            }).finally(() => {
                props.props.setCloseLoadingScreen();
                handleCloseDialog();
                handlecancelar();
            });
    };
    const [open2, setOpen2] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const handleOpenDialog = (id) => {
        setOpen2(true);
        setIdToDelete(id);
    }


    const handleCloseDialog = () => {
        setOpen2(false);
    };

    return (
        <div>

            <Dialog
                open={open2}
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
                            ¿Estás seguro de eliminar el articulo?
                        </p>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button className='btn-aceptar' onClick={() => eliminarFila(idToDelete)} variant={"contained"} sx={{ mr: 1 }}>Eliminar</Button>

                            <Button className="btn-cancelar" onClick={handleCloseDialog} variant={"contained"}>Cancelar</Button>

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
                    <Grid item xs={2}>
                        <Autocomplete
                            options={filterOptions1} // sin limitar aquí
                            filterOptions={(options, state) =>
                                options
                                    .filter((option) =>
                                        option.clave_producto
                                            ?.toLowerCase()
                                            .startsWith(state.inputValue.toLowerCase())
                                    )
                                    .slice(0, 50) // limita después de filtrar
                            }
                            onInputChange={(e, value) => handleDatosInicales('clave_producto', value)}
                            getOptionLabel={(option) => {
                                const duplicados = filterOptions1.filter(o => o.clave_producto?.toLowerCase() === option.clave_producto?.toLowerCase());
                                if (duplicados.length > 1) {
                                    const index = duplicados.findIndex(o => o.id === option.id);
                                    return `${option.clave_producto || 'N/A'} (${index + 1})`;
                                }
                                return option.clave_producto || 'N/A';
                            }}
                            disabled={habilitarPantalla === 1 ? true : bloqueoEdit}
                            renderInput={(params) =>
                                <TextFieldGeneral
                                    idprops={(habilitarPantalla === 1 || bloqueoEdit) ? true : null}
                                    error={(errorSolicitudDetalle.id ? (true) : (false))}
                                    label={"Clave Articulo"}
                                    className={(habilitarPantalla === 1 || bloqueoEdit) ? 'inputTextSize100disabled' : 'inputTextSize100'}

                                    {...params}
                                    placeholder="Buscar.."
                                />}
                            value={(filterOptions1?.find(option => option.id === articulosSet.id)) || null}
                            onChange={(event, value) =>
                                handleArticulos({ target: { name: 'id', value: value?.id } })
                            }
                            noOptionsText={
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={onAgregarClick}
                                    sx={{ textTransform: 'none', margin: '8px' }}
                                >
                                    Agregar artículo
                                </Button>
                            }
                        />
                        {errorSolicitudDetalle.id && (
                            <span className="label_Quest_Validaciones">{errorSolicitudDetalle.id}</span>
                        )}
                    </Grid>
                    <Grid item xs={7}>
                        <Autocomplete
                            options={filterOptions1} // sin limitar aquí
                            filterOptions={(options, state) =>
                                options
                                    .filter((option) =>
                                        option.descripcion_producto
                                            ?.toLowerCase()
                                            .startsWith(state.inputValue.toLowerCase())
                                    )
                                    .slice(0, 50) // limita después de filtrar
                            }
                            onInputChange={(e, value) => handleDatosInicales('descripcion_producto', value)}
                            getOptionLabel={(option) => option.descripcion_producto}
                            disabled={habilitarPantalla === 1 ? true : bloqueoEdit}
                            renderInput={(params) =>
                                <TextFieldGeneral
                                    idprops={(habilitarPantalla === 1 || bloqueoEdit) ? true : null}
                                    error={(errorSolicitudDetalle.id ? (true) : (false))}
                                    label={"Descripción general del articulo"}
                                    className={(habilitarPantalla === 1 || bloqueoEdit) ? 'inputTextSize100disabled' : 'inputTextSize100'}

                                    {...params}
                                    placeholder="Buscar.."
                                />}
                            value={(filterOptions1?.find(option => option.id === articulosSet.id)) || null}
                            onChange={(event, value) =>
                                handleArticulos({ target: { name: 'id', value: value?.id } })
                            }
                            noOptionsText={
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={onAgregarClick}
                                    sx={{ textTransform: 'none', margin: '8px' }}
                                >
                                    Agregar artículo
                                </Button>
                            }
                        />
                        {errorSolicitudDetalle.id && (
                            <span className="label_Quest_Validaciones">{errorSolicitudDetalle.id}</span>
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
                            error={(errorSolicitudDetalle.cantidad ? (true) : (false))}
                            className={habilitarPantalla === 1 ? "inputTextSize100disabled" : "inputTextSize100"}
                            label="cantidad"
                            disabled={habilitarPantalla === 1}
                            value={detalleSolicitud.cantidad}
                            name='cantidad'
                            onChange={handleDetalleSolicitudCantidad}
                        />
                        {errorSolicitudDetalle.cantidad && (
                            <span className="label_Quest_Validaciones">{errorSolicitudDetalle.cantidad}</span>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <TextFieldGeneral
                            error={(errorSolicitudDetalle.descripcion ? (true) : (false))}
                            className={habilitarPantalla === 1 ? "inputTextSize100disabled" : "inputTextSize100"}
                            label="Descripción detallada del articulo"
                            value={detalleSolicitud.descripcion}
                            name='descripcion'
                            disabled={habilitarPantalla === 1}
                            onChange={handleDetalleSolicitud}
                        />
                        {errorSolicitudDetalle.descripcion && (
                            <span className="label_Quest_Validaciones">{errorSolicitudDetalle.descripcion}</span>
                        )}
                    </Grid>
                    {reqMarcaModelo == false ? (null) : (
                        <>
                            <Grid item xs={2}>
                                <TextFieldGeneral2
                                    disabled={habilitarPantalla === 1}
                                    className={habilitarPantalla === 1 ? "inputTextSize100disabled" : "inputTextSize100"}
                                    error={(errorSolicitudDetalle.marca ? (true) : (false))}
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
                                <TextFieldGeneral2
                                    disabled={habilitarPantalla === 1}
                                    className={habilitarPantalla === 1 ? "inputTextSize100disabled" : "inputTextSize100"}
                                    error={(errorSolicitudDetalle.modelo ? (true) : (false))}
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
                                options={filterOptions3} // sin limitar aquí
                                filterOptions={(options, state) =>
                                    options
                                        .filter((option) =>
                                            option.clave_gpo_familia
                                                ?.toLowerCase()
                                                .startsWith(state.inputValue.toLowerCase())
                                        )
                                        .slice(0, 50) // limita después de filtrar
                                }
                                getOptionLabel={(option) => option.clave_gpo_familia + "/" + option.descripcion_gpo_familia}
                                disabled={habilitarPantalla === 1 ? true : bloqueoEdit}
                                renderInput={(params) =>
                                    <TextFieldGeneral
                                        idprops={(habilitarPantalla === 1 || bloqueoEdit) ? true : null}
                                        error={(errorSolicitudDetalle.id_gpo_familia ? (true) : (false))}
                                        label={"Grupo de artículos"}
                                        className={(habilitarPantalla === 1 || bloqueoEdit) ? 'inputTextSize100disabled' : 'inputTextSize100'}
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

                    <Grid item xs={12} spacing={2} alignItems="center" >
                        <TextFieldGeneral2
                            error={(errorSolicitudDetalle.observacion ? (true) : (false))}
                            className={habilitarPantalla === 1 ? "inputTextSize100disabled" : "inputTextSize100"}
                            //multiline
                            //minRows={2}
                            disabled={habilitarPantalla === 1}
                            label="Nota de la Solicitud"
                            value={detalleSolicitud.observacion}
                            name='observacion'
                            onChange={handleDetalleSolicitud}
                        />
                        {errorSolicitudDetalle.observacion && (
                            <span className="label_Quest_Validaciones">{errorSolicitudDetalle.observacion}</span>
                        )}
                    </Grid>

                    <Grid item xs={9}>
                        <Grid item xs={12}>
                            {habilitarPantalla === 1 ?
                                <Typography variant="body2">
                                    Archivos seleccionados por el usuario: {archivosBase64.length}
                                </Typography>
                                :
                                <Typography variant="body2">
                                    Archivos seleccionados: {archivosBase64.length}
                                </Typography>
                            }
                        </Grid>
                        {habilitarPantalla === 1 ? null :
                            <Grid item xs={3}>
                                <Button variant="outlined" component="label" fullWidth
                                    disabled={habilitarPantalla === 1}>
                                    Adjuntar imagen o documento
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.eml,.msg"
                                        onChange={handleArchivos}
                                        ref={inputRef}
                                    />
                                </Button>
                            </Grid>
                        }

                        <Grid item xs={9}>
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
                                        {habilitarPantalla === 1 ? null :
                                            <IconButton size="small" onClick={() => eliminarArchivo(index, archivo)}>
                                                <DeleteForeverIcon fontSize="small" sx={{ color: "red" }} />
                                            </IconButton>
                                        }
                                    </div>
                                ))}
                            </div>
                        </Grid>

                    </Grid>
                    {habilitarPantalla === 1 ? null :
                        <Grid container item xs={3} sx={{ justifyContent: 'flex-end' }} spacing={1}>
                            <Grid item>
                                <Button
                                    onClick={handleSubmit}
                                    className={habilitarPantalla === 1 ? "btn-aceptar-disabled" : "btn-aceptar"}
                                    disabled={habilitarPantalla === 1}
                                >
                                    {detalleSolicitud.id == 0 ? 'Agregar' : 'Actualizar'}

                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    disabled={habilitarPantalla === 1}
                                    onClick={handlecancelar}
                                    className={habilitarPantalla === 1 ? "btn-aceptar-disabled" : "btn-cancelar"}
                                >
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    }

                    {props.estatusCotizacionGlobla == true ? (
                        <Grid container justifyContent="right" sx={{ paddingRight: 2, margin: 2 }}>
                            <a href="#" className='textLabel9' onClick={(e) => { e.preventDefault(); handleVerCotizacionGeneral(); }}>
                                Ver cotización general
                            </a>
                        </Grid>
                    ) : (null)}


                    <Table size="small" sx={{
                        padding: 1,
                        margin: 1,
                        maxHeight: '200px', // límite de altura
                    }}>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell align={'center'}><label className='textLabel3'>Clave</label></StyledTableCell>
                                <StyledTableCell align={'center'}><label className='textLabel3'>Producto</label></StyledTableCell>
                                <StyledTableCell align={'center'}><label className='textLabel3'>Descripción</label></StyledTableCell>
                                <StyledTableCell align={'center'}><label className='textLabel3'>Cantidad</label></StyledTableCell>
                                <StyledTableCell align={'center'}><label className='textLabel3'>Marca</label></StyledTableCell>
                                <StyledTableCell align={'center'}><label className='textLabel3'>Modelo</label></StyledTableCell>
                                <StyledTableCell align={'center'}><label className='textLabel3'>Notas</label></StyledTableCell>
                                <StyledTableCell align={'center'}><label className='textLabel3'>Fecha de creación</label></StyledTableCell>
                                {props.estatusCotizacionGlobla != true ? (
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
                                    {props.estatusCotizacionGlobla != true ? (
                                        <StyledTableCell align={'center'} sx={{ whiteSpace: 'nowrap' }}><label className='textLabel4'>{row.cotizado == null ? 'Por cotizar' : row.cotizado ?
                                            <a href="#" className='textLabel9' onClick={(e) => { e.preventDefault(); handleVerCotizacion(row); }}>
                                                Cotizado
                                            </a>

                                            :
                                            <a href="#" className='textLabel9' onClick={(e) => { e.preventDefault(); handleVerObservaciones(row); }}>
                                                Ver observaciones
                                            </a>
                                        }</label></StyledTableCell>
                                    ) : (null)}
                                    <StyledTableCell align={'center'}>
                                        <IconButton
                                            onClick={() => editarDetalle(row)}
                                        >{habilitarPantalla === 1 ? (
                                            <FindInPageIcon sx={{ color: "#0066CC" }} />
                                        ) : (
                                            <EditNoteIcon sx={{ color: "#0066CC" }} />
                                        )}
                                        </IconButton>
                                        {habilitarPantalla === 1 ? (null) : (
                                            <IconButton
                                                onClick={() => handleOpenDialog(row.id)}
                                            >
                                                <DeleteIcon sx={{ color: "red" }} />
                                            </IconButton>
                                        )}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Box>

            <AlertaDocumento
                props={props}
                open={modalAbierto}
                close={() => setModalAbierto(false)}
                archivoSeleccionado={archivoSeleccionado}
            />
            <AlertObserDetalle
                props={props}
                open={obserDetalleAlert}
                close={() => setObserDetalleAlert(false)}
                obserDetaInfo={obserDetaInfo}
            />

            <AlertCotizacionDetalle
                props={props}
                open={cotizaDetalleAlert}
                close={() => setCotizaDetalleAlert(false)}
                cotizaDetaInfo={cotizaDetaInfo}
            />

            <AlertCotizacionGeneralDetalle
                props={props}
                open={cotizaGeneralDetalleAlert}
                close={() => setCotizaGeneralDetalleAlert(false)}
                cotizaDetaInfo={cotizaGeneralDetaInfo}
            />
            {loadProduct == true && habilitarPantalla != 1 && open == true && (
                <NuevoProducto
                    open={open}
                    props={props}
                    handleClose={handleClose}
                    handleCancel={handleCancel}
                    id={null}
                    titulo={"Producto"}
                    reqClave={false}
                    producto={datosIniciales}
                    handleArticulosModal={handleArticulosModal}
                />
            )}
        </div>
    )
}

export default DetalleSolicitud