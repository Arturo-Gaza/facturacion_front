import Backdrop from '@mui/material/Backdrop';
import { makeStyles } from '@mui/styles';
import Lottie from 'lottie-react';
import React from 'react';
import LoadingLottie1 from '../Utils/lottie/loadingLottie1.json';
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 9999,
        color: '#fff',
    },
}));

const LoadingScreen = (props) => {
    const classes = useStyles();
    return (
        <div>
            <Backdrop className={classes.backdrop} open={props.open} >
                {/* <CircularProgress color="primary" />
                    <Typography >
                        Cargando..... {props.Msj}
                    </Typography>                    */}
                <div style={{ width: '100px', margin: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                    <Lottie animationData={LoadingLottie1} loop={true} autoplay={true} />
                    <p className="bold co-white "> Cargando... {props.Msj}</p>
                </div>
            </Backdrop>
        </div>
    )
}
export default LoadingScreen;
