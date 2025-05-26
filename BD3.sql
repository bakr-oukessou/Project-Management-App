-- Create the database
CREATE DATABASE ProjectManagementSystem;
GO

USE ProjectManagementSystem;
GO

-- Create UserRoles table (enum)
CREATE TABLE UserRoles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(20) NOT NULL
);

INSERT INTO UserRoles (Name) VALUES 
('Director'), ('Manager'), ('Developer');

select * from Users;
-- Create Users table
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

-- Create Technologies table
CREATE TABLE Technologies (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(MAX),
    Category NVARCHAR(50)
);

-- Create DeveloperTechnologies junction table
CREATE TABLE DeveloperTechnologies (
    DeveloperId INT NOT NULL,
    TechnologyId INT NOT NULL,
    PRIMARY KEY (DeveloperId, TechnologyId),
    FOREIGN KEY (DeveloperId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (TechnologyId) REFERENCES Technologies(Id) ON DELETE CASCADE
);

-- Create ProjectStatuses table (enum)
CREATE TABLE ProjectStatuses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(20) NOT NULL
);

INSERT INTO ProjectStatuses (Name) VALUES 
('Planning'), ('InProgress'), ('OnHold'), ('Completed'), ('Cancelled');

-- Create Projects table
CREATE TABLE Projects (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(MAX) NOT NULL,
    StartDate DATETIME2 NOT NULL,
    DeadlineDate DATETIME2,
    EndDate DATETIME2,
    StatusId INT NOT NULL DEFAULT 1,
    ManagerId INT,
    DirectorId INT NOT NULL,
    ClientName NVARCHAR(100),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (StatusId) REFERENCES ProjectStatuses(Id),
    FOREIGN KEY (ManagerId) REFERENCES Users(Id),
    FOREIGN KEY (DirectorId) REFERENCES Users(Id)
);

-- Create ProjectDevelopers junction table
CREATE TABLE ProjectDevelopers (
    ProjectId INT NOT NULL,
    DeveloperId INT NOT NULL,
    AssignedDate DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (ProjectId, DeveloperId),
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (DeveloperId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Create ProjectTechnologies junction table
CREATE TABLE ProjectTechnologies (
    ProjectId INT NOT NULL,
    TechnologyId INT NOT NULL,
    PRIMARY KEY (ProjectId, TechnologyId),
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (TechnologyId) REFERENCES Technologies(Id) ON DELETE CASCADE
);

-- Create TaskPriorities table (enum)
CREATE TABLE TaskPriorities (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(20) NOT NULL
);

INSERT INTO TaskPriorities (Name) VALUES 
('Low'), ('Medium'), ('High'), ('Critical');

-- Create TaskStatuses table (enum)
CREATE TABLE TaskStatuses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(20) NOT NULL
);

INSERT INTO TaskStatuses (Name) VALUES 
('ToDo'), ('InProgress'), ('Review'), ('Completed');

-- Create Tasks table
CREATE TABLE Tasks (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    PriorityId INT NOT NULL,
    StatusId INT NOT NULL DEFAULT 1,
    DueDate DATETIME2 NOT NULL,
    EndDate DATETIME2,
    AssignedToId INT,
    ProjectId INT NOT NULL,
    EstimatedHours INT,
    ActualHours INT,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (PriorityId) REFERENCES TaskPriorities(Id),
    FOREIGN KEY (StatusId) REFERENCES TaskStatuses(Id),
    FOREIGN KEY (AssignedToId) REFERENCES Users(Id),
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE
);

-- Create TaskComments table
CREATE TABLE TaskComments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Content NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    TaskId INT NOT NULL,
    UserId INT NOT NULL,
    FOREIGN KEY (TaskId) REFERENCES Tasks(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Create TaskProgresses table
CREATE TABLE TaskProgresses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Description NVARCHAR(MAX) NOT NULL,
    PercentageComplete INT NOT NULL,
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    TaskId INT NOT NULL,
    UserId INT NOT NULL,
    FOREIGN KEY (TaskId) REFERENCES Tasks(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Create Notifications table
CREATE TABLE Notifications (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Message NVARCHAR(MAX) NOT NULL,
    Date DATETIME2 DEFAULT GETDATE(),
    IsRead BIT DEFAULT 0,
    UserId INT NOT NULL,
    ProjectId INT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE SET NULL
);

-- Create ProjectTasks table (legacy - consider merging with Tasks)
CREATE TABLE ProjectTasks (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Description NVARCHAR(MAX) NOT NULL,
    DurationInDays INT NOT NULL,
    ProjectId INT NOT NULL,
    DeveloperId INT NOT NULL,
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (DeveloperId) REFERENCES Users(Id)
);

-- Create TaskProgresses for ProjectTasks (legacy)
CREATE TABLE ProjectTaskProgresses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Description NVARCHAR(MAX) NOT NULL,
    PercentageComplete INT NOT NULL,
    Date DATETIME2 DEFAULT GETDATE(),
    TaskId INT NOT NULL,
    FOREIGN KEY (TaskId) REFERENCES ProjectTasks(Id) ON DELETE CASCADE
);
-- Sample Data for Project Management System Database

USE ProjectManagementSystem;
GO

-- Insert Users (Directors, Managers, Developers)
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, Role, LastLogin, ProfilePicture, PhoneNumber, IsActive) VALUES
-- Directors
('john.director', 'john.director@company.com', 'hashed_password_1', 'John', 'Smith', 'Director', '2024-05-20 09:15:00', 'profile_pics/john_smith.jpg', '+1-555-0101', 1),
('sarah.ceo', 'sarah.ceo@company.com', 'hashed_password_2', 'Sarah', 'Johnson', 'Director', '2024-05-21 14:30:00', 'profile_pics/sarah_johnson.jpg', '+1-555-0102', 1),

-- Managers
('mike.manager', 'mike.manager@company.com', 'hashed_password_3', 'Mike', 'Davis', 'Manager', '2024-05-22 08:45:00', 'profile_pics/mike_davis.jpg', '+1-555-0201', 1),
('lisa.pm', 'lisa.pm@company.com', 'hashed_password_4', 'Lisa', 'Wilson', 'Manager', '2024-05-21 16:20:00', 'profile_pics/lisa_wilson.jpg', '+1-555-0202', 1),
('david.lead', 'david.lead@company.com', 'hashed_password_5', 'David', 'Brown', 'Manager', '2024-05-20 11:10:00', 'profile_pics/david_brown.jpg', '+1-555-0203', 1),

-- Developers
('alex.dev', 'alex.dev@company.com', 'hashed_password_6', 'Alex', 'Garcia', 'Developer', '2024-05-22 10:30:00', 'profile_pics/alex_garcia.jpg', '+1-555-0301', 1),
('emma.coder', 'emma.coder@company.com', 'hashed_password_7', 'Emma', 'Martinez', 'Developer', '2024-05-22 09:15:00', 'profile_pics/emma_martinez.jpg', '+1-555-0302', 1),
('james.dev', 'james.dev@company.com', 'hashed_password_8', 'James', 'Taylor', 'Developer', '2024-05-21 15:45:00', 'profile_pics/james_taylor.jpg', '+1-555-0303', 1),
('sophia.frontend', 'sophia.frontend@company.com', 'hashed_password_9', 'Sophia', 'Anderson', 'Developer', '2024-05-22 08:20:00', 'profile_pics/sophia_anderson.jpg', '+1-555-0304', 1),
('ryan.backend', 'ryan.backend@company.com', 'hashed_password_10', 'Ryan', 'Thomas', 'Developer', '2024-05-21 13:30:00', 'profile_pics/ryan_thomas.jpg', '+1-555-0305', 1),
('olivia.fullstack', 'olivia.fullstack@company.com', 'hashed_password_11', 'Olivia', 'Jackson', 'Developer', '2024-05-20 17:10:00', 'profile_pics/olivia_jackson.jpg', '+1-555-0306', 1),
('noah.mobile', 'noah.mobile@company.com', 'hashed_password_12', 'Noah', 'White', 'Developer', '2024-05-22 07:45:00', 'profile_pics/noah_white.jpg', '+1-555-0307', 1),
('ava.qa', 'ava.qa@company.com', 'hashed_password_13', 'Ava', 'Harris', 'Developer', '2024-05-21 12:15:00', 'profile_pics/ava_harris.jpg', '+1-555-0308', 1);

-- Insert Technologies
INSERT INTO Technologies (Name, Description, Category) VALUES
('JavaScript', 'Dynamic programming language for web development', 'Programming Language'),
('TypeScript', 'Typed superset of JavaScript', 'Programming Language'),
('Python', 'High-level programming language', 'Programming Language'),
('Java', 'Object-oriented programming language', 'Programming Language'),
('C#', 'Microsoft .NET programming language', 'Programming Language'),
('React', 'JavaScript library for building user interfaces', 'Frontend Framework'),
('Angular', 'TypeScript-based web application framework', 'Frontend Framework'),
('Vue.js', 'Progressive JavaScript framework', 'Frontend Framework'),
('Node.js', 'JavaScript runtime for server-side development', 'Backend Technology'),
('Express.js', 'Web application framework for Node.js', 'Backend Framework'),
('Django', 'High-level Python web framework', 'Backend Framework'),
('Spring Boot', 'Java-based framework for microservices', 'Backend Framework'),
('ASP.NET Core', 'Cross-platform web framework', 'Backend Framework'),
('PostgreSQL', 'Open source relational database', 'Database'),
('MySQL', 'Relational database management system', 'Database'),
('MongoDB', 'NoSQL document database', 'Database'),
('Redis', 'In-memory data structure store', 'Database'),
('Docker', 'Containerization platform', 'DevOps'),
('Kubernetes', 'Container orchestration platform', 'DevOps'),
('AWS', 'Amazon Web Services cloud platform', 'Cloud Platform'),
('Azure', 'Microsoft cloud platform', 'Cloud Platform'),
('Git', 'Version control system', 'Development Tool'),
('Jenkins', 'Automation server for CI/CD', 'DevOps'),
('React Native', 'Mobile app development framework', 'Mobile Framework'),
('Flutter', 'UI toolkit for mobile development', 'Mobile Framework');

select * from Users;
-- Assign technologies to developers
INSERT INTO DeveloperTechnologies (DeveloperId, TechnologyId) VALUES
-- Alex Garcia (Full-stack developer)
(1, 1), (1, 2), (1, 6), (1, 9), (1, 10), (1, 14), (1, 18), (1, 22),
-- Emma Martinez (Frontend specialist)
(7, 1), (7, 2), (7, 6), (7, 7), (7, 8), (7, 22),
-- James Taylor (Backend developer)
(8, 3), (8, 11), (8, 14), (8, 16), (8, 18), (8, 20), (8, 22), (8, 23),
-- Sophia Anderson (Frontend developer)
(9, 1), (9, 2), (9, 6), (9, 8), (9, 22),
-- Ryan Thomas (Backend developer)
(10, 4), (10, 12), (10, 15), (10, 18), (10, 19), (10, 21), (10, 22),
-- Olivia Jackson (Full-stack developer)
(11, 1), (11, 5), (11, 6), (11, 13), (11, 15), (11, 18), (11, 21), (11, 22),
-- Noah White (Mobile developer)
(12, 1), (12, 2), (12, 24), (12, 25), (12, 22),
-- Ava Harris (QA/Testing)
(13, 1), (13, 3), (13, 18), (13, 22), (13, 23);

-- Insert Projects
INSERT INTO Projects (Name, Description, StartDate, DeadlineDate, EndDate, StatusId, ManagerId, DirectorId, ClientName, UpdatedAt) VALUES
('E-Commerce Platform Redesign', 'Complete overhaul of the existing e-commerce platform with modern UI/UX and improved performance', '2024-03-01', '2024-08-15', NULL, 2, 3, 1, 'TechMart Inc.', '2024-05-20'),
('Mobile Banking App', 'Development of a secure mobile banking application for iOS and Android platforms', '2024-04-15', '2024-10-30', NULL, 2, 4, 1, 'SecureBank Ltd.', '2024-05-21'),
('Inventory Management System', 'Cloud-based inventory management system with real-time tracking and analytics', '2024-02-10', '2024-07-20', NULL, 2, 5, 2, 'LogisticsPro Corp.', '2024-05-22'),
('Corporate Website Revamp', 'Modern responsive website with CMS integration and SEO optimization', '2024-01-15', '2024-05-30', '2024-05-25', 4, 3, 1, 'BusinessSolutions LLC', '2024-05-25'),
('Data Analytics Dashboard', 'Interactive dashboard for business intelligence and data visualization', '2024-05-01', '2024-09-15', NULL, 1, 4, 2, 'DataCorp Analytics', '2024-05-15'),
('Customer Support Portal', 'Self-service portal with ticketing system and knowledge base', '2024-03-20', '2024-08-30', NULL, 3, 5, 1, 'ServiceFirst Inc.', '2024-05-10');

-- Assign developers to projects
INSERT INTO ProjectDevelopers (ProjectId, DeveloperId, AssignedDate) VALUES
-- E-Commerce Platform Redesign
(1, 1, '2024-03-01'), (1, 7, '2024-03-01'), (1, 8, '2024-03-05'), (1, 9, '2024-03-01'),
-- Mobile Banking App
(2, 10, '2024-04-15'), (2, 11, '2024-04-15'), (2, 12, '2024-04-20'), (2, 13, '2024-04-25'),
-- Inventory Management System
(3, 1, '2024-02-10'), (3, 8, '2024-02-10'), (3, 10, '2024-02-15'),
-- Corporate Website Revamp
(4, 7, '2024-01-15'), (4, 9, '2024-01-15'),
-- Data Analytics Dashboard
(5, 11, '2024-05-01'), (5, 8, '2024-05-05'),
-- Customer Support Portal
(6, 1, '2024-03-20'), (6, 10, '2024-03-25');

-- Assign technologies to projects
INSERT INTO ProjectTechnologies (ProjectId, TechnologyId) VALUES
-- E-Commerce Platform Redesign
(1, 1), (1, 2), (1, 6), (1, 9), (1, 10), (1, 14), (1, 18), (1, 20),
-- Mobile Banking App
(2, 1), (2, 2), (2, 24), (2, 25), (2, 15), (2, 18), (2, 21),
-- Inventory Management System
(3, 3), (3, 11), (3, 14), (3, 18), (3, 20), (3, 23),
-- Corporate Website Revamp
(4, 1), (4, 6), (4, 9), (4, 15),
-- Data Analytics Dashboard
(5, 3), (5, 11), (5, 14), (5, 16), (5, 20),
-- Customer Support Portal
(6, 1), (6, 2), (6, 6), (6, 9), (6, 10), (6, 15);

-- Insert Tasks with updated schema (Status and Priority as NVARCHAR)
INSERT INTO Tasks (Title, Description, StatusId, PriorityId, DueDate, EndDate, AssignedToId, ProjectId, EstimatedHours, ActualHours, UpdatedAt) VALUES
-- E-Commerce Platform Redesign Tasks
('Database Schema Design', 'Design and implement the new database schema for the e-commerce platform', 4, 3, '2024-03-15', '2024-03-12', 8, 1, 40, 35, '2024-03-12'),
('Frontend Components Development', 'Develop reusable React components for the product catalog', 2, 3, '2024-06-01', NULL, 7, 1, 80, 45, '2024-05-22'),
('Payment Gateway Integration', 'Integrate multiple payment gateways including Stripe and PayPal', 1, 4, '2024-07-15', NULL, 6, 1, 60, 0, NULL),
('User Authentication System', 'Implement secure user authentication with JWT tokens', 2, 3, '2024-05-30', NULL, 9, 1, 50, 30, '2024-05-20'),
('Product Search Functionality', 'Implement advanced search with filters and sorting', 3, 2, '2024-06-15', NULL, 6, 1, 35, 32, '2024-05-21'),

-- Mobile Banking App Tasks
('Mobile App Architecture Setup', 'Set up the React Native project structure and navigation', 4, 3, '2024-05-01', '2024-04-28', 12, 2, 30, 28, '2024-04-28'),
('Account Balance API', 'Develop secure API endpoints for account balance retrieval', 2, 4, '2024-06-01', NULL, 10, 2, 45, 20, '2024-05-22'),
('Biometric Authentication', 'Implement fingerprint and face recognition for app login', 1, 3, '2024-07-01', NULL, 11, 2, 55, 0, NULL),
('Transaction History UI', 'Design and implement transaction history screens', 2, 2, '2024-06-15', NULL, 12, 2, 40, 15, '2024-05-18'),
('Security Testing', 'Comprehensive security testing and penetration testing', 1, 4, '2024-09-01', NULL, 13, 2, 70, 0, NULL),

-- Inventory Management System Tasks
('Inventory Data Model', 'Design database schema for inventory tracking', 4, 3, '2024-03-01', '2024-02-28', 8, 3, 35, 33, '2024-02-28'),
('Real-time Tracking API', 'Develop APIs for real-time inventory updates', 2, 3, '2024-06-10', NULL, 10, 3, 60, 40, '2024-05-22'),
('Analytics Dashboard', 'Create interactive dashboard for inventory analytics', 1, 2, '2024-07-01', NULL, 6, 3, 50, 0, NULL),
('Barcode Scanner Integration', 'Integrate barcode scanning for inventory management', 3, 2, '2024-06-20', NULL, 8, 3, 25, 22, '2024-05-19'),

-- Corporate Website Revamp Tasks
('Content Migration', 'Migrate existing content to new CMS system', 4, 2, '2024-04-01', '2024-03-28', 7, 4, 25, 24, '2024-03-28'),
('SEO Optimization', 'Implement SEO best practices and meta tags', 4, 2, '2024-05-15', '2024-05-12', 9, 4, 20, 18, '2024-05-12'),
('Responsive Design Testing', 'Test website responsiveness across all devices', 4, 1, '2024-05-20', '2024-05-18', 7, 4, 15, 16, '2024-05-18'),

-- Data Analytics Dashboard Tasks
('Data Pipeline Setup', 'Set up ETL pipeline for data processing', 2, 3, '2024-06-01', NULL, 8, 5, 45, 20, '2024-05-15'),
('Dashboard UI Framework', 'Implement base dashboard framework with React', 1, 3, '2024-06-15', NULL, 11, 5, 40, 0, NULL),
('Chart Components', 'Develop interactive chart components using D3.js', 1, 2, '2024-07-01', NULL, 11, 5, 35, 0, NULL),

-- Customer Support Portal Tasks
('Ticketing System Backend', 'Develop backend APIs for support ticket management', 2, 3, '2024-06-30', NULL, 10, 6, 55, 25, '2024-05-20'),
('Knowledge Base CMS', 'Implement content management system for knowledge base', 1, 2, '2024-07-15', NULL, 6, 6, 40, 0, NULL),
('User Portal Frontend', 'Develop customer-facing portal interface', 1, 3, '2024-08-01', NULL, 6, 6, 50, 0, NULL);

-- Insert Task Comments
INSERT INTO TaskComments (Content, TaskId, UserId, CreatedAt) VALUES
('Database schema has been reviewed and approved by the architecture team.', 1, 3, '2024-03-10 14:30:00'),
('Great work on the schema design! Moving forward with implementation.', 1, 8, '2024-03-11 09:15:00'),
('Working on the product card component. Should be ready for review by Friday.', 2, 7, '2024-05-20 11:20:00'),
('Need clarification on the payment gateway requirements. Setting up a meeting.', 3, 6, '2024-05-18 16:45:00'),
('Authentication flow is working well. Just need to add password reset functionality.', 4, 9, '2024-05-19 10:30:00'),
('Search functionality is complete and ready for code review.', 5, 6, '2024-05-21 13:15:00'),
('Mobile app structure is set up. Navigation is working smoothly.', 6, 12, '2024-04-28 15:00:00'),
('API endpoints are being developed. Security measures are in place.', 7, 10, '2024-05-22 08:45:00'),
('Biometric auth will require additional testing on different devices.', 8, 11, '2024-05-15 12:30:00'),
('Transaction history UI mockups have been approved by the client.', 9, 4, '2024-05-17 14:20:00');

-- Insert Task Progress Updates
INSERT INTO TaskProgresses (Description, PercentageComplete, TaskId, UserId, UpdatedAt) VALUES
('Initial database design completed', 100, 1, 8, '2024-03-12 16:00:00'),
('Product catalog components - 60% complete', 60, 2, 7, '2024-05-22 17:30:00'),
('Authentication system - login and registration done', 75, 4, 9, '2024-05-20 14:45:00'),
('Search functionality implementation finished', 95, 5, 6, '2024-05-21 16:20:00'),
('React Native project structure completed', 100, 6, 12, '2024-04-28 18:00:00'),
('API development in progress - 2 out of 5 endpoints done', 40, 7, 10, '2024-05-22 11:30:00'),
('Transaction UI wireframes completed', 35, 9, 12, '2024-05-18 13:15:00'),
('Inventory data model finalized and implemented', 100, 11, 8, '2024-02-28 17:45:00'),
('Real-time tracking API - core functionality implemented', 70, 12, 10, '2024-05-22 15:20:00'),
('Barcode scanner integration - testing phase', 90, 14, 8, '2024-05-19 12:00:00'),
('Content migration completed successfully', 100, 15, 7, '2024-03-28 14:30:00'),
('SEO optimization implemented across all pages', 100, 16, 7, '2024-05-12 16:45:00'),
('Data pipeline - initial setup completed', 45, 18, 8, '2024-05-15 10:20:00'),
('Ticketing system API - 50% of endpoints completed', 50, 21, 10, '2024-05-20 13:40:00');

-- Insert Notifications
INSERT INTO Notifications (Message, IsRead, UserId, ProjectId, Date) VALUES
('New task assigned: Payment Gateway Integration', 0, 6, 1, '2024-05-22 09:00:00'),
('Task completed: Database Schema Design', 1, 3, 1, '2024-03-12 16:30:00'),
('Project deadline reminder: Mobile Banking App due in 3 months', 0, 4, 2, '2024-05-22 08:00:00'),
('Code review requested for Search Functionality', 0, 3, 1, '2024-05-21 17:00:00'),
('New comment on Authentication System task', 1, 9, 1, '2024-05-19 11:00:00'),
('Project status updated: Corporate Website Revamp completed', 1, 1, 4, '2024-05-25 14:00:00'),
('Weekly progress report due tomorrow', 0, 8, 3, '2024-05-21 18:00:00'),
('New developer assigned to your project', 1, 4, 2, '2024-04-25 10:30:00'),
('Task overdue: Biometric Authentication', 0, 11, 2, '2024-05-22 07:00:00'),
('Project milestone reached: 50% completion', 0, 5, 3, '2024-05-20 15:30:00');

-- Insert Legacy ProjectTasks (if still needed)
INSERT INTO ProjectTasks (Description, DurationInDays, ProjectId, DeveloperId) VALUES
('Legacy task: Initial project setup and configuration', 5, 1, 6),
('Legacy task: Environment setup and deployment pipeline', 7, 2, 10),
('Legacy task: Code quality and testing standards setup', 3, 3, 13);

-- Insert Legacy ProjectTaskProgresses
INSERT INTO ProjectTaskProgresses (Description, PercentageComplete, TaskId, Date) VALUES
('Project setup completed with all necessary tools', 100, 1, '2024-03-05 17:00:00'),
('Environment configuration in progress', 75, 2, '2024-04-20 14:30:00'),
('Testing standards documentation finalized', 100, 3, '2024-02-15 16:45:00');

-- Display summary of inserted data
SELECT 
    'Users' as TableName, COUNT(*) as RecordCount 
FROM Users
UNION ALL
SELECT 'Technologies', COUNT(*) FROM Technologies
UNION ALL
SELECT 'Projects', COUNT(*) FROM Projects
UNION ALL
SELECT 'Tasks', COUNT(*) FROM Tasks
UNION ALL
SELECT 'TaskComments', COUNT(*) FROM TaskComments
UNION ALL
SELECT 'TaskProgresses', COUNT(*) FROM TaskProgresses
UNION ALL
SELECT 'Notifications', COUNT(*) FROM Notifications
UNION ALL
SELECT 'DeveloperTechnologies', COUNT(*) FROM DeveloperTechnologies
UNION ALL
SELECT 'ProjectDevelopers', COUNT(*) FROM ProjectDevelopers
UNION ALL
SELECT 'ProjectTechnologies', COUNT(*) FROM ProjectTechnologies;

SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Projects';

-- Insert Tasks assigned to userId: 1 (Developer)
INSERT INTO Tasks (Title, Description, StatusId, PriorityId, DueDate, EndDate, AssignedToId, ProjectId, EstimatedHours, ActualHours, UpdatedAt) VALUES
-- E-Commerce Platform Tasks for User 1
('Implement Shopping Cart', 'Develop shopping cart functionality with persistent storage', 2, 3, '2024-06-10', NULL, 1, 1, 25, 18, '2024-05-22'),
('Product Detail Page API', 'Create API endpoints for product details and variations', 3, 2, '2024-05-25', '2024-05-22', 1, 1, 15, 16, '2024-05-22'),

-- Mobile Banking App Tasks for User 1
('Transaction Notification Service', 'Implement push notifications for transactions', 2, 3, '2024-06-05', NULL, 1, 2, 25, 15, '2024-05-18'),
('Security Audit Fixes', 'Address security vulnerabilities from audit report', 1, 4, '2024-07-15', NULL, 1, 2, 40, 0, NULL),

-- Inventory Management Tasks for User 1
('Inventory Reporting Module', 'Create reporting features for inventory levels', 3, 2, '2024-06-01', NULL, 1, 3, 30, 22, '2024-05-21')

INSERT INTO Projects (Name, Description, StartDate, DeadlineDate, EndDate, StatusId, ManagerId, DirectorId, ClientName, UpdatedAt) VALUES
('KOR Platform Redesign', 'Complete overhaul of the existing e-commerce platform with modern UI/UX and improved performance', '2024-03-01', '2024-08-15', NULL, 2, 15, 16, 'TechMart Inc.', '2024-05-20'),
('Mobile App for yoga', 'Development of a secure mobile banking application for iOS and Android platforms', '2024-04-15', '2024-10-30', NULL, 2, 15, 16, 'SecureBank Ltd.', '2024-05-21')
select * from users;
select * from projects;