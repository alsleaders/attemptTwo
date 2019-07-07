using System.Collections.Generic;

namespace attempttwo.Model
{
  public class Destination
  {
    public int Id { get; set; }



    public int? TripId { get; set; }
    public Trip Trip { get; set; }
    public int? LocationId { get; set; }

    public Location Location { get; set; }
  }
}