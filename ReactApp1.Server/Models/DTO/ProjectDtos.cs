using System;
using System.Collections.Generic;

namespace ReactApp1.Server.Models.Dtos
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? DeadlineDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public ProjectStatus Status { get; set; }
        public int? ManagerId { get; set; }
        public int DirectorId { get; set; }
        public List<UserDto> Developers { get; set; }
        public List<TechnologyDto> Technologies { get; set; }
    }

    public class CreateProjectDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? DeadlineDate { get; set; }
    }

    public class UpdateProjectDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? DeadlineDate { get; set; }
        public ProjectStatus Status { get; set; }
        public DateTime? CompletionDate { get; set; }
    }

    public class AssignManagerDto
    {
        public int ManagerId { get; set; }
    }

    public class AddDeveloperDto
    {
        public int DeveloperId { get; set; }
    }

    public class AddTechnologyDto
    {
        public int TechnologyId { get; set; }
    }
}