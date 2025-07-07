import { Box, Button, Grid, IconButton, Pagination, Stack, Tooltip } from '@mui/material';
//REACT
import React, { useState } from 'react';
//COMPONENTES MUI MATERIAL
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
//ACCIONES
import { GET_DIFERENCIA_CA, GET_NUM_CONTEOS_BY_CARGA } from '../Constants/ApiConstants';
import requests from '../components/AxiosCalls/AxiosCallsLocal';
import AlertaFilter from "./FilterCatalogos";
//ICONOS 
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import moment from 'moment';
import * as XLSX from 'xlsx';
import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';
import { TextFieldGeneral } from '../Styles/TextField/TextField';

export const formatDecimal = (amount, locale = 'es-MX', minimumFractionDigits = 2) => {
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrency = (amount, currency = 'MXN', locale = 'es-MX', minimumFractionDigits = 2) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: minimumFractionDigits,
  }).format(amount);
};

const AlertReporteComparativoAnual = (props) => {

  const conteos = { conteo1: 1, conteo2: 2, conteo3: 3 };
  //::::::::::: OBTENER FILTRO ::::::::::::::::::::
  const [_ListCatalogo, setListCatalogo] = useState([])
  const GetListCatalogo = (idCarga, numConteo) => {
    props.props.props.props.setOpenLoadingScreen()
    requests
      .postToken(GET_DIFERENCIA_CA + idCarga, conteos) //### ** 
      .then((response) => {
        setListCatalogo(response.data.data.original)
        props.props.props.props.setCloseLoadingScreen()
      })
      .catch((error) => {
        error.data.errors.forEach(element => {
          props.props.props.props.setMessageSnackBar(element, 'warning');
        });
        props.props.props.props.setCloseLoadingScreen()
      })
  }

  const [_ListNumConteo, setListNumConteo] = useState([])
  const GetListNumConteo = (idCarga) => {
    props.props.props.props.setOpenLoadingScreen()
    requests
      .getToken(GET_NUM_CONTEOS_BY_CARGA + idCarga) //### ** 
      .then((response) => {
        setListNumConteo(response.data.data.original)
        props.props.props.props.setCloseLoadingScreen()
      })
      .catch((error) => {
        error.data.errors.forEach(element => {
          props.props.props.props.setMessageSnackBar(element, 'warning');
        });
        props.props.props.props.setCloseLoadingScreen()
      })
  }

  //::::::::::: PAGINADO ::::::::::::::::::::
  let paginas = 0;
  const [page, setPage] = React.useState(1);
  const [inicio, setInicio] = React.useState(0);
  const [fin, setFin] = React.useState(10);
  const [tamanio, setTamanio] = React.useState(10);

  const handleChange = (event, value) => {
    setPage(value);
    setInicio(parseInt((value - 1) * tamanio))
    setFin(parseInt(value * tamanio))
  };

  //::::::::::: FILTROS ::::::::::::::::::::
  const [filter, setFilter] = useState(false);
  const closeFilter = () => {
    setFilter(false);
  };

  const regresar = () => {
    setInicio(0)
    setFin(10)
    setPage(1);
  }

  //::::::::::: FILTROS - SEARCH ::::::::::::::::::::
  const [search0, setSearch0] = useState('');
  const [search1, setSearch1] = useState("true");
  var results = _ListCatalogo.sort((a, b) => a.id_producto - b.id_producto);
  if (!search0 && !search1) {
    paginas = Math.ceil((results.length / tamanio));
  } else {
    if (search0 !== "") {
      results = results.filter((dato) =>
        dato.descripcion.toLowerCase().includes(search0.toLocaleLowerCase()) //### **
      );
    }

    paginas = Math.ceil((results.length / tamanio));
  }

  const searcher0 = (e) => {
    setSearch0(e.target.value);
    setInicio(0)
    setFin(10)
    setPage(1);
  }

  //::::::::::: FILTROS - ORDENAR POR ASC Y DESC ::::::::::::::::::::
  const [ascNombre, setASCNombre] = useState(false);
  const [descNombre, setDescNombre] = useState(false);

  if (ascNombre === true) {
    results = results.sort((a, b) => a.codigo.localeCompare(b.codigo)); //### **
  }

  if (descNombre === true) {
    results = results.sort((a, b) => b.codigo.localeCompare(a.codigo)); //### **
  }

  const NombreAsc = () => {
    setASCNombre(true);
    setDescNombre(false);
  };
  const NombreDesc = () => {
    setASCNombre(false);
    setDescNombre(true);
  };

  const [_numConteo, setNumConteo] = useState(props._numConteo);
  const [_Estatus, setEstatus] = useState(false);
  if (props.open === true && props.idCarga != null && _Estatus === false) {
    setEstatus(true);
    setNumConteo(props._numConteo);
    GetListNumConteo(props.idCarga);
    GetListCatalogo(props.idCarga, props._numConteo);
  }

  const exportarExcel = () => {
    const worksheetData = [];

    Object.keys(results).forEach((claveProducto) => {
      const productoData = results[claveProducto];
      worksheetData.push({
        "Material": productoData.codigo,
        "Texto breve de material": productoData.descripcion,
        "Ubicación":productoData.ubicacion,
        "UME": productoData.unidad_medida,
        "Grupo de artículos": productoData.grupo_articulos,
        "SAP": parseFloat(productoData.sap),
        "Conteo Físico 1": parseFloat(productoData.fisico_conteo_1),
        "Usuario Conteo 1":productoData.usuario_conteo1,
        "Conteo Físico 2": parseFloat(productoData.fisico_conteo_2),
        "Usuario Conteo 2":productoData.usuario_conteo2,
        "Diferencia": parseFloat(productoData.diferencia),
        //"Importe unitario": formatCurrency(productoData.importe_unitario, 'MXN', 'es-MX', 2),
        //"$ Diferencia": formatCurrency(productoData.DiferenciaMoneda, 'MXN', 'es-MX', 2),
        //"Importe total": formatCurrency(productoData.ImporteTotal, 'MXN', 'es-MX', 2),
        "Importe unitario": parseFloat(productoData.importe_unitario),
        "Diferencia Conteo 1 Importe": parseFloat(productoData.diferencia_moneda_c1),
        "Diferencia Conteo 2 Importe": parseFloat(productoData.diferencia_moneda_c2),
        "Conteo Físico 3": parseFloat(productoData.fisico_conteo_3),
        "Usuario Conteo 3":productoData.usuario_conteo3,
        "Diferencia Física": parseFloat(productoData.diferencia_fisica_c3),
        "Diferencia Conteo 3 Importe": parseFloat(productoData.diferencia_moneda_c3),
        "Importe total SAP": parseFloat(productoData.importe_total),
      });
    });
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    worksheet['!cols'] = [
      { wpx: 100 }, { wpx: 200 }, { wpx: 50 }, { wpx: 100 }, { wpx: 80 }, { wpx: 80 }, { wpx: 80 },
      { wpx: 80 }, { wpx: 80 }, { wpx: 80 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Comparativa");
    const nombreArchivo = `${props.claveCarga}_ComparativaAnual_Dif_${moment().format("YYYY-MM-DD HH:mm:ss")}.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);
  };

  const handleAsigConteo = (e) => {
    setNumConteo(e.target.value)
    GetListCatalogo(props.idCarga, e.target.value);
  }

  return (
    <div>

      <Grid style={{ borderRadius: "10px" }}>
        <center>
          <h2>Detalle Diferencias Comparativo Anual</h2>
        </center>

        <AlertaFilter
          regresar={regresar}
          closeFilter={closeFilter}
          filter={filter}
          props={props}
          setSearch1={setSearch1}
          search1={search1}
        />

        <Grid container>
          <Grid item xs={12} sm={4} md={4} />
          <Grid item xs={12} sm={4} md={4} />

          <Grid item xs={12} sm={4} md={4}>
            <Box
              sx={{
                display: { xs: "flex", sm: "flex", md: "flex" },
                justifyContent: {
                  xs: "center",
                  sm: "flex-end",
                  md: "flex-end",
                },
              }}
            >
              <Tooltip title={"Exportar a Excel"} arrow>
                <Button
                  //onChange={handleUpload}
                  onClick={exportarExcel}
                  component="label"
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  style={{ width: "2%" }}
                ></Button>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
        <br />
        <Grid item xs={12} sm={4} md={4}></Grid>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          height={100}
          width={'100%'}
        >
          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" colSpan={7}>
                    Encabezado Conteo
                  </StyledTableCell>

                </TableRow>
                <TableRow>
                  <StyledTableCell align="center" >
                    <label className='textLabel3'>Clave Carga</label>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <label className='textLabel3'>No. Conteo</label>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <label className='textLabel3'>Emitido el</label>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow
                >
                  <StyledTableCell align="center">
                    <label className='textLabel4'> {props.claveCarga}</label> {/* //### ** */}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <label className='textLabel4'> {_numConteo}</label> {/* //### ** */}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <label className='textLabel4'> {moment().format('YYYY-MM-DD HH:mm:ss')}</label> {/* //### ** */}
                  </StyledTableCell>
                </StyledTableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Grid container>
          {/*<Grid item xs={12} sm={4} md={4}>
                      <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                        <label className="textLabel2">{"Conteos"}</label>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <SelectGeneral
                          // idprops={props.id}
                          id="conteo"
                          name="conteo"
                          value={_numConteo}
                          onChange={handleAsigConteo}
                          className="inputSelectSize25"
                        >
                          {_ListNumConteo.map((item) => (
                            <MenuItemGeneral
                              key={item.conteo} // ### **
                              value={item.conteo}
                            >
                              {item.conteo}
                            </MenuItemGeneral>
                          ))}
                        </SelectGeneral>
                      </Grid>
                    </Grid>*/}
          <Grid item xs={12} sm={4} md={4}>
          </Grid>
          <Grid item xs={12} sm={4} md={4} />

        </Grid>
        <br />

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
                placeholder="Buscar por texto breve de material."
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
          </Grid>
        </Grid>

        <center>
          <label className="textLabel1">
            Total de Registros: {results.length}{" "}
          </label>
          <Box  sx={{
                    width: '100%', // altura del Box
                    overflowX: "auto" // agregar scroll
                }}>
            <TableContainer component={Paper} sx={{
              minWidth: "2000px",
              //maxHeight: "300px", // Altura máxima con scroll vertical
              overflowX: "auto", // Scroll horizontal
            }}>
              <Table
                stickyHeader // Mantiene los encabezados visibles

                aria-label="customized table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Material</label>
                      <Tooltip title="Ordenar por Abecedario">
                        <IconButton
                          onClick={NombreAsc}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <ExpandLessIcon
                            sx={{ color: "white" }}
                            style={{ width: "20px", height: "20px" }}
                          />
                        </IconButton>
                        <IconButton
                          onClick={NombreDesc}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <ExpandMoreIcon
                            sx={{ color: "white" }}
                            style={{ width: "20px", height: "20px" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">
                        Texto breve de material
                      </label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Ubicación</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">UME</label>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <label className="textLabel3">
                        Grupo de artículos
                      </label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">SAP</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Conteo Físico 1</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Usuario Conteo 1</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Conteo Físico 2</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Usuario Conteo 2</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Diferencia</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">
                        Importe Unitario
                      </label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Diferencia Conteo 1 Importe</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Diferencia Conteo 2 Importe</label>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <label className="textLabel3">Conteo Físico 3</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Usuario Conteo 3</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className="textLabel3">Diferencia Física</label>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <label className="textLabel3">Diferencia Conteo 3 Importe</label>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <label className="textLabel3">Importe total SAP</label>
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
                        key={item.id_producto}
                        className="font-weight1"
                      >
                        <StyledTableCell>
                          <label className="textLabel4">
                            {item.codigo}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>

                        <StyledTableCell>
                          <label className="textLabel4">
                            {item.descripcion}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell>
                          <label className="textLabel4">
                            {item.ubicacion}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell>
                          <label className="textLabel4">{item.unidad_medida}</label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          <label className="textLabel4">
                            {item.grupo_articulos}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          <label className="textLabel4">{item.sap}</label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          <label className="textLabel4">
                            {item.fisico_conteo_1}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell>
                          <label className="textLabel4">
                            {item.usuario_conteo1}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <label className="textLabel4">
                            {item.fisico_conteo_2}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell>
                          <label className="textLabel4">
                            {item.usuario_conteo2}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <label className={item.diferencia.includes('-') ? "textLabel5" : "textLabel4"}>
                            {item.diferencia}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          <label className="textLabel4">
                            {formatCurrency(item.importe_unitario, 'MXN', 'es-MX', 2)}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <label className={item.diferencia_moneda_c1.includes('-') ? "textLabel5" : "textLabel4"}>
                            {formatCurrency(item.diferencia_moneda_c1, 'MXN', 'es-MX', 2)}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <label className={item.diferencia_moneda_c2.includes('-') ? "textLabel5" : "textLabel4"}>
                            {formatCurrency(item.diferencia_moneda_c2, 'MXN', 'es-MX', 2)}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <label className="textLabel4">
                            {item.fisico_conteo_3}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell>
                          <label className="textLabel4">
                            {item.usuario_conteo3}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <label className={item.diferencia_fisica_c3.includes('-') ? "textLabel5" : "textLabel4"}>
                            {item.diferencia_fisica_c3}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <label className={item.diferencia_moneda_c3.includes('-') ? "textLabel5" : "textLabel4"}>
                            {formatCurrency(item.diferencia_moneda_c3, 'MXN', 'es-MX', 2)}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <label className="textLabel4">
                            {formatCurrency(item.importe_total, 'MXN', 'es-MX', 2)}
                          </label>{" "}
                          {/* //### ** */}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </center>
      </Grid>
    </div>
  );
}
export default AlertReporteComparativoAnual
