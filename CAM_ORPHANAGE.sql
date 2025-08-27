USE CAM_ORPHANAGE_CONNECT;
CREATE TABLE Orphanages (
    OrphanageID INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID for each orphanage
    Name VARCHAR(255) NOT NULL,                   -- Orphanage name (text, max 255 characters)
    Location VARCHAR(255) NOT NULL,               -- Orphanage location
    Description TEXT,                             -- Optional description of the orphanage
    Picture VARCHAR(255)                           -- Optional image path or URL
);
CREATE TABLE Needs (
    NeedID INT AUTO_INCREMENT PRIMARY KEY,       -- Unique ID for each need
    OrphanageID INT,                             -- Links need to a specific orphanage
    Item VARCHAR(255) NOT NULL,                  -- Name of the needed item
    Quantity INT NOT NULL,                        -- How many items are needed
    Status VARCHAR(50) NOT NULL,                 -- Status: pending, fulfilled, etc.
    FOREIGN KEY (OrphanageID) REFERENCES Orphanages(OrphanageID) ON DELETE CASCADE
    -- If the orphanage is deleted, all its needs are deleted automatically
);
CREATE TABLE Organizations (
    OrganizationID INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID for each organization
    Name VARCHAR(255) NOT NULL,                      -- Organization name
    ContactEmail VARCHAR(255) NOT NULL UNIQUE,      -- Email, must be unique
    ContactPhone VARCHAR(50)                         -- Phone number (optional)
);
CREATE TABLE Visits (
    VisitID INT AUTO_INCREMENT PRIMARY KEY,        -- Unique ID for each visit
    OrphanageID INT,                               -- Orphanage being visited
    OrganizationID INT,                             -- Organization visiting
    VisitDate DATE NOT NULL,                        -- Date of the visit
    Notes TEXT,                                    -- Optional notes about the visit
    FOREIGN KEY (OrphanageID) REFERENCES Orphanages(OrphanageID) ON DELETE CASCADE,
    FOREIGN KEY (OrganizationID) REFERENCES Organizations(OrganizationID) ON DELETE CASCADE
    -- If the orphanage or organization is deleted, related visits are deleted
);
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,         -- Unique ID for each user
    Username VARCHAR(255) NOT NULL UNIQUE,         -- User login name
    PasswordHash VARCHAR(255) NOT NULL,           -- Password stored securely (hashed)
    Role VARCHAR(50) NOT NULL                      -- Role: admin, user, organization, etc.
);
CREATE TABLE EducationalResources (
    ResourceID INT AUTO_INCREMENT PRIMARY KEY,     -- Unique ID for each resource
    Title VARCHAR(255) NOT NULL,                   -- Resource title
    Content TEXT NOT NULL,                         -- Content of the resource
    OrphanageID INT,                               -- Optional link to orphanage
    FOREIGN KEY (OrphanageID) REFERENCES Orphanages(OrphanageID) ON DELETE CASCADE
);
CREATE TABLE AgeRanges (
    AgeRangeID INT AUTO_INCREMENT PRIMARY KEY,     -- Unique ID for age range
    MinimumAge INT NOT NULL,                       -- Minimum age
    MaximumAge INT NOT NULL,                       -- Maximum age
    OrphanageID INT,                               -- Link to orphanage
    FOREIGN KEY (OrphanageID) REFERENCES Orphanages(OrphanageID) ON DELETE CASCADE
);
CREATE TABLE Alerts (
    AlertID INT AUTO_INCREMENT PRIMARY KEY,        -- Unique ID for each alert
    Description VARCHAR(255) NOT NULL,            -- Text description of the alert
    OrphanageID INT,                               -- Optional: linked to a specific orphanage
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Automatically store creation time
    FOREIGN KEY (OrphanageID) REFERENCES Orphanages(OrphanageID) ON DELETE SET NULL
    -- If the orphanage is deleted, keep the alert but set OrphanageID to NULL
);