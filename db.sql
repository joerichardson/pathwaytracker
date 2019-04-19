-- MySQL dump 10.13  Distrib 8.0.15, for Win64 (x86_64)
--
-- Host: localhost    Database: student
-- ------------------------------------------------------
-- Server version	8.0.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `courses` (
  `CourseId` int(11) NOT NULL AUTO_INCREMENT,
  `CourseName` varchar(45) NOT NULL,
  `CourseCode` varchar(45) NOT NULL,
  `CreditHours` int(11) NOT NULL,
  PRIMARY KEY (`CourseId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pathwaycourses`
--

DROP TABLE IF EXISTS `pathwaycourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `pathwaycourses` (
  `PathwayCourseId` int(11) NOT NULL AUTO_INCREMENT,
  `PathwayId` int(11) NOT NULL,
  `CourseId` int(11) NOT NULL,
  `Required` bit(1) NOT NULL,
  `CourseOrder` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`PathwayCourseId`),
  KEY `PathwayId_idx` (`PathwayId`),
  KEY `CourseId_idx` (`CourseId`),
  CONSTRAINT `fk_PathwayCourses_Courses_CourseId` FOREIGN KEY (`CourseId`) REFERENCES `courses` (`courseid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_PathwayCourses_Pathway_PathwayId` FOREIGN KEY (`PathwayId`) REFERENCES `pathways` (`pathwayid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pathwaycourses`
--

LOCK TABLES `pathwaycourses` WRITE;
/*!40000 ALTER TABLE `pathwaycourses` DISABLE KEYS */;
/*!40000 ALTER TABLE `pathwaycourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pathways`
--

DROP TABLE IF EXISTS `pathways`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `pathways` (
  `PathwayId` int(11) NOT NULL AUTO_INCREMENT,
  `PathwayName` varchar(45) NOT NULL,
  `CreditHours` int(11) NOT NULL,
  PRIMARY KEY (`PathwayId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pathways`
--

LOCK TABLES `pathways` WRITE;
/*!40000 ALTER TABLE `pathways` DISABLE KEYS */;
/*!40000 ALTER TABLE `pathways` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prerequisites`
--

DROP TABLE IF EXISTS `prerequisites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `prerequisites` (
  `PrerequisiteId` int(11) NOT NULL AUTO_INCREMENT,
  `CourseId` int(11) NOT NULL,
  `PrerequisiteCourseId` int(11) NOT NULL,
  PRIMARY KEY (`PrerequisiteId`),
  KEY `PrerequisiteCourseId_idx` (`PrerequisiteCourseId`),
  KEY `CourseId_idx` (`CourseId`),
  CONSTRAINT `fk_Prerequisites_Courses_CourseId` FOREIGN KEY (`CourseId`) REFERENCES `courses` (`courseid`),
  CONSTRAINT `fk_Prerequisities_Courses_PrerequisiteCourseId` FOREIGN KEY (`PrerequisiteCourseId`) REFERENCES `courses` (`courseid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prerequisites`
--

LOCK TABLES `prerequisites` WRITE;
/*!40000 ALTER TABLE `prerequisites` DISABLE KEYS */;
/*!40000 ALTER TABLE `prerequisites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentcourses`
--

DROP TABLE IF EXISTS `studentcourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `studentcourses` (
  `StudentCourseId` int(11) NOT NULL AUTO_INCREMENT,
  `StudentId` int(11) NOT NULL,
  `CourseId` int(11) NOT NULL,
  `Passed` bit(1) NOT NULL,
  `Semester` varchar(45) NOT NULL,
  `Year` int(11) NOT NULL DEFAULT '0',
  `Status` varchar(45) NOT NULL,
  PRIMARY KEY (`StudentCourseId`),
  KEY `StudentId_idx` (`StudentId`),
  KEY `CourseId_idx` (`CourseId`),
  CONSTRAINT `fk_StudentCourse_Courses_CourseId` FOREIGN KEY (`CourseId`) REFERENCES `courses` (`courseid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_StudentCourses_Students_StudentId` FOREIGN KEY (`StudentId`) REFERENCES `students` (`studentid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentcourses`
--

LOCK TABLES `studentcourses` WRITE;
/*!40000 ALTER TABLE `studentcourses` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentcourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentpathways`
--

DROP TABLE IF EXISTS `studentpathways`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `studentpathways` (
  `StudentPathwayId` int(11) NOT NULL AUTO_INCREMENT,
  `StudentId` int(11) NOT NULL,
  `PathwayId` int(11) NOT NULL,
  PRIMARY KEY (`StudentPathwayId`),
  KEY `StudentId_idx` (`StudentId`),
  KEY `PathwayId_idx` (`PathwayId`),
  CONSTRAINT `fk_StudentPathways_Pathways_PathwayId` FOREIGN KEY (`PathwayId`) REFERENCES `pathways` (`pathwayid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_StudentPathways_Students_StudentId` FOREIGN KEY (`StudentId`) REFERENCES `students` (`studentid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentpathways`
--

LOCK TABLES `studentpathways` WRITE;
/*!40000 ALTER TABLE `studentpathways` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentpathways` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `students` (
  `StudentId` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(45) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  `StudentPid` varchar(45) NOT NULL,
  PRIMARY KEY (`StudentId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `substitutions`
--

DROP TABLE IF EXISTS `substitutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `substitutions` (
  `SubstitutionId` int(11) NOT NULL AUTO_INCREMENT,
  `StudentId` int(11) NOT NULL,
  `TakenCourseId` int(11) NOT NULL,
  `SubstituteCourseId` int(11) NOT NULL,
  `PathwayId` int(11) NOT NULL,
  PRIMARY KEY (`SubstitutionId`),
  KEY `StudentId_idx` (`StudentId`),
  KEY `CourseId_idx` (`TakenCourseId`),
  KEY `SubstituteCourseId_idx` (`SubstituteCourseId`),
  KEY `PathwayId_idx` (`PathwayId`),
  CONSTRAINT `fk_Substitutions_Courses_CourseId` FOREIGN KEY (`TakenCourseId`) REFERENCES `courses` (`courseid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Substitutions_Courses_SubstituteCourseId` FOREIGN KEY (`SubstituteCourseId`) REFERENCES `courses` (`courseid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Substitutions_Pathways_PathwayId` FOREIGN KEY (`PathwayId`) REFERENCES `pathways` (`pathwayid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Substitutions_Students_StudentId` FOREIGN KEY (`StudentId`) REFERENCES `students` (`studentid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `substitutions`
--

LOCK TABLES `substitutions` WRITE;
/*!40000 ALTER TABLE `substitutions` DISABLE KEYS */;
/*!40000 ALTER TABLE `substitutions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-18 20:55:18
