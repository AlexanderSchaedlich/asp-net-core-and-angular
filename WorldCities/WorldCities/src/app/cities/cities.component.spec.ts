import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../angular-material.module';
import { of } from 'rxjs';
import { CitiesComponent } from './cities.component';
import { CityService } from './city.service';
import { City, GetCitiesResponseObject } from '../models';
import { RouterModule, Routes } from '@angular/router';

describe('CitiesComponent', () => {
  let component: CitiesComponent;
  let fixture: ComponentFixture<CitiesComponent>;

  beforeEach(async () => {
    const routes: Routes = [
      { path: 'cities', component: CitiesComponent },
    ];

    const dumpCities: City[] = [
      <City>{
        name: 'TestCity1',
        id: 1, lat: 1, lon: 1,
        countryId: 1, countryName: 'TestCountry1'
      },
      <City>{
        name: 'TestCity2',
        id: 2, lat: 1, lon: 1,
        countryId: 1, countryName: 'TestCountry1'
      },
      <City>{
        name: 'TestCity3',
        id: 3, lat: 1, lon: 1,
        countryId: 1, countryName: 'TestCountry1'
      }
    ];

    // Create a mock cityService object with a mock 'getData' method
    let cityService = jasmine.createSpyObj<CityService>('CityService', ['readItems']);

    // Configure the 'getData' spy method
    cityService.readItems.and.returnValue(
      // return an Observable with some test data
      of<GetCitiesResponseObject>(<GetCitiesResponseObject>{
        cities: dumpCities,
        totalCount: 3
      }));

    await TestBed.configureTestingModule({
      declarations: [CitiesComponent],
      imports: [
        BrowserAnimationsModule,
        AngularMaterialModule,
        RouterModule.forRoot(routes)
      ],
      providers: [
        {
          provide: CityService,
          useValue: cityService
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitiesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a "Cities" title', () => {
    let title = fixture.nativeElement
      .querySelector('h1');
    expect(title.textContent).toEqual('Cities');
  });

  it('should contain a table with a list of one or more cities', () => {
    let table = fixture.nativeElement
      .querySelector('table[mat-table]');
    let tableRows = table
      .querySelectorAll('tr[mat-row]');
    expect(tableRows.length).toBeGreaterThan(0);
  });

});
