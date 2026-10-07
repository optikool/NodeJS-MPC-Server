import { MOCK_CUSTOMERS } from "../data/customers.data.ts";
import { MOCK_ORDERS, type Order } from "../data/orders.data.ts";

export class OrderService {
    static async getLatestOrders(limit?: number): Promise<Order[]> {
        const sortedOrders = MOCK_ORDERS.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (limit && limit > 0) {
            return sortedOrders.slice(0, limit);
        }

        return sortedOrders;
    }

    static async getLatestOrdersWithCustomerDetails(limit?: number): Promise<Order[]> {
        const customers = MOCK_CUSTOMERS;
        const orders = MOCK_ORDERS.map(order => {
            const customer = customers.find(c => c._id === order.customer);
            return {
                ...order,
                customer: customer?.name || "Unknown Customer"
            };
        });

        const sortedOrders = orders.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (limit && limit > 0) {
            return sortedOrders.slice(0, limit);
        }
        return sortedOrders;
    }   

    static async getOrderById(id: string): Promise<Order | null> {
        return MOCK_ORDERS.find(o => o._id === id) || null;
    }
}