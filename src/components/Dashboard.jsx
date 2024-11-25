import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Grid, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Filler, CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LowStockIcon from '@mui/icons-material/ErrorOutline';
import { ApiPath } from '../config/constants';
import { useNavigate } from 'react-router-dom';

ChartJS.register(Filler, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();
    const [ventasMes, setVentasMes] = useState([]);
    const [metodosPago, setMetodosPago] = useState([]);
    const [topProductos, setTopProductos] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (!token) {
            logout();
            navigate('/');
            return;
        }

        if (user.rol.nombreRol === 'CLIENTE') {
            setOpenDialog(true);
        } else {
            fetchVentasMes();
            fetchMetodosPago();
            fetchTopProductos();
            fetchLowStock();
        }
    }, [token]);

    const fetchVentasMes = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}pagos/ventas-mes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVentasMes(response.data);
        } catch (error) {
            handleFetchError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMetodosPago = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}pagos/estadisticas-pagos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMetodosPago(response.data);
        } catch (error) {
            handleFetchError(error);
        }
    };

    const fetchTopProductos = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}detalle-pedidos/top-vendidos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTopProductos(response.data);
        } catch (error) {
            handleFetchError(error);
        }
    };

    const fetchLowStock = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}inventarios/stock-productos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLowStockProducts(response.data);
        } catch (error) {
            handleFetchError(error);
        }
    };

    const handleFetchError = (error) => {
        if (error.response?.status === 403) {
            logout();
            navigate('/');
        }
        console.error('Error al obtener datos:', error);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        logout();
        navigate('/');
    };

    const ventasData = {
        labels: ventasMes.map(item => item.mes),
        datasets: [
            {
                label: 'Ventas ($)',
                data: ventasMes.map(item => item.totalVentas),
                fill: true, // Relleno debajo de la línea
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    const metodoPagoData = {
        labels: metodosPago.map(item => item.metodo),
        datasets: [
            {
                data: metodosPago.map(item => item.uso),
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    };

    const topProductosData = {
        labels: topProductos.map(item => item.nombre),
        datasets: [
            {
                label: 'Ventas (unidades)',
                data: topProductos.map(item => item.cantidadVendida),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Acceso no autorizado</DialogTitle>
                <DialogContent>
                    <Typography>Lo siento, no tienes permiso para acceder a esta página.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" variant="contained">
                        Regresar al inicio
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ventas del último mes
                            </Typography>
                            <Box sx={{ maxWidth: '100%', height: 300 }}>
                                <Line data={ventasData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Productos con menos de 50 en stock
                            </Typography>
                            <TableContainer component={Paper} sx={{ maxHeight: 240, overflowY: 'auto' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>Stock</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {lowStockProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.nombre}</TableCell>
                                                <TableCell>{product.stock}</TableCell>
                                                <TableCell>
                                                    {product.stock < 10 ? (
                                                        <IconButton color="error" title="Poco stock">
                                                            <LowStockIcon />
                                                        </IconButton>
                                                    ) : null}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Métodos de Pago más elegidos
                            </Typography>
                            <Box sx={{ maxWidth: '100%', height: 300, marginTop: 3 }}>
                                <Pie data={metodoPagoData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top 5 Productos Más Vendidos
                            </Typography>
                            <Box sx={{ maxWidth: '100%', height: 300 }}>
                                <Bar data={topProductosData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;