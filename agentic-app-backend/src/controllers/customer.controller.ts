import type { Request, Response } from "express";
import { MOCK_CUSTOMERS } from "../data/customers.data.ts";

export class CustomerController {
    static getAllCustomers(req: Request, res: Response) {
        res.json(MOCK_CUSTOMERS);
    }

    static getCustomerById(req: Request, res: Response) {
        const { id } = req.params;
        const customer = MOCK_CUSTOMERS.find(c => c._id === id);

        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: "Customer not found" });
        }
    }
}