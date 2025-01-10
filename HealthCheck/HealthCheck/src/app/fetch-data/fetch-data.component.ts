import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrl: './fetch-data.component.scss'
})
export class FetchDataComponent {
  public forecasts?: WeatherForecast[];
  constructor(http: HttpClient) {
    http.get<WeatherForecast[]>(environment.baseUrl + 'api/weatherforecast').subscribe({
      next: forecasts => {
        this.forecasts = forecasts;
      },
      error: error => console.error(error)
    });
  }
}
