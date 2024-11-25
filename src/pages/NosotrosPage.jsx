import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImgUs from '../img/unDraw_us.svg';
import ImgHistory from '../img/unDraw_history.svg';
import ImgVision from '../img/unDraw_vision.svg';

const InfoCard = ({ imgSrc, imgAlt, title, description, icon }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={8}
            sx={{
                padding: theme.spacing(4),
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                textAlign: 'center',
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.25)',
                },
            }}
        >
            <img
                src={imgSrc}
                alt={imgAlt}
                style={{
                    width: '100%',
                    height: 'auto',
                    marginBottom: theme.spacing(2),
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }}
            />
            <Box display="flex" alignItems="center" justifyContent="center" marginBottom={2}>
                {icon}
                <Typography
                    variant="h5"
                    sx={{
                        color: theme.palette.primary.main,
                        fontWeight: theme.typography.fontWeightBold,
                        textTransform: 'uppercase',
                    }}
                >
                    {title}
                </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.primary, lineHeight: '1.5' }}>
                {description}
            </Typography>
        </Paper>
    );
};

const NosotrosPage = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                padding: theme.spacing(6),
                backgroundColor: theme.palette.background.default,
                minHeight: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    padding: theme.spacing(6),
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.default,
                    borderRadius: theme.shape.borderRadius * 2,
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
                }}
            >
                <Box
                    sx={{
                        flex: { xs: '1', md: '0 0 50%' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: { xs: theme.spacing(4), md: 0 },
                        marginRight: { md: theme.spacing(4) },
                    }}
                >
                    <img
                        src={ImgUs}
                        alt="Sobre nosotros"
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            height: 'auto',
                            borderRadius: '10px',
                            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                </Box>

                <Paper
                    elevation={6}
                    sx={{
                        flex: { xs: '1', md: '0 0 50%' },
                        padding: { xs: theme.spacing(3), md: theme.spacing(5) },
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: theme.shape.borderRadius * 2,
                        width: '100%',
                        textAlign: 'left',
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
                        color: theme.palette.text.primary,
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            color: theme.palette.primary.main,
                            fontWeight: theme.typography.fontWeightBold,
                            fontSize: { xs: '1.75rem', md: '2rem' },
                            textTransform: 'uppercase',
                            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        Sobre Nosotros
                    </Typography>
                    <Typography variant="body2" paragraph sx={{ marginBottom: theme.spacing(3), lineHeight: '1.5', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                        Somos una tienda dedicada a ofrecer los mejores productos del mercado. Con años de experiencia, nos hemos consolidado como una de las opciones preferidas por nuestros clientes, gracias a nuestro compromiso con la calidad y la atención personalizada.
                    </Typography>
                    <Typography variant="body2" paragraph sx={{ marginBottom: theme.spacing(3), lineHeight: '1.5', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                        Nuestra misión es proporcionar productos que cumplan con las expectativas de nuestros clientes, brindando un servicio eficiente y amigable. Contamos con una amplia gama de productos de distintas categorías para satisfacer las necesidades de todos.
                    </Typography>
                    <Typography variant="body2" paragraph sx={{ marginBottom: theme.spacing(3), lineHeight: '1.5', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                        A lo largo de nuestra historia, hemos construido relaciones duraderas con proveedores locales e internacionales, garantizando productos de alta calidad a precios competitivos.
                    </Typography>
                </Paper>
            </Box>

            {/* Grid con las secciones adicionales */}
            <Grid container spacing={4} sx={{ marginTop: theme.spacing(5), maxWidth: '900px' }}>
                <Grid item xs={12} sm={6}>
                    <InfoCard
                        imgSrc={ImgHistory}
                        imgAlt="Historia de la tienda"
                        title="Nuestra Historia"
                        description="Fundados en 2010, empezamos como una pequeña tienda local, pero con el paso de los años hemos crecido hasta convertirnos en una de las tiendas en línea más confiables y apreciadas del país."
                        icon={<HistoryIcon fontSize="large" sx={{ color: theme.palette.primary.main, marginRight: theme.spacing(1) }} />}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InfoCard
                        imgSrc={ImgVision}
                        imgAlt="Nuestra Visión"
                        title="Nuestra Visión"
                        description="Aspiramos a ser líderes en el sector minorista, reconocidos por nuestra innovación, responsabilidad y calidad en el servicio."
                        icon={<VisibilityIcon fontSize="large" sx={{ color: theme.palette.primary.main, marginRight: theme.spacing(1) }} />}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default NosotrosPage;