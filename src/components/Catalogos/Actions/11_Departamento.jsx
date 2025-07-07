import { Box, Button, Checkbox, Dialog, Grid, Slide } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  CREATE_DEPARTAMENTO,
  GET_DEPARTAMENTO_ID,
  UPDATE_DEPARTAMENTO,
  GET_CATEGORIA_ID_DEPARTAMENTO,
  GET_LIST_CATEGORIA,
  CREATE_CAT_DEPARTAMENTO,
  GET_ALL_COMPRAS,
} from "../../../Constants/ApiConstants";
import { TextFieldGeneral } from "../../../Styles/TextField/TextField";
import { CAT_Departamento } from "../../../Utils/Validacion/Catolgos";
import requests from "../../AxiosCalls/AxiosCallsLocal";
import { MenuItemGeneral, SelectGeneral } from "../../../Styles/Select/Select";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Afectacion = (props) => {
  const [todasLasCategorias, setTodasLasCategorias] = useState([]);
  const [categoriasRelacionadas, setCategoriasRelacionadas] = useState([]); // IDs de categorías relacionadas
  const [catRelHistoricas, setcatRelHistoricas] = useState([]);
  const [_Estatus, setEstatus] = useState(false);
  const [_checked, setChecked] = useState(true);
  const { modalTipoAbierto, handleOpenTipo } = props;
  const [_ArrayCatalogo, setArrayCatalogo] = useState({
    descripcion: "",
    id_usuario_responsable_compras: "",
    habilitado: true,
  }); //### **
  const [categoriaDepartamento, setcategoriaDepartamento] = useState([]);
  const handleLimpiar = () => {
    setArrayCatalogo({
      ..._ArrayCatalogo,
      descripcion: "",
      id_usuario_responsable_compras: "",
      habilitado: true,
    }); //### **
    setChecked(true);
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

  const handleArrayCatalogo = (e) => {
    setArrayCatalogo({
      ..._ArrayCatalogo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setEstatus(false);
    handleLimpiar();
    props.handleCancel();
  };

  const handleClose = () => {
    setEstatus(false);
    handleLimpiar();
    props.handleClose();
  };

  const handleCloseTipo = () => {
    props.setModalTipoAbierto(false);
    setCategoriasRelacionadas([]);
  };

  const Guardar = () => {
    props.props.props.setOpenLoadingScreen();
    requests
      .postToken(CREATE_DEPARTAMENTO, _ArrayCatalogo) //### **
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

  const Actualizar = () => {
    props.props.props.setOpenLoadingScreen();
    requests
      .putToken(UPDATE_DEPARTAMENTO + props.id, _ArrayCatalogo) //### **
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
      .getToken(GET_DEPARTAMENTO_ID + props.id) //### **
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

  const GetCategoriaDepartamento = async () => {
    props.props.props.setOpenLoadingScreen();
    await requests
      .getToken(GET_LIST_CATEGORIA) //### **
      .then((response) => {
        setcategoriaDepartamento(response.data.data);

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

  const [_ListCatalogo, setListCatalogo] = useState([]);
  const GetAllCompras = async () => {
    try {
      const response = await requests.getToken(GET_ALL_COMPRAS);
      setListCatalogo(response.data.data);
    } catch (error) {
      const errores = error?.response?.data?.errors || ["Error inesperado"];

      errores.forEach((element) => { });
    }
  };
  useEffect(() => {
    if (modalTipoAbierto && props.id) {
      obtenerCategoriasAll();
    } else {
      GetAllCompras();
    }
  }, [modalTipoAbierto, props.id]);

  const obtenerCategoriasAll = async () => {
    props.props.props.setOpenLoadingScreen();
    await Promise.all([
      requests.getToken(GET_LIST_CATEGORIA),
      requests.getToken(GET_CATEGORIA_ID_DEPARTAMENTO + props.id)
    ]).then(([response1, response2]) => {
      setTodasLasCategorias(response1.data.data);
      setChecked(response1.data.data.habilitado);

      const idsRelacionados = response2.data.data.map(
        (categoria) => categoria.id
      );
      setCategoriasRelacionadas(idsRelacionados);
      setcatRelHistoricas(idsRelacionados);
    }).catch((error) => {
      error.response.data.errors.forEach(element => {  //forEach Ya quedo
        props.props.props.setMessageSnackBar(element, 'warning');
      });
    }).finally(() => {
      props.props.props.setCloseLoadingScreen();
    });;
  };

  const obtenerCategorias = async () => {
    props.props.props.setOpenLoadingScreen();
    await requests
      .getToken(GET_LIST_CATEGORIA) //### **
      .then((response) => {
        setTodasLasCategorias(response.data.data);
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

  const obtenerCategoriasRelacionadas = async () => {
    props.props.props.setOpenLoadingScreen();
    await requests
      .getToken(GET_CATEGORIA_ID_DEPARTAMENTO + props.id)
      .then((response) => {
        const idsRelacionados = response.data.data.map(
          (categoria) => categoria.id
        );
        setCategoriasRelacionadas(idsRelacionados);
        setcatRelHistoricas(idsRelacionados);
      }).catch((error) => {
        error.response.data.errors.forEach(element => {  //forEach Ya quedo
          props.props.props.setMessageSnackBar(element, 'warning');
        });
      })
      .finally(() => {
        props.props.props.setCloseLoadingScreen();
      });
  };

  const handleToggleCategoria = (evento, Categoria) => {
    setCategoriasRelacionadas(
      (prev) =>
        prev.includes(Categoria.id)
          ? prev.filter((id) => id !== Categoria.id) // desmarcar
          : [...prev, Categoria.id] // marcar
    );
  };

  const FiltroCheckBox = () => {
    let listAgregar = categoriasRelacionadas
      .filter((R) => !catRelHistoricas.includes(R))
      .map((add) => ({ id_categoria: add, id_departamento: props.id }));
    let listEliminar = catRelHistoricas
      .filter((R) => !categoriasRelacionadas.includes(R))
      .map((delet) => ({ id_categoria: delet, id_departamento: props.id }));
    const resultado = {
      Agregar: listAgregar,
      Eliminar: listEliminar,
    };
    props.props.props.setOpenLoadingScreen();
    requests

      .postToken(CREATE_CAT_DEPARTAMENTO, resultado)
      .then((response) => {
        props.props.props.setMessageSnackBar(response.data.message, "success");
        handleCloseTipo();
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
    CAT_Departamento(_ArrayCatalogo).then((resp) => {
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

  if (props.open == true && props.id != null && _Estatus == false) {
    setEstatus(true);
    GetArrayCatalogoByID();
  }
  return (
    <>
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
                <span>Nuevo {props.titulo}</span>
              ) : (
                <span>Editar {props.titulo}</span>
              )}
            </center>
          </h4>
          {/* //### ** REVISAR BIEN MIS PARAMETROS A METER*/}
          <Grid container className="marginComponets">
            <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
              <label className="textLabel2">
                {"Descripción " + props.titulo}
              </label>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextFieldGeneral
                className="inputTextSize75"
                id="descripcion"
                name="descripcion"
                // idprops={props.id}
                value={_ArrayCatalogo.descripcion} /* //### ** */
                error={errorsCAT.descripcion}
                onChange={handleArrayCatalogo}
                size="small"
                inputProps={{
                  maxLength: 255,
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
            <label className="textLabel2">{"Responsable de compras"}</label>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <SelectGeneral
              className="inputSelectSize75"
              id="id_usuario_responsable_compras"
              name="id_usuario_responsable_compras"
              value={_ArrayCatalogo.id_usuario_responsable_compras || ""}
              onChange={handleArrayCatalogo}
            >
              <MenuItemGeneral value="">
                <em>Seleccione un usuario de compras</em>
              </MenuItemGeneral>
              {_ListCatalogo.map((usuario) => (
                <MenuItemGeneral key={usuario.id} value={usuario.id}>
                  {`${usuario.name} ${usuario.apellidoP} ${usuario.apellidoM}`}
                </MenuItemGeneral>
              ))}
            </SelectGeneral>
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

          <center>
            <Grid container sx={{ marginTop: 3 }}>
              <Grid item xs={12} sm={6} md={6}>
                <Button
                  onClick={handleSubmitValidado}
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
      {/* === DIALOG 2: Tipo === */}
      <Dialog
        open={modalTipoAbierto}
        onClose={handleCloseTipo}
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
            <center>Categorias</center>
          </h4>
          <Grid container className="marginComponets">
            <Grid item xs={12}>
              {todasLasCategorias.map((categoria) => (
                <div key={categoria.id} style={{ marginBottom: "8px" }}>
                  <Checkbox
                    checked={categoriasRelacionadas.includes(categoria.id)}
                    onChange={(evento) =>
                      handleToggleCategoria(evento, categoria)
                    }
                  />
                  {categoria.descripcion_categoria } (Tipo:{categoria.descripcion_tipo })
                </div>
              ))}
            </Grid>
          </Grid>
          <center>
            <Grid container sx={{ marginTop: 3 }}>
              <Grid item xs={12} sm={6} md={6}>
                <Button
                  onClick={FiltroCheckBox}
                  className="btn-aceptar"
                  variant={"contained"}
                >
                  Guardar
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Button
                  onClick={handleCloseTipo}
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
    </>
  );
};
export default Afectacion;