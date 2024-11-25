import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Modal, Avatar, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ApiFiles, ApiPath } from '../config/constants';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 900,
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 4,
    p: 4,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
};

const EditarPerfil = () => {
    const { user, setUserAndToken, token } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [contrasenaConfirmada, setContrasenaConfirmada] = useState('');
    const [rol, setRol] = useState('');
    const [dni, setDni] = useState('');
    const [telefono, setTelefono] = useState('');
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (user) {
            setNombre(user.nombre);
            setApellidos(user.apellidos);
            setCorreo(user.email);
            setRol(user.rol.nombreRol);
            setDni(user.dni);
            setTelefono(user.telefono || '');
            setPreview(`${ApiFiles.apiBaseUrl}${user.imagen}`);
        }
    }, [user]);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagen(file);
                setPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (contrasena !== contrasenaConfirmada) {
            console.error('Las contraseñas no coinciden');
            return;
        }

        let updatedUser = {
            id: user.id,
            nombre,
            apellidos,
            correo,
            rol: user.rol.id,
            contrasena: contrasena,
            dni: dni,
            telefono: telefono,
            imagen: user.imagen,
        };

        try {
            if (imagen) {
                const formData = new FormData();
                formData.append('image', imagen);

                const imageResponse = await axios.post(`${ApiPath.apiBaseUrl}images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (imageResponse.status === 201) {
                    const imageData = imageResponse.data;
                    const imageUrl = `${ApiFiles.apiBaseUrl}${imageData}`;
                    updatedUser.imagen = imageData;
                } else {
                    console.error('Error al subir la imagen');
                    return;
                }
            }

            const response = await axios.put(`${ApiPath.apiBaseUrl}usuarios`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const { user: updatedUserData, token: updatedToken } = response.data;
                setUserAndToken(updatedUserData, updatedToken);
                handleCloseModal();
            } else {
                console.error('Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error en la actualización del perfil:', error);
        }
    };

    const handleDniChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,8}$/.test(value)) {
            setDni(value);
        }
    };

    const handleTelefonoChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,9}$/.test(value)) {
            setTelefono(value);
        }
    };

    return (
        <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar src={`${preview}`} alt={nombre} sx={{ width: 120, height: 120, borderRadius: '50%' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{nombre} {apellidos}</Typography>
                <Typography variant="body1" sx={{ color: '#6b6b6b' }}>{correo}</Typography>
                <Typography variant="body1" sx={{ color: '#6b6b6b' }}>DNI: {dni}</Typography>
                <Typography variant="body1" sx={{ color: '#6b6b6b' }}>{rol}</Typography>
            </Box>

            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                <Button
                    variant="contained"
                    onClick={handleOpenModal}
                    startIcon={<EditIcon />}
                    sx={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        backgroundColor: '#1976d2',
                        '&:hover': { backgroundColor: '#155a9d' },
                    }}
                >
                    Editar Perfil
                </Button>
            </Box>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 3 }}>
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                variant="outlined"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Apellidos"
                                variant="outlined"
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Correo"
                                variant="outlined"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contraseña"
                                variant="outlined"
                                type="password"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Confirmar Contraseña"
                                variant="outlined"
                                type="password"
                                value={contrasenaConfirmada}
                                onChange={(e) => setContrasenaConfirmada(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="DNI"
                                variant="outlined"
                                value={dni}
                                onChange={handleDniChange}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Teléfono"
                                variant="outlined"
                                value={telefono}
                                onChange={handleTelefonoChange}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
                                Cambiar Imagen
                                <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                            </Button>
                        </Grid>

                        {/* Sección de Imagen de Previsualización al Costado */}
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                            {preview && (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>Imagen Seleccionada:</Typography>
                                    <img
                                        src={preview}
                                        alt="Previsualización"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: '50%',
                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                        }}
                                    />
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    <Box sx={{ textAlign: 'right', marginTop: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{
                                backgroundColor: '#1976d2',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                '&:hover': { backgroundColor: '#155a9d' },
                            }}
                        >
                            Guardar Cambios
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default EditarPerfil;