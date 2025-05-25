import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Tabs,
    Tab,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { orders } from '../services/api';
import { Order, OrderStatus } from '../types';

const Kitchen: React.FC = () => {
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.PENDING);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000); // Her 30 saniyede bir güncelle
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orders.getActiveOrders();
            setActiveOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        try {
            await orders.updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const filteredOrders = activeOrders.filter((order) => order.status === selectedStatus);

    return (
        <Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={selectedStatus}
                    onChange={(_, newValue) => setSelectedStatus(newValue)}
                >
                    <Tab label="Bekleyen" value={OrderStatus.PENDING} />
                    <Tab label="Hazırlanan" value={OrderStatus.PREPARING} />
                    <Tab label="Hazır" value={OrderStatus.READY} />
                </Tabs>
            </Box>

            <Grid container spacing={3}>
                {filteredOrders.map((order) => (
                    <Grid item xs={12} md={6} lg={4} key={order.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Sipariş #{order.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {new Date(order.created_at).toLocaleString()}
                                </Typography>
                                <List>
                                    {order.items.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={item.menu_item_id}
                                                    secondary={`Adet: ${item.quantity}`}
                                                />
                                            </ListItem>
                                            {index < order.items.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">
                                        Toplam: {order.total_amount.toFixed(2)} TL
                                    </Typography>
                                    {order.status === OrderStatus.PENDING && (
                                        <Button
                                            variant="contained"
                                            onClick={() => handleStatusChange(order.id, OrderStatus.PREPARING)}
                                        >
                                            Hazırlanıyor
                                        </Button>
                                    )}
                                    {order.status === OrderStatus.PREPARING && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleStatusChange(order.id, OrderStatus.READY)}
                                        >
                                            Hazır
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Kitchen; 