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
    InputAdornment,
    Tooltip,
    Typography,
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, InputLabel
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ApiPath } from '../config/constants';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    p: 4,
    boxShadow: 24,
    borderRadius: '8px',
};

const Inventarios = () => {
    const { user, token } = useAuth();
    const [inventarios, setInventarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedInventario, setSelectedInventario] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [inventarioAEliminar, setInventarioAEliminar] = useState(null);

    const [producto, setProducto] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [stock, setStock] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');

    const fetchInventarios = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}inventarios`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInventarios(response.data);
        } catch (error) {
            console.error('Error al obtener inventarios:', error);
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}productos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const fetchProveedores = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}proveedores`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProveedores(response.data);
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}inventarios/reporte`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reporte_inventario.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error al descargar el reporte:', error);
        }
    };

    useEffect(() => {
        fetchInventarios();
        fetchProductos();
        fetchProveedores();
    }, [token]);

    const filteredInventarios = inventarios.filter((inventario) =>
        inventario.producto.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenModal = (inventario = null) => {
        setSelectedInventario(inventario);
        setProducto(inventario ? inventario.producto.idProducto : '');
        setProveedor(inventario ? inventario.proveedor.idProveedor : '');
        setStock(inventario ? inventario.stock : '');
        setPrecioVenta(inventario ? inventario.precioVenta : '');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedInventario(null);
    };

    const handleSave = async () => {
        try {
            const data = {
                idProducto: producto,
                idProveedor: proveedor,
                stock,
                precioVenta,
            };

            if (selectedInventario) {
                await axios.put(`${ApiPath.apiBaseUrl}inventarios`, { idInventario: selectedInventario.idInventario, ...data }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${ApiPath.apiBaseUrl}inventarios`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            fetchInventarios();
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar el inventario:', error);
        }
    };

    const handleOpenDeleteDialog = (inventario) => {
        setInventarioAEliminar(inventario);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setInventarioAEliminar(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${ApiPath.apiBaseUrl}inventarios`, {
                params: { id: inventarioAEliminar.idInventario },
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchInventarios();
            handleCloseDeleteDialog();
        } catch (error) {
            console.error('Error al eliminar el inventario:', error);
        }
    };

    const canAdd = user?.rol.nombreRol === 'ADMIN' || user?.rol.nombreRol === 'VENDEDOR';
    const canEdit = user?.rol.nombreRol === 'ADMIN';
    const canDelete = user?.rol.nombreRol === 'ADMIN';

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <TextField
                    label="Buscar por producto"
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
                {canAdd && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                    </Button>
                )}
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadReport}
                    sx={{ marginLeft: 2 }}
                >
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell>Proveedor</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Precio Venta</TableCell>
                            {canEdit || canDelete ? <TableCell>Acciones</TableCell> : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInventarios.map((inventario) => (
                            <TableRow key={inventario.idInventario}>
                                <TableCell>{inventario.producto.nombre}</TableCell>
                                <TableCell>{inventario.proveedor.nombreProveedor}</TableCell>
                                <TableCell>{inventario.stock}</TableCell>
                                <TableCell>{inventario.precioVenta}</TableCell>
                                <TableCell>
                                    {canEdit && (
                                        <Tooltip title="Editar">
                                            <IconButton onClick={() => handleOpenModal(inventario)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {canDelete && (
                                        <Tooltip title="Eliminar">
                                            <IconButton onClick={() => handleOpenDeleteDialog(inventario)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6">
                        {selectedInventario ? 'Editar Inventario' : 'Agregar Inventario'}
                    </Typography>
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Producto</InputLabel>
                        <Select
                            value={producto || ''}
                            onChange={(e) => setProducto(e.target.value)}
                            label="Producto"
                        >
                            {productos.map((prod) => (
                                <MenuItem key={prod.idProducto} value={prod.idProducto}>
                                    {prod.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Proveedor</InputLabel>
                        <Select
                            value={proveedor || ''}
                            onChange={(e) => setProveedor(e.target.value)}
                            label="Proveedor"
                        >
                            {proveedores.map((prov) => (
                                <MenuItem key={prov.idProveedor} value={prov.idProveedor}>
                                    {prov.nombreProveedor}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Stock"
                        variant="outlined"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Precio Venta"
                        variant="outlined"
                        value={precioVenta}
                        onChange={(e) => setPrecioVenta(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" onClick={handleSave}>
                        {selectedInventario ? 'Guardar Cambios' : 'Agregar Inventario'}
                    </Button>
                </Box>
            </Modal>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Deseas eliminar este inventario? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Inventarios;