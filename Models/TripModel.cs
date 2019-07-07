using System;
using System.Collections.Generic;

namespace attempttwo.Model
{
  public class Trip
  {
    public int Id { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }


    public List<attempttwo.Model.Destination> Destinations { get; set; } = new List<Destination>();



  }
}