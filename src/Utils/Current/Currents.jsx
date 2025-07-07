import PropTypes from 'prop-types';
import { NumericFormat, PatternFormat } from 'react-number-format';

//numeros
export function TextMaskFormatoNumber(props) {
    const { inputRef, ...other } = props;
    const maxIntegerLength = 6;
    return (
        <NumericFormat
            type='text'
            {...other}
            getInputRef={inputRef}   // Para mantener la referencia del input
            decimalScale={3}         // Permitir solo dos decimales
            fixedDecimalScale={false} // Mantener siempre dos decimales
            allowNegative={false}     // No permitir valores negativos
            isNumericString={true}
            format={(value) => {
                // Dividir la entrada en parte entera y decimal
                const [integerPart, decimalPart] = value.split('.');
                
                // Limitar la parte entera a `maxIntegerLength` dígitos
                const limitedIntegerPart = integerPart.slice(0, maxIntegerLength);
                
                // Recomponer el valor formateado
                return decimalPart !== undefined
                    ? `${limitedIntegerPart}.${decimalPart}`
                    : limitedIntegerPart;
            }}
            isAllowed={(values) => {
                const { formattedValue } = values;
                const integerPart = formattedValue.split('.')[0];
                // Asegurar que la parte entera no supere el límite
                return integerPart.length <= maxIntegerLength;
            }}
        />
    );
}
TextMaskFormatoNumber.propTypes = {
    inputRef: PropTypes.func.isRequired,
};
// monedas


export function TextMaskFormatoMoneda(props) {
    const { inputRef, ...other } = props;
    return (
        <NumericFormat
            {...other}
            allowLeadingZeros
            prefix={'$'}
            thousandSeparator=","
            decimalScale={0}
            fixedDecimalScale />
    );
}
TextMaskFormatoMoneda.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

export function TextMaskFormatoPorcentaje(props) {
    const { inputRef, ...other } = props;
    return (
        <NumericFormat
            {...other}
            allowLeadingZeros
            suffix={'%'}
            decimalScale={2}
        />
    );
}
TextMaskFormatoPorcentaje.propTypes = {
    inputRef: PropTypes.func.isRequired,
};


export function TextMaskTelefono(props) {
    const { inputRef, ...other } = props;
    return (
        <PatternFormat
            {...other}
            format="(###)-#-###-###"
            //format="+1 (###) #### ###"
            allowEmptyFormatting mask="#" />
    );
}
TextMaskTelefono.propTypes = {
    inputRef: PropTypes.func.isRequired,
};



export function TextMaskTelefono2(props) {
    const { inputRef, ...other } = props;
    return (
        <NumericFormat
            {...other}
            allowLeadingZeros
            prefix={'+'} />
    );
}
TextMaskTelefono2.propTypes = {
    inputRef: PropTypes.func.isRequired,
};
