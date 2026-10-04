export class WeatherService {
    static async fetchWeatherData(city: string): Promise<any> {
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
            throw new Error("WEATHER_API_KEY is not set in the environment variables.");
        }
        const URL = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;
        
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }
} 