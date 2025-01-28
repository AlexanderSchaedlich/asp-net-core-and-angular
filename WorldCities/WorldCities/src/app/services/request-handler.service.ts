import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { City, Country, GetCitiesResponseObject, GetCountriesResponseObject } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestHandlerService {

  constructor(private http: HttpClient) {
  }

  public createCity(city: City): Observable<City> {
    return this.http.post<City>(`${environment.baseUrl}api/Cities`, city);
  }

  public readCities(params: HttpParams): Observable<GetCitiesResponseObject> {
    return this.http.get<GetCitiesResponseObject>(`${environment.baseUrl}api/Cities`, {params});
  }

  public readCity(id: number): Observable<City> {
    return this.http.get<City>(`${environment.baseUrl}api/Cities/${id}`);
  }

  public updateCity(id: number, city: City): Observable<Response> {
    return this.http.put<Response>(`${environment.baseUrl}api/Cities/${id}`, city);
  }

  public isCityDuplicate(city: City): Observable<boolean> {
    return this.http.post<boolean>(`${environment.baseUrl}api/Cities/CityIsDuplicate`, city);
  }

  public createCountry(country: Country): Observable<Country> {
    return this.http.post<Country>(`${environment.baseUrl}api/Countries`, country);
  }

  public readCountries(params: HttpParams): Observable<GetCountriesResponseObject> {
    return this.http.get<GetCountriesResponseObject>(`${environment.baseUrl}api/Countries`, { params });
  }

  public readCountry(id: number): Observable<Country> {
    return this.http.get<Country>(`${environment.baseUrl}api/Countries/${id}`);
  }

  public updateCountry(id: number, country: Country): Observable<Response> {
    return this.http.put<Response>(`${environment.baseUrl}api/Countries/${id}`, country);
  }

  public isCountryFieldDuplicate(params: HttpParams): Observable<boolean> {
    return this.http.post<boolean>(`${environment.baseUrl}api/Countries/FieldIsDuplicate`, null, { params });
  }
}

