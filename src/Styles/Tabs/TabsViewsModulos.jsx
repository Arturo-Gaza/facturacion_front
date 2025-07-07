import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Tab, Tabs } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useState } from 'react';
import { useUserContenidoContext } from '../../hooks/UserConteProvider';

export function TabsViewsModulos({ navButtons, props }) {
    //:::::::::::::::::::::: UserConteProvider :::::::::::::::::::::::
    const user = useUserContenidoContext();
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    const [tabIndex, setTabIndex] = useState(0)
    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex)
    }

    const handleNext = () => {
        if (tabIndex <= 20) {
            setTabIndex((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setTabIndex((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <>
            <Box >
                <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="trasnparent"
                    variant="scrollable"
                    scrollButtons="auto"
                    size="small"
                    sx={{
                        width: '100%',
                        '& .MuiTabs-scrollButtons .MuiSvgIcon-root': {
                            fontSize: 35, // Cambia el tamaño del icono
                        },
                        '& .MuiTabs-scrollButtons': {
                            width: 60,
                            '&.Mui-disabled': { opacity: 0.2 },
                        },
                        background: user.ColorSubModulos
                    }}
                >
                    {navButtons.map(item_1 => (
                        <Tab
                            sx={{ minHeight: 50, width: '20%', height: '1px', fontSize: 11, padding: -1, background: user.ColorSubModulos }}
                            icon={item_1.icon}
                            iconPosition="start"
                            label={<>{item_1.title}{item_1.openitem ? <ExpandLess sx={{ marginLeft: 2 }} /> : <ExpandMore sx={{ marginLeft: 2 }} />}</>}
                            onClick={item_1.openhandle}
                            onMouseEnter={item_1.openhandle}
                        />
                    ))}
                </Tabs>
                {navButtons.map(item_1 => (
                    <Popper
                        onMouseLeave={item_1.closehandle}
                        open={Boolean(item_1.openitem)}
                        anchorEl={item_1.openitem}
                        transition
                        disablePortal
                        sx={{ zIndex: 2 }}
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={item_1.closehandle}>
                                        <MenuList
                                            autoFocusItem={item_1.openitem}
                                            id="composition-menu"
                                            aria-labelledby="composition-button"
                                            style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '-5px' }}
                                        >
                                            {
                                                item_1.subtitle.map(item_2 => (
                                                    <MenuItem onClick={(e) => item_2.handleTab(item_2.tabNum)}>
                                                        <ListItemIcon>
                                                            {item_2.icon}
                                                        </ListItemIcon>
                                                        <ListItemText primary={item_2.title} />
                                                    </MenuItem>
                                                ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                ))}
            </Box>
        </>
    );
}



{/* 
    *****EJEMPLO 1 CON MENU******
    <Menu
anchorEl={item_1.openitem}
open={Boolean(item_1.openitem)}
onClose={item_1.closehandle}
onClick={item_1.closehandle}
transformOrigin={{ horizontal: 'right', vertical: 'top' }}
anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
keepMounted
style={{ background: 'rgba(241, 241, 241, 0.8)' }}
autoFocus={true}


>
{
    item_1.subtitle.map(item_2 => (
        <MenuItem onClick={item_1.closehandle}>
            <ListItemIcon>
                {item_2.icon}
            </ListItemIcon>
            <ListItemText primary={item_2.title} />
        </MenuItem>
    ))}
</Menu> */}



{/* 
    *************EJEMPLO 2 COMO EJEMPLO  BUTTON *************
    <Grid container justifyContent="center">
    {
        navButtons.map(item_1 => (
            <Grid item xs={12} sm={6} md={2}>

                <>
                    <ListItemButton onClick={item_1.openhandle}>
                        <ListItemIcon>
                            {item_1.icon}
                        </ListItemIcon>
                        <ListItemText primary={item_1.title} />
                        {item_1.openitem ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={item_1.openitem} timeout="auto" unmountOnExit >
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Informacion del sistema" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </>

            </Grid>
        ))
    }
</Grid> */}


{/* 
     *****EJEMPLO 3 CON OTRO ESTILO******
    <Grid container justifyContent="center">
                {
                    navButtons.map(item_1 => (
                        <Grid item xs={12} sm={6} md={2}>
                            <>
                                <Box >
                                    <ListItemButton onClick={item_1.openhandle}>
                                        <ListItemIcon>
                                            {item_1.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item_1.title} />
                                        {item_1.openitem ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Menu
                                        anchorEl={item_1.openitem}
                                        open={Boolean(item_1.openitem)}
                                        onClose={item_1.closehandle}
                                        id="account-menu"
                                        onClick={item_1.closehandle}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-40%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        keepMounted
                                    >
                                        {
                                            item_1.subtitle.map(item_2 => (
                                                <MenuItem onClick={item_1.closehandle}>
                                                    <ListItemIcon>
                                                        {item_2.icon}
                                                    </ListItemIcon>
                                                    <ListItemText primary={item_2.title} />
                                                </MenuItem>
                                            ))}
                                    </Menu>
                                </Box>
                            </>
                        </Grid>
                    ))
                }
            </Grid> */}
