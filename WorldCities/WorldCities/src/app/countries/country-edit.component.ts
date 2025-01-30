import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Country } from '../models';
import { RequestHandlerService } from '../services/request-handler.service';
import { BaseFormComponent } from '../base-form.component';

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
    private requestHandler: RequestHandlerService,
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

    this.requestHandler.readCountry(this.id).subscribe({
      next: country => {
        this.title = this.updateCountryTitle.replace('$', country.name);
        this.country = country;
        this.form.patchValue(country);
      },
      error: error => console.error(error)
    });
  }

  onSubmit() {
    this.country = this.getCountryFromFormControls(!this.isCountryBeingCreated);

    this.isCountryBeingCreated
      ? this.createCountry()
      : this.updateCountry();
  }

  private getCountryFromFormControls(setId: boolean): Country {
    return <Country>{
      ...setId && {
        id: this.id
      },
      name: this.form.controls['name'].value,
      iso2: this.form.controls['iso2'].value,
      iso3: this.form.controls['iso3'].value,
    };
  }

  private createCountry(): void {
    if (!this.country) {
      return;
    }

    this.requestHandler.createCountry(this.country).subscribe({
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

    this.requestHandler.updateCountry(this.id, this.country).subscribe({
      next: noContent => {
        console.log(this.updateCountrySuccessMessage.replace('$', this.country?.id.toString() ?? ''));
        this.router.navigate(['/countries']);
      },
      error: error => console.error(error)
    });
  }

  private isFieldDuplicate(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const params = new HttpParams()
        .set('fieldName', fieldName)
        .set('fieldValue', control.value);

      return this.requestHandler.isCountryFieldDuplicate(params).pipe(map(
        isDuplicate => isDuplicate
          ? { isFieldDuplicate: true }
          : null
      ));
    }
  }
}
