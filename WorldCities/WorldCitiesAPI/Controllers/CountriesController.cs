using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorldCitiesAPI.Data;
using WorldCitiesAPI.Data.Models;

namespace WorldCitiesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CountriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Countries
        [HttpGet]
        public async Task<ActionResult<CountriesApiResult<CountryDTO>>> GetCities(
            int pageIndex = 0,
            int pageSize = 10,
            string? filterColumn = null,
            string? filterValue = null,
            string? sortColumn = null,
            string? sortOrder = null

        )
        {
            return await CountriesApiResult<CountryDTO>.CreateAsync(
                _context.Countries.AsNoTracking()
                    .Select(country => new CountryDTO(){
                        Id = country.Id,
                        Name = country.Name,
                        ISO2 = country.ISO2,
                        ISO3 = country.ISO3,
                        NumberOfCities = country.Cities!.Count(),
                    }),
                pageIndex,
                pageSize,
                filterColumn,
                filterValue,
                sortColumn,
                sortOrder);
        }

        // GET: api/Countries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Country>> GetCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);

            if (country == null)
            {
                return NotFound();
            }

            return country;
        }

        // PUT: api/Countries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<IActionResult> PutCountry(int id, Country country)
        {
            if (id != country.Id)
            {
                return BadRequest();
            }

            _context.Entry(country).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CountryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Countries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<ActionResult<Country>> PostCountry(Country country)
        {
            _context.Countries.Add(country);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCountry", new { id = country.Id }, country);
        }

        // DELETE: api/Countries/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound();
            }

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CountryExists(int id)
        {
            return _context.Countries.Any(e => e.Id == id);
        }

        // POST: api/Countries/FieldIsDuplicate
        [HttpPost]
        [Route("FieldIsDuplicate")]
        public bool IsFieldDuplicate(
            string fieldName,
            string fieldValue)
        {
            return fieldName switch
            {
                "name" => _context.Countries.Any(country => country.Name == fieldValue),
                "iso2" => _context.Countries.Any(country => country.ISO2 == fieldValue),
                "iso3" => _context.Countries.Any(country => country.ISO3 == fieldValue),
                _ => false,
            };
        }
    }
}
