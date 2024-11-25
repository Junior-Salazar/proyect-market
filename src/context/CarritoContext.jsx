import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
    return useContext(CarritoContext);
};

export const CarritoProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('carrito');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (producto) => {
        setCartItems((currentItems) => {
            const itemExistente = currentItems.find((item) => item.idInventario === producto.idInventario);
            if (itemExistente) {
                return currentItems.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...currentItems, { ...producto, cantidad: 1 }];
        });
    };

    const incrementarCantidad = (id) => {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id && item.cantidad < item.stock
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            )
        );
    };

    const decrementarCantidad = (id) => {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id && item.cantidad > 1
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            )
        );
    };

    const eliminarItem = (id) => {
        setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('carrito');
    };

    return (
        <CarritoContext.Provider
            value={{
                cartItems,
                addToCart,
                incrementarCantidad,
                decrementarCantidad,
                eliminarItem,
                clearCart,
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
};