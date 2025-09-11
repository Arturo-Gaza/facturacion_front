import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Box, Grid } from '@mui/material';
import { TextFieldGeneral } from '../Styles/TextField/TextField';
import axios from 'axios';
import Button from '@mui/material/Button';
import requests from '../components/AxiosCalls/AxiosCallsLocal';
import { MANDAR_SMS } from '../Constants/ApiConstants';
const CountryPhoneSelectors = () => {
  const [_AsigPais, setAsigPais] = useState({
    code: 'MX',
    name: 'México',
    dialCode: '+52'
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countries, setCountries] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axios.get(
          'https://restcountries.com/v3.1/all?fields=name,flag,idd,cca2,translations'
        );

        const mapped = data.map((c) => {
          let dialCode = '';

          if (c.idd?.root) {
            if (c.idd.suffixes && c.idd.suffixes.length === 1) {
              dialCode = `${c.idd.root}${c.idd.suffixes[0]}`;
            } else {
              dialCode = c.idd.root;
            }
          }

          return {
            code: c.cca2,
            name: c.translations?.spa?.common || c.name.common,
            dialCode,
            flag: c.flag
          };
        });

        const filteredCountries = mapped.filter(country => country.dialCode);
        filteredCountries.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(filteredCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleAsigPais = (value) => {
    setAsigPais(value);
    if (value) {
      setInputValue(`${value.flag} ${value.name} (${value.dialCode})`);
    }
    console.log('País seleccionado:', value);
  };
  const onSMS = (value) => {
    const data = {
      numero: phoneNumber,
      codigo: _AsigPais.dialCode,
    }
    console.log("Mensaje")
    console.log(phoneNumber)
    requests.postToken(MANDAR_SMS, data)
      .then((response) => {


      })
      .catch((error) => {
        console.log('VER MI ERRORS', error)
        error.response.data.errors.forEach(element => {
          props.setMessageSnackBar(element, 'warning');
        });
        props.setCloseLoadingScreen()
      })
  };

  const handlePhoneChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} alignItems="flex-end">
          {/* Selector de País - Mismo tamaño que el teléfono */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) =>
                option ? `${option.flag} ${option.name} (${option.dialCode})` : ''
              }
              renderInput={(params) => (
                <TextFieldGeneral
                  className="inputTextSize100"
                  label={'País'}
                  {...params}
                  placeholder="Buscar país..."
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '56px' // Misma altura que el TextField estándar
                    }
                  }}
                />
              )}
              value={countries.find((option) => option.code === _AsigPais.code) || null}
              onChange={(event, value) => handleAsigPais(value)}
              inputValue={inputValue}
              onInputChange={(event, newInputValue, reason) => {
                if (reason === 'input' || reason === 'clear') {
                  setInputValue(newInputValue);
                } else if (reason === 'reset') {
                  const selectedOption = countries.find(option =>
                    `${option.flag} ${option.name} (${option.dialCode})` === newInputValue
                  );
                  if (selectedOption) {
                    setInputValue(`${selectedOption.flag} ${selectedOption.name} (${selectedOption.dialCode})`);
                  }
                }
              }}
              noOptionsText="No hay opciones"
              disableClearable
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  paddingTop: '0px !important',
                  paddingBottom: '0px !important'
                }
              }}
            />
          </Grid>

          {/* Campo de Teléfono - Mismo tamaño que el autocomplete */}
          <Grid item xs={12} sm={6}>
            <TextFieldGeneral
              fullWidth
              label="Número de teléfono"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="1234567890"
              InputProps={{
                startAdornment: (
                  <span style={{
                    marginRight: '8px',
                    color: '#666',
                    minWidth: '30px' // Ancho fijo para el código
                  }}>
                    {_AsigPais.dialCode}
                  </span>
                ),
                sx: {
                  height: '56px',
                  alignItems: 'center'
                }
              }}
              inputProps={{
                maxLength: 15,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                style: {
                  paddingTop: '0',
                  paddingBottom: '0',
                  height: '100%'
                }
              }}
              sx={{
                '& .MuiInputBase-root': {
                  height: '56px',
                  alignItems: 'center'
                },
                '& .MuiInputLabel-root': {
                  transform: 'translate(14px, 18px) scale(1)',
                  '&.Mui-focused, &.MuiFormLabel-filled': {
                    transform: 'translate(14px, -9px) scale(0.75)'
                  }
                }
              }}
            />

          </Grid>



        </Grid>
        <Button
          onClick={onSMS}
          fullWidth
          variant="contained"
          className='btn-aceptar'
        >
          Confirmar y mandar SMS
        </Button>
      </Box>


    </div>
  );
};

export default CountryPhoneSelectors;