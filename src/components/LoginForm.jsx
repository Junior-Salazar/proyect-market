import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const LoginForm = ({ onSubmit, loading, errorMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}

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

            <TextField
                fullWidth
                label="Contraseña"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: 2 }}
                required
            />

            <Button variant="contained" type="submit" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>
        </form>
    );
};

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
};

export default LoginForm;