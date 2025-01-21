import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component'
import { CitiesComponent } from './cities/cities.component';
import { provideHttpClient } from '@angular/common/http';
import { AngularMaterialModule } from './angular-material.module';
import { CountriesComponent } from './countries/countries.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavMenuComponent,
    CitiesComponent,
    CountriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
