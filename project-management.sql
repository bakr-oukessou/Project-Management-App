CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Directeur', 'ChefProjet', 'Développeur')),
    Discriminator NVARCHAR(20) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
CREATE TABLE Technologies (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL UNIQUE,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
CREATE TABLE Projects (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(MAX),
    Client NVARCHAR(100),
    StartDate DATETIME2 NOT NULL,
    DeliveryDate DATETIME2 NOT NULL,
    DevelopmentDays INT NOT NULL,
    Methodology NVARCHAR(50),
    TeamMeetingDate DATETIME2 NULL,
    ProjectManagerId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProjectManagerId) REFERENCES Users(Id) ON DELETE NO ACTION
);

CREATE TABLE ProjectDevelopers (
    ProjectId INT NOT NULL,
    DeveloperId INT NOT NULL,
    AssignedAt DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (ProjectId, DeveloperId),
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (DeveloperId) REFERENCES Users(Id) ON DELETE CASCADE
);
CREATE TABLE ProjectTechnologies (
    ProjectId INT NOT NULL,
    TechnologyId INT NOT NULL,
    PRIMARY KEY (ProjectId, TechnologyId),
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (TechnologyId) REFERENCES Technologies(Id) ON DELETE CASCADE
);
CREATE TABLE DeveloperTechnologies (
    DeveloperId INT NOT NULL,
    TechnologyId INT NOT NULL,
    SkillLevel NVARCHAR(20) CHECK (SkillLevel IN ('Beginner', 'Intermediate', 'Expert')),
    PRIMARY KEY (DeveloperId, TechnologyId),
    FOREIGN KEY (DeveloperId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (TechnologyId) REFERENCES Technologies(Id) ON DELETE CASCADE
);
CREATE TABLE ProjectTasks (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Description NVARCHAR(MAX) NOT NULL,
    DurationInDays INT NOT NULL,
    ProjectId INT NOT NULL,
    DeveloperId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (DeveloperId) REFERENCES Users(Id) ON DELETE NO ACTION
);
CREATE TABLE TaskProgresses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Date DATETIME2 NOT NULL DEFAULT GETDATE(),
    Description NVARCHAR(MAX),
    PercentageComplete INT NOT NULL CHECK (PercentageComplete BETWEEN 0 AND 100),
    TaskId INT NOT NULL,
    FOREIGN KEY (TaskId) REFERENCES ProjectTasks(Id) ON DELETE CASCADE
);
CREATE TABLE Notifications (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Message NVARCHAR(MAX) NOT NULL,
    Date DATETIME2 NOT NULL DEFAULT GETDATE(),
    IsRead BIT NOT NULL DEFAULT 0,
    UserId INT NOT NULL,
    ProjectId INT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE SET NULL
);
-- Performance optimization indexes
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Projects_ProjectManagerId ON Projects(ProjectManagerId);
CREATE INDEX IX_ProjectTasks_DeveloperId ON ProjectTasks(DeveloperId);
CREATE INDEX IX_ProjectTasks_ProjectId ON ProjectTasks(ProjectId);
CREATE INDEX IX_TaskProgresses_TaskId ON TaskProgresses(TaskId);
CREATE INDEX IX_Notifications_UserId ON Notifications(UserId);
CREATE INDEX IX_Notifications_IsRead ON Notifications(IsRead);

-- Directors
INSERT INTO Users (UserName, Email, PasswordHash, Role, Discriminator)
VALUES 
('jdupont', 'jean.dupont@company.com', '$2a$11$5bJfZ9sAxjH1YwYQ6kzVUO7XvUW1rLm2nT3pVqYsKtN1dF5GcHb6C', 'Directeur', 'User'),
('mleclerc', 'marie.leclerc@company.com', '$2a$11$8kTgH7sBxqP2YvR9wLzVUO7XvUW1rLm2nT3pVqYsKtN1dF5GcHb6C', 'Directeur', 'User');

-- Project Managers
INSERT INTO Users (UserName, Email, PasswordHash, Role, Discriminator)
VALUES 
('pmoreau', 'pierre.moreau@company.com', '$2a$11$3mJfZ9sAxjH1YwYQ6kzVUO7XvUW1rLm2nT3pVqYsKtN1dF5GcHb6C', 'ChefProjet', 'User'),
('lbernard', 'lucie.bernard@company.com', '$2a$11$7nTgH7sBxqP2YvR9wLzVUO7XvUW1rLm2nT3pVqYsKtN1dF5GcHb6C', 'ChefProjet', 'User');

-- Developers
INSERT INTO Users (UserName, Email, PasswordHash, Role, Discriminator)
VALUES 
('adurand', 'alice.durand@company.com', '$2a$11$2bJfZ9sAxjH1YwYQ6kzVUO7XvUW1rLm2nT3pVqYsKtN1dF5GcHb6C', 'Développeur', 'Developer'),
('tleroy', 'thomas.leroy@company.com', '$2a$11$9mTgH7sBxqP2YvR9wLzVUO7XvUW1rLm2nT3pVqYsKtN1dF5GcHb6C', 'Développeur', 'Developer'),
('slambert', 'sophie.lambert@company.com', '$2a$11$4nJfZ9sAxjH1YwYQ6kzVUO7XvUW1rLm2nT3pVqYsKtN1dF5GcHb6C', 'Développeur', 'Developer'),
('jmartin', 'julien.martin@company.com', '$2a$11$6kTgH7sBxqP2YvR9wLzVUO7XvUW1rLm2nT3pVqYsKtN1dF5GcHb6C', 'Développeur', 'Developer');

INSERT INTO Technologies (Name) 
VALUES 
('.NET'), 
('React'), 
('Angular'), 
('Java (JEE)'), 
('PHP'), 
('Python'),
('Node.js'),
('SQL Server'),
('MySQL'),
('MongoDB'),
('Docker'),
('Kubernetes'),
('Azure'),
('AWS'),
('Agile'),
('Scrum'),
('XP'),
('DevOps');

INSERT INTO Projects (Name, Description, Client, StartDate, DeliveryDate, DevelopmentDays, Methodology, ProjectManagerId)
VALUES
('E-Commerce Platform', 'Development of a new e-commerce platform for retail client', 'ShopCorp', '2023-06-01', '2023-12-15', 120, 'Scrum', 3),
('Banking App Modernization', 'Modernization of legacy banking application', 'FinBank', '2023-07-10', '2024-02-28', 150, 'Agile', 4),
('Healthcare Portal', 'Patient management system for hospital network', 'MediGroup', '2023-08-15', '2024-01-30', 100, 'Scrum', 3),
('IoT Fleet Management', 'Tracking system for vehicle fleet using IoT', 'LogiTrans', '2023-09-01', '2024-03-15', 130, 'XP', 4);

INSERT INTO ProjectDevelopers (ProjectId, DeveloperId)
VALUES
(1, 5), -- E-Commerce: Alice
(1, 6), -- E-Commerce: Thomas
(2, 6), -- Banking: Thomas
(2, 7), -- Banking: Sophie
(2, 8), -- Banking: Julien
(3, 5), -- Healthcare: Alice
(3, 8), -- Healthcare: Julien
(4, 7); -- IoT: Sophie

INSERT INTO ProjectTechnologies (ProjectId, TechnologyId)
VALUES
-- E-Commerce Platform
(1, 1), -- .NET
(1, 2), -- React
(1, 8), -- SQL Server
(1, 15), -- Agile
-- Banking App Modernization
(2, 4), -- Java (JEE)
(2, 9), -- MySQL
(2, 16), -- Scrum
-- Healthcare Portal
(3, 1), -- .NET
(3, 3), -- Angular
(3, 8), -- SQL Server
(3, 15), -- Agile
-- IoT Fleet Management
(4, 5), -- Python
(4, 11), -- Docker
(4, 12), -- Kubernetes
(4, 17); -- XP

INSERT INTO DeveloperTechnologies (DeveloperId, TechnologyId, SkillLevel)
VALUES
-- Alice Durand
(5, 1, 'Expert'),  -- .NET
(5, 2, 'Beginner'), -- React
(5, 8, 'Intermediate'), -- SQL Server
-- Thomas Leroy
(6, 4, 'Expert'),  -- Java (JEE)
(6, 9, 'Beginner'), -- MySQL
(6, 16, 'Intermediate'), -- Scrum
-- Sophie Lambert
(7, 5, 'Expert'),  -- Python
(7, 11, 'Beginner'), -- Docker
(7, 12, 'Intermediate'), -- Kubernetes
-- Julien Martin
(8, 1, 'Advanced'), -- .NET
(8, 3, 'Beginner'),  -- Angular
(8, 8, 'Advanced'); -- SQL Server

INSERT INTO ProjectTasks (Description, DurationInDays, ProjectId, DeveloperId)
VALUES
-- E-Commerce Platform
('Develop product catalog API', 15, 1, 5),
('Implement shopping cart functionality', 10, 1, 5),
('Build frontend product listings', 12, 1, 6),
('Create checkout process', 8, 1, 6),
-- Banking App Modernization
('Migrate legacy authentication', 20, 2, 6),
('Implement new transaction engine', 25, 2, 7),
('Develop mobile banking features', 18, 2, 8),
-- Healthcare Portal
('Create patient registration module', 15, 3, 5),
('Develop appointment scheduling', 12, 3, 8),
('Build prescription management', 10, 3, 8),
-- IoT Fleet Management
('Design device communication protocol', 20, 4, 7),
('Implement real-time tracking', 15, 4, 7),
('Develop analytics dashboard', 10, 4, 7);

INSERT INTO TaskProgresses (Date, Description, PercentageComplete, TaskId)
VALUES
-- Product catalog API
('2023-06-05', 'Initial setup and architecture', 20, 1),
('2023-06-12', 'Core API endpoints completed', 60, 1),
('2023-06-19', 'Testing and documentation', 90, 1),
-- Shopping cart functionality
('2023-06-15', 'Basic cart operations implemented', 30, 2),
('2023-06-22', 'Persistent cart across sessions', 70, 2),
-- Mobile banking features
('2023-08-01', 'UI framework setup', 15, 7),
('2023-08-08', 'Account overview screen', 40, 7),
-- Device communication protocol
('2023-09-10', 'Protocol specification finalized', 25, 12),
('2023-09-17', 'Initial implementation working', 50, 12);

INSERT INTO Notifications (Message, Date, IsRead, UserId, ProjectId)
VALUES
('You have been assigned as project manager for "E-Commerce Platform"', '2023-05-28 09:15:00', 1, 3, 1),
('New project "Banking App Modernization" assigned to you', '2023-06-30 14:30:00', 1, 4, 2),
('Team meeting scheduled for E-Commerce Platform on 2023-06-10 at 10:00', '2023-06-05 16:45:00', 0, 5, 1),
('You have been added to the Banking App Modernization project team', '2023-07-12 11:20:00', 1, 7, 2),
('New task assigned: "Develop analytics dashboard"', '2023-09-05 09:00:00', 0, 7, 4),
('Project "Healthcare Portal" has reached 75% completion', '2023-11-15 17:30:00', 0, 3, 3);

SELECT 
    p.Name AS ProjectName,
    pm.UserName AS ProjectManager,
    STRING_AGG(d.UserName, ', ') AS TeamMembers,
    STRING_AGG(t.Name, ', ') AS Technologies
FROM 
    Projects p
JOIN 
    Users pm ON p.ProjectManagerId = pm.Id
LEFT JOIN 
    ProjectDevelopers pd ON p.Id = pd.ProjectId
LEFT JOIN 
    Users d ON pd.DeveloperId = d.Id
LEFT JOIN 
    ProjectTechnologies pt ON p.Id = pt.ProjectId
LEFT JOIN 
    Technologies t ON pt.TechnologyId = t.Id
GROUP BY 
    p.Name, pm.UserName;