import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { City, Country } from '../models';
import { BaseFormComponent } from '../base-form.component';
import { CityService } from './city.service';
import { CountryService } from '../countries/country.service';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent extends BaseFormComponent implements OnInit {
  public title?: string;
  private createCityTitle: string = 'Create a new City';
  private updateCityTitle: string = 'Edit city $';
  public city?: City;
  // 0 when creating a city
  // ID when updating a city
  public id: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  public isCityBeingCreated: boolean = !this.id;
  private createCitySuccessMessage: string = 'City with the ID $ has been created.';
  private updateCitySuccessMessage: string = 'City with the ID $ has been updated.';
  public countries: Country[] = [];
  private countriesPageSize: number = 9999;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cityService: CityService,
    private countryService: CountryService) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        lat: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
        ]),
        lon: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
        ]),
        countryId: new FormControl('', Validators.required)
      },
      null,
      this.isDuplicate()
    );

    this.readData();
  }

  readData() {
    this.readCountries();

    if (this.isCityBeingCreated) {
      this.title = this.createCityTitle;

      return;
    }

    this.cityService.readItem(this.id).subscribe({
      next: city => {
        this.title = this.updateCityTitle.replace('$', city.name);
        this.city = city;
        this.form.patchValue(city);
      },
      error: error => console.error(error)
    });
  }

  private readCountries(): void {
    const params = new HttpParams({
      fromObject: {
        'pageSize': this.countriesPageSize,
      }
    });

    this.countryService.readItems(this.countriesPageSize).subscribe({
      next: responseObject => {
        this.countries = responseObject.countries;
      },
      error: error => console.error(error)
    });
  }

  private isDuplicate(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.cityService.isItemDuplicate(this.getCityFromFormControls()).pipe(map(
        isDuplicate => isDuplicate
          ? { isCityDuplicate: true }
          : null
      ));
    }
  }

  private getCityFromFormControls(): City {
    return <City>{
      id: this.id,
      name: this.form.controls['name'].value,
      lat: +this.form.controls['lat'].value,
      lon: +this.form.controls['lon'].value,
      countryId: +this.form.controls['countryId'].value,
    };
  }

  onSubmit() {
    this.city = this.getCityFromFormControls();

    this.isCityBeingCreated
      ? this.createCity()
      : this.updateCity();
  }

  private createCity(): void {
    if (!this.city) {
      return;
    }

    this.cityService.createItem(this.city).subscribe({
      next: city => {
        console.log(this.createCitySuccessMessage.replace('$', city.id.toString()));
        this.router.navigate(['/cities']);
      },
      error: error => console.error(error)
    });
  }

  private updateCity(): void {
    if (!this.city) {
      return;
    }

    this.cityService.updateItem(this.city).subscribe({
      next: noContent => {
        console.log(this.updateCitySuccessMessage.replace('$', this.city?.id.toString() ?? ''));
        this.router.navigate(['/cities']);
      },
      error: error => console.error(error)
    });
  }
}
