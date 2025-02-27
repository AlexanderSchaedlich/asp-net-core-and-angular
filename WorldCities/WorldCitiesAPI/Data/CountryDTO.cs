﻿using System.Text.Json.Serialization;

namespace WorldCitiesAPI.Data
{
    public class CountryDTO
    {
        public CountryDTO() { }

        #region Properties
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        [JsonPropertyName("iso2")]
        [GraphQLName("iso2")]
        public string ISO2 { get; set; } = null!;

        [JsonPropertyName("iso3")]
        [GraphQLName("iso3")]
        public string ISO3 { get; set; } = null!;

        public int? NumberOfCities { get; set; } = null!;
        #endregion
    }
}