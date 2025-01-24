import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { City, Country } from '../models';
import { RequestHandlerService } from '../services/request-handler.service';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent implements OnInit {
  public title?: string;
  private createCityTitle: string = 'Create a new City';
  private updateCityTitle: string = 'Edit city $';
  public form!: FormGroup;
  public city?: City;
  // 0 when creating a city
  // ID when updating a city
  public id: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  public isCityBeingCreated: boolean = !this.id;
  private createCitySuccessMessage: string = 'City with the ID $ has been created.';
  private updateCitySuccessMessage: string = 'City with the ID $ has been updated.';
  public countries: Country[] = [];
  private countriesPageSize: string = '9999';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private requestHandler: RequestHandlerService) {
  }

  ngOnInit() {
    this.form = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        lat: new FormControl('', Validators.required),
        lon: new FormControl('', Validators.required),
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

    this.requestHandler.readCity(this.id).subscribe({
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

    this.requestHandler.readCountries(params).subscribe({
      next: responseObject => {
        this.countries = responseObject.countries;
      },
      error: error => console.error(error)
    });
  }

  private isDuplicate(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.requestHandler.isCityDuplicate(this.getCityFromFormControls(true)).pipe(map(
        isDuplicate => isDuplicate
          ? { isCityDuplicate: true }
          : null
      ));
    }
  }

  private getCityFromFormControls(setId: boolean): City {
    return <City>{
      ...setId && {
        id: this.id
      },
      name: this.form.controls['name'].value,
      lat: +this.form.controls['lat'].value,
      lon: +this.form.controls['lon'].value,
      countryId: +this.form.controls['countryId'].value,
    };
  }

  onSubmit() {
    this.city = this.getCityFromFormControls(!this.isCityBeingCreated);

    this.isCityBeingCreated
      ? this.createCity()
      : this.updateCity();
  }

  private createCity(): void {
    if (!this.city) {
      return;
    }

    this.requestHandler.createCity(this.city).subscribe({
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

    this.requestHandler.updateCity(this.id, this.city).subscribe({
      next: noContent => {
        console.log(this.updateCitySuccessMessage.replace('$', this.city?.id.toString() ?? ''));
        this.router.navigate(['/cities']);
      },
      error: error => console.error(error)
    });
  }
}
