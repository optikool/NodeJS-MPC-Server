import type { Request, Response } from "express";
import { MOCK_CUSTOMERS } from "../data/customers.data.ts";
import { CustomerService } from "../services/customer.service.ts";

export class CustomerController {
    static async getAllCustomers(req: Request, res: Response): Promise<any> {
        try {
            const { limit } = req.query;
            const customers = await CustomerService.getLatestCustomers(limit ? Number(limit) : undefined);
            res.json(customers);
        } catch (error) {
            console.error("Error fetching customers:", error);
            res.status(500).json({ error: "Failed to fetch customers" });
        }
    }

    static async getCustomerById(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const customer = await CustomerService.getCustomerById(String(id));

        if (!customer) {
           return res.status(404).json({ error: "Customer not found" });
        }

        res.json(customer);
    }
}