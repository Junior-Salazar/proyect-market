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
    FormControl,
    InputLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ApiFiles, ApiPath } from '../config/constants';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
    boxShadow: 24,
};

const Productos = () => {
    const { user, token } = useAuth();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);

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

    const fetchCategorias = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}categorias`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategorias(response.data);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
        }
    };

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, [token]);

    const filteredProductos = productos.filter((item) =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenModal = (producto = null) => {
        setSelectedProducto(producto);
        setNombre(producto ? producto.nombre : '');
        setCategoria(producto && producto.categoria ? producto.categoria.idCategoria : '');
        setDescripcion(producto ? producto.descripcion : '');
        setImagen(null);
        setPreview(producto ? `${ApiFiles.apiBaseUrl}${producto.imagen}` : null);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setPreview(null);
        setImagen(null);
        setCategoria('');
    };

    const handleSave = async () => {
        try {
            let imageUrl = null;

            if (imagen) {
                const formData = new FormData();
                formData.append('image', imagen);
                const imageResponse = await axios.post(`${ApiPath.apiBaseUrl}images`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                imageUrl = imageResponse.data;
            }

            if (selectedProducto && selectedProducto.idProducto) {
                await axios.put(
                    `${ApiPath.apiBaseUrl}productos`,
                    {
                        id: selectedProducto.idProducto,
                        nombre,
                        descripcion,
                        imagen: imageUrl || selectedProducto.imagen,
                        idCategoria: categoria,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                await axios.post(
                    `${ApiPath.apiBaseUrl}productos`,
                    {
                        nombre,
                        descripcion,
                        imagen: imageUrl,
                        idCategoria: categoria,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }

            fetchProductos();
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    const handleOpenConfirmDialog = (producto) => {
        setProductoToDelete(producto);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleDelete = async () => {
        try {
            if (user?.rol.nombreRol === 'ADMIN' && productoToDelete?.idProducto) {
                await axios.delete(`${ApiPath.apiBaseUrl}productos/${productoToDelete.idProducto}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchProductos();
                handleCloseConfirmDialog();
            } else {
                console.error('No se proporcionó un ID válido para la eliminación.');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const canAdd = user?.rol.nombreRol === 'ADMIN' || user?.rol.nombreRol === 'VENDEDOR';
    const canEdit = user?.rol.nombreRol === 'ADMIN';
    const canDelete = user?.rol.nombreRol === 'ADMIN';

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <TextField
                    label="Buscar productos"
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
            </Box>

            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Imagen</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Descripción</TableCell>
                            {canEdit || canDelete ? <TableCell>Acciones</TableCell> : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProductos.map((item) => (
                            <TableRow key={item.idProducto}>
                                <TableCell>
                                    {item.imagen ? (
                                        <img src={`${ApiFiles.apiBaseUrl}${item.imagen}`} alt={item.nombre} style={{ width: '50px' }} />
                                    ) : (
                                        <Typography>No Imagen</Typography>
                                    )}
                                </TableCell>
                                <TableCell>{item.nombre}</TableCell>
                                <TableCell>{item.categoria?.nombre}</TableCell>
                                <TableCell>
                                    <Tooltip title={item.descripcion} arrow>
                                        <span>{item.descripcion.substring(0, 20)}...</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    {canEdit && (
                                        <IconButton onClick={() => handleOpenModal(item)}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {canDelete && (
                                        <IconButton onClick={() => handleOpenConfirmDialog(item)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6">{selectedProducto ? 'Editar Producto' : 'Agregar Producto'}</Typography>
                    <TextField
                        fullWidth
                        label="Nombre"
                        variant="outlined"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            value={categoria || ''}
                            onChange={(e) => setCategoria(e.target.value)}
                            label="Categoría"
                            variant="outlined"
                        >
                            {categorias.map((cat) => (
                                <MenuItem key={cat.idCategoria} value={cat.idCategoria}>
                                    {cat.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Descripción"
                        variant="outlined"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    {preview && (
                        <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
                            <Typography variant="subtitle1">Previsualización de Imagen:</Typography>
                            <img src={preview} alt="Previsualización" style={{ width: '100px', height: '100px' }} />
                        </Box>
                    )}

                    <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
                        Subir Imagen
                        <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                    </Button>

                    <Box sx={{ textAlign: 'right' }}>
                        <Button variant="contained" onClick={handleSave}>
                            {selectedProducto ? 'Guardar Cambios' : 'Agregar'}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogTitle>{"Confirmar Eliminación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar el producto "{productoToDelete?.nombre}"? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
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

export default Productos;