import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseHTTPService } from '../base-http.service';
import { Country, GetCountriesResponseObject } from '../models';
import { environment } from '../../environments/environment';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class CountryService
  extends BaseHTTPService<Country> {
  constructor(
    http: HttpClient,
    private apollo: Apollo) {
    super(http);
  }

  public isFieldDuplicate(
    fieldName: string,
    fieldValue: string
  ): Observable<boolean> {
    const params = new HttpParams()
      .set('fieldName', fieldName)
      .set('fieldValue', fieldValue);
    ;
    return this.http.post<boolean>(`${environment.baseUrl}api/Countries/FieldIsDuplicate`, null, { params });
  }

  public readItems(
    pageSize: number,
    pageIndex: number = 0,
    sortColumn: string = '',
    sortOrder: string = '',
    filterColumn: string = '',
    filterQuery: string = ''
  ): Observable<GetCountriesResponseObject> {
    return this.apollo
      .query({
        query: gql`
          query GetCountriesApiResult(
            $pageIndex: Int!,
            $pageSize: Int!,
            $sortColumn: String,
            $sortOrder: String,
            $filterColumn: String,
            $filterQuery: String) {
            countriesApiResult(
              pageIndex: $pageIndex
              pageSize: $pageSize
              sortColumn: $sortColumn
              sortOrder: $sortOrder
              filterColumn: $filterColumn
              filterQuery: $filterQuery
            ){
               countries {
                 id
                 name
                 iso2
                 iso3
                 numberOfCities
               },
               totalCount
             }
          }
        `,
        variables: {
          pageIndex,
          pageSize,
          sortColumn,
          sortOrder,
          filterColumn,
          filterQuery
        }
      })
      .pipe(map((result: any) =>
        result.data.countriesApiResult));
  }

  public readItem(id: number): Observable<Country> {
    return this.apollo
      .query({
        query: gql`
          query GetCountryById($id: Int!) {
            countries(where: { id: { eq: $id } }) {
              nodes {
                id
                name
                iso2
                iso3
              }
            }
          }
        `,
        variables: {
          id
        }
      })
      .pipe(map((result: any) =>
        result.data.countries.nodes[0]));
  }

  public updateItem(item: Country): Observable<Response> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateCountry($country: CountryDTOInput!) {
            updateCountry(countryDTO: $country) { 
              id
              name
              iso2
              iso3
            }
          }
        `,
        variables: {
          country: item
        }
      })
      .pipe(map((result: any) =>
        result.data.updateCountry));
  }

  public createItem(item: Country): Observable<Country> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation addCountry($country: CountryDTOInput!) {
            addCountry(countryDTO: $country) { 
              id
              name
              iso2
              iso3
            }
          }
        `,
        variables: {
          country: item
        }
      })
      .pipe(map((result: any) =>
        result.data.addCountry));
  }
}
