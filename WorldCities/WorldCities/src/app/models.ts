export interface City {
  id: number;
  name: string;
  lat: number;
  lon: number;
  countryId: number;
}

export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
}

export interface GetCitiesResponseObject {
  cities: City[];
  totalCount: number;
}

export interface GetCountriesResponseObject {
  countries: Country[];
  totalCount: number;
}
