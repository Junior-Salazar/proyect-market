import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import Logo from '../img/MR.png';
import {format} from "date-fns";
import {es} from "date-fns/locale";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        backgroundColor: '#F9FBE7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 60,
        height: 60,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2E7D32',
        textAlign: 'center',
    },
    userInfo: {
        marginBottom: 15,
        fontSize: 12,
        color: '#4CAF50',
    },
    table: {
        display: 'table',
        width: '100%',
        marginTop: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#A5D6A7',
        borderCollapse: 'collapse',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '25%',
        backgroundColor: '#4CAF50',
        color: '#FFFFFF',
        fontWeight: 'bold',
        padding: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#A5D6A7',
        textAlign: 'center',
    },
    tableCol: {
        width: '25%',
        padding: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#A5D6A7',
        textAlign: 'center',
    },
    total: {
        textAlign: 'right',
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    footer: {
        marginTop: 20,
        textAlign: 'center',
        color: '#66BB6A',
    },
});

const ReporteVentaPDF = ({ usuario, ventas }) => {
    const total = ventas.reduce((acc, venta) => acc + venta.precio * venta.cantidad, 0);

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
                    <Image style={styles.logo} src={Logo} />
                    <Text style={styles.title}>Minimarket Roque - Reporte de Venta</Text>
                </View>

                <View style={styles.userInfo}>
                    <Text>Nombre : {usuario.nombre}</Text>
                    <Text>DNI    : {usuario.dni}</Text>
                    <Text>Fecha  : { format(new Date(), 'dd/MM/yy HH:mm', { locale: es })}</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>Producto</Text>
                        <Text style={styles.tableColHeader}>Cantidad</Text>
                        <Text style={styles.tableColHeader}>Precio Unitario</Text>
                        <Text style={styles.tableColHeader}>Subtotal</Text>
                    </View>
                    {ventas.map((venta, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCol}>{venta.nombre}</Text>
                            <Text style={styles.tableCol}>{venta.cantidad}</Text>
                            <Text style={styles.tableCol}>S/ {venta.precio.toFixed(2)}</Text>
                            <Text style={styles.tableCol}>
                                S/ {(venta.precio * venta.cantidad).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.total}>Total: S/ {total.toFixed(2)}</Text>

                <View style={styles.footer}>
                    <Text>Gracias por su preferencia</Text>
                </View>
            </Page>
        </Document>
    );
};

const DescargarPDF = forwardRef(({ usuario, ventas }, ref) => {
    const downloadLinkRef = useRef();

    useImperativeHandle(ref, () => ({
        triggerDownload: () => {
            if (downloadLinkRef.current) {
                downloadLinkRef.current.click();
            }
        },
    }));

    return (
        <PDFDownloadLink
            document={<ReporteVentaPDF usuario={usuario} ventas={ventas} />}
            fileName="reporte_venta.pdf"
        >
            {({ loading, url }) =>
                loading ? (
                    'Generando PDF...'
                ) : (
                    <button
                        ref={downloadLinkRef}
                        style={{ display: 'none' }}
                        onClick={() => window.open(url)}
                    >
                        Descargar PDF
                    </button>
                )
            }
        </PDFDownloadLink>
    );
});

export default DescargarPDF;