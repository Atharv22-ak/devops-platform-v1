import { createTheme } from '@mui/material/styles';

// Shared palette so the sidebar / login screen can reuse the same colours
export const brand = {
  indigo: '#4f46e5',
  violet: '#7c3aed',
  cyan: '#06b6d4',
  navy: '#0b1020',
  gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #06b6d4 100%)',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4f46e5', light: '#818cf8', dark: '#3730a3' },
    secondary: { main: '#0ea5e9' },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    background: { default: '#f5f7fb', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
    divider: 'rgba(15, 23, 42, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontSize: '1.2rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#f5f7fb', WebkitFontSmoothing: 'antialiased' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, padding: '8px 20px' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)' },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(15, 23, 42, 0.07)',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.12)',
          transition: 'box-shadow .2s ease, transform .2s ease',
          '&:hover': {
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 14px 32px -12px rgba(79, 70, 229, 0.25)',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        title: { fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10, backgroundColor: '#fff' } } },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, color: '#475569', backgroundColor: '#f8fafc', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' },
      },
    },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
  },
});

export default theme;
