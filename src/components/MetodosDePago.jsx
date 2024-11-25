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

const MetodosDePago = () => {
    const { user, token } = useAuth();
    const [metodosPago, setMetodosPago] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedMetodoPago, setSelectedMetodoPago] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [nombre, setNombre] = useState('');
    const [metodoToDelete, setMetodoToDelete] = useState(null);

    const fetchMetodosPago = async () => {
        try {
            const response = await axios.get(`${ApiPath.apiBaseUrl}metodos-pago`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMetodosPago(response.data);
        } catch (error) {
            console.error('Error al obtener métodos de pago:', error);
        }
    };

    useEffect(() => {
        fetchMetodosPago();
    }, [user, token]);

    const filteredMetodosPago = metodosPago.filter((metodo) =>
        metodo.nombreMetodo.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenModal = (metodo = null) => {
        setSelectedMetodoPago(metodo);
        setNombre(metodo ? metodo.nombreMetodo : '');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSave = async () => {
        try {
            if (selectedMetodoPago) {
                if (user?.rol.nameRol === 'ADMIN') {
                    await axios.put(
                        `${ApiPath.apiBaseUrl}metodos-pago`,
                        {
                            idMetodoPago: selectedMetodoPago.idMetodoPago,
                            nombreMetodo: nombre,
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
                    `${ApiPath.apiBaseUrl}metodos-pago`,
                    { nombreMetodo: nombre },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
            fetchMetodosPago();
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar el método de pago:', error);
        }
    };

    const handleOpenConfirmDialog = (metodo) => {
        setMetodoToDelete(metodo);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleDelete = async () => {
        try {
            if (user?.rol.nombreRol === 'ADMIN') {
                await axios.delete(`${ApiPath.apiBaseUrl}metodos-pago/${metodoToDelete.idMetodoPago}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchMetodosPago();
                handleCloseConfirmDialog();
            }
        } catch (error) {
            console.error('Error al eliminar el método de pago:', error);
        }
    };

    const canAdd = user?.rol.nombreRol === 'ADMIN' || user?.rol.nombreRol === 'VENDEDOR';
    const canEdit = user?.rol.nombreRol === 'ADMIN';
    const canDelete = user?.rol.nombreRol === 'ADMIN';

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <TextField
                    label="Buscar métodos de pago"
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
                            {canEdit || canDelete ? <TableCell>Acciones</TableCell> : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMetodosPago.map((metodo) => (
                            <TableRow key={metodo.idMetodoPago}>
                                <TableCell>{metodo.nombreMetodo}</TableCell>
                                <TableCell>
                                    {canEdit && (
                                        <IconButton onClick={() => handleOpenModal(metodo)}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {canDelete && (
                                        <IconButton
                                            onClick={() => handleOpenConfirmDialog(metodo)}
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
                    <Typography variant="h6">{selectedMetodoPago ? 'Editar Método de Pago' : 'Agregar Método de Pago'}</Typography>
                    <TextField
                        fullWidth
                        label="Nombre"
                        variant="outlined"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" onClick={handleSave}>
                        {selectedMetodoPago ? 'Guardar Cambios' : 'Agregar'}
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
                        ¿Estás seguro de que deseas eliminar el método de pago "{metodoToDelete?.nombreMetodo}"? Esta acción no se puede deshacer.
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

export default MetodosDePago;
