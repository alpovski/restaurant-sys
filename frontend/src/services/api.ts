import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse, MenuItem, Order, OrderStatus, Table, User, Category, OrderCreate } from '../types';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const formData = new FormData();
        formData.append('username', data.email);
        formData.append('password', data.password);
        
        const response = await api.post<AuthResponse>('/token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        
        // Kullanıcı bilgilerini al
        const userResponse = await api.get<User>('/users/me', {
            headers: {
                Authorization: `Bearer ${response.data.access_token}`,
            },
        });
        
        return {
            ...response.data,
            user: userResponse.data,
        };
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/users/', data);
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<User>('/users/me');
        return response.data;
    },
};

export const menu = {
    getItems: async (category?: Category): Promise<MenuItem[]> => {
        const response = await api.get<MenuItem[]>('/menu/items', {
            params: { category },
        });
        return response.data;
    },

    getItem: async (id: number): Promise<MenuItem> => {
        const response = await api.get<MenuItem>(`/menu/items/${id}`);
        return response.data;
    },

    createItem: async (data: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
        const response = await api.post<MenuItem>('/menu/items', data);
        return response.data;
    },

    updateItem: async (id: number, data: Partial<MenuItem>): Promise<MenuItem> => {
        const response = await api.put<MenuItem>(`/menu/items/${id}`, data);
        return response.data;
    },

    deleteItem: async (id: number): Promise<void> => {
        await api.delete(`/menu/items/${id}`);
    },
};

export const orders = {
    getOrders: async (status?: OrderStatus): Promise<Order[]> => {
        const response = await api.get<Order[]>('/orders', {
            params: { status },
        });
        return response.data;
    },

    getActiveOrders: async (): Promise<Order[]> => {
        const response = await api.get<Order[]>('/orders/active');
        return response.data;
    },

    getOrder: async (id: number): Promise<Order> => {
        const response = await api.get<Order>(`/orders/${id}`);
        return response.data;
    },

    createOrder: async (data: OrderCreate): Promise<Order> => {
        const response = await api.post<Order>('/orders', data);
        return response.data;
    },

    updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
        const response = await api.put<Order>(`/orders/${id}/status`, { status });
        return response.data;
    },
};

export const tables = {
    getTables: async (): Promise<Table[]> => {
        const response = await api.get<Table[]>('/tables');
        return response.data;
    },

    getTable: async (id: number): Promise<Table> => {
        const response = await api.get<Table>(`/tables/${id}`);
        return response.data;
    },

    createTable: async (data: Omit<Table, 'id' | 'current_order_id'>): Promise<Table> => {
        const response = await api.post<Table>('/tables', data);
        return response.data;
    },

    updateTable: async (id: number, data: Partial<Table>): Promise<Table> => {
        const response = await api.put<Table>(`/tables/${id}`, data);
        return response.data;
    },

    deleteTable: async (id: number): Promise<void> => {
        await api.delete(`/tables/${id}`);
    },
};

export default api; 