import React, { useState, useContext } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Divider,
    Button,
    Modal,
    Avatar,
    IconButton,
    AppBar,
    Toolbar,
    useMediaQuery,
    useTheme,
    CssBaseline,
    Menu,
    MenuItem
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

import Dashboard from '../components/Dashboard';
import Categorias from '../components/Categorias';
import Inventario from '../components/Inventarios';
import MetodosDePago from '../components/MetodosDePago';
import Productos from '../components/Productos';
import Proveedores from '../components/Proveedores';
import Usuarios from '../components/Usuarios';
import Pedidos from '../components/Pedidos';
import EditarPerfil from '../components/EditarPerfil';
import { ColorModeContext } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ApiFiles } from '../config/constants';
import Roles from "../components/Roles";

const DrawerItem = ({ label, icon, isSelected, onClick }) => {
    return (
        <ListItem
            selected={isSelected}
            onClick={onClick}
            sx={{
                backgroundColor: isSelected ? '#1c1f2e' : 'transparent',
                borderRadius: 2,
                marginBottom: '8px',
                '&:hover': {
                    backgroundColor: '#2a2d3e',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
        </ListItem>
    );
};

const AdminPage = () => {
    const { user, logout } = useAuth();
    const [selectedSection, setSelectedSection] = useState('Dashboard');
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);

    // Detect screen size using MediaQuery
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Map de las secciones
    const sectionMap = {
        'Dashboard': <Dashboard />,
        'Categorias': <Categorias />,
        'MetodosDePago': <MetodosDePago />,
        'Proveedores': <Proveedores />,
        'Productos': <Productos />,
        'Pedidos': <Pedidos />,
        'EditarPerfil': <EditarPerfil />,
        'Inventario': <Inventario />,
        'Usuarios': user?.rol.nombreRol === 'ADMIN' ? <Usuarios /> : null,
        'Roles': user?.rol.nombreRol === 'ADMIN' ? <Roles /> : <Dashboard />,
    };

    const renderSection = sectionMap[selectedSection] || <Dashboard />;

    const menuItems = [
        { label: 'Dashboard', icon: <DashboardIcon />, section: 'Dashboard' },
        { label: 'Categorías', icon: <CategoryIcon />, section: 'Categorias' },
        { label: 'Proveedores', icon: <LocalShippingIcon />, section: 'Proveedores' },
        { label: 'Métodos de Pago', icon: <PaymentIcon />, section: 'MetodosDePago' },
        { label: 'Productos', icon: <StorefrontIcon />, section: 'Productos' },
        { label: 'Pedidos', icon: <ShoppingCartIcon />, section: 'Pedidos' },
        { label: 'Inventario', icon: <InventoryIcon />, section: 'Inventario' },
    ];

    if (user?.rol.nombreRol === 'ADMIN') {
        menuItems.push(
            { label: 'Usuarios', icon: <GroupIcon />, section: 'Usuarios' },
            { label: 'Roles', icon: <SecurityIcon />, section: 'Roles' }
        );
    }

    const handleLogout = () => {
        logout();
        setOpenLogoutModal(false);
        navigate('/');
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(true);
    };

    const handleMenuClose = () => {
        setOpenMenu(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            {/* Mobile AppBar */}
            {isMobile && (
                <AppBar position="sticky" sx={{ zIndex: 1201 }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleMenuClick}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {user?.nombre ? `Hola, ${user?.nombre}` : "Admin Panel"}
                        </Typography>

                        {/* Buttons for theme toggle and logout in mobile */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton onClick={colorMode.toggleColorMode}>
                                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                            <IconButton onClick={() => setOpenLogoutModal(true)}>
                                <ExitToAppIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
            )}

            {/* Menu for Mobile */}
            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
            >
                {menuItems.map((item) => (
                    <MenuItem key={item.section} onClick={() => { setSelectedSection(item.section); handleMenuClose(); }}>
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>

            {/* Drawer for larger screens */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            height: '100vh',
                            boxSizing: 'border-box',
                            backgroundColor: theme.palette.mode === 'dark' ? '#1c541e' : '#a1e3a4',
                            color: '#ffffff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                        },
                    }}
                >
                    <Box sx={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar alt={user?.nombre} src={`${ApiFiles.apiBaseUrl}${user?.imagen}`} />
                        <Typography variant="h6" sx={{ color: '#ffffff' }}>
                            {user?.nombre}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                        <List>
                            {menuItems.map((item) => (
                                <DrawerItem
                                    key={item.section}
                                    label={item.label}
                                    icon={item.icon}
                                    isSelected={selectedSection === item.section}
                                    onClick={() => setSelectedSection(item.section)}
                                />
                            ))}
                        </List>
                    </Box>

                    <Divider />
                    <List>
                        <DrawerItem
                            label="Cuenta"
                            icon={<AccountCircleIcon />}
                            isSelected={false}
                            onClick={() => setSelectedSection('EditarPerfil')}
                        />
                        <DrawerItem
                            label="Cerrar Sesión"
                            icon={<ExitToAppIcon />}
                            isSelected={false}
                            onClick={() => setOpenLogoutModal(true)}
                        />
                    </List>

                    <Box sx={{ marginTop: 'auto', padding: '16px' }}>
                        <Button
                            variant="outlined"
                            startIcon={theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            onClick={colorMode.toggleColorMode}
                            sx={{
                                borderColor: theme.palette.mode === 'dark' ? '#A8DCE7' : '#FFFFFF',
                                bgcolor: theme.palette.mode === 'dark' ? '#000000' : '#252c44',
                                color: theme.palette.mode === 'dark' ? '#A8DCE7' : '#FFFFFF',
                                '&:hover': {
                                    borderColor: '#ffffff',
                                    backgroundColor: '#333a56',
                                },
                            }}
                        >
                            {theme.palette.mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                        </Button>
                    </Box>
                </Drawer>
            )}

            <Box sx={{ flexGrow: 1, p: 3 }}>
                {renderSection}
            </Box>

            <Modal open={openLogoutModal} onClose={() => setOpenLogoutModal(false)}>
                <Box sx={{ ...modalStyle, width: 300 }}>
                    <Typography variant="h6" gutterBottom>Confirmación</Typography>
                    <Typography>¿Estás seguro que deseas cerrar sesión?</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={() => setOpenLogoutModal(false)}>Cancelar</Button>
                        <Button onClick={handleLogout} color="error">
                            Cerrar Sesión
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    p: 4,
    boxShadow: 24,
};

export default AdminPage;