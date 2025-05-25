INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, Role, CreatedAt, LastLogin, ProfilePicture, PhoneNumber, IsActive)
VALUES
    ('jdoe', 'john.doe@company.com', '$2a$10$XH232I9JtlD5J7N6Q7nzOeJz7vQ1VZ3Xe9WkX1Y2Z3A4B5C6D7E8F9G0H', 'John', 'Doe', 'Director', '2023-01-01', '2023-06-15', 'profile1.jpg', '555-0101', 1),
    ('asmith', 'alice.smith@company.com', '$2a$10$XH232I9JtlD5J7N6Q7nzOeJz7vQ1VZ3Xe9WkX1Y2Z3A4B5C6D7E8F9G0H', 'Alice', 'Smith', 'Manager', '2023-01-02', '2023-06-14', 'profile2.jpg', '555-0102', 1),
    ('bjohnson', 'bob.johnson@company.com', '$2a$10$XH232I9JtlD5J7N6Q7nzOeJz7vQ1VZ3Xe9WkX1Y2Z3A4B5C6D7E8F9G0H', 'Bob', 'Johnson', 'Developer', '2023-01-03', '2023-06-13', 'profile3.jpg', '555-0103', 1),
    ('cwilliams', 'charlie.williams@company.com', '$2a$10$XH232I9JtlD5J7N6Q7nzOeJz7vQ1VZ3Xe9WkX1Y2Z3A4B5C6D7E8F9G0H', 'Charlie', 'Williams', 'Developer', '2023-01-04', '2023-06-12', 'profile4.jpg', '555-0104', 1),
    ('djones', 'diana.jones@company.com', '$2a$10$XH232I9JtlD5J7N6Q7nzOeJz7vQ1VZ3Xe9WkX1Y2Z3A4B5C6D7E8F9G0H', 'Diana', 'Jones', 'Developer', '2023-01-05', '2023-06-11', 'profile5.jpg', '555-0105', 1),
    ('ebrown', 'emma.brown@company.com', '$2a$10$XH232I9JtlD5J7N6Q7nzOeJz7vQ1VZ3Xe9WkX1Y2Z3A4B5C6D7E8F9G0H', 'Emma', 'Brown', 'Manager', '2023-01-06', '2023-06-10', 'profile6.jpg', '555-0106', 1),
    ('fdavis', 'frank.davis@company.com', '$2a$10$XH232I9JtlD5J7N6Q7nzOeJz7vQ1VZ3Xe9WkX1Y2Z3A4B5C6D7E8F9G0H', 'Frank', 'Davis', 'Developer', '2023-01-07', '2023-06-09', 'profile7.jpg', '555-0107', 1),
    ('gmiller', 'grace.miller@company.com', '$2a$10$XH232I9JtlD5J7N6Q7nzOeJz7vQ1VZ3Xe9WkX1Y2Z3A4B5C6D7E8F9G0H', 'Grace', 'Miller', 'Developer', '2023-01-08', '2023-06-08', 'profile8.jpg', '555-0108', 1),
    ('hwilson', 'henry.wilson@company.com', '$2a$10$XH232I9JtlD5J7N6Q7nzOeJz7vQ1VZ3Xe9WkX1Y2Z3A4B5C6D7E8F9G0H', 'Henry', 'Wilson', 'Developer', '2023-01-09', '2023-06-07', 'profile9.jpg', '555-0109', 1),
    ('imoore', 'isabella.moore@company.com', '$2a$10$XH232I9JtlD5J7N6Q7nzOeJz7vQ1VZ3Xe9WkX1Y2Z3A4B5C6D7E8F9G0H', 'Isabella', 'Moore', 'Developer', '2023-01-10', '2023-06-06', 'profile10.jpg', '555-0110', 1);

    select * from Technologies;
    INSERT INTO Technologies (Name, Category, Description, Version, DocumentationUrl)
VALUES
    ('Node.js', 'Backend', 'JavaScript runtime built on Chrome''s V8 JavaScript engine', '18.16.0', 'https://nodejs.org/en/docs'),
    ('PostgreSQL', 'Database', 'Open source relational database system', '15.3', 'https://www.postgresql.org/docs'),
    ('Docker', 'DevOps', 'Platform for developing, shipping, and running applications in containers', '23.0.5', 'https://docs.docker.com'),
    ('Azure', 'Cloud', 'Microsoft''s cloud computing platform', NULL, 'https://learn.microsoft.com/en-us/azure'),
    ('Kubernetes', 'DevOps', 'Container orchestration system', '1.27', 'https://kubernetes.io/docs'),
    ('GraphQL', 'API', 'Query language for APIs', NULL, 'https://graphql.org/learn'),
    ('MongoDB', 'Database', 'NoSQL document database', '6.0', 'https://www.mongodb.com/docs');


    select * from Projects;
    INSERT INTO Projects (Name, Description, StartDate, EndDate, Status, DirectorId, ManagerId, Budget, Methodology, Priority, ClientName, CreatedAt, UpdatedAt)
VALUES
    ('E-Commerce Platform', 'Build a scalable e-commerce platform with React frontend and Node.js backend', '2023-02-01', '2023-08-31', 'InProgress', 1, 2, 150000.00, 'Agile', 1, 'RetailCorp', '2023-01-15', '2023-06-01'),
    ('Healthcare Portal', 'Patient management system for healthcare providers', '2023-03-15', '2023-10-15', 'Planning', 1, 19, 200000.00, 'Scrum', 2, 'HealthPlus', '2023-02-10', '2023-05-20'),
    ('IoT Monitoring System', 'Real-time monitoring system for IoT devices', '2023-01-10', '2023-07-30', 'InProgress', 1, 23, 120000.00, 'Kanban', 1, 'TechSolutions', '2022-12-05', '2023-06-10'),
    ('Mobile Banking App', 'Cross-platform mobile banking application', '2023-04-01', '2023-11-30', 'OnHold', 1, 23, 180000.00, 'Agile', 3, 'GlobalBank', '2023-03-01', '2023-05-15'),
    ('AI Chatbot', 'Customer support chatbot with natural language processing', '2023-05-01', '2023-09-30', 'InProgress', 1, 2, 90000.00, 'Scrum', 2, 'ServicePro', '2023-04-10', '2023-06-05');

    INSERT INTO Services (Name, Description, ProjectId, StartDate, EndDate, Status, Priority)
VALUES
    ('Frontend Development', 'React-based user interface development', 3, '2023-02-01', '2023-05-31', 'Completed', 1),
    ('Backend API', 'Node.js backend with REST API', 3, '2023-02-15', '2023-06-30', 'InProgress', 1),
    ('Database Design', 'PostgreSQL database schema and implementation', 4, '2023-02-10', '2023-04-15', 'Completed', 2),
    ('Patient Registration', 'System for patient registration and profiles', 4, '2023-03-15', '2023-06-30', 'Planning', 1),
    ('Appointment Scheduling', 'Doctor appointment booking system', 5, '2023-04-01', '2023-07-31', 'Planning', 2),
    ('Device Integration', 'Integration with IoT sensors and devices', 5, '2023-01-10', '2023-03-31', 'Completed', 1),
    ('Data Visualization', 'Dashboard for monitoring device data', 6, '2023-02-15', '2023-06-30', 'InProgress', 1),
    ('Mobile UI', 'React Native user interface', 6, '2023-04-01', '2023-07-31', 'OnHold', 1),
    ('Security Module', 'Banking security features and authentication', 7, '2023-04-15', '2023-08-31', 'OnHold', 1),
    ('NLP Engine', 'Natural language processing component', 7, '2023-05-01', '2023-07-31', 'InProgress', 1);
    select * from Services;

    INSERT INTO Tasks (Title, Description, ServiceId, StartDate, EndDate, Status, Priority, EstimatedHours, ActualHours, CreatedAt, UpdatedAt)
VALUES
    ('Product Listing Page', 'Develop product listing page with filters', 11, '2023-02-01', '2023-02-15', 'Done', 1, 40, 35, '2023-01-20', '2023-02-16'),
    ('Shopping Cart', 'Implement shopping cart functionality', 11, '2023-02-10', '2023-02-28', 'Done', 1, 30, 28, '2023-01-25', '2023-03-01'),
    ('User Authentication', 'Create login/register system', 2, '2023-02-15', '2023-03-15', 'InProgress', 1, 50, 35, '2023-02-01', '2023-06-01'),
    ('Product API', 'Develop REST endpoints for products', 2, '2023-03-01', '2023-04-15', 'InProgress', 2, 60, 40, '2023-02-10', '2023-06-01'),
    ('Database Schema', 'Design database tables and relationships', 3, '2023-02-10', '2023-02-28', 'Done', 1, 25, 20, '2023-02-01', '2023-03-01'),
    ('Patient Form', 'Design patient registration form', 4, '2023-03-15', '2023-04-15', 'ToDo', 1, 30, NULL, '2023-03-01', '2023-03-01'),
    ('Device API', 'Create API for device communication', 6, '2023-01-10', '2023-02-10', 'Done', 1, 45, 40, '2022-12-20', '2023-02-12'),
    ('Dashboard UI', 'Build monitoring dashboard UI', 7, '2023-02-15', '2023-04-30', 'InProgress', 1, 80, 50, '2023-02-01', '2023-06-01'),
    ('Login Screen', 'Design mobile app login screen', 8, '2023-04-01', '2023-04-15', 'InReview', 1, 20, NULL, '2023-03-15', '2023-05-01'),
    ('Intent Recognition', 'Implement intent detection for chatbot', 10, '2023-05-01', '2023-06-15', 'InProgress', 1, 70, 30, '2023-04-20', '2023-06-01');


    INSERT INTO ProjectDevelopers (ProjectId, DeveloperId, AssignedDate, Role, IsActive)
VALUES
    (3, 3, '2023-01-20', 'Frontend Lead', 1),
    (3, 4, '2023-01-20', 'Backend Developer', 1),
    (3, 17, '2023-01-25', 'Full Stack Developer', 1),
    (4, 20, '2023-02-15', 'UI Developer', 1),
    (4, 21, '2023-02-15', 'Database Specialist', 1),
    (5,22, '2023-01-05', 'Lead Developer', 1),
    (5, 24, '2023-01-05', 'IoT Specialist', 1),
    (5, 25, '2023-01-10', 'UI Developer', 1),
    (6, 26, '2023-03-05', 'Mobile Developer', 1),
    (6, 27, '2023-03-05', 'Security Specialist', 1),
    (7, 17, '2023-04-15', 'NLP Engineer', 1),
    (7, 20, '2023-04-15', 'Backend Developer', 1);

    INSERT INTO ProjectTechnologies (ProjectId, TechnologyId, Usage)
VALUES
    (3, 1, 'Frontend development'),
    (3, 2, 'Backend server'),
    (3, 3, 'Primary database'),
    (3, 5, 'Type checking'),
    (4, 1, 'Admin portal UI'),
    (4, 2, 'Backend API'),
    (4, 3, 'Patient records storage'),
    (5, 2, 'Data processing'),
    (5, 4, 'Containerization'),
    (5, 8, 'Orchestration'),
    (6, 1, 'Mobile app UI (React Native)'),
    (6, 11, 'Cloud hosting'),
    (7, 5, 'Type safety'),
    (7, 9, 'API queries'),
    (7, 10, 'Conversation history storage');

    INSERT INTO TaskAssignments (TaskId, DeveloperId, AssignedDate, CompletionPercentage, Notes)
VALUES
    (20, 3, '2023-01-25', 100, 'Completed ahead of schedule'),
    (21, 3, '2023-01-25', 100, 'Minor UI tweaks needed'),
    (22, 4, '2023-02-10', 70, 'Working on password reset functionality'),
    (23, 17, '2023-02-15', 65, 'Product search endpoint remaining'),
    (24, 17, '2023-02-05', 100, 'Approved by architect'),
    (25, 20, '2023-03-10', 0, 'Not started yet'),
    (26, 21, '2023-01-05', 100, 'Tested with actual devices'),
    (27, 22, '2023-02-20', 60, 'Charts implementation in progress'),
    (28, 24, '2023-03-20', 0, 'Project on hold'),
    (29, 27, '2023-04-25', 40, 'Training model with sample data');

    select * from Tasks;
    INSERT INTO UserSkills (UserId, TechnologyId, ProficiencyLevel, YearsOfExperience, IsCertified)
VALUES
    (3, 1, 5, 4, 1),
    (3, 5, 4, 3, 1),
    (4, 2, 5, 5, 1),
    (4, 6, 4, 4, 0),
    (5, 1, 4, 3, 1),
    (5, 2, 4, 3, 0),
    (5, 3, 3, 2, 0),
    (7, 1, 5, 4, 1),
    (7, 5, 4, 3, 1),
    (8, 3, 5, 5, 1),
    (8, 6, 4, 4, 1),
    (9, 2, 4, 3, 0),
    (9, 4, 5, 4, 1),
    (10, 1, 4, 3, 1),
    (10, 5, 3, 2, 0);

    INSERT INTO Meetings (Title, Description, ProjectId, ScheduledDate, DurationMinutes, MeetingLink, Status, OrganizerId)
VALUES
    ('E-Commerce Kickoff', 'Initial project kickoff meeting', 1, '2023-01-25 10:00:00', 60, 'https://meet.company.com/kickoff', 'Completed', 2),
    ('Sprint Planning', 'Sprint 2 planning session', 1, '2023-03-01 09:30:00', 90, 'https://meet.company.com/sprint2', 'Completed', 2),
    ('Healthcare Requirements', 'Client requirements gathering', 2, '2023-03-20 14:00:00', 120, 'https://meet.company.com/health-req', 'Scheduled', 6),
    ('IoT Demo', 'Demonstration of current progress', 3, '2023-04-15 11:00:00', 60, 'https://meet.company.com/iot-demo', 'Completed', 2),
    ('AI Chatbot Review', 'Monthly progress review', 5, '2023-06-20 13:00:00', 60, 'https://meet.company.com/ai-review', 'Scheduled', 2);


    INSERT INTO MeetingAttendees (MeetingId, UserId, HasAttended)
VALUES
    (1, 1, 1),
    (1, 2, 1),
    (1, 3, 1),
    (1, 4, 1),
    (1, 5, 1),
    (2, 2, 1),
    (2, 3, 1),
    (2, 4, 1),
    (2, 5, 1),
    (3, 1, 0),
    (3, 6, 0),
    (3, 7, 0),
    (3, 8, 0),
    (4, 1, 1),
    (4, 2, 1),
    (4, 3, 1),
    (4, 9, 1),
    (4, 10, 1),
    (5, 2, 0),
    (5, 7, 0),
    (5, 8, 0);

    INSERT INTO ProjectDocuments (ProjectId, Title, FilePath, FileType, UploadedById, UploadedAt, Description, Version)
VALUES
    (1, 'Requirements Document', '/docs/ecommerce/requirements_v1.pdf', 'PDF', 2, '2023-01-18', 'Initial requirements gathered from client', 1),
    (1, 'Database Schema', '/docs/ecommerce/db_schema_v2.pdf', 'PDF', 5, '2023-02-05', 'Final database schema design', 2),
    (2, 'Wireframes', '/docs/healthcare/wireframes_v1.pptx', 'PPTX', 6, '2023-03-10', 'UI wireframes for patient portal', 1),
    (3, 'Architecture Diagram', '/docs/iot/architecture_v1.png', 'PNG', 2, '2023-01-05', 'System architecture overview', 1),
    (5, 'NLP Research', '/docs/ai/nlp_research_v1.docx', 'DOCX', 7, '2023-04-25', 'Research on intent recognition algorithms', 1);

    INSERT INTO ActivityLogs (UserId, ProjectId, Action, Description, Timestamp, IpAddress)
VALUES
    (2, 1, 'Create', 'Created new project E-Commerce Platform', '2023-01-15 09:15:22', '192.168.1.100'),
    (3, 1, 'Update', 'Completed Product Listing Page task', '2023-02-16 14:30:45', '192.168.1.105'),
    (4, 1, 'Comment', 'Added comment to User Authentication task', '2023-03-10 11:20:33', '192.168.1.106'),
    (6, 2, 'Create', 'Created new project Healthcare Portal', '2023-02-10 10:05:18', '192.168.1.102'),
    (9, 3, 'Upload', 'Uploaded device integration test results', '2023-02-12 16:45:29', '192.168.1.109'),
    (7, 5, 'Update', 'Started work on Intent Recognition task', '2023-05-02 09:10:15', '192.168.1.107'),
    (1, NULL, 'Login', 'User logged in', '2023-06-15 08:30:00', '192.168.1.101'),
    (2, 1, 'Meeting', 'Conducted sprint planning meeting', '2023-03-01 09:30:00', '192.168.1.100');

    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Projects';
    ALTER TABLE Projects ADD DeadlineDate DATETIME NULL;
    Select * from Projects;
