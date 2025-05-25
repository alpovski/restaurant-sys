import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { menu, orders } from '../services/api';
import { MenuItem as MenuItemType, Category, OrderCreate, OrderItemCreate, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Menu: React.FC = () => {
    const [items, setItems] = useState<MenuItemType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
    const [cart, setCart] = useState<{ item: MenuItemType; quantity: number }[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const navigate = useNavigate();
    const query = useQuery();
    const { user } = useAuth();

    // URL'den masa numarasını al
    const tableNumber = Number(query.get('table')) || '';

    useEffect(() => {
        loadMenuItems();
    }, [selectedCategory]);

    const loadMenuItems = async () => {
        try {
            const data = await menu.getItems(selectedCategory || undefined);
            setItems(data);
        } catch (error) {
            console.error('Menü yüklenirken hata:', error);
            setSnackbar({
                open: true,
                message: 'Menü yüklenirken bir hata oluştu',
                severity: 'error'
            });
        }
    };

    const addToCart = (item: MenuItemType) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.item.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: number) => {
        setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(cartItem =>
                cartItem.item.id === itemId
                    ? { ...cartItem, quantity }
                    : cartItem
            )
        );
    };

    const handleOrder = async () => {
        if (!tableNumber) {
            setSnackbar({
                open: true,
                message: 'Masa numarası bulunamadı. Lütfen QR kodu tekrar okutun.',
                severity: 'error'
            });
            return;
        }

        try {
            const orderItems: OrderItemCreate[] = cart.map(cartItem => ({
                menu_item_id: cartItem.item.id,
                quantity: cartItem.quantity,
                price: cartItem.item.price
            }));

            const order: OrderCreate = {
                table_id: tableNumber,
                items: orderItems,
                status: OrderStatus.PENDING,
                total_amount: cart.reduce((total, item) => total + (item.item.price * item.quantity), 0)
            };

            await orders.createOrder(order);
            setSnackbar({
                open: true,
                message: 'Siparişiniz başarıyla oluşturuldu',
                severity: 'success'
            });
            setCart([]);
            setOpenDialog(false);
            navigate('/');
        } catch (error) {
            console.error('Sipariş oluşturulurken hata:', error);
            setSnackbar({
                open: true,
                message: 'Sipariş oluşturulurken bir hata oluştu',
                severity: 'error'
            });
        }
    };

    const totalAmount = cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>Kategori</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as Category)}
                        label="Kategori"
                    >
                        <MenuItem value="">Tümü</MenuItem>
                        <MenuItem value={Category.APPETIZER}>Başlangıçlar</MenuItem>
                        <MenuItem value={Category.MAIN_COURSE}>Ana Yemekler</MenuItem>
                        <MenuItem value={Category.DESSERT}>Tatlılar</MenuItem>
                        <MenuItem value={Category.BEVERAGE}>İçecekler</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {items.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card>
                            {item.image_url && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={item.image_url}
                                    alt={item.name}
                                />
                            )}
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                    {item.price} TL
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => addToCart(item)}
                                    sx={{ mt: 2 }}
                                >
                                    Sepete Ekle
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {cart.length > 0 && (
                <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        Sepetim
                    </Typography>
                    {cart.map((cartItem) => (
                        <Box key={cartItem.item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ flex: 1 }}>
                                {cartItem.item.name} x {cartItem.quantity}
                            </Typography>
                            <Typography sx={{ mx: 2 }}>
                                {cartItem.item.price * cartItem.quantity} TL
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            >
                                -
                            </Button>
                            <Typography sx={{ mx: 1 }}>{cartItem.quantity}</Typography>
                            <Button
                                size="small"
                                onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            >
                                +
                            </Button>
                            <Button
                                color="error"
                                onClick={() => removeFromCart(cartItem.item.id)}
                                sx={{ ml: 2 }}
                            >
                                Kaldır
                            </Button>
                        </Box>
                    ))}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Toplam: {totalAmount} TL
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                        sx={{ mt: 2 }}
                    >
                        Sipariş Ver
                    </Button>
                </Box>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Sipariş Onayı</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Masa No: <b>{tableNumber || '-'}</b>
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Toplam Tutar: {totalAmount} TL
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>İptal</Button>
                    <Button onClick={handleOrder} variant="contained" color="primary">
                        Siparişi Onayla
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Menu; 