using System.Collections.Generic;
using System.Threading.Tasks;
using attempttwo.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace attempttwo.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class DestinationController : ControllerBase
  {
    private readonly DatabaseContext _context;

    public DestinationController(DatabaseContext context)
    {
      _context = context;
    }

    // GET: api/Destination
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Destination>>> GetDestination()
    {
      return await _context.Destinations.Include(i => i.Location).Include(i => i.Trip).ToListAsync();
    }


    // GET: api/Destination/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Destination>> GetDestination(int id)
    {
      // var destination = await _context.Destinations.FindAsync(id);
      // Where(i => i.LocationId == LocationId.GetValueOrDefault()).FirstOrDefault(w => w.id == id)

      var destination = await _context.Destinations.Include(i => i.Location).FirstOrDefaultAsync(f => f.Id == id);

      if (destination == null)
      {
        return NotFound();
      }

      return destination;
    }

    //Post api/destination
    [HttpPost]
    public ActionResult<Destination> PostDestination(Destination destination)
    {
      _context.Destinations.Add(destination);
      _context.SaveChanges();
      return destination;
    }

  }
}