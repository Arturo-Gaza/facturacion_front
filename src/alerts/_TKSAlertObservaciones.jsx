import { Button, Dialog, DialogContent, Grid } from "@mui/material";
//REACT
import React, { useEffect, useState } from "react";
//COMPONENTES MUI MATERIAL
import { Box, IconButton, Tooltip } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
//ACCIONES
import {
  CREATE_OBSERVACIONES_SOLICITUD,
  GET_OBSERVACIONES_SOLICITUD_ID,
  GET_OBSERVACIONES_ID_CARGA_USER,
} from "../Constants/ApiConstants";
import AlertaFilter from "../alerts/FilterCatalogos";
import requests from "../components/AxiosCalls/AxiosCallsLocal";
//ICONOS
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//ESTILOS
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { StyledTableCell, StyledTableRow } from "../Styles/Table/Table";
import { TextFieldGeneral } from "../Styles/TextField/TextField";

import moment from "moment";
import { useUserContenidoContext } from "../hooks/UserConteProvider";

const AlertaObservaciones = (props) => {
  const user = useUserContenidoContext();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("lg");
  //::::::::::: OBSERVACIONES :::::::::::::::::::: //props.idSolicitud
  const [_Array, setArray] = useState({
    id_solicitud: 0,
    id_usuario: user.idUsuario,
    observacion: "",
  }); //### **

  useEffect(() => {
    if (props.solicitudItem != undefined) {
      setArray({
        ..._Array,
        id_solicitud: props.solicitudItem.id,
        id_usuario: user.idUsuario,
        observacion: "",
      }); //### **
    }
  }, [props.solicitudItem]);



  const handleLimpiar = () => {
    setArray({
      ..._Array,
      id_solicitud: props.solicitudItem.id,
      id_usuario: user.idUsuario,
      observacion: "",
    }); //### **
  };

  const handleArrayCatalogo = (e) => {
    setArray({
      ..._Array,
      [e.target.name]: e.target.value,
    });
  };

  //::::::::::: MODALES ::::::::::::::::::::
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("Almacén"); //### **

  const handleOpen = (id) => {
    setOpen(!open);
    setId(id);
  };

  const handleClose = () => {
    setOpen(!open);
    GetListCatalogo();
    setId(null);
  };

  const handleCancel = () => {
    setOpen(!open);
    setId(null);
  };
  //::::::::::: OBTENER FILTRO ::::::::::::::::::::
  const [_ListCatalogo, setListCatalogo] = useState([]);
  const GetListCatalogo = () => {
    let ObservacionesList = GET_OBSERVACIONES_SOLICITUD_ID + props.solicitudItem.id;
    // if (user.idRol == 2) {
    //     ObservacionesList = GET_OBSERVACIONES_ID_CARGA_USER + props.idCarga + "/" + user.idUsuario;
    // } else {
    //     ObservacionesList = GET_OBSERVACIONES_ID_CARGA + props.idCarga;
    // }
    props.props.props.setOpenLoadingScreen();
    requests
      .getToken(ObservacionesList) //### **
      .then((response) => {
        // props.props.props.setMessageSnackBar(response.data.message, 'success');
        setListCatalogo(response.data.data);
        props.props.props.setCloseLoadingScreen();
      })
      .catch((error) => {
        error.data.errors.forEach((element) => {
          props.props.props.setMessageSnackBar(element, "warning");
        });
        props.props.props.setCloseLoadingScreen();
      });
  };

  //::::::::::: PAGINADO ::::::::::::::::::::
  let paginas = 0;
  const [page, setPage] = React.useState(1);
  const [inicio, setInicio] = React.useState(0);
  const [fin, setFin] = React.useState(5);
  const [tamanio, setTamanio] = React.useState(5);

  const handleChange = (event, value) => {
    setPage(value);
    setInicio(parseInt((value - 1) * tamanio));
    setFin(parseInt(value * tamanio));
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
    setInicio(0);
    setFin(10);
    setPage(1);
  };

  const [stepFilter, setStepFilter] = useState(0);
  const porHabilitado = () => {
    setStepFilter(1);
    openFilter();
  };

  //::::::::::: FILTROS - SEARCH ::::::::::::::::::::
  const [search0, setSearch0] = useState("");
  const [search1, setSearch1] = useState("true");
  var results = _ListCatalogo.sort((a, b) => a.id - b.id);
  if (!search0 && !search1) {
    paginas = Math.ceil(results.length / tamanio);
  } else {
    if (search0 != "") {
      results = results.filter(
        (dato) => dato.user.toLowerCase().includes(search0.toLocaleLowerCase()) //### **
      );
    }
    /* if (search1 != "Mostrar todos") {
      if (search1 == "true") {
        results = results.filter(
          (dato) => dato.habilitado == true //###
        );
      }
      if (search1 == "false") {
        results = results.filter(
          (dato) => dato.habilitado == false //###
        );
      }
    } else {
      results = results.filter(
        (dato) => dato.habilitado != null //###
      );
    } */
    paginas = Math.ceil(results.length / tamanio);
  }

  const searcher0 = (e) => {
    setSearch0(e.target.value);
    setInicio(0);
    setFin(10);
    setPage(1);
  };

  //::::::::::: FILTROS - ORDENAR POR ASC Y DESC ::::::::::::::::::::
  const [ascNombre, setASCNombre] = useState(false);
  const [descNombre, setDescNombre] = useState(false);

  if (ascNombre == true) {
    results = results.sort((a, b) => a.observacion.localeCompare(b.observacion)); //### **
  }

  if (descNombre == true) {
    results = results.sort((a, b) => b.observacion.localeCompare(a.observacion)); //### **
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
  if (props.open == true && props.solicitudItem.id != null && _Estatus == false) {
    setEstatus(true);
    GetListCatalogo();
  }

  const Cancelar = () => {
    props.close(false);
    setListCatalogo([]);
    setEstatus(false);
    handleLimpiar();
  };
  const Continuar = () => {
    if (_Array.observacion == "") {
      props.props.props.setMessageSnackBar(
        "Agregue una observación.",
        "warning"
      );
    } else {
      props.props.props.setOpenLoadingScreen();
      requests
        .postToken(CREATE_OBSERVACIONES_SOLICITUD, _Array) //### **
        .then((response) => {
          setEstatus(false);
          handleLimpiar();
          GetListCatalogo();
        })
        .catch((error) => {
          props.props.props.setCloseLoadingScreen();
        });
    }
  };

  return (
    <div>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={props.open}>
        <Grid style={{ borderRadius: "10px" }}>
          <Grid>
            {/* <Grid container className="containerCerrar">
              <a className="cerrar">
                <IconButton aria-label="delete" size="small" onClick={Cancelar}>
                  <DisabledByDefaultIcon sx={{ color: "red" }} />
                </IconButton>
              </a>
            </Grid> */}
            <DialogContent>
              <center>
                {/* <p>{props.idCarga}</p> */}
                <center>
                  <h3>Observaciones</h3>
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
                        justifyContent: {
                          xs: "center",
                          sm: "flex-start",
                          md: "flex-start",
                        },
                      }}
                    >
                      <TextFieldGeneral
                        className="inputTextSize75"
                        value={search0}
                        onChange={searcher0}
                        placeholder="Buscar por usuario."
                        inputProps={{
                          maxLength: 200,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Stack alignItems="center" marginBottom={2}>
                      <Pagination
                        count={paginas}
                        page={page}
                        onChange={handleChange}
                        variant="outlined"
                        shape="rounded"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}></Grid>
                </Grid>

                <label className="textLabel1">
                  Total de Registros: {results.length}{" "}
                </label>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 80, maxHeight: "300px" }}
                      aria-label="customized table"
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center" width="50%">
                            <label className="textLabel3">Observaciones</label>
                          </StyledTableCell>
                          <StyledTableCell align="center" width="15%">
                            <label className="textLabel3">Usuario</label>
                            <Tooltip title="Ordenar por Abecedario">
                              <span>
                                <IconButton
                                  onClick={NombreAsc}
                                  style={{ width: "30px", height: "30px" }}
                                >
                                  <ExpandLessIcon
                                    sx={{ color: "black" }}
                                    style={{ width: "20px", height: "20px" }}
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={NombreDesc}
                                  style={{ width: "30px", height: "30px" }}
                                >
                                  <ExpandMoreIcon
                                    sx={{ color: "black" }}
                                    style={{ width: "20px", height: "20px" }}
                                  />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <label className="textLabel3">Rol</label>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <label className="textLabel3">Nombre completo</label>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <label className="textLabel3">Fecha</label>
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
                              <StyledTableCell align="center">
                                <label className="textLabel4">
                                  {item.observacion}
                                </label>{" "}
                                {/* //### ** */}
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                <label className="textLabel4">{item.usuario.name}</label>{" "}
                                {/* //### ** */}
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                <label className="textLabel4">
                                  {item.usuario.rol.nombre}
                                </label>{" "}
                                {/* //### ** */}
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                <label className="textLabel4">
                                  {item.usuario.name +
                                    " " +
                                    item.usuario.apellidoP +
                                    " " +
                                    item.usuario.apellidoM}
                                </label>{" "}
                                {/* //### ** */}
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                <label className="textLabel4">
                                  {item.created_at}
                                </label>
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
                </Box>
              </center>
              <br></br>
              <center>
                <textarea
                  //disabled={getLocalRol() == 7 || getLocalRol() == 6 || getLocalRol() == 8 ? (true) : (false)}
                  cols="70"
                  rows="4"
                  id="observacion"
                  name="observacion"
                  error={_Array.observacion == "" ? true : false}
                  value={_Array.observacion}
                  onChange={handleArrayCatalogo}
                  placeholder="Escribe aquí tu Observación"
                ></textarea>
                <br />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button className="btn-aceptar" onClick={Continuar} variant={"contained"} sx={{ mr: 1 }} >
                    Guardar
                  </Button>

                  <Button onClick={Cancelar} className="btn-cancelar" variant={"contained"}>Salir</Button>
                </Box>
              </center>
            </DialogContent>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};
export default AlertaObservaciones;
