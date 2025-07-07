import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';


function secondsToString(seconds) {
    var minute = Math.floor((seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    var second = seconds % 60;
    second = (second < 10) ? '0' + second : second;
    return minute + ':' + second;
}

export function CircularProgress1(props) {

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress size="3rem" variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${secondsToString(Math.round(props.value / 1.6666666667))}`}
                    {`${Math.round(props.value / 1.6666666667)}` <= 0 ? (props.stopInterval == false ? (window.location.reload()) : (null)) : (null)}
                </Typography>
            </Box>
        </Box>
    );
}

CircularProgress1.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
};


export function CircularProgress2(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress size="3rem" variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${secondsToString(Math.round(props.Time2 / 1.6666666667))}`}
                    {`${Math.round(props.Time2 / 1.6666666667)}` <= 0 ? (props.stopInterval == false ? (window.location.reload()) : (null)) : (null)}
                </Typography>
            </Box>
        </Box>
    );
}

CircularProgress2.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
};


export function CircularProgress3(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress style={{ color: 'rgba(5, 240, 181, 0.9)' }} size="3rem" variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="white">
                    {`${secondsToString(Math.round(props.progressTime))}`}
                </Typography>
                {props.idUsuario}
            </Box>
        </Box>
    );
}

CircularProgress3.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
};

export function CircularProgress4(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress style={{ color: 'rgba(5, 240, 181, 0.9)' }} size="3rem" variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="white">
                    {`${secondsToString(Math.round(props.progressTime))}`}
                </Typography>
                {props.idUsuario}
            </Box>
        </Box>
    );
}

CircularProgress4.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
};




