import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Country } from '../models';
import { BaseFormComponent } from '../base-form.component';
import { CountryService } from './country.service';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrl: './country-edit.component.scss'
})
export class CountryEditComponent extends BaseFormComponent implements OnInit {
  public title?: string;
  private createCountryTitle: string = 'Create a new Country';
  private updateCountryTitle: string = 'Edit country $';
  public country?: Country;
  // 0 when creating a country
  // ID when updating a country
  public id: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  public isCountryBeingCreated: boolean = !this.id;
  private createCountrySuccessMessage: string = 'Country with the ID $ has been created.';
  private updateCountrySuccessMessage: string = 'Country with the ID $ has been updated.';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countryService: CountryService,
    private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['',
        Validators.required,
        this.isFieldDuplicate('name')
      ],
      iso2: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{2}$/)
        ],
        this.isFieldDuplicate('iso2')
      ],
      iso3: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{3}$/)
        ],
        this.isFieldDuplicate('iso3')
      ]
    });

    this.readData();
  }

  readData() {
    if (this.isCountryBeingCreated) {
      this.title = this.createCountryTitle;

      return;
    }

    this.countryService.readItem(this.id).subscribe({
      next: country => {
        this.title = this.updateCountryTitle.replace('$', country.name);
        this.country = country;
        this.form.patchValue(country);
      },
      error: error => console.error(error)
    });
  }

  onSubmit() {
    this.country = this.getCountryFromFormControls();

    this.isCountryBeingCreated
      ? this.createCountry()
      : this.updateCountry();
  }

  private getCountryFromFormControls(): Country {
    return <Country>{
      id: this.id,
      name: this.form.controls['name'].value,
      iso2: this.form.controls['iso2'].value,
      iso3: this.form.controls['iso3'].value,
    };
  }

  private createCountry(): void {
    if (!this.country) {
      return;
    }

    this.countryService.createItem(this.country).subscribe({
      next: country => {
        console.log(this.createCountrySuccessMessage.replace('$', country.id.toString()));
        this.router.navigate(['/countries']);
      },
      error: error => console.error(error)
    });
  }

  private updateCountry(): void {
    if (!this.country) {
      return;
    }

    this.countryService.updateItem(this.country).subscribe({
      next: noContent => {
        console.log(this.updateCountrySuccessMessage.replace('$', this.country?.id.toString() ?? ''));
        this.router.navigate(['/countries']);
      },
      error: error => console.error(error)
    });
  }

  private isFieldDuplicate(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.countryService.isFieldDuplicate(fieldName, control.value).pipe(map(
        isDuplicate => isDuplicate
          ? { isFieldDuplicate: true }
          : null
      ));
    }
  }
}
