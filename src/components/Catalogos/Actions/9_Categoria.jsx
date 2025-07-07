import { Box, Button, Checkbox, Dialog, Grid, Slide, MenuItem, Select } from "@mui/material";
import React, { useState, useEffect } from "react";
import { CREATE_CATEGORIA, GET_CATEGORIA_ID, UPDATE_CATEGORIA, GET_LIST_TIPO } from "../../../Constants/ApiConstants";
import { TextFieldGeneral } from '../../../Styles/TextField/TextField';
import { MenuItemGeneral, SelectGeneral } from "../../../Styles/Select/Select";
import { CAT_Categoria } from '../../../Utils/Validacion/Catolgos';
import requests from '../../AxiosCalls/AxiosCallsLocal';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Afectacion = (props) => {
    const [_Estatus, setEstatus] = useState(false);
    const [_checked, setChecked] = useState(true);
    const [_ArrayCatalogo, setArrayCatalogo] = useState({
        descripcion_categoria: "",
        id_tipo: "",
        habilitado: true
    })//### **

    const handleLimpiar = () => {
        setArrayCatalogo({
            ..._ArrayCatalogo,
            descripcion_categoria: "",
            id_tipo: "",
            habilitado: true
        });//### **
        setChecked(true);
    }

    const handleHabilitado = (e) => {
        setChecked(e.target.checked);
        if (e.target.checked === true) {
            _ArrayCatalogo.habilitado = true;
        }
        if (e.target.checked === false) {
            _ArrayCatalogo.habilitado = false;
        }
    };

    const handleArrayCatalogo = (e) => {
        setArrayCatalogo({
            ..._ArrayCatalogo,
            [e.target.name]: e.target.value,
        });
    }

    const handleCancel = () => {
        setEstatus(false);
        handleLimpiar();
        props.handleCancel()
    }

    const handleClose = () => {
        setEstatus(false);
        handleLimpiar();
        props.handleClose();
    }

    const Guardar = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .postToken(CREATE_CATEGORIA, _ArrayCatalogo)//### **
            .then((response) => {
                props.props.props.setMessageSnackBar(response.data.message, 'success');
                handleClose();
            }).catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
            })
            .finally(() => {
                props.props.props.setCloseLoadingScreen();
            });
    }
    const Actualizar = () => {
        props.props.props.setOpenLoadingScreen()
        requests
            .putToken(UPDATE_CATEGORIA + props.id, _ArrayCatalogo)//### **
            .then((response) => {
                props.props.props.setMessageSnackBar(response.data.message, 'success');
                handleClose();
            }).catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
            })
            .finally(() => {
                props.props.props.setCloseLoadingScreen();
            });
    }

    const GetArrayCatalogoByID = async () => {
        props.props.props.setOpenLoadingScreen()
        await requests
            .getToken(GET_CATEGORIA_ID + props.id) //### **
            .then((response) => {
                setArrayCatalogo(response.data.data)
                setChecked(response.data.data.habilitado);
            }).catch((error) => {
                error.response.data.errors.forEach(element => {  //forEach Ya quedo
                    props.props.props.setMessageSnackBar(element, 'warning');
                });
            })
            .finally(() => {
                props.props.props.setCloseLoadingScreen();
            });
    }

    const [_ListCatalogo, setListCatalogo] = useState([])
    const GetALLTipo = async () => {
        try {
            const response = await requests.getToken(GET_LIST_TIPO);
            setListCatalogo(response.data.data);
        } catch (error) {
            const errores = error?.response?.data?.errors || ['Error inesperado'];

            errores.forEach((element) => {

            });

        }
    }

    useEffect(() => {
        GetALLTipo();
    }, []);

    const [errorsCAT, setErrorsCAT] = useState({});
    const handleSubmitValidado = (e) => {
        props.props.props.setOpenLoadingScreen();
        e.preventDefault();
        CAT_Categoria(_ArrayCatalogo).then((resp) => {//### **
            setErrorsCAT(resp);
            let boolValor = false;
            for (const el of Object.values(resp)) {
                if (el === true) {
                    boolValor = false;
                    break;
                } else {
                    boolValor = true;
                }
            }
            if (boolValor) {
                if (props.id == null) {
                    Guardar();
                } else {
                    Actualizar();
                }
            } else {
                props.props.props.setMessageSnackBar('Ingrese todos los datos', 'warning');
                props.props.props.setCloseLoadingScreen();
            }
        });
    };

    if (props.open == true && props.id != null && _Estatus == false) {
        setEstatus(true);
        GetArrayCatalogoByID()
    }

    return (
        <Dialog
            TransitionComponent={Transition}
            open={props.open}
            onClose={handleCancel}
            PaperProps={{
                style: {
                    backgroundColor: "#F6F6FF",
                    maxHeight: "150%",
                    minWidth: "350px",
                    maxWidth: "350px",
                },
            }}
        >
            <Box sx={{ padding: 5 }}>
                <h4 className="textLabel1">
                    <center>
                        {props.id == null ? (
                            <span>Nueva {props.titulo}</span>
                        ) : (
                            <span>Editar {props.titulo}</span>
                        )}
                    </center>
                </h4>
                {/* //### ** REVISAR BIEN MIS PARAMETROS A METER*/}
                <Grid container className='marginComponets'>
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className='textLabel2'>{"Categoria"}</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextFieldGeneral
                            className="inputTextSize75"
                            id="descripcion_categoria"
                            name="descripcion_categoria"
                            // idprops={props.id}
                            value={_ArrayCatalogo.descripcion_categoria} /* //### ** */
                            error={errorsCAT.descripcion_categoria}
                            onChange={handleArrayCatalogo}
                            size="small"
                            inputProps={{
                                maxLength: 255,
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container className='marginComponets'>
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className='textLabel2'>{"Tipo"}</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <SelectGeneral
                            className="inputSelectSize75"
                            id="id_tipo"
                            name="id_tipo"
                            value={_ArrayCatalogo.id_tipo}
                            label="Tipo"
                            onChange={handleArrayCatalogo}
                        >
                            <MenuItemGeneral value="">
                                <em>Seleccione un tipo</em>
                            </MenuItemGeneral>
                            {_ListCatalogo.map((tipo) => (
                                <MenuItemGeneral key={tipo.id} value={tipo.id}>
                                    {tipo.descripcion}
                                </MenuItemGeneral>
                            ))}
                        </SelectGeneral>
                    </Grid>
                </Grid>
                {props.id == null ? (null) : (
                    <Grid container className='marginComponets'>
                        <label className='textLabel2'>Habilitado</label>
                        <Checkbox
                            className="ckBox1"
                            id="habilitado"
                            name="habilitado"
                            checked={_checked}
                            onChange={handleHabilitado}
                            value={_checked}
                            disabled={props.id == null}
                        ></Checkbox>
                    </Grid>
                )}
                <center>
                    <Grid container sx={{ marginTop: 3 }}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Button onClick={handleSubmitValidado} className='btn-aceptar' variant={"contained"}>
                                {props.id == null ? ('Guardar') : ('Actualizar')}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Button onClick={handleCancel} className="btn-cancelar" variant={"contained"}>Cancelar</Button>
                        </Grid>
                    </Grid>
                </center>
            </Box>
        </Dialog>
    );

}
export default Afectacion