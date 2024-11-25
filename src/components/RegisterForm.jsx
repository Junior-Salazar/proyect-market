import React, { useState } from 'react';
import {
    TextField,
    Button,
    CircularProgress,
    Typography,
    Avatar,
    IconButton,
    InputAdornment,
    Box,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PropTypes from 'prop-types';

const RegisterForm = ({ onSubmit, loading, errorMessage }) => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [dni, setDni] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        onSubmit({
            nombre,
            apellidos,
            email,
            dni,
            telefono,
            password,
            imagen: image,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Button variant="outlined" component="label">
                    Subir Imagen
                    <input type="file" hidden onChange={handleImageChange} />
                </Button>
                {preview && (
                    <Avatar
                        alt="Previsualización"
                        src={preview}
                        sx={{ width: 80, height: 80, marginLeft: 2 }}
                    />
                )}
            </Box>

            <TextField
                fullWidth
                label="Nombre"
                variant="outlined"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                sx={{ marginBottom: 2 }}
                required
            />

            <TextField
                fullWidth
                label="Apellidos"
                variant="outlined"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                sx={{ marginBottom: 2 }}
                required
            />

            <TextField
                fullWidth
                label="Correo Electrónico"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: 2 }}
                required
                type="email"
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <TextField
                    label="DNI"
                    variant="outlined"
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                    sx={{ marginRight: 1, width: '48%' }}
                    required
                />
                <TextField
                    label="Teléfono"
                    variant="outlined"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                    sx={{ marginLeft: 1, width: '48%' }}
                    required
                />
            </Box>

            <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: 2 }}
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                fullWidth
                label="Confirmar Contraseña"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ marginBottom: 2 }}
                required
            />

            <Button variant="contained" type="submit" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
            </Button>
        </form>
    );
};

RegisterForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
};

export default RegisterForm;