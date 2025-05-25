import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import PrivateRoute from './components/PrivateRoute';
import Kitchen from './pages/Kitchen';
import Tables from './pages/Tables';
import Admin from './pages/Admin';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Layout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<Navigate to="/menu" replace />} />
                            <Route path="menu" element={<Menu />} />
                            <Route path="kitchen" element={<Kitchen />} />
                        </Route>
                        <Route
                            path="tables"
                            element={
                                <PrivateRoute>
                                    <Tables />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="admin"
                            element={
                                <PrivateRoute>
                                    <Admin />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
