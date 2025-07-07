
import axios from "axios";
import $ from 'jquery';
import { AxiosPermisos } from '../../components/AxiosCalls/AxiosPermisos';
import { useNavigate } from "react-router-dom";

var url = await axios("../../../assets/config.json").then(r => r.data);
var getBaseUrl = url.BASE_URL;

AxiosPermisos();

var token = sessionStorage.getItem("token");

let e = {
  data: {
    success: null,
    message: "",
    errors: []
  },
  response: {
    data: {
      success: null,
      message: "",
      errors: []
    }
  }
}

axios.interceptors.response.use(
  response => response,
  (error) => {
    const { status, data } = error?.response || {};
    if (error.message === "Network Error" ||
      (status === 500 && typeof data === "string" && data.includes("ECONNREFUSED"))) {
      e = {
        response: {
          data: {
            success: false,
            message: "No se pudo conectar con el servidor, verifique que el servidor este activo.",
            errors: [
              "No se pudo conectar con el servidor, verifique que el servidor este activo."
            ]
          }
        }
      };
      sessionStorage.clear();
      localStorage.removeItem("expireTime");
      // Espera 3 segundos antes de redirigir
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

      return Promise.reject(e);
    }
    if (status === 401) {
      e = {
        response: {
          data: {
            success: false,
            message: "¡Tu sesión ha caducado! Ingresa nuevamente tus datos para continuar.",
            errors: [
              "¡Tu sesión ha caducado! Ingresa nuevamente tus datos para continuar."
            ]
          }
        }
      };
      sessionStorage.clear();
      localStorage.removeItem("expireTime");
      // Espera 3 segundos antes de redirigir
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

      return Promise.reject(e);
    }

    return Promise.reject(error);
  }
);


// const responseBody1 = (response) => response?.data;

const responseBody = (response) => response;
const requests = {
  postJQuery: (url, body) =>
    $.post({
      url: getBaseUrl + url,
      data: body, // Puedes ajustar los datos según tus necesidades
      contentType: "application/json",
      contentType: "text/plain",
      credentials: 'include',
      success: function (data) {
        var responseData = data;
        if (responseData.success) {
          // document.getElementById('resultText').value = 'OK';
        } else {
          //document.getElementById('resultText').value = 'Error';
        }
      },
      error: function (xhr, status, error) {
        console.error('Error:', status, error);
        //document.getElementById('resultText').value = 'Error';
      }
    })
  ,
  get: (url, id = "") =>
    axios
      .get(!id ? url : `${url}/${id}`, {
        baseURL: getBaseUrl,
      })
      .then(responseBody).catch(error => {
        throw e
      }),
  getBody: (url, body) =>
    axios
      .post(url, body, {
        baseURL: getBaseUrl,
      })
      .then(responseBody).catch(error => {
        throw e
      }),
  post: (url, body, id = "") =>
    axios
      .post(!id ? url : `${url}/${id}`, body, {
        baseURL: getBaseUrl,
      })
      .then(responseBody)
      .catch(e => {
        throw e
      }),
  put: (url, body, id = "") =>
    axios
      .put(!id ? url : `${url}/${id}`, body, {
        baseURL: getBaseUrl,
      })
      .then(responseBody).catch(error => {
        throw e
      }),
  delete: (url, id = "") =>
    axios
      .delete(!id ? url : `${url}/${id}`, {
        baseURL: getBaseUrl,
      })
      .then(responseBody).catch(error => {
        throw e
      }),

  deleteToken: (url, id = "") =>
    axios
      .delete(!id ? url : `${url}/${id}`, {
        headers: { "Authorization": `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        baseURL: getBaseUrl
      })
      .then(responseBody).catch(error => {
        throw e
      }),

  getToken: (url, id = "") =>
    axios
      .get(!id ? url : `${url}/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
        baseURL: getBaseUrl
      },
      )
      .then(responseBody).catch(e => {
        throw e
      }),
  postFileToken: (url, body, id = "") =>
    axios
      .post(!id ? url : `${url}/${id}`, body, {
        headers: { "Authorization": `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        baseURL: getBaseUrl
      })
      .then(responseBody).catch(e => {
        throw e
      }),

  postToken: (url, body, id = "") =>
    axios
      .post(!id ? url : `${url}/${id}`, body, {
        headers: { "Authorization": `Bearer ${token}` },
        baseURL: getBaseUrl
      })
      .then(responseBody).catch(e => {
        throw e
      }),
  putToken: (url, body, id = "") =>
    axios
      .put(!id ? url : `${url}/${id}`, body, {
        headers: { "Authorization": `Bearer ${token}` },
        baseURL: getBaseUrl,
      })
      .then(responseBody).catch(e => {
        throw e
      }),
  Url: getBaseUrl
};

export default requests;