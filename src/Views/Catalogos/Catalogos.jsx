import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStepContext, useStepSetContext } from '../../hooks/StepProvider';

//***********TABS::::::::::::::::::::::: */
import { Box } from '@mui/material';
//import Tabs1 from '../../components/Catalogos/Views/1_Almacen';
import Tabs6 from '../../components/Catalogos/Views/10_Tipo';
import Tabs8 from '../../components/Catalogos/Views/11_Departamento';
import Tabs3 from '../../components/Catalogos/Views/2_Unidad_Medida';
import Tabs4 from '../../components/Catalogos/Views/3_Grupo_Familia ';
import Tabs2 from '../../components/Catalogos/Views/4_Producto';
import Tabs5 from '../../components/Catalogos/Views/7_Moneda';
import Tabs7 from '../../components/Catalogos/Views/9_Categoria';
//import Tabs4 from '../../components/Catalogos/Views/4_Producto';
//import Tabs6 from '../../components/Catalogos/Views/5_Roles';
//import Tabs7 from '../../components/Catalogos/Views/6_Ubicacion';
//import Tabs8 from '../../components/Catalogos/Views/8_Centro';

// import Tabs3 from '../../components/1_CUSAP/Usuarios/ConsultaUsuario'



const HomeView = (props) => {
    //:::::::::::::::::::::: step :::::::::::::::::::::::
    const step = useStepContext();
    const setStep = useStepSetContext();
    //:::::::::::::::::::::::::::::::::::::::::::::::::::
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    return (
        <Box>
            <center>
                {step === 0 && (
                    <p className='p3' style={{ fontWeight: '500' }}>
                         <Tabs2 props={props} />
                    </p>
                )}
                {step === 1 && (
                    <p className='p3' style={{ fontWeight: '500' }}>
                        <Tabs2 props={props} />
                    </p>
                )}
                {step === 2 && (
                    <p className='p3' style={{ fontWeight: '500' }}>
                        <Tabs3 props={props} />
                    </p>
                )}
                {step === 3 && (
                    <p className='p3' style={{ fontWeight: '500' }}>
                        <Tabs4 props={props} />
                    </p>
                )}
                {step === 4 && (
                    <p className='p3' style={{ fontWeight: '500' }}>
                        <Tabs5 props={props} />
                    </p>
                )}

                {step === 5 && (
                    <p className='p3' style={{ fontWeight: '500' }}>
                        <Tabs6 props={props} />
                    </p>
                )}
               {step === 6 && (
                    <p className='p4' style={{ fontWeight: '500' }}>
                        <Tabs7 props={props} />
                    </p>
                )}
                {step === 7 && (
                    <p className='p5' style={{ fontWeight: '500' }}>
                        <Tabs8 props={props} />
                    </p>
                )}
            </center>
        </Box>
    )
}

export default HomeView