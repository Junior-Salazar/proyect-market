import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductosPage from './pages/ProductosPage';
import { ColorModeProvider } from './theme/ThemeContext';
import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider } from './context/AuthContext';
import AdminPage from './pages/AdminPage';
import LoginRegisterPage from './pages/LoginRegisterPage';
import NosotrosPage from "./pages/NosotrosPage";
import ContactoPage from "./pages/ContactoPage";
import { Box } from '@mui/material';
import PedidosUsuario from "./components/PedidosUsuario";
import EditarPerfil from "./components/EditarPerfil";
import { ProductosProvider } from './context/ProductosContext';

function Layout({ children }) {
    const location = useLocation();

    const hideNavbarRoutes = ['/admin', '/login'];

    const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowNavbar && (
                <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1300 }}>
                    <Navbar />
                </Box>
            )}
            <Box sx={{ marginTop: shouldShowNavbar ? '64px' : '0px' }}>
                {children}
            </Box>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <CarritoProvider>
                <ColorModeProvider>
                    <ProductosProvider>
                        <Router>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<ProductosPage />} />
                                    <Route path="/nosotros" element={<NosotrosPage />} />
                                    <Route path="/mis-pedidos" element={<PedidosUsuario />} />
                                    <Route path="/editar-perfil" element={<EditarPerfil />} />
                                    <Route path="/contacto" element={<ContactoPage />} />
                                    <Route path="/admin" element={<AdminPage />} />
                                    <Route path="/login" element={<LoginRegisterPage />} />
                                </Routes>
                            </Layout>
                        </Router>
                    </ProductosProvider>
                </ColorModeProvider>
            </CarritoProvider>
        </AuthProvider>
    );
}

export default App;