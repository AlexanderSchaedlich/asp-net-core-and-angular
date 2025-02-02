import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHTTPService } from '../base-http.service';
import { City, GetCitiesResponseObject } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CityService
  extends BaseHTTPService<City> {
  constructor(
    http: HttpClient) {
    super(http);
  }

  public createItem(city: City): Observable<City> {
    return this.http.post<City>(`${environment.baseUrl}api/Cities`, city);
  }

  public readItem(id: number): Observable<City> {
    return this.http.get<City>(`${environment.baseUrl}api/Cities/${id}`);
  }

  readItems(
    pageSize: number,
    pageIndex?: number,
    sortColumn?: string,
    sortOrder?: string,
    filterColumn?: string,
    filterValue?: string
  ): Observable<GetCitiesResponseObject> {
    return this.http.get<GetCitiesResponseObject>(
      `${environment.baseUrl}api/Cities`,
      {
        params: this.getReducedParams(pageSize, pageIndex, sortColumn, sortOrder, filterColumn, filterValue)
      }
    );
  }

  public updateItem(city: City): Observable<Response> {
    return this.http.put<Response>(`${environment.baseUrl}api/Cities/${city.id}`, city);
  }

  public isItemDuplicate(city: City): Observable<boolean> {
    return this.http.post<boolean>(`${environment.baseUrl}api/Cities/CityIsDuplicate`, city);
  }
}
