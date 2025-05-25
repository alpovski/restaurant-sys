import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
} from '@mui/material';
import { tables, orders } from '../services/api';
import { Table, Order, OrderStatus, OrderCreate } from '../types';

const Tables: React.FC = () => {
    const [tableList, setTableList] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchTables();
        const interval = setInterval(fetchTables, 30000); // Her 30 saniyede bir güncelle
        return () => clearInterval(interval);
    }, []);

    const fetchTables = async () => {
        try {
            const data = await tables.getTables();
            setTableList(data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleTableClick = async (table: Table) => {
        setSelectedTable(table);
        if (table.current_order_id) {
            try {
                const order = await orders.getOrder(table.current_order_id);
                setCurrentOrder(order);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        } else {
            setCurrentOrder(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTable(null);
        setCurrentOrder(null);
        setNumberOfGuests(1);
    };

    const handleCreateOrder = async () => {
        if (!selectedTable) return;

        try {
            const orderData: OrderCreate = {
                table_id: selectedTable.id,
                items: [],
                status: OrderStatus.PENDING,
                total_amount: 0,
            };

            const order = await orders.createOrder(orderData);

            await tables.updateTable(selectedTable.id, {
                is_occupied: true,
                current_order_id: order.id,
            });

            handleCloseDialog();
            fetchTables();
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleCompleteOrder = async () => {
        if (!selectedTable || !currentOrder) return;

        try {
            await orders.updateOrderStatus(currentOrder.id, OrderStatus.DELIVERED);
            await tables.updateTable(selectedTable.id, {
                is_occupied: false,
                current_order_id: undefined,
            });

            handleCloseDialog();
            fetchTables();
        } catch (error) {
            console.error('Error completing order:', error);
        }
    };

    return (
        <Container>
            <Grid container spacing={3}>
                {tableList.map((table) => (
                    <Grid item xs={12} sm={6} md={4} key={table.id}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                bgcolor: table.is_occupied ? 'error.light' : 'success.light',
                            }}
                            onClick={() => handleTableClick(table)}
                        >
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Masa {table.number}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Kapasite: {table.capacity} kişi
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Durum: {table.is_occupied ? 'Dolu' : 'Boş'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    Masa {selectedTable?.number} -{' '}
                    {selectedTable?.is_occupied ? 'Dolu' : 'Boş'}
                </DialogTitle>
                <DialogContent>
                    {currentOrder ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Mevcut Sipariş
                            </Typography>
                            <Typography variant="body1">
                                Sipariş No: {currentOrder.id}
                            </Typography>
                            <Typography variant="body1">
                                Toplam: {currentOrder.total_amount.toFixed(2)} TL
                            </Typography>
                            <Typography variant="body1">
                                Durum: {currentOrder.status}
                            </Typography>
                        </Box>
                    ) : (
                        <TextField
                            margin="dense"
                            label="Müşteri Sayısı"
                            type="number"
                            fullWidth
                            value={numberOfGuests}
                            onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                            inputProps={{ min: 1, max: selectedTable?.capacity }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>İptal</Button>
                    {currentOrder ? (
                        <Button onClick={handleCompleteOrder} color="success">
                            Siparişi Tamamla
                        </Button>
                    ) : (
                        <Button onClick={handleCreateOrder} color="primary">
                            Yeni Sipariş
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Tables; 