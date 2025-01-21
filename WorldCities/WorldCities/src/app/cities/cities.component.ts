import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from './../../environments/environment';

import { City } from './city';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  public dataSource: MatTableDataSource<City> = new MatTableDataSource();
  public length: number = 0;

  public columns: string[] = [
    'id',
    'name',
    'lat',
    'lon'
  ];

  public filterColumn: string = this.columns[1];
  public filterValue?: string = undefined;
  public sortColumn?: string = undefined;
  public sortOrder: string = '';
  public pageSizeOptions: number[] = [10, 20, 50];
  public pageSize: number = this.pageSizeOptions[0];
  public pageIndex: number = 0;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getData();
  }

  public tryFilteringByColumn(column: string): void {
    console.log(column);
    if (!this.columns.includes(column)) {
      return;
    }

    this.filterColumn = column;

    if (!this.filterValue) {
      return;
    }

    this.getData();
  }

  public tryFilteringByValue(value: string): void {
    if (value === this.filterValue) {
      return;
    }

    this.filterValue = value.trim() !== ''
      ? value.trim()
      : undefined;

    this.getData();
  }

  public sortData(sort: Sort): void {
    if (!sort.active
      || sort.direction === ''
      || (sort.active === this.sortColumn && sort.direction === this.sortOrder)) {
      return;
    }

    this.sortColumn = sort.active;
    this.sortOrder = sort.direction;

    this.getData();
  }

  public handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.getData();
  }

  private getData(): void {
    let params: HttpParams = new HttpParams()
      .set('pageIndex', this.pageIndex.toString())
      .set('pageSize', this.pageSize.toString());

    if (this.filterValue) {
      params = params.set('filterColumn', this.filterColumn)
        .set('filterValue', this.filterValue);
    }

    if (this.sortColumn && this.sortOrder !== '') {
      params = params.set('sortColumn', this.sortColumn)
        .set('sortOrder', this.sortOrder);
    }

    this.http.get<responseObject>(`${environment.baseUrl}api/Cities`, {params})
      .subscribe({
        next: responseObject => {
          this.dataSource.data = responseObject.cities;
          this.length = responseObject.totalCount;
        },
        error: error => console.error(error)
      })
    ;
  }
}

interface responseObject {
  cities: City[];
  totalCount: number;
}
