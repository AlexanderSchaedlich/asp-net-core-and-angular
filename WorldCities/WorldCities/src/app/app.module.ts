import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component'
import { CitiesComponent } from './cities/cities.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AngularMaterialModule } from './angular-material.module';
import { CountriesComponent } from './countries/countries.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CityEditComponent } from './cities/city-edit.component';
import { CountryEditComponent } from './countries/country-edit.component';
import { LoginComponent } from './auth/login.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ConnectionServiceModule, ConnectionServiceOptions, ConnectionServiceOptionsToken } from 'angular-connection-service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CitiesComponent,
    CountriesComponent,
    HomeComponent,
    NavMenuComponent,
    CityEditComponent,
    CountryEditComponent,
    LoginComponent,
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserModule,
    ConnectionServiceModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: ConnectionServiceOptionsToken,
      useValue: <ConnectionServiceOptions>{
        heartbeatUrl: environment.baseUrl + 'api/heartbeat',
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
