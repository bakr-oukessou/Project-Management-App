-- Create database
CREATE DATABASE ProjectManagement;
GO

USE ProjectManagement;
GO

-- Users table
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Director', 'Manager', 'Developer')),
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    LastLogin DATETIME NULL,
    ProfilePicture NVARCHAR(255) NULL,
    PhoneNumber NVARCHAR(20) NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

-- Projects table
CREATE TABLE Projects (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Planning', 'InProgress', 'OnHold', 'Completed', 'Cancelled')),
    DirectorId INT NOT NULL,
    ManagerId INT NULL,
    Budget DECIMAL(18, 2) NULL,
    Methodology NVARCHAR(50) NULL,
    Priority INT NOT NULL DEFAULT 1,
    ClientName NVARCHAR(100) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (DirectorId) REFERENCES Users(Id),
    FOREIGN KEY (ManagerId) REFERENCES Users(Id)
);

-- Services table (components of a project)
CREATE TABLE Services (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    ProjectId INT NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Planning', 'InProgress', 'OnHold', 'Completed', 'Cancelled')),
    Priority INT NOT NULL DEFAULT 1,
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE Tasks (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    ServiceId INT NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('ToDo', 'InProgress', 'InReview', 'Done')),
    Priority INT NOT NULL DEFAULT 1,
    EstimatedHours INT NULL,
    ActualHours INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (ServiceId) REFERENCES Services(Id) ON DELETE CASCADE
);

-- Technologies table
CREATE TABLE Technologies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Category NVARCHAR(50) NULL,
    Description NVARCHAR(MAX) NULL,
    Version NVARCHAR(20) NULL,
    DocumentationUrl NVARCHAR(255) NULL
);

-- ProjectDevelopers table (many-to-many relationship between Projects and Developers)
CREATE TABLE ProjectDevelopers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProjectId INT NOT NULL,
    DeveloperId INT NOT NULL,
    AssignedDate DATETIME NOT NULL DEFAULT GETDATE(),
    Role NVARCHAR(50) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (DeveloperId) REFERENCES Users(Id),
    CONSTRAINT UQ_ProjectDeveloper UNIQUE (ProjectId, DeveloperId)
);

-- ProjectTechnologies table (many-to-many relationship between Projects and Technologies)
CREATE TABLE ProjectTechnologies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProjectId INT NOT NULL,
    TechnologyId INT NOT NULL,
    Usage NVARCHAR(100) NULL,
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (TechnologyId) REFERENCES Technologies(Id),
    CONSTRAINT UQ_ProjectTechnology UNIQUE (ProjectId, TechnologyId)
);

-- TaskAssignments table (many-to-many relationship between Tasks and Developers)
CREATE TABLE TaskAssignments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TaskId INT NOT NULL,
    DeveloperId INT NOT NULL,
    AssignedDate DATETIME NOT NULL DEFAULT GETDATE(),
    CompletionPercentage INT NOT NULL DEFAULT 0,
    Notes NVARCHAR(MAX) NULL,
    FOREIGN KEY (TaskId) REFERENCES Tasks(Id) ON DELETE CASCADE,
    FOREIGN KEY (DeveloperId) REFERENCES Users(Id),
    CONSTRAINT UQ_TaskDeveloper UNIQUE (TaskId, DeveloperId)
);

-- UserSkills table (many-to-many relationship between Users and Technologies)
CREATE TABLE UserSkills (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TechnologyId INT NOT NULL,
    ProficiencyLevel INT NOT NULL CHECK (ProficiencyLevel BETWEEN 1 AND 5),
    YearsOfExperience INT NULL,
    IsCertified BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (TechnologyId) REFERENCES Technologies(Id),
    CONSTRAINT UQ_UserTechnology UNIQUE (UserId, TechnologyId)
);

-- Meetings table
CREATE TABLE Meetings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    ProjectId INT NOT NULL,
    ScheduledDate DATETIME NOT NULL,
    DurationMinutes INT NOT NULL,
    MeetingLink NVARCHAR(255) NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Scheduled', 'Completed', 'Cancelled')),
    OrganizerId INT NOT NULL,
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (OrganizerId) REFERENCES Users(Id)
);

-- MeetingAttendees table (many-to-many relationship between Meetings and Users)
CREATE TABLE MeetingAttendees (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    MeetingId INT NOT NULL,
    UserId INT NOT NULL,
    HasAttended BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (MeetingId) REFERENCES Meetings(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT UQ_MeetingUser UNIQUE (MeetingId, UserId)
);

-- ProjectDocuments table
CREATE TABLE ProjectDocuments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProjectId INT NOT NULL,
    Title NVARCHAR(100) NOT NULL,
    FilePath NVARCHAR(255) NOT NULL,
    FileType NVARCHAR(50) NOT NULL,
    UploadedById INT NOT NULL,
    UploadedAt DATETIME NOT NULL DEFAULT GETDATE(),
    Description NVARCHAR(MAX) NULL,
    Version INT NOT NULL DEFAULT 1,
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (UploadedById) REFERENCES Users(Id)
);

-- ActivityLogs table
CREATE TABLE ActivityLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ProjectId INT NULL,
    Action NVARCHAR(50) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Timestamp DATETIME NOT NULL DEFAULT GETDATE(),
    IpAddress NVARCHAR(50) NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE SET NULL
);

-- Indexes for performance optimization
CREATE INDEX IX_Projects_DirectorId ON Projects(DirectorId);
CREATE INDEX IX_Projects_ManagerId ON Projects(ManagerId);
CREATE INDEX IX_Projects_Status ON Projects(Status);
CREATE INDEX IX_Services_ProjectId ON Services(ProjectId);
CREATE INDEX IX_Tasks_ServiceId ON Tasks(ServiceId);
CREATE INDEX IX_Tasks_Status ON Tasks(Status);
CREATE INDEX IX_ProjectDevelopers_ProjectId ON ProjectDevelopers(ProjectId);
CREATE INDEX IX_ProjectDevelopers_DeveloperId ON ProjectDevelopers(DeveloperId);
CREATE INDEX IX_TaskAssignments_TaskId ON TaskAssignments(TaskId);
CREATE INDEX IX_TaskAssignments_DeveloperId ON TaskAssignments(DeveloperId);
CREATE INDEX IX_UserSkills_UserId ON UserSkills(UserId);
CREATE INDEX IX_UserSkills_TechnologyId ON UserSkills(TechnologyId);
CREATE INDEX IX_Meetings_ProjectId ON Meetings(ProjectId);
CREATE INDEX IX_MeetingAttendees_MeetingId ON MeetingAttendees(MeetingId);
CREATE INDEX IX_ProjectDocuments_ProjectId ON ProjectDocuments(ProjectId);
CREATE INDEX IX_ActivityLogs_UserId ON ActivityLogs(UserId);
CREATE INDEX IX_ActivityLogs_ProjectId ON ActivityLogs(ProjectId);
GO

-- Create a view for project summary
CREATE VIEW ProjectSummaryView AS
SELECT 
    p.Id AS ProjectId,
    p.Name AS ProjectName,
    p.Description,
    p.Status,
    p.StartDate,
    p.EndDate,
    director.FirstName + ' ' + director.LastName AS DirectorName,
    manager.FirstName + ' ' + manager.LastName AS ManagerName,
    COUNT(DISTINCT pd.DeveloperId) AS DeveloperCount,
    COUNT(DISTINCT t.Id) AS TaskCount,
    SUM(CASE WHEN t.Status = 'Done' THEN 1 ELSE 0 END) AS CompletedTaskCount
FROM 
    Projects p
    LEFT JOIN Users director ON p.DirectorId = director.Id
    LEFT JOIN Users manager ON p.ManagerId = manager.Id
    LEFT JOIN ProjectDevelopers pd ON p.Id = pd.ProjectId
    LEFT JOIN Services s ON p.Id = s.ProjectId
    LEFT JOIN Tasks t ON s.Id = t.ServiceId
GROUP BY 
    p.Id, p.Name, p.Description, p.Status, p.StartDate, p.EndDate, 
    director.FirstName, director.LastName, manager.FirstName, manager.LastName;
GO

-- Create a view for developer workload
CREATE VIEW DeveloperWorkloadView AS
SELECT 
    u.Id AS DeveloperId,
    u.FirstName + ' ' + u.LastName AS DeveloperName,
    COUNT(DISTINCT ta.TaskId) AS AssignedTaskCount,
    SUM(CASE WHEN t.Status = 'InProgress' THEN 1 ELSE 0 END) AS TasksInProgress,
    SUM(CASE WHEN t.Status = 'ToDo' THEN 1 ELSE 0 END) AS TasksToDo,
    SUM(CASE WHEN t.Status = 'Done' THEN 1 ELSE 0 END) AS TasksCompleted,
    SUM(t.EstimatedHours) AS TotalEstimatedHours
FROM 
    Users u
    LEFT JOIN TaskAssignments ta ON u.Id = ta.DeveloperId
    LEFT JOIN Tasks t ON ta.TaskId = t.Id
WHERE 
    u.Role = 'Developer'
GROUP BY 
    u.Id, u.FirstName, u.LastName;
GO

-- Sample data insertion for testing
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, Role)
VALUES 
    ('director1', 'director@example.com', 'director1234', 'John', 'Director', 'Director'),
    ('manager1', 'manager@example.com', 'manager1234', 'Jane', 'Manager', 'Manager'),
    ('dev1', 'dev1@example.com', 'developer1234', 'Bob', 'Developer', 'Developer'),
    ('dev2', 'dev2@example.com', 'hashed_password', 'Alice', 'Developer', 'Developer');

INSERT INTO Technologies (Name, Category, Description)
VALUES 
    ('React', 'Frontend', 'A JavaScript library for building user interfaces'),
    ('ASP.NET Core', 'Backend', 'A cross-platform framework for building web apps'),
    ('SQL Server', 'Database', 'Microsoft SQL Server database'),
    ('TypeScript', 'Frontend', 'A typed superset of JavaScript'),
    ('Entity Framework Core', 'Backend', 'ORM for .NET');

-- Add more sample data as needed

select * from Users;
delete from Users where Id > 12;