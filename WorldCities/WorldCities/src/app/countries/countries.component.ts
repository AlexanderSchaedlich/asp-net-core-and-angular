import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Country } from '../models';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CountryService } from './country.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  private filterValueChanged: Subject<string> = new Subject();

  public dataSource: MatTableDataSource<Country> = new MatTableDataSource();
  public length: number = 0;

  public columns: string[] = [
    'id',
    'name',
    'iso2',
    'iso3',
    'numberOfCities'
  ];

  public filterColumn: string = this.columns[1];
  public filterValue?: string = undefined;
  public sortColumn?: string = undefined;
  public sortOrder?: string = undefined;
  public pageSizeOptions: number[] = [10, 20, 50];
  public pageSize: number = this.pageSizeOptions[0];
  public pageIndex: number = 0;

  constructor(private countryService: CountryService) {
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
    this.countryService.readItems(this.pageSize, this.pageIndex, this.sortColumn, this.sortOrder, this.filterColumn, this.filterValue).subscribe({
      next: responseObject => {
        this.dataSource.data = responseObject.countries;
        this.length = responseObject.totalCount;
      },
      error: error => console.error(error)
    });
  }
}
