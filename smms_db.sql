-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2026 at 08:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smms_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `StaffID` varchar(20) NOT NULL,
  `StaffName` varchar(100) NOT NULL,
  `MobileNo` varchar(15) DEFAULT NULL,
  `EmailAddress` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Created` timestamp NOT NULL DEFAULT current_timestamp(),
  `Modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`StaffID`, `StaffName`, `MobileNo`, `EmailAddress`, `Password`, `Description`, `Created`, `Modified`) VALUES
('ADMIN001', 'Admin', '9000000001', 'admin@darshan.ac.in', 'admin123', 'System Administrator', '2026-03-18 17:40:37', '2026-03-19 05:23:21'),
('STAFF001', 'Mentor', '9000000002', 'mentor@darshan.ac.in', 'mentor123', 'CSE', '2026-03-18 17:40:37', '2026-03-19 05:28:26'),
('STAFF002', 'Dharmik Sir', '', 'dharmik@darshan.ac.in', 'dharmik', 'CSE', '2026-03-19 02:56:36', '2026-03-19 05:27:40'),
('STAFF003', 'Vishal Sir', '', 'vishal@darshan.ac.in', 'vishal', 'CSE', '2026-03-19 03:35:13', '2026-03-19 05:27:47'),
('STAFF004', 'Dhwanik Zala', '9825498605', 'dhwamik@darshan.ac.in', 'dhwamik', 'MATHS', '2026-03-20 03:21:30', '2026-03-20 03:21:30'),
('STAFF006', 'mihir', '', 'mihir@darshan.ac.in', 'mihir', 'CSE', '2026-03-20 05:33:42', '2026-03-20 05:33:42');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `StudentID` int(11) NOT NULL,
  `StudentName` varchar(100) NOT NULL,
  `EnrollmentNo` varchar(20) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `MobileNo` varchar(15) DEFAULT NULL,
  `EmailAddress` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Created` timestamp NOT NULL DEFAULT current_timestamp(),
  `Modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`StudentID`, `StudentName`, `EnrollmentNo`, `Password`, `MobileNo`, `EmailAddress`, `Description`, `Created`, `Modified`) VALUES
(1, 'Student', '24010101333', 'student123', '9000000003', 'student@darshan.ac.in', 'CSE', '2026-03-18 17:40:37', '2026-03-19 06:56:05'),
(2, 'Rakshit', '24010101071', 'rakshit', '', 'rakshit@gmail.com', 'CSE', '2026-03-18 17:51:43', '2026-03-19 06:56:07'),
(4, 'Ruchit', '24010101091', 'ruchit', '', 'ruchit@darshan.ac.in', 'CSE', '2026-03-19 02:55:39', '2026-03-19 06:56:10'),
(5, 'Soham Joshi', '24010101113', 'soham', '', 'soham@darshan.ac.in', 'CSE', '2026-03-19 13:52:55', '2026-03-19 13:52:55'),
(6, 'Kahan', '24010101111', 'kahan', '9409681405', 'kahan@darshan.ac.in', 'CSE', '2026-03-20 03:18:37', '2026-03-20 03:18:37'),
(7, 'V-Vidit', '24010101001', 'vidit', '6969696969', 'vidit@darshan.ac.in', 'CSE', '2026-03-20 04:28:38', '2026-03-20 04:28:38'),
(8, 'Manas', '24010101002', 'manas', '9999955555', 'manas@darshan.ac.in', 'CSE', '2026-03-20 05:13:07', '2026-03-20 05:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `studentmentor`
--

CREATE TABLE `studentmentor` (
  `StudentMentorID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL,
  `StaffID` varchar(20) NOT NULL,
  `FromDate` date NOT NULL,
  `ToDate` date DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Created` timestamp NOT NULL DEFAULT current_timestamp(),
  `Modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentmentor`
--

INSERT INTO `studentmentor` (`StudentMentorID`, `StudentID`, `StaffID`, `FromDate`, `ToDate`, `Description`, `Created`, `Modified`) VALUES
(11, 2, 'STAFF002', '2026-03-19', NULL, NULL, '2026-03-19 13:08:07', '2026-03-19 13:08:07'),
(12, 1, 'STAFF001', '2026-03-19', NULL, NULL, '2026-03-19 13:11:30', '2026-03-19 13:11:30'),
(13, 4, 'STAFF002', '2026-03-19', NULL, NULL, '2026-03-19 13:53:03', '2026-03-19 13:53:03'),
(14, 5, 'STAFF002', '2026-03-19', NULL, NULL, '2026-03-19 13:55:30', '2026-03-19 13:55:30'),
(15, 6, 'STAFF004', '2026-03-20', NULL, NULL, '2026-03-20 03:24:09', '2026-03-20 03:24:09'),
(16, 7, 'STAFF003', '2026-03-20', NULL, NULL, '2026-03-20 04:29:13', '2026-03-20 04:29:13');

-- --------------------------------------------------------

--
-- Table structure for table `studentmentoring`
--

CREATE TABLE `studentmentoring` (
  `StudentMentoringID` int(11) NOT NULL,
  `StudentMentorID` int(11) NOT NULL,
  `DateOfMentoring` date NOT NULL,
  `ScheduledMeetingDate` date DEFAULT NULL,
  `NextMentoringDate` date DEFAULT NULL,
  `IssuesDiscussed` text DEFAULT NULL,
  `MentoringMeetingAgenda` text DEFAULT NULL,
  `AttendanceStatus` varchar(20) DEFAULT 'Present',
  `AbsentRemarks` text DEFAULT NULL,
  `IsParentPresent` enum('Yes','No') DEFAULT 'No',
  `ParentName` varchar(100) DEFAULT NULL,
  `ParentMobileNo` varchar(15) DEFAULT NULL,
  `StudentsOpinion` text DEFAULT NULL,
  `ParentsOpinion` text DEFAULT NULL,
  `StaffOpinion` text DEFAULT NULL,
  `StressLevel` varchar(20) DEFAULT NULL,
  `LearnerType` varchar(30) DEFAULT NULL,
  `MentoringDocument` varchar(500) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Created` timestamp NOT NULL DEFAULT current_timestamp(),
  `Modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentmentoring`
--

INSERT INTO `studentmentoring` (`StudentMentoringID`, `StudentMentorID`, `DateOfMentoring`, `ScheduledMeetingDate`, `NextMentoringDate`, `IssuesDiscussed`, `MentoringMeetingAgenda`, `AttendanceStatus`, `AbsentRemarks`, `IsParentPresent`, `ParentName`, `ParentMobileNo`, `StudentsOpinion`, `ParentsOpinion`, `StaffOpinion`, `StressLevel`, `LearnerType`, `MentoringDocument`, `Description`, `Created`, `Modified`) VALUES
(3, 11, '2026-03-20', '2026-03-21', '2026-03-22', 'Uselesss Session', 'Academic Review', 'Present', NULL, '', NULL, NULL, 'Good faculty', NULL, 'Good student', 'Medium', 'Average', NULL, 'Overall was good', '2026-03-19 13:36:05', '2026-03-19 13:36:05'),
(4, 13, '2026-03-19', '2026-03-20', '2026-03-22', NULL, 'Career Guidance', 'Absent', 'Dude was sick', '', NULL, NULL, NULL, NULL, NULL, 'Medium', 'Fast', NULL, NULL, '2026-03-19 13:56:49', '2026-03-19 13:56:49'),
(5, 15, '2026-03-20', '2026-03-20', NULL, 'Why is kahan lodu?', 'Career guidance', 'Present', NULL, '', NULL, NULL, 'Mentor is Lodu', NULL, 'We both are Lodus', 'High', 'Average', NULL, 'We like being Lodus', '2026-03-20 03:26:14', '2026-03-20 03:26:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`StaffID`),
  ADD UNIQUE KEY `EmailAddress` (`EmailAddress`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`StudentID`),
  ADD UNIQUE KEY `EnrollmentNo` (`EnrollmentNo`),
  ADD UNIQUE KEY `EmailAddress` (`EmailAddress`);

--
-- Indexes for table `studentmentor`
--
ALTER TABLE `studentmentor`
  ADD PRIMARY KEY (`StudentMentorID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `StaffID` (`StaffID`);

--
-- Indexes for table `studentmentoring`
--
ALTER TABLE `studentmentoring`
  ADD PRIMARY KEY (`StudentMentoringID`),
  ADD KEY `StudentMentorID` (`StudentMentorID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `StudentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `studentmentor`
--
ALTER TABLE `studentmentor`
  MODIFY `StudentMentorID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `studentmentoring`
--
ALTER TABLE `studentmentoring`
  MODIFY `StudentMentoringID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `studentmentor`
--
ALTER TABLE `studentmentor`
  ADD CONSTRAINT `studentmentor_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `studentmentor_ibfk_2` FOREIGN KEY (`StaffID`) REFERENCES `staff` (`StaffID`) ON DELETE CASCADE;

--
-- Constraints for table `studentmentoring`
--
ALTER TABLE `studentmentoring`
  ADD CONSTRAINT `studentmentoring_ibfk_1` FOREIGN KEY (`StudentMentorID`) REFERENCES `studentmentor` (`StudentMentorID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
