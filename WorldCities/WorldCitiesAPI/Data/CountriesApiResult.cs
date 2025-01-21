using Microsoft.EntityFrameworkCore;
using System.Reflection;
using WorldCitiesAPI.Data.Models;

namespace WorldCitiesAPI.Data
{
    public class CountriesApiResult<T>
    {
        /// <summary>
        /// IQueryable data result to return.
        /// </summary>
        public List<T> Countries { get; private set; }

        /// <summary>
        /// Total items count
        /// </summary>
        public int TotalCount { get; private set; }

        /// <summary>
        /// Private constructor called by the CreateAsync method.
        /// </summary>
        private CountriesApiResult(
            List<T> countries,
            int count
        )
        {
            Countries = countries;
            TotalCount = count;
        }

        /// <summary>
        /// Pages, sorts and/or filters a IQueryable source.
        /// </summary>
        /// <param name="source">An IQueryable source of generic 
        /// type</param>
        /// <param name="pageIndex">Zero-based current page index 
        /// (0 = first page)</param>
        /// <param name="pageSize">The actual size of 
        /// each page</param>
        /// <param name="filterColumn">The filtering colum name</param>
        /// <param name="filterValue">The filtering value</param>
        /// <param name="sortColumn">The sorting colum name</param>
        /// <param name="sortOrder">The sorting order ("ASC" or 
        /// "DESC")</param>
        /// <returns>
        /// A object containing the IQueryable paged/sorted/filtered
        /// result 
        /// and all the relevant paging/sorting/filtering navigation
        /// info.
        /// </returns>
        public static async Task<CountriesApiResult<Country>> CreateAsync(
            IQueryable<Country> source,
            int pageIndex,
            int pageSize,
            string? filterColumn = null,
            string? filterValue = null,
            string? sortColumn = null,
            string? sortOrder = null
        )
        {
            var count = await source.CountAsync();

            source = Filter(source, filterColumn, filterValue);
            source = Sort(source, sortColumn, sortOrder);

            source = source
                .Skip(pageIndex * pageSize)
                .Take(pageSize);

            var countries = await source.ToListAsync();

            return new CountriesApiResult<Country>(
                countries,
                count
            );
        }

        /// <summary>
        /// Checks if the given property name exists
        /// to protect against SQL injection attacks
        /// </summary>
        public static bool IsValidProperty(
            string propertyName,
            bool throwExceptionIfNotFound = true)
        {
            var prop = typeof(Country).GetProperty(
                propertyName,
                BindingFlags.IgnoreCase |
                BindingFlags.Public |
                BindingFlags.Static |
                BindingFlags.Instance);
            if (prop == null && throwExceptionIfNotFound)
                throw new NotSupportedException($"ERROR: Property '{propertyName}' does not exist.");
            return prop != null;
        }

        private static IQueryable<Country> Filter(
            IQueryable<Country> source,
            string? filterColumn = null,
            string? filterValue = null
        )
        {
            if (string.IsNullOrEmpty(filterColumn) || !IsValidProperty(filterColumn))
            {
                return source;
            }

            if (string.IsNullOrEmpty(filterValue) || filterValue.Trim() == "")
            {
                return source;
            }

            return filterColumn.ToLower() switch
            {
                "id" => source.Where(city => city.Id.ToString().Contains(filterValue.Trim())),
                "name" => source.Where(city => city.Name.Contains(filterValue.Trim())),
                "iso2" => source.Where(city => city.ISO2.Contains(filterValue.Trim())),
                "iso3" => source.Where(city => city.ISO3.Contains(filterValue.Trim())),
                _ => source,
            };
        }

        private static IQueryable<Country> Sort(
            IQueryable<Country> source,
            string? sortColumn = null,
            string? sortOrder = null
        )
        {
            if (string.IsNullOrEmpty(sortColumn) || !IsValidProperty(sortColumn))
            {
                return source;
            }

            sortOrder = !string.IsNullOrEmpty(sortOrder) && sortOrder.ToLower().Equals("desc")
                ? "_desc"
                : "";

            return $"{sortColumn}{sortOrder}" switch
            {
                "id" => source.OrderBy(city => city.Id),
                "id_desc" => source.OrderByDescending(city => city.Id),
                "name" => source.OrderBy(city => city.Name),
                "name_desc" => source.OrderByDescending(city => city.Name),
                "iso2" => source.OrderBy(city => city.ISO2),
                "iso2_desc" => source.OrderByDescending(city => city.ISO2),
                "iso3" => source.OrderBy(city => city.ISO3),
                "iso3_desc" => source.OrderByDescending(city => city.ISO3),
                _ => source,
            };
        }
    }
}