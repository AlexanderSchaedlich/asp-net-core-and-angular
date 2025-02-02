import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseHTTPService<T> {
  constructor(
    protected http: HttpClient) {
  }
  abstract createItem(item: T): Observable<T>;
  abstract readItem(id: number): Observable<T>;

  abstract readItems(
    pageSize: number,
    pageIndex?: number,
    sortColumn?: string,
    sortOrder?: string,
    filterColumn?: string,
    filterValue?: string
  ): Observable<any>;

  abstract updateItem(item: T): Observable<Response>;

  public getReducedParams(
    pageSize: number,
    pageIndex?: number,
    sortColumn?: string,
    sortOrder?: string,
    filterColumn?: string,
    filterValue?: string
  ): HttpParams {
    return new HttpParams({
      fromObject: {
        pageSize: pageSize.toString(),
        ...pageIndex && {
          pageIndex: pageIndex.toString(),
        },
        ...filterColumn && filterValue && {
          filterColumn,
          filterValue,
        },
        ...sortColumn && sortOrder && {
          sortColumn,
          sortOrder,
        },
      }
    });
  }
}
