import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseHTTPService } from '../base-http.service';
import { City, GetCitiesResponseObject } from '../models';
import { environment } from '../../environments/environment';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class CityService
  extends BaseHTTPService<City> {
  constructor(
    http: HttpClient,
    private apollo: Apollo) {
    super(http);
  }

  public readItem(id: number): Observable<City> {
    return this.apollo
      .query({
        query: gql`
          query GetCityById($id: Int!) {
            cities(where: { id: { eq: $id } }) {
              nodes {
                id
                name
                lat
                lon
                countryId
              }
            }
          }
        `,
        variables: {
          id
        }
      })
      .pipe(map((result: any) =>
        result.data.cities.nodes[0]));
  }

  public readItems(
    pageSize: number,
    pageIndex: number = 0,
    sortColumn: string = '',
    sortOrder: string = '',
    filterColumn: string = '',
    filterQuery: string = ''
  ): Observable<GetCitiesResponseObject> {
    console.log(filterQuery);
    return this.apollo
      .query({
        query: gql`
          query GetCitiesApiResult(
              $pageIndex: Int!,
              $pageSize: Int!,
              $sortColumn: String,
              $sortOrder: String,
              $filterColumn: String,
              $filterQuery: String) {
            citiesApiResult(
              pageIndex: $pageIndex
              pageSize: $pageSize
              filterColumn: $filterColumn
              filterQuery: filterQuery
              sortColumn: $sortColumn
              sortOrder: $sortOrder
            ) { 
               cities { 
                 id
                 name
                 lat 
                 lon
                 countryId
                 countryName 
               }
              }
          }
        `,
        variables: {
          pageIndex,
          pageSize,
          filterColumn,
          filterQuery,
          sortColumn,
          sortOrder
        }
      })
      .pipe(map((result: any) =>
        result.data.citiesApiResult));
  }

  public updateItem(input: City): Observable<Response> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation UpdateCity($city: CityDTOInput!) {
            updateCity(cityDTO: $city) { 
              id
              name
              lat
              lon
              countryId
            }
          }
        `,
        variables: {
          city: input
        }
      }).pipe(map((result: any) =>
        result.data.updateCity));
  }

  public createItem(item: City): Observable<City> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation AddCity($city: CityDTOInput!) {
            addCity(cityDTO: $city) { 
              id 
              name
              lat
              lon
              countryId
            }
          }
        `,
        variables: {
          city: item
        }
      }).pipe(map((result: any) =>
        result.data.addCity));
  }

  public isItemDuplicate(city: City): Observable<boolean> {
    return this.http.post<boolean>(`${environment.baseUrl}api/Cities/CityIsDuplicate`, city);
  }
}
