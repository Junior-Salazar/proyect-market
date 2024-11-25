import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                primary: {
                    main: '#4CAF50',
                    contrastText: '#FFFFFF',
                },
                secondary: {
                    main: '#A5D6A7',
                    contrastText: '#4CAF50',
                },
                background: {
                    default: '#F9FBE7',
                    paper: '#FFFFFF',
                },
                text: {
                    primary: '#000000',
                    secondary: '#757575',
                },
                error: {
                    main: '#F44336',
                },
                success: {
                    main: '#66BB6A',
                },
            }
            : {
                primary: {
                    main: '#2E7D32',
                    contrastText: '#E0E0E0',
                },
                secondary: {
                    main: '#A5D6A7',
                    contrastText: '#2E7D32',
                },
                background: {
                    default: '#2B2B2B',
                    paper: '#1B3E20',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#A5D6A7',
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
            color: mode === 'light' ? '#000000' : '#FFFFFF',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            color: mode === 'light' ? '#000000' : '#FFFFFF',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
            color: mode === 'light' ? '#000000' : '#FFFFFF',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 400,
            color: mode === 'light' ? '#000000' : '#FFFFFF',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 300,
            color: mode === 'light' ? '#000000' : '#FFFFFF',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 200,
            color: mode === 'light' ? '#000000' : '#FFFFFF',
        },
        body1: {
            fontSize: '1rem',
            color: mode === 'light' ? '#000000' : '#FFFFFF',
        },
        body2: {
            fontSize: '0.875rem',
            color: mode === 'light' ? '#757575' : '#A5D6A7',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: mode === 'light' ? '#000000' : '#A5D6A7',
        },
        subtitle: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: mode === 'light' ? '#4CAF50' : '#A5D6A7',
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
                            borderColor: mode === 'light' ? '#4CAF50' : '#A5D6A7',
                        },
                        '&:hover fieldset': {
                            borderColor: mode === 'light' ? '#1B5E20' : '#E0E0E0',
                        },
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: mode === 'light' ? '#4CAF50' : '#A5D6A7',
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
                    backgroundColor: mode === 'light' ? '#A5D6A7' : '#2E7D32',
                    color: mode === 'light' ? '#000000' : '#FFFFFF',
                },
            },
        },
    },
});

export const theme = (mode) => createTheme(getDesignTokens(mode));