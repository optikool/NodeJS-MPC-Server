export interface WeatherLocation {
    name: string,
    region: string,
    country: string,
    lat: number,
    lon: number,
    tz_id: string,
    localtime_epoch: number,
    localtime: string
}

export interface WeatherCondition {
    text: string,
    icon: string,
    code: number
}

export interface WeatherCurrent {
    last_updated_epoch: number,
    last_updated: string,
    temp_c: number,
    temp_f: number,
    is_day: number,
    condition: WeatherCondition,
}

export interface WeatherService {
    location: WeatherLocation,
    current: WeatherCurrent
}

export class WeatherService {
    static async fetchWeatherData(city: string): Promise<WeatherService> {
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