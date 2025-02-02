import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { City } from '../models';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CityService } from './city.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  private filterValueChanged: Subject<string> = new Subject();

  public dataSource: MatTableDataSource<City> = new MatTableDataSource();
  public length: number = 0;

  public columns: string[] = [
    'id',
    'name',
    'lat',
    'lon',
    'countryName'
  ];

  public filterColumn: string = this.columns[1];
  public filterValue?: string = undefined;
  public sortColumn?: string = undefined;
  public sortOrder?: string = undefined;
  public pageSizeOptions: number[] = [10, 20, 50];
  public pageSize: number = this.pageSizeOptions[0];
  public pageIndex: number = 0;

  constructor(private cityService: CityService) {
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

  public onFilterValueChanged(value: string): void {
    if (!this.filterValueChanged.observed) {
      this.filterValueChanged.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe({
        next: currentValue => this.filterByValue(currentValue),
        error: error => console.error(error)
      });
    }

    this.filterValueChanged.next(value);
  }

  public filterByValue(value: string): void {
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
    this.cityService.readItems(this.pageSize, this.pageIndex, this.sortColumn, this.sortOrder, this.filterColumn, this.filterValue).subscribe({
        next: responseObject => {
          this.dataSource.data = responseObject.cities;
          this.length = responseObject.totalCount;
        },
        error: error => console.error(error)
    });
  }
}
