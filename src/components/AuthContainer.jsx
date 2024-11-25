import React from 'react';
import { Box, Avatar, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import Logo from '../img/MR.png';
import BackgroundImage from '../img/fondo.jpg';

const AuthContainer = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: `url(${BackgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Box
                sx={{
                    width: { xs: '100%', sm: '600px', md: '800px' },
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(16, 20, 34, 0.89)' : 'rgba(255, 255, 255, 0.8)',
                    boxShadow: 24,
                    borderRadius: 3,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                }}
            >
                <Box
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        color: '#000',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: { xs: 3, md: 5 },
                        textAlign: 'center',
                        flexDirection: 'column',
                        bgcolor: 'linear-gradient(to right, #1e3c72, #2a5298)',
                    }}
                >
                    <Avatar sx={{ width: 80, height: 80, mb: 2 }} src={Logo} />
                    <Typography variant="h6" gutterBottom>MR Minimarket</Typography>
                    <Typography variant="body2">"Tu tienda de confianza, siempre cerca de ti."</Typography>
                </Box>
                <Box sx={{ width: { xs: '100%', md: '50%' }, padding: { xs: 3, md: 5 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

AuthContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContainer;