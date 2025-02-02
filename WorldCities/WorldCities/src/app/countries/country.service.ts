import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHTTPService } from '../base-http.service';
import { Country, GetCountriesResponseObject } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountryService
  extends BaseHTTPService<Country> {
  constructor(
    http: HttpClient) {
    super(http);
  }

  public createItem(country: Country): Observable<Country> {
    return this.http.post<Country>(`${environment.baseUrl}api/Countries`, country);
  }

  public readItem(id: number): Observable<Country> {
    return this.http.get<Country>(`${environment.baseUrl}api/Countries/${id}`);
  }

  readItems(
    pageSize: number,
    pageIndex?: number,
    sortColumn?: string,
    sortOrder?: string,
    filterColumn?: string,
    filterValue?: string
  ): Observable<GetCountriesResponseObject> {
    return this.http.get<GetCountriesResponseObject>(
      `${environment.baseUrl}api/Countries`,
      {
        params: this.getReducedParams(pageSize, pageIndex, sortColumn, sortOrder, filterColumn, filterValue)
      }
    );
  }

  public updateItem(country: Country): Observable<Response> {
    return this.http.put<Response>(`${environment.baseUrl}api/Countries/${country.id}`, country);
  }

  public isItemDuplicate(country: Country): Observable<boolean> {
    return this.http.post<boolean>(`${environment.baseUrl}api/Countries/CountryIsDuplicate`, country);
  }

  public isFieldDuplicate(
    filterName: string,
    filterValue: string
  ): Observable<boolean> {
    const params = new HttpParams()
      .set('filterName', filterName)
      .set('filterValue', filterValue);
    ;
    return this.http.post<boolean>(`${environment.baseUrl}api/Countries/FieldIsDuplicate`, null, { params });
  }
}
