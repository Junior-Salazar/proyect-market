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
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ApiPath } from '../config/constants';
import { useNavigate } from 'react-router-dom';

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

const Categorias = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoriaToDelete, setCategoriaToDelete] = useState(null);

    const fetchCategorias = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}categorias`);
            setCategorias(response.data);
        } catch (error) {
            if (error.response?.status === 403) {
                navigate('/');
            }
            console.error('Error al obtener categorías:', error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const filteredCategorias = categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenModal = (categoria = null) => {
        setSelectedCategoria(categoria);
        setNombre(categoria ? categoria.nombre : '');
        setDescripcion(categoria ? categoria.descripcion : '');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleSave = async () => {
        try {
            if (selectedCategoria) {
                if (user?.rol.nombreRol === 'ADMIN') {
                    await axios.put(
                        `${ApiPath.apiBaseUrl}categorias`,
                        {
                            id: selectedCategoria.idCategoria,
                            nombre,
                            descripcion,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                }
            } else {
                await axios.post(
                    `${ApiPath.apiBaseUrl}categorias`,
                    { nombre, descripcion },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
            fetchCategorias();
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar la categoría:', error);
        }
    };

    const handleOpenConfirmDialog = (categoria) => {
        setCategoriaToDelete(categoria);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleDelete = async () => {
        try {
            if (user?.rol.nombreRol === 'ADMIN') {
                await axios.delete(`${ApiPath.apiBaseUrl}categorias/${categoriaToDelete.idCategoria}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchCategorias();
                handleCloseConfirmDialog();
            }
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };

    const canAdd = user?.rol.nombreRol === 'ADMIN' || user?.rol.nombreRol === 'VENDEDOR';
    const canEdit = user?.rol.nombreRol === 'ADMIN';
    const canDelete = user?.rol.nombreRol === 'ADMIN';

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <TextField
                    label="Buscar categorías"
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
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            {canEdit || canDelete ? <TableCell>Acciones</TableCell> : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCategorias.map((categoria) => (
                            <TableRow key={categoria.idCategoria}>
                                <TableCell>{categoria.nombre}</TableCell>
                                <TableCell>{categoria.descripcion}</TableCell>
                                <TableCell>
                                    {canEdit && (
                                        <IconButton onClick={() => handleOpenModal(categoria)}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {canDelete && (
                                        <IconButton
                                            onClick={() => handleOpenConfirmDialog(categoria)}
                                            color="error"
                                        >
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
                    <Typography variant="h6">{selectedCategoria ? 'Editar Categoría' : 'Agregar Categoría'}</Typography>
                    <TextField
                        fullWidth
                        label="Nombre"
                        variant="outlined"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Descripción"
                        variant="outlined"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" onClick={handleSave}>
                        {selectedCategoria ? 'Guardar Cambios' : 'Agregar'}
                    </Button>
                </Box>
            </Modal>

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
            >
                <DialogTitle>{"Confirmar Eliminación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar la categoría "{categoriaToDelete?.nombre}"? Esta acción no se puede deshacer.
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

export default Categorias;