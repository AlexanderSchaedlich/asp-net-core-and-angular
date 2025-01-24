import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Country } from '../models';
import { RequestHandlerService } from '../services/request-handler.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  public dataSource: MatTableDataSource<Country> = new MatTableDataSource();
  public length: number = 0;

  public columns: string[] = [
    'id',
    'name',
    'iso2',
    'iso3'
  ];

  public filterColumn: string = this.columns[1];
  public filterValue?: string = undefined;
  public sortColumn?: string = undefined;
  public sortOrder?: string = undefined;
  public pageSizeOptions: number[] = [10, 20, 50];
  public pageSize: number = this.pageSizeOptions[0];
  public pageIndex: number = 0;

  constructor(private requestHandler: RequestHandlerService) {
  }

  ngOnInit() {
    this.readData();
  }

  public tryFilteringByColumn(column: string): void {
    this.filterColumn = column;

    if (!this.filterValue) {
      return;
    }

    this.readData();
  }

  public tryFilteringByValue(value: string): void {
    this.filterValue = value.trim() !== ''
      ? value.trim()
      : undefined;

    this.readData();
  }

  public sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.sortColumn = sort.active;
    this.sortOrder = sort.direction;

    this.readData();
  }

  public handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.readData();
  }

  private readData(): void {
    this.requestHandler.readCountries(this.getParams()).subscribe({
      next: responseObject => {
        this.dataSource.data = responseObject.countries;
        this.length = responseObject.totalCount;
      },
      error: error => console.error(error)
    });
  }

  private getParams(): HttpParams {
    return new HttpParams({
      fromObject: {
        pageIndex: this.pageIndex.toString(),
        pageSize: this.pageSize.toString(),
        ...this.filterValue && {
          filterColumn: this.filterColumn,
          filterValue: this.filterValue,
        },
        ...this.sortColumn && {
          sortColumn: this.sortColumn,
          sortOrder: this.sortOrder,
        },
      }
    });
  }
}
