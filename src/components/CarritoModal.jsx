import React, { useState, useRef, useEffect } from 'react';
import {
    Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, IconButton, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Select, MenuItem, CircularProgress
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTheme } from '@mui/material/styles';
import { ApiFiles, ApiPath } from '../config/constants';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DescargarPDF from './DescargarPDF';
import { useProductos } from '../context/ProductosContext';

const CarritoModal = ({ isOpen, handleClose, cartItems, incrementarCantidad, decrementarCantidad, eliminarItem, clearCart }) => {
    const theme = useTheme();
    const { fetchProductos } = useProductos();
    const [openDialog, setOpenDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [idModoPago, setIdModoPago] = useState('');
    const [modosPago, setModosPago] = useState([]);
    const [procesando, setProcesando] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [cargandoModosPago, setCargandoModosPago] = useState(false);

    const { user, token } = useAuth();
    const pdfRef = useRef();

    useEffect(() => {
        fetchModosPago();
    }, []);

    const fetchModosPago = async () => {
        if (cargandoModosPago) return;

        setCargandoModosPago(true);
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}metodos-pago`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setModosPago(response.data);
        } catch (error) {
            console.error('Error al obtener métodos de pago:', error);
        } finally {
            setCargandoModosPago(false);
        }
    };

    const calcularTotal = () => {
        return cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setOpenDialog(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) eliminarItem(itemToDelete.id);
        setItemToDelete(null);
        setOpenDialog(false);
    };

    const cancelDelete = () => setOpenDialog(false);

    const handleProcesarCompra = async () => {
        if (!idModoPago || cartItems.length === 0) {
            setMensaje("Por favor, complete todos los campos antes de procesar la compra.");
            return;
        }

        setProcesando(true);

        const detallePedido = cartItems.map((item) => ({
            idInventario: item.idInventario,
            cantidad: item.cantidad,
        }));

        const pedido = {
            pedido: { idUsuario: user.id },
            detallePedido,
            idModoPago,
        };

        try {
            console.log(pedido);
            console.log(token);
            const response = await axios.post(`${ApiPath.apiBaseUrl}pedidos`, pedido, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 201) {
                setMensaje("Pedido registrado con éxito.");
                pdfRef.current.triggerDownload();
                clearCart();
                fetchProductos();
                handleClose();
            } else {
                setMensaje("Error al registrar el pedido.");
            }
        } catch (error) {
            console.error('Error en la solicitud de pedido:', error);
            setMensaje("Error en la solicitud. Por favor, inténtelo de nuevo.");
        } finally {
            setProcesando(false);
        }
    };

    return (
        <>
            <Modal open={isOpen} onClose={handleClose} aria-labelledby="modal-carrito" aria-describedby="modal-carrito-descripcion">
                <Box sx={{ ...modalResponsiveStyle(theme) }}>
                    <Typography variant="h5" component="h2" sx={{ marginBottom: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
                        Hola {user.nombre}, aquí tienes tus productos:
                    </Typography>

                    <DescargarPDF ref={pdfRef} usuario={user} ventas={cartItems} />

                    {mensaje && (
                        <Typography sx={{ marginBottom: 2, color: theme.palette.error.main }}>
                            {mensaje}
                        </Typography>
                    )}

                    {cartItems.length > 0 ? (
                        <>
                            <TableContainer component={Paper} sx={{ maxHeight: '50vh', overflowY: 'auto', bgcolor: theme.palette.background.paper }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Imagen</TableCell>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>Proveedor</TableCell>
                                            <TableCell>Precio</TableCell>
                                            <TableCell>Cantidad</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cartItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <img src={`${ApiFiles.apiBaseUrl}${item.imagen}`} alt={item.nombre} style={{ width: '50px' }} />
                                                </TableCell>
                                                <TableCell>{item.nombre}</TableCell>
                                                <TableCell>{item.proveedor}</TableCell>
                                                <TableCell>${item.precio}</TableCell>
                                                <TableCell>{item.cantidad}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <IconButton size="small" onClick={() => incrementarCantidad(item.id)} color="primary">
                                                            <AddIcon />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => decrementarCantidad(item.id)} color="secondary">
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleDeleteClick(item)} color="error">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                    Total: ${calcularTotal()}
                                </Typography>

                                <Select value={idModoPago} onChange={(e) => setIdModoPago(e.target.value)} displayEmpty sx={{ width: '150px' }}>
                                    <MenuItem value="">
                                        <em>Seleccione</em>
                                    </MenuItem>
                                    {modosPago.map((modo) => (
                                        <MenuItem key={modo.idMetodoPago} value={modo.idMetodoPago}>
                                            {modo.nombreMetodo}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={procesando ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartCheckoutIcon />}
                                    onClick={handleProcesarCompra}
                                    disabled={!idModoPago || cartItems.length === 0 || procesando}
                                >
                                    {procesando ? "Procesando..." : "Procesar Compra"}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Typography sx={{ color: theme.palette.text.secondary }}>No hay productos en el carrito.</Typography>
                    )}
                </Box>
            </Modal>

            <Dialog open={openDialog} onClose={cancelDelete}>
                <DialogTitle sx={{ color: theme.palette.error.main }}>{"Confirmar Eliminación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: theme.palette.text.primary }}>
                        ¿Estás seguro de que deseas eliminar este producto del carrito?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={confirmDelete} color="primary" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const modalResponsiveStyle = (theme) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '100%', sm: '90%', md: '80%' },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: 24,
    borderRadius: '8px',
    p: 4,
});

export default CarritoModal;