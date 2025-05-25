using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;
using TaskStatus = ReactApp1.Server.Models.TaskStatus; // Explicit alias to resolve ambiguity

namespace ReactApp1.Server.Data
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

            // Check if the database already has data
            if (context.Users.Any())
            {
                return; // Database has been seeded
            }

            var authService = serviceProvider.GetRequiredService<IAuthService>();

            // Seed users
            var director = new User
            {
                Username = "director",
                Email = "director@example.com",
                PasswordHash = authService.HashPassword("Password123!"),
                Role = UserRole.Director,
                FirstName = "John",
                LastName = "Director"
            };

            var manager = new User
            {
                Username = "manager",
                Email = "manager@example.com",
                PasswordHash = authService.HashPassword("Password123!"),
                Role = UserRole.Manager,
                FirstName = "Jane",
                LastName = "Manager"
            };

            var developer1 = new User
            {
                Username = "developer1",
                Email = "developer1@example.com",
                PasswordHash = authService.HashPassword("Password123!"),
                Role = UserRole.Developer,
                FirstName = "Bob",
                LastName = "Developer"
            };

            var developer2 = new User
            {
                Username = "developer2",
                Email = "developer2@example.com",
                PasswordHash = authService.HashPassword("Password123!"),
                Role = UserRole.Developer,
                FirstName = "Alice",
                LastName = "Coder"
            };

            context.Users.AddRange(director, manager, developer1, developer2);
            context.SaveChanges();

            // Seed technologies
            var technologies = new List<Technology>
            {
                new Technology { Name = "ASP.NET Core", Category = "Backend" },
                new Technology { Name = "React", Category = "Frontend" },
                new Technology { Name = "SQL Server", Category = "Database" },
                new Technology { Name = "Entity Framework Core", Category = "ORM" },
                new Technology { Name = "TypeScript", Category = "Language" },
                new Technology { Name = "Tailwind CSS", Category = "CSS Framework" }
            };

            context.Technologies.AddRange(technologies);
            context.SaveChanges();

            // Seed projects
            var project1 = new Project
            {
                Name = "E-Commerce Platform",
                Description = "A full-featured e-commerce platform with product management, cart, and checkout.",
                StartDate = DateTime.UtcNow.AddDays(-30),
                DeadlineDate = DateTime.UtcNow.AddDays(60),
                //Status = ProjectStatus.InProgress,
                DirectorId = director.Id,
                ManagerId = manager.Id
            };

            var project2 = new Project
            {
                Name = "CRM System",
                Description = "Customer Relationship Management system for sales and support teams.",
                StartDate = DateTime.UtcNow.AddDays(-15),
                DeadlineDate = DateTime.UtcNow.AddDays(90),
                //Status = ProjectStatus.Planning,
                DirectorId = director.Id
            };

            context.Projects.AddRange(project1, project2);
            context.SaveChanges();

            // Assign developers to projects
            var projectDevelopers = new List<ProjectDeveloper>
            {
                new ProjectDeveloper { ProjectId = project1.Id, DeveloperId = developer1.Id },
                new ProjectDeveloper { ProjectId = project1.Id, DeveloperId = developer2.Id },
                new ProjectDeveloper { ProjectId = project2.Id, DeveloperId = developer1.Id }
            };

            context.ProjectDevelopers.AddRange(projectDevelopers);
            context.SaveChanges();

            // Assign technologies to projects
            var projectTechnologies = new List<ProjectTechnology>
            {
                new ProjectTechnology { ProjectId = project1.Id, TechnologyId = technologies[0].Id },
                new ProjectTechnology { ProjectId = project1.Id, TechnologyId = technologies[1].Id },
                new ProjectTechnology { ProjectId = project1.Id, TechnologyId = technologies[2].Id },
                new ProjectTechnology { ProjectId = project2.Id, TechnologyId = technologies[0].Id },
                new ProjectTechnology { ProjectId = project2.Id, TechnologyId = technologies[3].Id },
                new ProjectTechnology { ProjectId = project2.Id, TechnologyId = technologies[4].Id }
            };

            context.ProjectTechnologies.AddRange(projectTechnologies);
            context.SaveChanges();

            // Seed tasks
            var tasks = new List<TaskItem>
            {
                new TaskItem
                {
                    Title = "Design Database Schema",
                    Description = "Create the database schema for the e-commerce platform",
                    //Priority = TaskPriority.High,
                    //Status = TaskStatus.Completed,
                    DueDate = DateTime.UtcNow.AddDays(-5),
                    EndDate = DateTime.UtcNow.AddDays(-7),
                    AssignedToId = developer1.Id,
                    ProjectId = project1.Id,
                    EstimatedHours = 8,
                    ActualHours = 10
                },
                new TaskItem
                {
                    Title = "Implement User Authentication",
                    Description = "Implement JWT authentication for the API",
                    //Priority = TaskPriority.High,
                    //Status = TaskStatus.InProgress,
                    DueDate = DateTime.UtcNow.AddDays(5),
                    AssignedToId = developer2.Id,
                    ProjectId = project1.Id,
                    EstimatedHours = 12
                },
                new TaskItem
                {
                    Title = "Create Product Listing UI",
                    Description = "Implement the product listing page with filtering and sorting",
                    //Priority = TaskPriority.Medium,
                    //Status = TaskStatus.ToDo,
                    DueDate = DateTime.UtcNow.AddDays(10),
                    AssignedToId = developer1.Id,
                    ProjectId = project1.Id,
                    EstimatedHours = 16
                },
                new TaskItem
                {
                    Title = "Requirements Gathering",
                    Description = "Gather and document requirements for the CRM system",
                    //Priority = TaskPriority.High,
                    //Status = TaskStatus.InProgress,
                    DueDate = DateTime.UtcNow.AddDays(3),
                    AssignedToId = developer1.Id,
                    ProjectId = project2.Id,
                    EstimatedHours = 20
                }
            };

            context.Tasks.AddRange(tasks);
            context.SaveChanges();

            // Seed task comments
            var taskComments = new List<TaskComment>
            {
                new TaskComment
                {
                    Content = "I've completed the initial schema design. Please review.",
                    TaskId = tasks[0].Id,
                    UserId = developer1.Id
                },
                new TaskComment
                {
                    Content = "Looks good. Make sure to include indexes for frequently queried fields.",
                    TaskId = tasks[0].Id,
                    UserId = manager.Id
                },
                new TaskComment
                {
                    Content = "I'm having an issue with the JWT token validation. Will need some help.",
                    TaskId = tasks[1].Id,
                    UserId = developer2.Id
                }
            };

            context.TaskComments.AddRange(taskComments);
            context.SaveChanges();

            
        }
    }
}
