export interface City {
  id: number;
  name: string;
  lat: number;
  lon: number;
  countryId: number;
  countryName: string;
}

export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  numberOfCities: number;
}

export interface GetCitiesResponseObject {
  cities: City[];
  totalCount: number;
}

export interface GetCountriesResponseObject {
  countries: Country[];
  totalCount: number;
}
