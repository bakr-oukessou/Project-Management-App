using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using TaskStatus = ReactApp1.Server.Models.TaskStatus;

namespace ReactApp1.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<TaskProgress> TaskProgresses { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<TaskStatus> TaskStatuses { get; set; }
        public DbSet<TaskPriority> TaskPriorities { get; set; }
        public DbSet<Technology> Technologies { get; set; }
        public DbSet<ProjectDeveloper> ProjectDevelopers { get; set; }
        public DbSet<ProjectStatus> ProjectStatuses { get; set; }
        public DbSet<ProjectTechnology> ProjectTechnologies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(e => e.Role)
                .HasConversion<string>()
                .HasColumnType("nvarchar(20)");

            // Configure many-to-many relationship between Project and Developer
            modelBuilder.Entity<ProjectDeveloper>()
                .HasKey(pd => new { pd.ProjectId, pd.DeveloperId });

            modelBuilder.Entity<ProjectDeveloper>()
                .HasOne(pd => pd.Project)
                .WithMany(p => p.Developers)
                .HasForeignKey(pd => pd.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProjectDeveloper>()
                .HasOne(pd => pd.Developer)
                .WithMany(d => d.Projects)
                .HasForeignKey(pd => pd.DeveloperId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure many-to-many relationship between Project and Technology
            modelBuilder.Entity<ProjectTechnology>()
                .HasKey(pt => new { pt.ProjectId, pt.TechnologyId });

            modelBuilder.Entity<ProjectTechnology>()
                .HasOne(pt => pt.Project)
                .WithMany(p => p.Technologies)
                .HasForeignKey(pt => pt.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProjectTechnology>()
                .HasOne(pt => pt.Technology)
                .WithMany(t => t.Projects)
                .HasForeignKey(pt => pt.TechnologyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Project entity
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description)
                    .IsRequired();

                entity.Property(e => e.StartDate)
                    .IsRequired();

                entity.Property(e => e.ClientName)
                    .HasMaxLength(100);

                // Configure relationship with ProjectStatus
                entity.HasOne(p => p.Status)
                    .WithMany(ps => ps.Projects)
                    .HasForeignKey(p => p.StatusId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Configure relationship with Manager
                entity.HasOne(p => p.Manager)
                    .WithMany(u => u.ManagedProjects)
                    .HasForeignKey(p => p.ManagerId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired(false);

                // Configure relationship with Director
                entity.HasOne(p => p.Director)
                    .WithMany()
                    .HasForeignKey(p => p.DirectorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure ProjectStatus entity
            modelBuilder.Entity<ProjectStatus>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(20);
            });

            // Configure TaskItem entity
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description)
                    .IsRequired();

                // Configure relationships
                entity.HasOne(t => t.AssignedTo)
                    .WithMany()
                    .HasForeignKey(t => t.AssignedToId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(t => t.Project)
                    .WithMany(p => p.Tasks)
                    .HasForeignKey(t => t.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(t => t.Priority)
                    .WithMany(p => p.Tasks)
                    .HasForeignKey(t => t.PriorityId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.Status)
                    .WithMany(s => s.Tasks)
                    .HasForeignKey(t => t.StatusId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure TaskStatus entity
            modelBuilder.Entity<TaskStatus>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(20);
            });

            // Configure TaskPriority entity
            modelBuilder.Entity<TaskPriority>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(20);
            });

            // Configure TaskComment entity
            modelBuilder.Entity<TaskComment>(entity =>
            {
                entity.ToTable("TaskComments"); // Add this line to specify the correct table name
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Content)
                    .IsRequired();

                entity.HasOne(tc => tc.Task)
                    .WithMany(t => t.Comments)
                    .HasForeignKey(tc => tc.TaskId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(tc => tc.User)
                    .WithMany()
                    .HasForeignKey(tc => tc.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure TaskProgress entity
            modelBuilder.Entity<TaskProgress>(entity =>
            {
                entity.ToTable("TaskProgresses"); // Add this line to specify the correct table name
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Description)
                    .IsRequired();

                entity.Property(e => e.PercentageComplete)
                    .IsRequired();

                entity.HasOne(tp => tp.Task)
                    .WithMany(t => t.ProgressUpdates)
                    .HasForeignKey(tp => tp.TaskId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(tp => tp.User)
                    .WithMany()
                    .HasForeignKey(tp => tp.UserId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired();
            });
        }
    }
}