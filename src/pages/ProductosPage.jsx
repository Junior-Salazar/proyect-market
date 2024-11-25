import React, { useState } from 'react';
import {
    Grid, TextField, MenuItem, Select, FormControl, InputLabel, Box, Typography
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useProductos } from '../context/ProductosContext';

const ProductosPage = () => {
    const { productos = [], loading } = useProductos();
    const [search, setSearch] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

    const handleSearchChange = (event) => {
        setSearch(event.target.value.toLowerCase());
    };

    const handleCategoryChange = (event) => {
        setCategoriaSeleccionada(event.target.value);
    };

    const categorias = ['Todas', ...new Set(productos.map((producto) => producto.categoria || 'Sin categoría'))];

    const productosFiltrados = productos
        .filter((producto, index, self) => index === self.findIndex((p) => p.idInventario === producto.idInventario))
        .filter((producto) => {
            const coincideNombre = producto.nombre?.toLowerCase().includes(search) || false;
            const coincideCategoria =
                categoriaSeleccionada === 'Todas' || producto.categoria === categoriaSeleccionada || false;
            return coincideNombre && coincideCategoria;
        });

    return (
        <Box sx={{ padding: '20px' }}>
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Buscar por nombre"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" variant="outlined">
                        <InputLabel id="categoria-label">Categoría</InputLabel>
                        <Select
                            labelId="categoria-label"
                            value={categoriaSeleccionada}
                            onChange={handleCategoryChange}
                            label="Categoría"
                        >
                            {categorias.map((categoria, index) => (
                                <MenuItem key={categoria || `categoria-${index}`} value={categoria}>
                                    {categoria}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                {loading ? (
                    <Typography variant="h6">Cargando productos...</Typography>
                ) : productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto, index) => (
                        <Grid item xs={12} sm={6} md={3} key={`${producto.id || producto.nombre}-${index}`}>
                            <ProductCard producto={producto} />
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6">No se encontraron productos</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default ProductosPage;