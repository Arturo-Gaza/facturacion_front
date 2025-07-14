//REACT
import React, { useEffect, useState } from "react";
//COMPONENTES MUI MATERIAL
import { Box, Checkbox, Grid, IconButton, Tooltip } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
//ACCIONES
import { GET_CAT_UNIDAD_MEDIDA_EXCEL, GET_LIST_CAT_UNIDAD_MEDIDA } from "../../../Constants/ApiConstants";
import AlertaFilter from "../../../alerts/FilterCatalogos";
import requests from "../../AxiosCalls/AxiosCallsLocal";
import Acciones from "../Actions/2_Unidad_Medida"; //###
//ICONOS
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
//ESTILOS
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import { StyledTableCell, StyledTableRow } from "../../../Styles/Table/Table";
import { TextFieldGeneral } from "../../../Styles/TextField/TextField";
const Afectacion = (props) => {
  //::::::::::: MODALES ::::::::::::::::::::
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("Unidad de Medida"); //### **

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
    props.props.setOpenLoadingScreen();
    requests
      .getToken(GET_LIST_CAT_UNIDAD_MEDIDA) //### **
      .then((response) => {
        props.props.setMessageSnackBar(response.data.message, 'success');
        setListCatalogo(response.data.data);
      })
      .catch((error) => {
        error.response.data.errors.forEach(element => {
          props.props.setMessageSnackBar(element, 'warning');
        });
      }).finally(() => {
        props.props.setCloseLoadingScreen();
      });
  };

  //::::::::::: PAGINADO ::::::::::::::::::::
  let paginas = 0;
  const [page, setPage] = React.useState(1);
  const [inicio, setInicio] = React.useState(0);
  const [fin, setFin] = React.useState(10);
  const [tamanio, setTamanio] = React.useState(10);

  const handleChange = (event, value) => {
    setPage(value);
    setInicio(parseInt((value - 1) * tamanio));
    setFin(parseInt(value * tamanio));
  };

  //::::::::::: DESCARGAR ARCHIVO ::::::::::::::::::::

  const descargarExcel = () => {
    props.props.setOpenLoadingScreen();
    requests
      .postToken(GET_CAT_UNIDAD_MEDIDA_EXCEL, search0) //### **
      .then((response) => {
        // props.props.setMessageSnackBar(response.data.message, 'success');

        const link = document.createElement("a");
        link.href = `data:${response.data.data.mime_type};base64,${response.data.data.base64}`;
        link.download = response.data.data.file_name;
        link.click();
      })
      .catch((error) => {
        error.response.data.errors.forEach(element => {
          props.props.setMessageSnackBar(element, 'warning');
        });
      }).finally(() => {
        props.props.setCloseLoadingScreen();
      });
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
        (dato) =>
          dato.clave_unidad_medida.toLowerCase().includes(search0.toLocaleLowerCase()) ||
          dato.descripcion_unidad_medida.toLowerCase().includes(search0.toLowerCase())//### **
      );
    }
    if (search1 != "Mostrar todos") {
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
    }
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
    results = results.sort((a, b) =>
      a.clave_unidad_medida.localeCompare(b.clave_unidad_medida)
    ); //### **
  }

  if (descNombre == true) {
    results = results.sort((a, b) =>
      b.clave_unidad_medida.localeCompare(a.clave_unidad_medida)
    ); //### **
  }

  const NombreAsc = () => {
    setASCNombre(true);
    setDescNombre(false);
  };
  const NombreDesc = () => {
    setASCNombre(false);
    setDescNombre(true);
  };

  //::::::::::: USEEFECT ::::::::::::::::::::
  useEffect(() => {
    GetListCatalogo();
  }, []);

  return (
    <div style={{ padding: "1%" }}>
      <center>
        <h2>Catálogo {titulo}</h2>
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
              className="inputTextSize50"
              value={search0}
              onChange={searcher0}
              placeholder="Buscar..."
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
        <Grid item xs={12} sm={4} md={4}>
          <Box
            sx={{
              display: { xs: "flex", sm: "flex", md: "flex" },
              justifyContent: { xs: "center", sm: "flex-end", md: "flex-end" },
            }}
          >
            <Tooltip title={"Descargar Excel"} arrow>
              <IconButton
                onClick={descargarExcel}
                aria-label="bloqueado"
                color="primary"
              >
                <SimCardDownloadIcon
                  sx={{ color: "#0066CC", width: "40px", height: "30px" }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Agregar"} arrow>
              <IconButton
                onClick={function () {
                  handleOpen(null);
                }}
                aria-label="bloqueado"
                color="primary"
              >
                <AddCircleIcon
                  sx={{ color: "#0066CC", width: "40px", height: "30px" }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      <label className="textLabel1">
        Total de Registros: {results.length}{" "}
      </label>
      <TableContainer component={Paper}
      >
        <Table
          sx={{ tableLayout: "auto", minWidth: 80, maxHeight: "300px" }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" style={{
                width: "1%",
                whiteSpace: "nowrap",
                padding: "0 8px"
              }}>
                <label className="textLabel3">{titulo}</label>
                <Tooltip title="Ordenar por Abecedario">
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
                </Tooltip>
              </StyledTableCell>

              <StyledTableCell align="center" style={{ width: "fit-content", whiteSpace: "nowrap", padding: "0 8px" }}>
                <label className="textLabel3">Descripción</label>
              </StyledTableCell>

              <StyledTableCell align="center" width="15%">
                <label className="textLabel3">Habilitado</label>
                <Tooltip title="Filtrar por Estatus">
                  <IconButton
                    onClick={porHabilitado}
                    style={{ width: "30px", height: "30px" }}
                  >
                    <FilterAltIcon
                      sx={{ color: "black" }}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </IconButton>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="center" width="10%">
                <label className="textLabel3">Acciones</label>
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
                  <StyledTableCell style={{ width: "1%", whiteSpace: "nowrap" }}>
                    <label className="textLabel4">
                      {item.clave_unidad_medida}
                    </label>{" "}
                    {/* //### ** */}
                  </StyledTableCell>

                  <StyledTableCell>
                    <label className="textLabel4">
                      {item.descripcion_unidad_medida}
                    </label>{" "}
                    {/* //### ** */}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Checkbox disabled checked={item.habilitado} />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton
                      aria-label="editar"
                      color="primary"
                      onClick={function () {
                        handleOpen(item.id);
                        {
                          /* //### ** */
                        }
                      }}
                    >
                      <EditNoteIcon sx={{ color: "#0066CC" }} />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Acciones
        open={open}
        props={props}
        handleClose={handleClose}
        handleCancel={handleCancel}
        id={id}
        titulo={titulo}
      />
    </div>
  );
};

export default Afectacion;
