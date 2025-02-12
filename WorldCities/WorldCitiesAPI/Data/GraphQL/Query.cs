using Microsoft.EntityFrameworkCore;
using WorldCitiesAPI.Data.Models;

namespace WorldCitiesAPI.Data.GraphQL
{
    public class Query
    {
        /// <summary>
        /// Gets all Cities.
        /// </summary>
        [Serial]
        [UsePaging]
        [UseFiltering]
        [UseSorting]
        public IQueryable<City> GetCities(
            [Service] ApplicationDbContext context)
            => context.Cities;

        /// <summary>
        /// Gets all Countries.
        /// </summary>
        [Serial]
        [UsePaging]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Country> GetCountries(
            [Service] ApplicationDbContext context)
            => context.Countries;

        /// <summary>
        /// Gets all Cities (with ApiResult and DTO support).
        /// </summary>
        [Serial]
        public async Task<CitiesApiResult<CityDTO>> GetCitiesApiResult(
            [Service] ApplicationDbContext context,
            int pageIndex = 0,
            int pageSize = 10,
            string? filterColumn = null,
            string? filterQuery = null,
            string? sortColumn = null,
            string? sortOrder = null)
        {
            return await CitiesApiResult<CityDTO>.CreateAsync(
                    context.Cities.AsNoTracking()
                        .Select(c => new CityDTO()
                        {
                            Id = c.Id,
                            Name = c.Name,
                            Lat = c.Lat,
                            Lon = c.Lon,
                            CountryId = c.Country!.Id,
                            CountryName = c.Country!.Name
                        }),
                    pageIndex,
                    pageSize,
                    filterColumn,
                    filterQuery,
                    sortColumn,
                    sortOrder);
        }

        /// <summary>
        /// Gets all Countries (with ApiResult and DTO support).
        /// </summary>
        [Serial]
        public async Task<CountriesApiResult<CountryDTO>> GetCountriesApiResult(
            [Service] ApplicationDbContext context,
            int pageIndex = 0,
            int pageSize = 10,
            string? filterColumn = null,
            string? filterQuery = null,
            string? sortColumn = null,
            string? sortOrder = null)
        {
            return await CountriesApiResult<CountryDTO>.CreateAsync(
                    context.Countries.AsNoTracking()
                        .Select(c => new CountryDTO()
                        {
                            Id = c.Id,
                            Name = c.Name,
                            ISO2 = c.ISO2,
                            ISO3 = c.ISO3,
                            NumberOfCities = c.Cities!.Count
                        }),
                    pageIndex,
                    pageSize,
                    filterColumn,
                    filterQuery,
                    sortColumn,
                    sortOrder);
        }
    }
}