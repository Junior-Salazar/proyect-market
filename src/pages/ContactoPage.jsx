import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ContactoPage = () => {
    const theme = useTheme();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', { nombre, email, mensaje });
    };

    return (
        <Box
            sx={{
                padding: theme.spacing(4),
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    padding: theme.spacing(4),
                    maxWidth: '800px',
                    width: '100%',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[5],
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: theme.palette.text.title,
                        fontWeight: theme.typography.fontWeightBold,
                        textAlign: 'center',
                        marginBottom: theme.spacing(3),
                    }}
                >
                    Contáctanos
                </Typography>
                <Typography
                    variant="body1"
                    paragraph
                    sx={{ color: theme.palette.text.primary, textAlign: 'center', marginBottom: theme.spacing(3) }}
                >
                    Si tienes alguna pregunta, sugerencia o simplemente deseas ponerte en contacto con nosotros, llena el siguiente formulario. Estaremos encantados de atenderte.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nombre"
                                variant="outlined"
                                fullWidth
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderColor: theme.palette.primary.main,
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.secondary.main,
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Correo Electrónico"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                type="email"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderColor: theme.palette.primary.main,
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.secondary.main,
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Mensaje"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderColor: theme.palette.primary.main,
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.secondary.main,
                                        },
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ marginTop: theme.spacing(4), textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                paddingX: theme.spacing(3),
                                paddingY: theme.spacing(1.5),
                                borderRadius: theme.shape.borderRadius,
                                boxShadow: theme.shadows[2],
                                textTransform: 'none',
                            }}
                        >
                            Enviar
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default ContactoPage;
