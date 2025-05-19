using ReactApp1.Server.Models;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<TaskProgress> TaskProgress { get; set; }
        public DbSet<Technology> Technologies { get; set; }
        public DbSet<ProjectDeveloper> ProjectDevelopers { get; set; }
        public DbSet<ProjectTechnology> ProjectTechnologies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure many-to-many relationship between Project and Developer
            modelBuilder.Entity<ProjectDeveloper>()
                .HasKey(pd => new { pd.ProjectId, pd.DeveloperId });

            modelBuilder.Entity<ProjectDeveloper>()
                .HasOne(pd => pd.Project)
                .WithMany(p => p.Developers)
                .HasForeignKey(pd => pd.ProjectId);

            modelBuilder.Entity<ProjectDeveloper>()
                .HasOne(pd => pd.Developer)
                .WithMany(d => d.Projects)
                .HasForeignKey(pd => pd.DeveloperId);

            // Configure many-to-many relationship between Project and Technology
            modelBuilder.Entity<ProjectTechnology>()
                .HasKey(pt => new { pt.ProjectId, pt.TechnologyId });

            modelBuilder.Entity<ProjectTechnology>()
                .HasOne(pt => pt.Project)
                .WithMany(p => p.Technologies)
                .HasForeignKey(pt => pt.ProjectId);

            modelBuilder.Entity<ProjectTechnology>()
                .HasOne(pt => pt.Technology)
                .WithMany(t => t.Projects)
                .HasForeignKey(pt => pt.TechnologyId);
        }
    }
}
