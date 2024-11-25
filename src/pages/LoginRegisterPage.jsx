import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AuthContainer from '../components/AuthContainer';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import axios from 'axios';
import { ApiPath } from '../config/constants';
import { useNavigate } from 'react-router-dom';

const LoginRegisterPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setUserAndToken } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await axios.post(`${ApiPath.apiBaseUrl}auth/login`, { email, password });
            const { user, token } = response.data;
            setUserAndToken(user, token);
            navigate(user.rol.nombreRol === 'CLIENTE' ? '/' : '/admin');
        } catch {
            setErrorMessage('Error en las credenciales.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ nombre, apellidos, email, dni, telefono, password, imagen }) => {
        setLoading(true);
        setErrorMessage('');

        try {
            let imageName = 'default.png';

            if (imagen) {
                const formData = new FormData();
                formData.append('image', imagen);

                const imageResponse = await axios.post(`${ApiPath.apiBaseUrl}images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                imageName = imageResponse.data;
            }

            const userResponse = await axios.post(`${ApiPath.apiBaseUrl}auth/register`, {
                nombre,
                apellidos,
                email,
                dni,
                telefono,
                contrasena: password,
                rolId: 2,
                imagen: imageName,
            });

            const { user, token } = userResponse.data;
            setUserAndToken(user, token);
            navigate('/');
        } catch (error) {
            setErrorMessage('Error en el registro.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContainer>
            {isRegister ? (
                <RegisterForm
                    onSubmit={handleRegister}
                    loading={loading}
                    errorMessage={errorMessage}
                />
            ) : (
                <LoginForm
                    onSubmit={handleLogin}
                    loading={loading}
                    errorMessage={errorMessage}
                />
            )}
            <Button onClick={() => setIsRegister(!isRegister)} variant="text" fullWidth>
                {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
            </Button>
        </AuthContainer>
    );
};

export default LoginRegisterPage;