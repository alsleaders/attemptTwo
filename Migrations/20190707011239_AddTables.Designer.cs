﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using attempttwo;

namespace sdgreacttemplate.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20190707011239_AddTables")]
    partial class AddTables
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.0-rtm-35687")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("attempttwo.Model.Destination", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("LocationId");

                    b.Property<int?>("TripId");

                    b.HasKey("Id");

                    b.HasIndex("LocationId");

                    b.HasIndex("TripId");

                    b.ToTable("Destinations");
                });

            modelBuilder.Entity("attempttwo.Model.Location", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<float>("Lat");

                    b.Property<float>("Long");

                    b.Property<string>("Place");

                    b.Property<bool>("Visited");

                    b.HasKey("Id");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("attempttwo.Model.Trip", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("EndDate");

                    b.Property<DateTime>("StartDate");

                    b.HasKey("Id");

                    b.ToTable("Trips");
                });

            modelBuilder.Entity("attempttwo.Model.Destination", b =>
                {
                    b.HasOne("attempttwo.Model.Location", "Location")
                        .WithMany("Destinations")
                        .HasForeignKey("LocationId");

                    b.HasOne("attempttwo.Model.Trip", "Trip")
                        .WithMany("Destinations")
                        .HasForeignKey("TripId");
                });
#pragma warning restore 612, 618
        }
    }
}
