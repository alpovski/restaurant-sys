export enum UserRole {
    ADMIN = "admin",
    WAITER = "waiter",
    KITCHEN = "kitchen",
    CUSTOMER = "customer"
}

export enum Category {
    APPETIZER = "appetizer",
    MAIN_COURSE = "main_course",
    DESSERT = "dessert",
    BEVERAGE = "beverage"
}

export enum OrderStatus {
    PENDING = "pending",
    PREPARING = "preparing",
    READY = "ready",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}

export enum TableStatus {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    RESERVED = "reserved",
    CLEANING = "cleaning"
}

export interface User {
    id: number;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
    role: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: Category;
    is_available: boolean;
    image_url?: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    menu_item_id: number;
    quantity: number;
    price: number;
}

export interface OrderItemCreate {
    menu_item_id: number;
    quantity: number;
    price: number;
}

export interface Order {
    id: number;
    table_id: number;
    status: OrderStatus;
    total_amount: number;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
}

export interface OrderCreate {
    table_id: number;
    items: OrderItemCreate[];
    status: OrderStatus;
    total_amount: number;
}

export interface Table {
    id: number;
    number: number;
    capacity: number;
    is_occupied: boolean;
    current_order_id?: number;
}

export interface Reservation {
    id: string;
    user_id: string;
    table_id: string;
    date: string;
    time: string;
    number_of_guests: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    notes?: string;
} 