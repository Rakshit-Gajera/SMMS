-- ============================================================
-- SMMS - Student Mentoring Management System
-- Database Setup Script (based on official schema)
-- Run this in phpMyAdmin → SQL tab
-- ============================================================

CREATE DATABASE IF NOT EXISTS smms_db;
USE smms_db;

-- ============================================================
-- TABLE 1: Student
-- ============================================================
CREATE TABLE IF NOT EXISTS Student (
    StudentID     INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
    StudentName   VARCHAR(100)  NOT NULL,
    EnrollmentNo  VARCHAR(20)   UNIQUE NOT NULL,
    Password      VARCHAR(100)  NOT NULL,
    MobileNo      VARCHAR(15),
    EmailAddress  VARCHAR(100)  UNIQUE NOT NULL,
    Description   TEXT,
    Created       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    Modified      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 2: Staff
-- ============================================================
CREATE TABLE IF NOT EXISTS Staff (
    StaffID       VARCHAR(20)   NOT NULL PRIMARY KEY,
    StaffName     VARCHAR(100)  NOT NULL,
    MobileNo      VARCHAR(15),
    EmailAddress  VARCHAR(100)  UNIQUE NOT NULL,
    Password      VARCHAR(100)  NOT NULL,
    Description   TEXT,
    Created       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    Modified      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 3: StudentMentor
-- (maps a student to a staff/mentor for a date range)
-- ============================================================
CREATE TABLE IF NOT EXISTS StudentMentor (
    StudentMentorID  INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    StudentID        INT          NOT NULL,
    StaffID          VARCHAR(20)  NOT NULL,
    FromDate         DATE         NOT NULL,
    ToDate           DATE,                          -- NULL means ongoing
    Description      TEXT,
    Created          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    Modified         TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (StaffID)   REFERENCES Staff(StaffID)     ON DELETE CASCADE
);

-- ============================================================
-- TABLE 4: StudentMentoring
-- (individual mentoring session records)
-- ============================================================
CREATE TABLE IF NOT EXISTS StudentMentoring (
    StudentMentoringID    INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
    StudentMentorID       INT           NOT NULL,

    -- Session dates
    DateOfMentoring       DATE          NOT NULL,
    ScheduledMeetingDate  DATE,
    NextMentoringDate     DATE,

    -- Session content
    IssuesDiscussed       TEXT,
    MentoringMeetingAgenda TEXT,

    -- Attendance
    AttendanceStatus      VARCHAR(20)   DEFAULT 'Present',   -- Present / Absent
    AbsentRemarks         TEXT,                              -- reason if absent

    -- Parent info
    IsParentPresent       ENUM('Yes','No') DEFAULT 'No',
    ParentName            VARCHAR(100),
    ParentMobileNo        VARCHAR(15),

    -- Opinions / Feedback
    StudentsOpinion       TEXT,
    ParentsOpinion        TEXT,
    StaffOpinion          TEXT,

    -- Assessment
    StressLevel           VARCHAR(20),   -- Low / Medium / High
    LearnerType           VARCHAR(30),   -- Fast / Average / Advanced / etc.

    -- Document attachment (file path or URL)
    MentoringDocument     VARCHAR(500),

    -- Extra notes
    Description           TEXT,

    Created               TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    Modified              TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (StudentMentorID) REFERENCES StudentMentor(StudentMentorID) ON DELETE CASCADE
);

-- ============================================================
-- SEED DATA: Sample Accounts
-- ============================================================

-- Admin + one mentor (both go in Staff table)
INSERT INTO Staff (StaffID, StaffName, MobileNo, EmailAddress, Password, Description) VALUES
    ('ADMIN001', 'Admin', '9000000001', 'admin@darshan.ac.in',  'admin123',  'System Administrator'),
    ('STAFF001', 'Mentor',     '9000000002', 'mentor@darshan.ac.in',  'mentor123', 'Computer Science Mentor');

-- One student
INSERT INTO Student (StudentName, EnrollmentNo, Password, MobileNo, EmailAddress, Description) VALUES
    ('Student', '22CS001', 'student123', '9000000003', 'student@darshan.ac.in', 'CS Student');

-- Assign Arjun as Soham's mentor
INSERT INTO StudentMentor (StudentID, StaffID, FromDate) VALUES
    (1, 'STAFF001', '2024-01-01');

-- Sample mentoring session
INSERT INTO StudentMentoring (
    StudentMentorID, DateOfMentoring, ScheduledMeetingDate,
    IssuesDiscussed, MentoringMeetingAgenda,
    AttendanceStatus, IsParentPresent,
    StudentsOpinion, StaffOpinion,
    StressLevel, LearnerType
) VALUES (
    1, '2024-02-10', '2024-02-10',
    'Academic performance review', 'Discuss semester results and goals',
    'Present', 'No',
    'Session was very helpful', 'Student is progressing well',
    'Low', 'Average'
);

-- ============================================================
-- Done! 4 tables created, sample data inserted.
-- Login credentials:
--   Admin:   admin@darshan.ac.in  / admin123
--   Mentor:  arjun@darshan.ac.in  / mentor123
--   Student: soham@darshan.ac.in  / student123
-- ============================================================
