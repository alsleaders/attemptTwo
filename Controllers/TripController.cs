using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using attempttwo.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace attempttwo.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TripController : ControllerBase
  {
    private readonly DatabaseContext _context;

    public TripController(DatabaseContext context)
    {
      _context = context;
    }

    // GET: api/Trip
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
    {
      return await _context.Trips.ToListAsync();
    }

    // GET: api/Trip/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Trip>> GetTrip(int id)
    {
      var trip = await _context.Trips.Include(i => i.Destinations).ThenInclude(i => i.Location).FirstOrDefaultAsync(f => f.Id == id);

      if (trip == null)
      {
        return NotFound();
      }

      return trip;
    }


    [HttpPost]
    public async Task<ActionResult<Trip>> PostTrip(Trip trip)
    {
      _context.Trips.Add(trip);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetTrip", new { id = trip.Id }, trip);
    }

  }
}