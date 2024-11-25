import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Modal,
    Box,
    TextField,
    Tooltip,
    Typography,
    InputAdornment,
    Autocomplete,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ApiPath } from '../config/constants';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useProductos } from '../context/ProductosContext';


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '600px',
    bgcolor: 'background.paper',
    p: 4,
    boxShadow: 24,
    borderRadius: '8px',
};

const Pedidos = () => {
    const { user, token } = useAuth();
    const { fetchProductos: fecthInventario } = useProductos();
    const [pedidos, setPedidos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [metodosPago, setMetodosPago] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openBoletaModal, setOpenBoletaModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [pedidoAEliminar, setPedidoAEliminar] = useState(null);
    const [selectedProductos, setSelectedProductos] = useState([]);
    const [cantidad, setCantidad] = useState({});
    const [usuario, setUsuario] = useState(null);
    const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('');

    useEffect(() => {
        fetchPedidos();
        fetchProductos();
        fetchUsuarios();
        fetchMetodosPago();
    }, [token]);

    const fetchPedidos = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}pedidos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPedidos(response.data);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}inventarios`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}usuarios`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    const fetchMetodosPago = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}metodos-pago`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMetodosPago(response.data);
        } catch (error) {
            console.error('Error al obtener métodos de pago:', error);
        }
    };

    const handleOpenModal = (pedido = null) => {
        setSelectedPedido(pedido);
        setOpenModal(true);

        if (pedido && pedido.pedido.usuario) {
            setUsuario(pedido.pedido.usuario);

            const productosConIdDetalle = pedido.detallePedido.map(p => ({
                idDetalle: p.idDetalle,
                nombre: p.inventario.producto.nombre,
                cantidad: p.cantidad,
                idInventario: p.inventario.idInventario,
                precioUnitario: p.inventario.precioVenta
            }));

            const prodCantidad = productosConIdDetalle.reduce((acc, p) => {
                acc[p.nombre] = p.cantidad;
                return acc;
            }, {});

            setCantidad(prodCantidad);
            setSelectedProductos(productosConIdDetalle);
            setMetodoPagoSeleccionado(pedido.pago?.metodoPago.idMetodoPago || '');
        } else {
            setUsuario(null);
            setSelectedProductos([]);
            setCantidad({});
            setMetodoPagoSeleccionado('');
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPedido(null);
        setSelectedProductos([]);
        setCantidad({});
        setMetodoPagoSeleccionado('');
    };

    const handleSave = async () => {
        try {
            const productosSeleccionados = selectedProductos.map((producto) => {
                const productoInfo = productos.find((p) => p.producto.nombre === producto.nombre);

                if (!productoInfo || !productoInfo.idInventario) {
                    console.error(`Producto con nombre "${producto.nombre}" o idInventario no encontrado.`);
                    return null;
                }

                return {
                    idDetalle: producto.idDetalle || null,
                    idInventario: productoInfo.idInventario,
                    cantidad: cantidad[producto.nombre],
                    precioUnitario: productoInfo.precioVenta
                };
            }).filter(p => p !== null);

            if (productosSeleccionados.length === 0) {
                throw new Error('No se encontraron productos válidos para procesar el pedido.');
            }

            const dataRequest = {
                pedido: {
                    idPedido: selectedPedido ? selectedPedido.pedido.idPedido : null,
                    idUsuario: usuario?.id,
                    total: productosSeleccionados.reduce((acc, p) => acc + (p.cantidad * p.precioUnitario), 0)
                },
                detallePedido: productosSeleccionados.map((producto) => ({
                    ...producto,
                    idDetalle: producto.idDetalle || undefined
                })),
                idModoPago: metodoPagoSeleccionado
            };

            console.log('Datos que se están enviando al backend:', dataRequest);

            if (selectedPedido) {
                await axios.put(`${ApiPath.apiBaseUrl}pedidos`, dataRequest, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${ApiPath.apiBaseUrl}pedidos`, dataRequest, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            fetchPedidos();
            fecthInventario();
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar el pedido:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${ApiPath.apiBaseUrl}pedidos/${pedidoAEliminar.pedido.idPedido}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPedidos();
            handleCloseDeleteDialog();
        } catch (error) {
            console.error('Error al eliminar el pedido:', error);
        }
    };

    const handleOpenDeleteDialog = (pedido) => {
        setPedidoAEliminar(pedido);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setPedidoAEliminar(null);
    };

    const handlePrint = (pedido) => {
        setSelectedPedido(pedido);
        setOpenBoletaModal(true);
    };

    const handleCloseBoletaModal = () => {
        setOpenBoletaModal(false);
        setSelectedPedido(null);
    };

    const handleCantidadChange = (producto, value) => {
        const newCantidad = parseInt(value);
        if (newCantidad === 0) {
            setSelectedProductos(prev => prev.filter(p => p.nombre !== producto));
            setCantidad(prev => {
                const { [producto]: _, ...rest } = prev;
                return rest;
            });
        } else {
            setCantidad((prev) => ({ ...prev, [producto]: newCantidad }));
        }
    };


    const handlePrintBoleta = () => {
        window.print();
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <TextField
                    label="Buscar por usuario"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Detalles</TableCell>
                            <TableCell>Unid.</TableCell>
                            <TableCell>M/P</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pedidos.filter(pedido => pedido.pedido.usuario?.nombre?.toLowerCase().includes(search.toLowerCase())).map((pedido) => (
                            <TableRow key={pedido.pedido.idPedido}>
                                <TableCell>{pedido.pedido.usuario?.nombre || 'Usuario no encontrado'}</TableCell>
                                <TableCell>
                                    <Table size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Producto</strong></TableCell>
                                                <TableCell><strong>P/U (S/.)</strong></TableCell>
                                                <TableCell><strong>Und.</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pedido.detallePedido.map((producto, index) => (
                                                <TableRow key={producto.idDetalle || index}>
                                                    <TableCell>{producto.inventario.producto.nombre}</TableCell>
                                                    <TableCell>{producto.inventario.precioVenta.toFixed(2)}</TableCell>
                                                    <TableCell>{producto.cantidad}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableCell>
                                <TableCell>{pedido.detallePedido.reduce((acc, p) => acc + p.cantidad, 0)}</TableCell>
                                <TableCell>{pedido.pago?.metodoPago.nombreMetodo || 'No especificado'}</TableCell>
                                <TableCell>
                                    {pedido.pedido.fechaPedido
                                        ? format(new Date(pedido.pedido.fechaPedido), 'dd/MM/yy HH:mm', { locale: es })
                                        : 'No especificado'}
                                </TableCell>
                                <TableCell>{pedido.pedido.total}</TableCell>
                                <TableCell>
                                    <Tooltip title="Editar">
                                        <IconButton onClick={() => handleOpenModal(pedido)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>

                                    {
                                        user?.rol.nombreRol === 'ADMIN' ? (
                                            <Tooltip title="Eliminar">
                                                <IconButton onClick={() => handleOpenDeleteDialog(pedido)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : null
                                    }

                                    <Tooltip title="Imprimir Boleta">
                                        <IconButton onClick={() => handlePrint(pedido)}>
                                            <PrintIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6">
                        {selectedPedido ? 'Editar Pedido' : 'Agregar Pedido'}
                    </Typography>

                    <Autocomplete
                        options={usuarios}
                        getOptionLabel={(option) => option.nombre}
                        value={usuario}
                        onChange={(event, newValue) => setUsuario(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Seleccionar usuario"
                                variant="outlined"
                                sx={{ marginBottom: 2 }}
                                required
                                fullWidth
                            />
                        )}
                    />

                    <Autocomplete
                        options={productos}
                        getOptionLabel={(option) => option.producto.nombre}
                        onChange={(event, newValue) => {
                            if (newValue && !selectedProductos.some(p => p.nombre === newValue.producto.nombre)) {
                                setSelectedProductos(prev => [...prev, { nombre: newValue.producto.nombre, idInventario: newValue.idInventario, precioUnitario: newValue.precioVenta }]);
                                setCantidad(prev => ({ ...prev, [newValue.producto.nombre]: 1 }));
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Seleccionar producto"
                                variant="outlined"
                                sx={{ marginBottom: 2 }}
                                required
                                fullWidth
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />

                    {selectedProductos.map((producto) => (
                        <Box key={producto.idDetalle || producto.nombre} sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={`Cantidad de ${producto.nombre}`}
                                type="number"
                                value={cantidad[producto.nombre] || ''}
                                onChange={(e) => handleCantidadChange(producto.nombre, e.target.value)}
                                sx={{ marginBottom: 2 }}
                                required
                            />
                            <Typography variant="body2">Precio Unitario: S/ {producto.precioUnitario}</Typography>
                        </Box>
                    ))}

                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel required>Método de Pago</InputLabel>
                        <Select
                            value={metodoPagoSeleccionado}
                            onChange={(e) => setMetodoPagoSeleccionado(e.target.value)}
                            required // Hacer obligatorio
                        >
                            {metodosPago.map(metodo => (
                                <MenuItem key={metodo.idMetodoPago} value={metodo.idMetodoPago}>
                                    {metodo.nombreMetodo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="contained" onClick={handleSave}>
                        {selectedPedido ? 'Guardar Cambios' : 'Agregar Pedido'}
                    </Button>
                </Box>
            </Modal>

            <Modal open={openBoletaModal} onClose={handleCloseBoletaModal}>
                <Box sx={{ ...modalStyle, width: 400 }}>
                    <Typography variant="h5">Boleta de Venta</Typography>
                    {selectedPedido && (
                        <Box sx={{ marginTop: 2 }}>
                            <Typography variant="subtitle1">Usuario: {selectedPedido.pedido.usuario?.nombre || 'Usuario no encontrado'}</Typography>
                            <Typography variant="subtitle1">Fecha: {format(new Date(selectedPedido.pedido.fechaPedido), 'dd MMMM yyyy, HH:mm', { locale: es })}</Typography>
                            <Typography variant="subtitle1">Moneda: Soles (S/.)</Typography>
                            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell>Und.</TableCell>
                                            <TableCell>P/U</TableCell>
                                            <TableCell>Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedPedido.detallePedido.map((producto, index) => (
                                            <TableRow key={producto.idDetalle || index}>
                                                <TableCell>{producto.inventario.producto.nombre}</TableCell>
                                                <TableCell>{producto.cantidad}</TableCell>
                                                <TableCell>{producto.inventario.precioVenta}</TableCell>
                                                <TableCell>{producto.inventario.precioVenta * producto.cantidad}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableRow>
                                        <TableCell colSpan={3} align="right">
                                            <strong>Total</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>S/ {selectedPedido.pedido.total}</strong>
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleCloseBoletaModal}
                            startIcon={<CloseIcon />}
                        >
                            Cerrar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePrintBoleta}
                            startIcon={<PrintIcon />}
                        >
                            Imprimir Boleta
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Deseas eliminar este pedido? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Pedidos;