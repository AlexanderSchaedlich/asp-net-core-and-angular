using Microsoft.EntityFrameworkCore;
using System.Reflection;
using WorldCitiesAPI.Data.Models;

namespace WorldCitiesAPI.Data
{
    public class CitiesApiResult<T>
    {
        /// <summary>
        /// IQueryable data result to return.
        /// </summary>
        public List<T> Cities { get; private set; }

        /// <summary>
        /// Total items count
        /// </summary>
        public int TotalCount { get; private set; }

        /// <summary>
        /// Private constructor called by the CreateAsync method.
        /// </summary>
        private CitiesApiResult(
            List<T> cities,
            int count
        )
        {
            Cities = cities;
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
        public static async Task<CitiesApiResult<City>> CreateAsync(
            IQueryable<City> source,
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

            var cities = await source.ToListAsync();

            return new CitiesApiResult<City>(
                cities,
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
            var prop = typeof(City).GetProperty(
                propertyName,
                BindingFlags.IgnoreCase |
                BindingFlags.Public |
                BindingFlags.Static |
                BindingFlags.Instance);
            if (prop == null && throwExceptionIfNotFound)
                throw new NotSupportedException($"ERROR: Property '{propertyName}' does not exist.");
            return prop != null;
        }

        private static IQueryable<City> Filter(
            IQueryable<City> source,
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
                "lat" => source.Where(city => city.Lat.ToString().Contains(filterValue.Trim())),
                "lon" => source.Where(city => city.Lon.ToString().Contains(filterValue.Trim())),
                _ => source,
            };
        }

        private static IQueryable<City> Sort(
            IQueryable<City> source,
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
                "lat" => source.OrderBy(city => city.Lat),
                "lat_desc" => source.OrderByDescending(city => city.Lat),
                "lon" => source.OrderBy(city => city.Lon),
                "lon_desc" => source.OrderByDescending(city => city.Lon),
                _ => source,
            };
        }
    }
}