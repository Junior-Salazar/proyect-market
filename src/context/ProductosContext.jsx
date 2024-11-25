import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiPath } from '../config/constants';

const ProductosContext = createContext();

export const useProductos = () => useContext(ProductosContext);

export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProductos = async () => {
        try {
            const response = await fetch(`${ApiPath.apiBaseUrl}inventarios`);
            const data = await response.json();
            const productosAdaptados = data.map((inventario) => ({
                id: inventario.producto.idProducto,
                idInventario: inventario.idInventario,
                nombre: inventario.producto.nombre,
                descripcion: inventario.producto.descripcion,
                precio: inventario.precioVenta,
                categoria: inventario.producto.categoria.nombre,
                proveedor: inventario.proveedor.nombreProveedor,
                stock: inventario.stock,
                imagen: `${inventario.producto.imagen}`,
            }));
            setProductos(productosAdaptados);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    return (
        <ProductosContext.Provider value={{ productos, loading, fetchProductos }}>
            {children}
        </ProductosContext.Provider>
    );
};
