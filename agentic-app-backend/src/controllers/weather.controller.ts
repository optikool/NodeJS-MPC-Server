import type { Request, Response } from "express";
import { WeatherService } from "../services/weather.service.ts";

export class WeatherController {
    static async getWeatherData(req: Request, res: Response): Promise<void> {
        try {
            const { q } = req.query || 'San Diego';

            if (!q) {
                res.status(400).json({
                    success: false,
                    message: "Query parameter is required. Example: London"
                });
            }

            const data = await WeatherService.fetchWeatherData(String(q));

            res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Error fetching weather data:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch weather data"
            });
        }
    }
}