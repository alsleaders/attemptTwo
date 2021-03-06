using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using attempttwo;
using attempttwo.Model;

namespace attempttwo.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class LocationController : ControllerBase
  {
    private readonly DatabaseContext _context;

    public LocationController(DatabaseContext context)
    {
      _context = context;
    }

    // GET: api/Location
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
    {
      return await _context.Locations.ToListAsync();
    }

    // GET: api/Location not all visited
    [HttpGet("visited")]
    public ActionResult<List<Location>> Get()
    {
      // return await _context.Locations.Where(w => w.Visited != true).ToListAsync();
      var tm = _context.Locations.Include(i => i.Destinations).ThenInclude(i => i.Trip).Where(w => w.Visited != true);
      return tm.ToList();
    }

    // GET: api/Location/5
    [HttpGet("{placeName}")]
    public async Task<ActionResult<List<Location>>> GetLocation(string placeName)
    {
      var location = _context.Locations
        .Include(i => i.Destinations)
        .ThenInclude(i => i.Trip)
        .Where(w => w.Destinations.Count > 0)
        .Where(w => w.Place.ToLower() == placeName.ToLower());

      if (location == null)
      {
        return NotFound();
      }

      return await location.ToListAsync();
    }

    // Patch to change visited
    [HttpPatch("{id}")]
    public ActionResult<Location> Patch(int id)
    {
      var seenIt = _context.Locations.FirstOrDefault(f => f.Id == id);
      seenIt.Visited = true;
      _context.SaveChanges();
      return Ok(seenIt);
    }

    // PUT: api/Location/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutLocation(int id, [FromBody] Location location)
    {
      if (id != location.Id)
      {
        return BadRequest();
      }

      _context.Entry(location).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!LocationExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return Ok(location);
    }

    // POST: api/Location
    [HttpPost]
    public async Task<ActionResult<Location>> PostLocation(Location location)
    {
      _context.Locations.Add(location);
      await _context.SaveChangesAsync();

      return Ok(location);
    }

    // DELETE: api/Location/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<Location>> DeleteLocation(int id)
    {
      var location = await _context.Locations.FindAsync(id);
      if (location == null)
      {
        return NotFound();
      }

      _context.Locations.Remove(location);
      await _context.SaveChangesAsync();

      return location;
    }

    private bool LocationExists(int id)
    {
      return _context.Locations.Any(e => e.Id == id);
    }
  }
}