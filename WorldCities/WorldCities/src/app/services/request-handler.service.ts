import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetCitiesResponseObject, GetCountriesResponseObject } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestHandlerService {

  constructor(private http: HttpClient) {
  }

  public getCities(params: HttpParams): Observable<GetCitiesResponseObject> {
    return this.http.get<GetCitiesResponseObject>(`${environment.baseUrl}api/Cities`, {params});
  }

  public getCountries(params: HttpParams): Observable<GetCountriesResponseObject> {
    return this.http.get<GetCountriesResponseObject>(`${environment.baseUrl}api/Countries`, {params});
  }
}
