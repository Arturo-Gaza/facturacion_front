import { Box, Button, Checkbox, Dialog, Grid, Slide } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CREATE_CAT_PRODUCTOS,
  CREATE_CAT_PRODUCTOS_SIN_CLAVE,
  GET_CAT_PRODUCTOSBY_ID,
  GET_LIST_CATEGORIA,
  GET_LIST_MONEDA,
  GET_LIST_CAT_GRUPO_FAMILIA,
  GET_LIST_CAT_UNIDAD_MEDIDA,
  UPDATE_CAT_PRODUCTOS,
  GET_LIST_TIPO,
  GET_CAT_BY_TIPO,
} from "../../../Constants/ApiConstants";
import { MenuItemGeneral, SelectGeneral } from "../../../Styles/Select/Select";
import { TextFieldGeneral } from "../../../Styles/TextField/TextField";
import { CAT_Productos } from "../../../Utils/Validacion/Catolgos";
import { CAT_Productos_Sin_Clave } from "../../../Utils/Validacion/Catolgos";
import requests from "../../AxiosCalls/AxiosCallsLocal";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Afectacion = (props) => {
  const [_ListOptions1, setListOptions1] = useState([]);
  const [_ListOptions2, setListOptions2] = useState([]);
  const [_ListOptions3, setListOptions3] = useState([]);
  const [_ListOptions5, setListOptions5] = useState([]);

  const GetListOptionsCatalogo = async () => {
    props.props.props.setOpenLoadingScreen();
    await Promise.all([
      requests.getToken(GET_LIST_CAT_UNIDAD_MEDIDA),
      requests.getToken(GET_LIST_MONEDA),
      requests.getToken(GET_LIST_CAT_GRUPO_FAMILIA),
      requests.getToken(GET_LIST_TIPO)
    ]).then(([unidadMedida, moneda, catGrupoFamilia, tipo]) => {
      setListOptions1(unidadMedida.data.data);
      setListOptions2(moneda.data.data);
      setListOptions3(catGrupoFamilia.data.data);
      setListOptions5(tipo.data.data);

    }).catch((error) => {
      error.response.data.errors.forEach(element => {  //forEach Ya quedo
        props.props.props.setMessageSnackBar(element, 'warning');
      });
    }).finally(() => {
      props.props.props.setCloseLoadingScreen();
    });;
  };

  const [_Estatus, setEstatus] = useState(false);
  const [_checked, setChecked] = useState(true);
  const [_ArrayCatalogo, setArrayCatalogo] = useState({
    id_tipo: 0,
    clave_producto: "",
    descripcion_producto: "",
    id_unidad_medida: "",
    id_moneda: "",
    id_gpo_familia: "",
    id_categoria: "",
    habilitado: true,
  }); //### **

  const handleLimpiar = () => {
    setArrayCatalogo({
      ..._ArrayCatalogo,
      id_tipo: 0,
      clave_producto: "",
      descripcion_producto: "",
      id_unidad_medida: "",
      id_moneda: "",
      id_gpo_familia: "",
      id_categoria: "",
      habilitado: true,
    }); //### **
    setChecked(true);
  };

  const [_ListOptions4, setListOptions4] = useState([]);
  const GetArrayCatalogoByID2 = async (id) => {

    props.props.props.setOpenLoadingScreen();
    await requests
      .getToken(GET_CAT_BY_TIPO + id) //### **
      .then((response) => {
        setListOptions4(response.data.data);
        setChecked(response.data.data.habilitado);
      }).catch((error) => {
        error.response.data.errors.forEach(element => {  //forEach Ya quedo
          props.props.props.setMessageSnackBar(element, 'warning');
        });
      })
      .finally(() => {
        props.props.props.setCloseLoadingScreen();
      });
  };

  const handleArrayCatalogo = (e) => {
    const { name, value } = e.target;

    setArrayCatalogo((prev) => ({
      ...prev,
      [name]: value,
      habilitado: prev.habilitado ?? true,
    }));

    if (name === "id_tipo") {
      let idCategoria = value;
      GetArrayCatalogoByID2(idCategoria);
    }
  };

  const handleHabilitado = (e) => {
    setChecked(e.target.checked);
    if (e.target.checked === true) {
      _ArrayCatalogo.habilitado = true;
    }
    if (e.target.checked === false) {
      _ArrayCatalogo.habilitado = false;
    }
  };

  const handleCancel = () => {
    setEstatus(false);
    handleLimpiar();
    props.handleCancel();
  };

  const handleClose = (id) => {
    props.props.props.setOpenLoadingScreen();
    setEstatus(false);
    handleLimpiar();
    props.handleClose(id);
  };

  const Guardar = () => {
    debugger
    props.props.props.setOpenLoadingScreen();
    requests
      .postToken(
        CREATE_CAT_PRODUCTOS_SIN_CLAVE,
        _ArrayCatalogo
      ) //### **
      .then((response) => {
        props.props.props.setMessageSnackBar(response.data.message, "success");
        return handleClose(response.data.data.id);
      }).catch((error) => {
        error.response.data.errors.forEach(element => {  //forEach Ya quedo
          props.props.props.setMessageSnackBar(element, 'warning');
        });
      })
      .finally(() => {
        props.props.props.setCloseLoadingScreen();
      });
  };
  const Actualizar = () => {
    props.props.props.setOpenLoadingScreen();
    requests
      .putToken(UPDATE_CAT_PRODUCTOS + props.id, _ArrayCatalogo) //### **
      .then((response) => {
        props.props.props.setMessageSnackBar(response.data.message, "success");
        handleClose();
      }).catch((error) => {
        error.response.data.errors.forEach(element => {  //forEach Ya quedo
          props.props.props.setMessageSnackBar(element, 'warning');
        });
      })
      .finally(() => {
        props.props.props.setCloseLoadingScreen();
      });
  };

  const GetArrayCatalogoByID = async () => {
    props.props.props.setOpenLoadingScreen();
    await requests
      .getToken(GET_CAT_PRODUCTOSBY_ID + props.id) //### **
      .then((response) => {
        setArrayCatalogo(response.data.data);
        setChecked(response.data.data.habilitado);
      }).catch((error) => {
        error.response.data.errors.forEach(element => {  //forEach Ya quedo
          props.props.props.setMessageSnackBar(element, 'warning');
        });
      })
      .finally(() => {
        props.props.props.setCloseLoadingScreen();
      });
  };

  const [errorsCAT, setErrorsCAT] = useState({});
  const handleSubmitValidado = (e) => {
    props.props.props.setOpenLoadingScreen();
    e.preventDefault();
    CAT_Productos(_ArrayCatalogo).then((resp) => {
      //### **
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
        props.props.props.setMessageSnackBar(
          "Ingrese todos los datos",
          "warning"
        );
        props.props.props.setCloseLoadingScreen();
      }
    });
  };

  const handleSubmitValidadoSinClave = (e) => {
    props.props.props.setOpenLoadingScreen();
    e.preventDefault();
    CAT_Productos_Sin_Clave(_ArrayCatalogo).then((resp) => {
      //### **
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
        Guardar();
        props.props.props.setCloseLoadingScreen();
      } else {
        props.props.props.setMessageSnackBar(
          "Ingrese todos los datos",
          "warning"
        );
        props.props.props.setCloseLoadingScreen();
      }
    });
  };

  if (props.open == true && props.id != null && _Estatus == false) {
    setEstatus(true);
    GetArrayCatalogoByID();
  }

  //::::::::::: USEEFECT ::::::::::::::::::::
  useEffect(() => {
    GetListOptionsCatalogo();

    if (props.open && props.reqClave === false) {
      setArrayCatalogo((prev) => ({
        ...prev,
        ...props.producto,
      }));
      if (props.producto.id_tipo !== 0) {
        GetArrayCatalogoByID2(props.producto.id_tipo);
      }

    }
  }, [props.open]);

  return (
    <Dialog
      TransitionComponent={Transition}
      open={props.open}
      onClose={handleCancel}
      PaperProps={{
        style: {
          backgroundColor: "#F6F6FF",
          maxHeight: "150%",
          minWidth: "500px",
          maxWidth: "500px",
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
        <Grid container spacing={1}>

          <Grid container item xs={6} sm={6} md={6} >
            <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
              <label className="textLabel2">{"Clave " + props.titulo}</label>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextFieldGeneral
                className="inputTextSize75"
                id="clave_producto"
                name="clave_producto"
                // idprops={props.id}
                value={_ArrayCatalogo.clave_producto} /* //### ** */
                error={errorsCAT.clave_producto}
                onChange={handleArrayCatalogo}
                size="small"
                inputProps={{
                  maxLength: 20,
                }}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
              <label className="textLabel2">
                {"Descripción " + props.titulo}
              </label>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextFieldGeneral
                className="inputTextSize100"
                id="descripcion_producto"
                name="descripcion_producto"
                value={_ArrayCatalogo.descripcion_producto} /* //### ** */
                error={errorsCAT.descripcion_producto}
                onChange={handleArrayCatalogo}
                size="small"
                inputProps={{
                  maxLength: 255,
                }}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} sm={12} md={12} spacing={2}>

            <Grid container item xs={4} sm={4} md={4} >
              <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                <label className="textLabel2">{"Unidad de medida"}</label>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <SelectGeneral
                  // idprops={props.id}
                  id="id_unidad_medida"
                  name="id_unidad_medida"
                  value={_ArrayCatalogo.id_unidad_medida}
                  error={errorsCAT.id_unidad_medida}
                  onChange={handleArrayCatalogo}
                  className="inputSelectSize100"
                >
                  <MenuItemGeneral key={0} value={0} disabled>
                    Seleccione una Opción
                  </MenuItemGeneral>
                  {_ListOptions1.map((item) => (
                    <MenuItemGeneral
                      key={item.id} // ### **
                      value={item.id}
                    >
                      {item.clave_unidad_medida}
                    </MenuItemGeneral>
                  ))}
                </SelectGeneral>

              </Grid>
            </Grid>
            {props.reqClave ? (
              <Grid container item xs={6} sm={6} md={6} >
                <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                  <label className="textLabel2">{"Moneda"}</label>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <SelectGeneral
                    // idprops={props.id}
                    id="id_moneda"
                    name="id_moneda"
                    value={_ArrayCatalogo.id_moneda}
                    error={errorsCAT.id_moneda}
                    onChange={handleArrayCatalogo}
                    className="inputSelectSize100"
                  >
                    <MenuItemGeneral key={0} value={0} disabled>
                      Seleccione una Opción
                    </MenuItemGeneral>
                    {_ListOptions2.map((item) => (
                      <MenuItemGeneral
                        key={item.id_moneda} // ### **
                        value={item.id_moneda}
                      >
                        {item.descripcion_moneda}
                      </MenuItemGeneral>
                    ))}
                  </SelectGeneral>
                </Grid>
              </Grid>) : (null)}
          </Grid>

          <Grid container item xs={12} sm={12} md={12} >
            <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
              <label className="textLabel2">{"Grupo de artículos"}</label>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <SelectGeneral
                // idprops={props.id}
                id="id_gpo_familia"
                name="id_gpo_familia"
                value={_ArrayCatalogo.id_gpo_familia}
                error={errorsCAT.id_gpo_familia}
                onChange={handleArrayCatalogo}
                className="inputSelectSize50"
              >
                <MenuItemGeneral key={0} value={0} disabled>
                  Seleccione una Opción
                </MenuItemGeneral>
                {_ListOptions3.map((item) => (
                  <MenuItemGeneral
                    key={item.id} // ### **
                    value={item.id}
                  >
                    {item.clave_gpo_familia}
                  </MenuItemGeneral>
                ))}
              </SelectGeneral>
            </Grid>
          </Grid>

          <Grid container item xs={12} sm={12} md={12} spacing={2}>

            <Grid container item xs={6} sm={6} md={6} >
              <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                <label className="textLabel2">{"Tipo"}</label>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <SelectGeneral
                  // idprops={props.id}
                  disabled={!props.reqClave}
                  id="id_tipo"
                  name="id_tipo"
                  value={_ArrayCatalogo.id_tipo}
                  error={errorsCAT.id_tipo}
                  onChange={handleArrayCatalogo}
                  className="inputSelectSize100"
                >
                  <MenuItemGeneral key={0} value={0} disabled>
                    Seleccione una Opción
                  </MenuItemGeneral>
                  {_ListOptions5.map((item) => (
                    <MenuItemGeneral
                      key={item.id} // ### **
                      value={item.id}
                    >
                      {item.descripcion}
                    </MenuItemGeneral>
                  ))}
                </SelectGeneral>
              </Grid>
            </Grid>

            <Grid container item xs={6} sm={6} md={6} >
              <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                <label className="textLabel2">{"Categoria"}</label>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <SelectGeneral
                  // idprops={props.id}
                  disabled={!props.reqClave}
                  id="id_categoria"
                  name="id_categoria"
                  value={_ArrayCatalogo.id_categoria}
                  error={errorsCAT.id_categoria}
                  onChange={handleArrayCatalogo}
                  className="inputSelectSize75"
                >
                  <MenuItemGeneral key={0} value={0} disabled>
                    Seleccione una Opción
                  </MenuItemGeneral>
                  {_ListOptions4.map((item) => (
                    <MenuItemGeneral
                      key={item.id} // ### **
                      value={item.id}
                    >
                      {item.descripcion_categoria}
                    </MenuItemGeneral>
                  ))}
                </SelectGeneral>
              </Grid>
            </Grid>
          </Grid>
          {props.id == null ? (null) : (
            <Grid container className="marginComponets">
              <label className="textLabel2">Habilitado</label>
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
        </Grid>
        <center>
          <Grid container sx={{ marginTop: 3 }}>
            <Grid item xs={12} sm={6} md={6}>
              <Button
                onClick={
                  props.reqClave
                    ? handleSubmitValidado
                    : handleSubmitValidadoSinClave
                }
                className="btn-aceptar"
                variant={"contained"}
              >
                {props.id == null ? "Guardar" : "Actualizar"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Button
                onClick={handleCancel}
                className="btn-cancelar"
                variant={"contained"}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </center>
      </Box>
    </Dialog>
  );
};
export default Afectacion;
