import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                primary: {
                    main: '#101422',
                    contrastText: '#FFFFFF',
                },
                secondary: {
                    main: '#A8DCE7',
                    contrastText: '#101422',
                },
                background: {
                    default: '#d3e5fe',
                    paper: '#FFFFFF',
                },
                text: {
                    primary: '#101422',
                    secondary: '#FFFFFF',
                },
                error: {
                    main: '#FF1744',
                },
                success: {
                    main: '#2E7D32',
                },
            }
            : {
                primary: {
                    main: '#A8DCE7',
                    contrastText: '#101422',
                },
                secondary: {
                    main: '#272B3B',
                    contrastText: '#FFFFFF',
                },
                background: {
                    default: '#101422',
                    paper: '#272B3B',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#A8DCE7',
                },
                error: {
                    main: '#FF5252',
                },
                success: {
                    main: '#66BB6A',
                },
            }),
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 400,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 300,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 200,
        },
        body1: {
            fontSize: '1rem',
            color: mode === 'light' ? '#101422' : '#FFFFFF',
        },
        body2: {
            fontSize: '0.875rem',
            color: mode === 'light' ? '#272B3B' : '#A8DCE7',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: mode === 'light' ? '#272B3B' : '#A8DCE7',
        },
        subtitle: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: mode === 'light' ? '#272B3B' : '#A8DCE7',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
                contained: {
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: mode === 'light' ? '#272B3B' : '#A8DCE7',
                        },
                        '&:hover fieldset': {
                            borderColor: mode === 'light' ? '#101422' : '#FFFFFF',
                        },
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: mode === 'light' ? '#272B3B' : '#A8DCE7',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'light'
                        ? '0px 4px 12px rgba(0, 0, 0, 0.1)'
                        : '0px 4px 12px rgba(255, 255, 255, 0.1)',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? '#A8DCE7' : '#101422',
                    color: mode === 'light' ? '#101422' : '#FFFFFF',
                },
            },
        },
    },
});

export const theme = (mode) => createTheme(getDesignTokens(mode));