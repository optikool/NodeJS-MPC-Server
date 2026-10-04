import type { Request, Response } from "express";
import { MOCK_ORDERS } from "../data/orders.data.ts";

export class OrderController {
    static getAllOrders(req: Request, res: Response) {
        // Placeholder for fetching all orders
        res.json(MOCK_ORDERS);
    }

    static getOrderById(req: Request, res: Response) {
        const { id } = req.params;
        const order = MOCK_ORDERS.find(o => o._id === id);

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    }
}