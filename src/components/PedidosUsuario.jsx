import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Divider,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ApiPath } from '../config/constants';
import { AccessTime, Payment, ShoppingCart, Receipt } from '@mui/icons-material';

const PedidosUsuario = () => {
    const { token, user } = useAuth();
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        fetchPedidos();
    }, [token]);

    const fetchPedidos = async () => {
        try {
            const userId = user.id;
            const response = await axios.get(`${ApiPath.apiBaseUrl}pedidos/cliente/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPedidos(response.data);
        } catch (error) {
            console.error('Error al obtener pedidos del usuario:', error);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h5" gutterBottom>
                <ShoppingCart fontSize="large" sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                Lista de Pedidos del Usuario
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Detalle</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Cantidad Total</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Método de Pago</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pedidos.length > 0 ? (
                            pedidos.map((pedido) => {
                                const cantidadTotal = pedido.detallePedido.reduce((acc, p) => acc + p.cantidad, 0);
                                const totalPedido = pedido.pedido.total;

                                return (
                                    <TableRow key={pedido.pedido.idPedido}>
                                        <TableCell>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {pedido.detallePedido.map((producto) => (
                                                        <TableRow key={producto.idDetalle}>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    <Receipt fontSize="small" sx={{ marginRight: 1 }} />
                                                                    {producto.inventario.producto.nombre}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {producto.cantidad}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    S/ {producto.inventario.precioVenta}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                        <TableCell>{cantidadTotal}</TableCell>
                                        <TableCell>
                                            <Payment fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 0.5 }} />
                                            {pedido.pago?.metodoPago.nombreMetodo || 'No especificado'}
                                        </TableCell>
                                        <TableCell>
                                            <AccessTime fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 0.5 }} />
                                            {formatDate(pedido.pedido?.fechaPedido)}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="primary">
                                                S/ {totalPedido}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="body1" color="text.secondary">
                                        No hay pedidos para mostrar.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PedidosUsuario;