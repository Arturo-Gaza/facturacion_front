import { Box, Button, Checkbox, Dialog, Grid, Slide } from "@mui/material";
import React, { useState } from "react";
import { CREATE_CAT_GRUPO_FAMILIA, GET_CAT_GRUPO_FAMILIA_BY_ID, UPDATE_CAT_GRUPO_FAMILIA } from "../../../Constants/ApiConstants";
import { TextFieldGeneral } from '../../../Styles/TextField/TextField';
import { CAT_Grupo_Familia } from '../../../Utils/Validacion/Catolgos';
import requests from '../../AxiosCalls/AxiosCallsLocal';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Afectacion = (props) => {
    const [_Estatus, setEstatus] = useState(false);
    const [_checked, setChecked] = useState(true);
    const [_ArrayCatalogo, setArrayCatalogo] = useState({
        clave_gpo_familia: "",
        descripcion_gpo_familia: "",
        descripcion_gpo_familia_2: "",
        habilitado: true
    })//### **

    const handleLimpiar = () => {
        setArrayCatalogo({
            ..._ArrayCatalogo,
            clave_gpo_familia: "",
            descripcion_gpo_familia: "",
            descripcion_gpo_familia_2: "",
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

            .postToken(CREATE_CAT_GRUPO_FAMILIA, _ArrayCatalogo)//### **
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
            .putToken(UPDATE_CAT_GRUPO_FAMILIA + props.id, _ArrayCatalogo)//### **
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
            .getToken(GET_CAT_GRUPO_FAMILIA_BY_ID + props.id) //### **
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

    const [errorsCAT, setErrorsCAT] = useState({});
    const handleSubmitValidado = (e) => {
        props.props.props.setOpenLoadingScreen();
        e.preventDefault();
        CAT_Grupo_Familia(_ArrayCatalogo).then((resp) => {//### **
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
                    minWidth: "450px",
                    maxWidth: "450px",
                },
            }}
        >
            <Box sx={{ padding: 5 }}>
                <h4 className="textLabel1">
                    <center>
                        {props.id == null ? (
                            <span>Nuevo {props.titulo}</span>
                        ) : (
                            <span>Editar {props.titulo}</span>
                        )}
                    </center>
                </h4>
                {/* //### ** REVISAR BIEN MIS PARAMETROS A METER*/}
                <Grid container className='marginComponets'>
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className='textLabel2'>{"Clave " + props.titulo}</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextFieldGeneral
                            className="inputTextSize50"
                            id="clave_gpo_familia"
                            name="clave_gpo_familia"
                            // idprops={props.id}
                            value={_ArrayCatalogo.clave_gpo_familia} /* //### ** */
                            error={errorsCAT.clave_gpo_familia}
                            onChange={handleArrayCatalogo}
                            size="small"
                            inputProps={{
                                maxLength: 10,
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container className='marginComponets'>
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className='textLabel2'>{"Descripción " + props.titulo}</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextFieldGeneral
                            className="inputTextSize100"
                            id="descripcion_gpo_familia"
                            name="descripcion_gpo_familia"
                            value={_ArrayCatalogo.descripcion_gpo_familia} /* //### ** */
                            error={errorsCAT.descripcion_gpo_familia}
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
                        <label className='textLabel2'>{"Descripción Grupo famlia 2"}</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextFieldGeneral
                            className="inputTextSize100"
                            id="descripcion_gpo_familia_2"
                            name="descripcion_gpo_familia_2"
                            value={_ArrayCatalogo.descripcion_gpo_familia_2} /* //### ** */
                            error={errorsCAT.descripcion_gpo_familia_2}
                            onChange={handleArrayCatalogo}
                            size="small"
                            inputProps={{
                                maxLength: 255,
                            }}
                        />
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