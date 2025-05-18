using ReactApp1.Server.Models;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;

namespace ReactApp1.Server
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Developer> Developers { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Technology> Technologies { get; set; }
        public DbSet<ProjectTask> Tasks { get; set; }
        public DbSet<TaskProgress> TaskProgresses { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuration de la relation entre Project et User (ProjectManager)
            modelBuilder.Entity<Project>()
                .HasOne(p => p.ProjectManager)
                .WithMany()
                .HasForeignKey(p => p.ProjectManagerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration de la relation entre Project et Developer (Team)
            modelBuilder.Entity<Project>()
                .HasMany(p => p.Team)
                .WithMany(d => d.Projects)
                .UsingEntity<Dictionary<string, object>>(
                    "ProjectDevelopers", // Table name
                    j => j.HasOne<Developer>().WithMany().HasForeignKey("DeveloperId"),
                    j => j.HasOne<Project>().WithMany().HasForeignKey("ProjectId")
                );

            // Contrainte d'unicité sur le nom du projet
            modelBuilder.Entity<Project>()
                .HasIndex(p => p.Name)
                .IsUnique();
        }
    }
}
