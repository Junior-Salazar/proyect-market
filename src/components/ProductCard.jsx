import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions, Box } from '@mui/material';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import { ApiFiles } from '../config/constants';
import { useTheme } from '@mui/material/styles';

const ProductCard = ({ producto }) => {
    const { addToCart } = useCarrito();
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleAddToCart = () => {
        if (!user) {
            console.warn('Usuario no autenticado, redirigiendo a login.');
            navigate('/login');
        } else {
            if (producto.stock > 0) {
                addToCart(producto);
            } else {
                console.error('El producto no tiene stock disponible.');
            }
        }
    };

    const getStockColor = (stock) => {
        if (!stock) return 'gray';
        if (stock > 50) return 'green';
        if (stock > 10) return 'orange';
        return 'red';
    };

    return (
        <Card
            sx={{
                maxWidth: 345,
                borderRadius: 4,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                },
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={`${ApiFiles.apiBaseUrl}${producto.imagen || '/default-image.jpg'}`}
                    alt={producto.nombre || 'Producto'}
                    sx={{
                        borderRadius: '4px 4px 0 0',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        '&:hover, &:focus': {
                            opacity: 1,
                        },
                    }}
                >
                    <Typography variant="h6">{producto.nombre || 'Producto'}</Typography>
                </Box>
            </Box>
            <CardContent>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark' ? '#A8DCE7' : '#101422',
                    }}
                >
                    {producto.nombre || 'Sin nombre'}
                </Typography>
                <Typography
                    variant="body2"
                    color={theme.palette.text.secondary}
                    sx={{
                        marginBottom: 1,
                    }}
                >
                    {producto.descripcion || 'Sin descripción'}
                </Typography>
                <Typography
                    variant="body2"
                    color={theme.palette.text.secondary}
                    sx={{
                        marginBottom: 1,
                    }}
                >
                    Proveedor: {producto.proveedor || 'Desconocido'}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark' ? '#A8DCE7' : '#101422',
                    }}
                >
                    Precio: ${producto.precio || '0.00'}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: getStockColor(producto.stock),
                    }}
                >
                    {producto.stock < 10 && (
                        <WarningIcon sx={{ mr: 1, color: getStockColor(producto.stock) }} />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Stock: {producto.stock || 'Sin información'}
                    </Typography>
                </Box>
                <Button
                    size="small"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                    disabled={producto.stock <= 0}
                >
                    Añadir al carrito
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;