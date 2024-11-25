import React, { useState, useContext, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Box,
    Button,
    Badge,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../theme/ThemeContext';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EditIcon from '@mui/icons-material/Edit';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactsIcon from '@mui/icons-material/Contacts';
import CarritoModal from './CarritoModal';
import { ApiFiles } from '../config/constants';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import Logo from '../img/MR.png';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems, clearCart, incrementarCantidad, decrementarCantidad, eliminarItem } = useCarrito();
    const theme = useTheme();
    const navigate = useNavigate();
    const colorMode = useContext(ColorModeContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else if (user.rol.nombreRol === 'ADMIN' || user.rol.nombreRol === 'VENDEDOR') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    }, [user]);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        setLogoutDialogOpen(true);
    };

    const confirmLogout = () => {
        logout();
        clearCart();
        setLogoutDialogOpen(false);
        handleMenuClose();
        navigate('/');
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(true);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setOpenMenu(false);
    };

    const handleMobileMenuOpen = () => {
        setOpenMenu(true);
    };

    const handleMobileMenuClose = () => {
        setOpenMenu(false);
    };

    const activeLinkStyle = {
        textDecoration: 'none',
        color: theme.palette.mode === 'dark' ? '#a5e81d' : '#3b5605',
    };

    return (
        <>
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar sx={{ width: 50, height: 50, bgcolor: 'transparent', marginRight: '10px' }} src={Logo} />

                        <IconButton edge="start" color="inherit" onClick={handleMobileMenuOpen} sx={{ display: { sm: 'none', md: 'none' } }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography sx={{ flexGrow: 1, color: 'white' }} variant="h6">
                            {user ? `Hola, ${user.nombre}` : 'Bienvenido'}
                        </Typography>

                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', flexGrow: 1, gap: 5 }}>
                            <Button
                                color="inherit"
                                startIcon={<HomeIcon />}
                                component={NavLink}
                                to="/"
                                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                            >
                                Inicio
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<InfoIcon />}
                                component={NavLink}
                                to="/nosotros"
                                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                            >
                                Nosotros
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<ContactsIcon />}
                                component={NavLink}
                                to="/contacto"
                                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                            >
                                Contacto
                            </Button>
                        </Box>

                        {user && (
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                                <IconButton color="inherit" onClick={handleModalOpen}>
                                    <Badge badgeContent={cartItems.length} color="secondary">
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>

                                <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>

                                <IconButton color="inherit" onClick={handleMenuClick}>
                                    {user.imagen ? (
                                        <Avatar src={`${ApiFiles.apiBaseUrl}${user.imagen}`} alt="Avatar de usuario" sx={{ width: 40, height: 40 }} />
                                    ) : (
                                        <AccountCircleIcon />
                                    )}
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Menu */}
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMobileMenuClose}>
                <MenuItem component={NavLink} to="/" onClick={handleMobileMenuClose}>Inicio</MenuItem>
                <MenuItem component={NavLink} to="/nosotros" onClick={handleMobileMenuClose}>Nosotros</MenuItem>
                <MenuItem component={NavLink} to="/contacto" onClick={handleMobileMenuClose}>Contacto</MenuItem>
                {user && (
                    <MenuItem onClick={handleModalOpen}>
                        <ListItemIcon>
                            <ShoppingCartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Carrito" />
                    </MenuItem>
                )}
                {user ? (
                    <>
                        <MenuItem component={NavLink} to="/editar-perfil" onClick={handleMobileMenuClose}>
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText primary="Editar Perfil" />
                        </MenuItem>
                        <MenuItem component={NavLink} to="/mis-pedidos" onClick={handleMobileMenuClose}>
                            <ListItemIcon>
                                <ListAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Mis Pedidos" />
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Cerrar Sesión" />
                        </MenuItem>
                    </>
                ) : (
                    <MenuItem component={NavLink} to="/login" onClick={handleMobileMenuClose}>
                        <ListItemIcon>
                            <LoginIcon />
                        </ListItemIcon>
                        <ListItemText primary="Iniciar sesión" />
                    </MenuItem>
                )}
            </Menu>

            {/* Carrito Modal */}
            {user && (
                <CarritoModal
                    isOpen={isModalOpen}
                    handleClose={handleModalClose}
                    cartItems={cartItems}
                    incrementarCantidad={incrementarCantidad}
                    decrementarCantidad={decrementarCantidad}
                    eliminarItem={eliminarItem}
                    clearCart={clearCart}
                />
            )}

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ color: theme.palette.mode === 'dark' ? '#A8DCE7' : '#000' }}>
                    Cerrar Sesión
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ color: theme.palette.mode === 'dark' ? '#A8DCE7' : '#000' }}>
                        ¿Estás seguro de que deseas cerrar sesión? Los productos de tu carrito también se perderán.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutDialogOpen(false)} color="success">
                        Cancelar
                    </Button>
                    <Button onClick={confirmLogout} color="error" autoFocus>
                        Cerrar Sesión
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Navbar;