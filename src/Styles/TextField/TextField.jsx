import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TextMaskFormatoNumber } from '../../Utils/Current/Currents';

// ::::::::::::::::::::::::::::ESTILO GENERAL::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export const TextFieldGeneral = styled((props) => ( //<-------------- PUEDO RECIBIR UN PROPS PARA HABILITADO O DESHABILITADO
	<TextField InputProps={{ required: false }} {...props}
		fullWidth
		autoComplete="off"
		required
		disabled={props.idprops != null || props.idprops != undefined ? true : false || props.disabled !== undefined ? props.disabled : !!props.idprops}
		size="small"
		sx={{
			'& .MuiInputBase-input': {
				fontSize: 16,
				height: '15px',
			},
		}}
	/>
))(({ theme }) => ({}));

export const TextFieldGeneral2 = styled((props) => ( //<-------------- PUEDO RECIBIR UN PROPS PARA HABILITADO O DESHABILITADO
	<TextField InputProps={{}} {...props}
		fullWidth
		autoComplete="off"
		disabled={props.idprops != null || props.idprops != undefined ? true : false
			|| props.disabled !== undefined ? props.disabled : !!props.idprops
		}
		size="small"
		sx={{
			'& .MuiInputBase-input': {
				fontSize: 16,
				height: '15px',
			},
		}}
	/>
))(({ theme }) => ({}));

// ::::::::::::::::::::::::::::ESTILO LOGIN::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export const TextFailedLogin = styled((props, { idprops }) => (
	<TextField InputProps={{}} {...props}
		fullWidth
		required
		size="small"

		sx={{
			'& .MuiInputBase-input': {
				fontSize: 16,
				height: '15px',
			},
		}}
	/>
))(({ theme }) => ({}));


// ::::::::::::::::::::::::::::ESTILO GENERAL::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export const TextFieldNumber = styled((props) => ( //<-------------- PUEDO RECIBIR UN PROPS PARA HABILITADO O DESHABILITADO
	<TextField InputProps={{ inputComponent: TextMaskFormatoNumber }} {...props}
		fullWidth
		autoComplete="off"
		required
		disabled={props.idprops != null || props.idprops != undefined ? true : false
			|| props.disabled !== undefined ? props.disabled : !!props.idprops}
		size="small"
		sx={{
			'& .MuiInputBase-input': {
				fontSize: 16,
				height: '15px',
			},
		}}

	/>
))(({ theme }) => ({}));
