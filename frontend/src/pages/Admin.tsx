import React from 'react';
import { Container, Typography } from '@mui/material';

const Admin: React.FC = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Yönetici Paneli
            </Typography>
            <Typography>
                Burada yöneticiye özel işlemler ve raporlar yer alacak.
            </Typography>
        </Container>
    );
};

export default Admin; 