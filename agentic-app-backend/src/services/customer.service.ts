import { MOCK_CUSTOMERS } from "../data/customers.data.ts";


export class CustomerService {
    static async getLatestCustomers(limit?: number): Promise<any[]> {
        const sortedCustomers = MOCK_CUSTOMERS.sort((a, b) => 
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
        );

        if (limit && limit > 0) {
            return sortedCustomers.slice(0, limit);
        }

        return sortedCustomers;
    }

    static async getCustomerById(id: string): Promise<any | null> {
        return MOCK_CUSTOMERS.find(c => c._id === id);
    }
}