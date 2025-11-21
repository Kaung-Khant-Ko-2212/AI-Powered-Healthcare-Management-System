-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: ezdatabase
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('CANCELLED','CONFIRMED','PENDING') DEFAULT NULL,
  `clinic_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `fk_clinic` (`clinic_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`),
  CONSTRAINT `chk_location` CHECK ((((`hospital_id` is null) and (`clinic_id` is not null)) or ((`hospital_id` is not null) and (`clinic_id` is null))))
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (96,8,2,1,'2025-03-25','10:00:00','2025-02-18 17:57:00','CANCELLED',NULL),(98,9,2,NULL,'2025-02-26','13:00:00','2025-02-19 15:58:21','CONFIRMED',1),(100,9,1,NULL,'2025-02-24','13:00:00','2025-02-19 16:09:30','CONFIRMED',1),(101,10,1,NULL,'2025-02-24','09:00:00','2025-02-21 17:59:53','CONFIRMED',1),(106,10,1,NULL,'2025-03-17','09:00:00','2025-02-24 18:54:17','CONFIRMED',1),(107,10,1,NULL,'2025-03-03','09:00:00','2025-02-24 18:57:26','CONFIRMED',1),(108,10,2,1,'2025-03-11','08:00:00','2025-02-25 01:32:41','CANCELLED',NULL),(109,10,2,1,'2025-03-25','09:00:00','2025-02-25 02:03:24','CANCELLED',NULL),(110,10,3,2,'2025-03-12','10:00:00','2025-02-25 02:29:06','CANCELLED',NULL),(111,8,3,2,'2025-03-12','12:00:00','2025-02-25 02:30:13','CANCELLED',NULL),(112,8,3,2,'2025-03-19','11:00:00','2025-02-25 02:33:25','CANCELLED',NULL),(113,11,3,2,'2025-03-19','11:00:00','2025-02-25 02:34:04','CANCELLED',NULL),(114,8,2,NULL,'2025-02-26','09:00:00','2025-02-25 02:38:25','CONFIRMED',1),(115,10,2,NULL,'2025-02-26','09:00:00','2025-02-25 13:30:42','CONFIRMED',1),(116,10,1,NULL,'2025-03-24','16:00:00','2025-02-25 13:36:44','CANCELLED',1),(117,10,1,NULL,'2025-03-31','10:00:00','2025-02-25 14:03:19','CANCELLED',1),(118,8,1,NULL,'2025-03-31','14:00:00','2025-02-25 14:05:43','PENDING',1),(119,8,1,NULL,'2025-04-07','09:00:00','2025-02-25 14:32:11','CANCELLED',1),(120,10,1,NULL,'2025-04-14','09:00:00','2025-02-25 14:33:02','CONFIRMED',1),(121,10,1,NULL,'2025-04-28','15:00:00','2025-02-25 14:33:47','CONFIRMED',1),(122,10,1,NULL,'2025-04-21','14:00:00','2025-02-25 14:47:54','CANCELLED',1),(123,10,1,NULL,'2025-03-10','13:00:00','2025-02-25 18:28:52','PENDING',1),(124,10,1,NULL,'2025-04-14','11:00:00','2025-02-25 19:27:56','PENDING',1),(125,8,1,NULL,'2025-04-14','14:00:00','2025-02-25 19:35:11','PENDING',1),(126,11,1,NULL,'2025-04-14','14:00:00','2025-02-25 19:35:50','PENDING',1),(127,9,1,NULL,'2025-04-14','14:00:00','2025-02-25 19:36:35','PENDING',1),(128,5,1,NULL,'2025-04-14','14:00:00','2025-02-25 19:37:00','PENDING',1),(129,4,1,NULL,'2025-04-14','14:00:00','2025-02-25 19:37:26','PENDING',1),(130,4,1,NULL,'2025-04-14','13:00:00','2025-02-25 19:39:38','PENDING',1),(131,4,1,NULL,'2025-04-14','15:00:00','2025-02-25 19:39:41','PENDING',1),(132,2,1,NULL,'2025-04-14','13:00:00','2025-02-25 20:05:15','PENDING',1),(133,8,1,NULL,'2025-04-14','13:00:00','2025-02-25 20:05:49','PENDING',1);
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Fruits'),(2,'Vegetables'),(3,'Fast Food'),(4,'Main Dishes & Meals'),(5,'Drinks');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinics`
--

DROP TABLE IF EXISTS `clinics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinics`
--

LOCK TABLES `clinics` WRITE;
/*!40000 ALTER TABLE `clinics` DISABLE KEYS */;
INSERT INTO `clinics` VALUES (1,'Green Valley Clinic','456 Wellness Ave, Townsville',23.456789,87.654321,'green_valley_clinic.jpg'),(2,'Riverside Clinic','789 Care Blvd, Villageville',34.56789,76.54321,'riverside_clinic.jpg'),(3,'Mountain View Clinic','101 Healthy Way, Countryside',45.678901,65.432109,'mountain_view_clinic.jpg');
/*!40000 ALTER TABLE `clinics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_clinics`
--

DROP TABLE IF EXISTS `doctor_clinics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_clinics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int DEFAULT NULL,
  `clinic_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `clinic_id` (`clinic_id`),
  CONSTRAINT `doctor_clinics_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `doctor_clinics_ibfk_2` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_clinics`
--

LOCK TABLES `doctor_clinics` WRITE;
/*!40000 ALTER TABLE `doctor_clinics` DISABLE KEYS */;
INSERT INTO `doctor_clinics` VALUES (2,1,1),(3,2,1);
/*!40000 ALTER TABLE `doctor_clinics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_date_lock_requests`
--

DROP TABLE IF EXISTS `doctor_date_lock_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_date_lock_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `doctor_id` bigint NOT NULL,
  `requested_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_date_lock_requests`
--

LOCK TABLES `doctor_date_lock_requests` WRITE;
/*!40000 ALTER TABLE `doctor_date_lock_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctor_date_lock_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_hospitals`
--

DROP TABLE IF EXISTS `doctor_hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_hospitals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `hospital_id` (`hospital_id`),
  CONSTRAINT `doctor_hospitals_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `doctor_hospitals_ibfk_2` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_hospitals`
--

LOCK TABLES `doctor_hospitals` WRITE;
/*!40000 ALTER TABLE `doctor_hospitals` DISABLE KEYS */;
INSERT INTO `doctor_hospitals` VALUES (1,1,1),(2,2,1),(3,3,2),(4,4,2),(5,5,3),(6,1,2),(7,1,3),(8,2,3);
/*!40000 ALTER TABLE `doctor_hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_schedule`
--

DROP TABLE IF EXISTS `doctor_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_schedule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `doctor_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `day_of_week` enum('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY') DEFAULT NULL,
  `clinic_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `fk_doctor_schedule_clinic` (`clinic_id`),
  CONSTRAINT `doctor_schedule_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `doctor_schedule_ibfk_2` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_doctor_schedule_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_schedule`
--

LOCK TABLES `doctor_schedule` WRITE;
/*!40000 ALTER TABLE `doctor_schedule` DISABLE KEYS */;
INSERT INTO `doctor_schedule` VALUES (21,2,1,'08:00:00','16:00:00','2025-02-16 03:40:00','TUESDAY',NULL),(22,3,1,'10:00:00','18:00:00','2025-02-16 03:50:00','WEDNESDAY',NULL),(24,2,3,'09:00:00','13:00:00','2025-02-16 21:02:00','TUESDAY',NULL),(25,3,2,'10:00:00','14:00:00','2025-02-16 21:02:00','WEDNESDAY',NULL),(26,1,NULL,'09:00:00','17:00:00','2025-02-17 11:06:48','MONDAY',1),(27,2,NULL,'09:00:00','17:00:00','2025-02-19 15:55:50','WEDNESDAY',1);
/*!40000 ALTER TABLE `doctor_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `degree` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) DEFAULT NULL,
  `specialty_id` int DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_specialty` (`specialty_id`),
  CONSTRAINT `fk_specialty` FOREIGN KEY (`specialty_id`) REFERENCES `specialties` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'Dr. John Doe','1234567890','johndoe@example.com','MD','10 years','2025-02-11 06:40:22','john_doe.jpg',1,'$2a$10$0GonzIEfeqbmFfuTsxnD5Oe/YJsYIS5KpNRBMYO/o1XLPaZYTfOrK'),(2,'Dr. Alice Smith','9876543210','alice.smith@example.com','MBBS, MS','8 years','2025-02-11 06:40:22','alice_smith.jpg',2,'$2a$10$JYFgKQKlvD9mI9azTpLT.eFbIYpHn7PlZt.k7wMS5QwJc0pICjx.e'),(3,'Dr. Michael Brown','5551234567','michael.brown@example.com','MBBS','5 years','2025-02-11 06:40:22','michael_brown.jpg',3,'$2a$10$5JScIHy4M1qzPik2RdF1Uu7fTgHk3n2uG96nBLorBQjQn.zlf10WS'),(4,'Dr. Emma White','4445556666','emma.white@example.com','MD, DM','12 years','2025-02-11 06:40:22','emma_white.jpg',4,'$2a$10$K7QhF5D/s.CE6aS39nM0Kuy9g6tM4G.RIMiYxX4m7grzqgVm1PzGq'),(5,'Dr. Daniel Lee','7778889999','daniel.lee@example.com','MBBS, MD','7 years','2025-02-11 06:40:22','daniel_lee.jpg',5,'$2a$10$h6C0iImN97qPz/A2OHKfVuw7DCmFW7K.w/F38Cbujn2VC89D8zK7S'),(10,'Dr. Su Su','123-456-7890','susu@example.com','MD','10 years','2025-02-26 06:26:54','susu.jpg',1,'asdfg12345');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_doctors`
--

DROP TABLE IF EXISTS `favorite_doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_doctors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `doctor_id` int DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `favorite_doctors_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  CONSTRAINT `favorite_doctors_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_doctors`
--

LOCK TABLES `favorite_doctors` WRITE;
/*!40000 ALTER TABLE `favorite_doctors` DISABLE KEYS */;
INSERT INTO `favorite_doctors` VALUES (2,2,1),(3,3,1),(5,2,4),(8,1,5),(9,2,5),(10,1,11);
/*!40000 ALTER TABLE `favorite_doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(500) NOT NULL,
  `calories` int NOT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkomdx99dhk2cveaxugl2lws2u` (`category_id`),
  CONSTRAINT `FKkomdx99dhk2cveaxugl2lws2u` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `food_ibfk_1` FOREIGN KEY (`id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
INSERT INTO `food` VALUES (1,'Apple','apple.jpg',95,NULL);
/*!40000 ALTER TABLE `food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `open_hours` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` VALUES (1,'City General Hospital','123 Main St, Cityville',98.12345678,16.78901234,'city_hospital.jpg',NULL,NULL,NULL),(2,'Sunrise Medical Center','456 Elm St, Townsville',97.65432109,15.67890123,'sunrise_medical.jpg',NULL,NULL,NULL),(3,'Greenfield Hospital','789 Oak Ave, Greenfield',96.54321098,14.56789012,'greenfield_hospital.jpg',NULL,NULL,NULL),(4,'Riverbend Clinic','101 River Rd, Rivertown',95.43210987,13.45678901,'riverbend_clinic.jpg',NULL,NULL,NULL),(5,'MetroCare Hospital','202 Metro St, Metropolis',94.32109876,12.3456789,'metrocare_hospital.jpg',NULL,NULL,NULL);
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `appointment_id` bigint NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `appointment_id` (`appointment_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (52,8,96,'Appointment Confirmed!','confirmed','2025-02-18 17:58:16',1),(63,9,98,'','confirmed','2025-02-24 18:53:28',0),(64,9,100,'','confirmed','2025-02-24 18:53:30',0),(65,10,106,'','confirmed','2025-02-24 18:54:45',1),(66,10,107,'Appointment Confirmed at Clinic!','confirmed','2025-02-24 18:57:43',1),(67,10,108,'Your appointment with Dr. Dr. Alice Smith on 2025-03-11 has been canceled. Click here to reschedule: http://localhost:3000/doctor/2','cancelled','2025-02-25 01:54:02',1),(68,10,108,'Your appointment with Dr. Dr. Alice Smith on 2025-03-11 has been canceled. Click here to reschedule: http://localhost:3000/doctor/2','cancelled','2025-02-25 01:54:16',1),(69,10,101,'Your appointment with Dr. Dr. John Doe on 2025-02-24 has been confirmed.','confirmed','2025-02-25 02:00:33',1),(70,8,96,'Your appointment with Dr. Dr. Alice Smith on 2025-03-25 has been canceled. Click here to reschedule: http://localhost:3000/doctor/2','cancelled','2025-02-25 02:04:09',1),(71,10,109,'Your appointment with Dr. Dr. Alice Smith on 2025-03-25 has been canceled. Click here to reschedule: http://localhost:3000/doctor/2','cancelled','2025-02-25 02:04:09',1),(72,10,110,'Your appointment with Dr. Dr. Michael Brown on 2025-03-12 has been canceled. Click here to reschedule: http://localhost:3000/doctor/3','cancelled','2025-02-25 02:30:45',1),(73,8,111,'Your appointment with Dr. Dr. Michael Brown on 2025-03-12 has been canceled. Click here to reschedule: http://localhost:3000/doctor/3','cancelled','2025-02-25 02:30:45',1),(74,8,112,'Your appointment with Dr. Dr. Michael Brown on 2025-03-19 has been canceled. Click here to reschedule: http://localhost:3000/doctor/3','cancelled','2025-02-25 02:34:40',1),(75,11,113,'Your appointment with Dr. Dr. Michael Brown on 2025-03-19 has been canceled. Click here to reschedule: http://localhost:3000/doctor/3','cancelled','2025-02-25 02:34:40',1),(76,8,114,'Your appointment with Dr. Dr. Alice Smith on 2025-02-26 has been confirmed.','confirmed','2025-02-25 02:38:43',1),(77,10,116,'Your appointment with Dr. Dr. John Doe on 2025-03-24 has been canceled. Click here to reschedule: http://localhost:3000/doctor/1','cancelled','2025-02-25 13:37:45',1),(78,10,117,'Your appointment with Dr. Dr. John Doe on 2025-03-31 has been canceled. Click here to reschedule: http://localhost:3000/doctor/1','cancelled','2025-02-25 14:04:25',1),(79,8,119,'Your appointment with Dr. Dr. John Doe on 2025-04-07 has been confirmed.','confirmed','2025-02-25 14:32:28',1),(80,10,115,'Your appointment with Dr. Dr. Alice Smith on 2025-02-26 has been confirmed.','confirmed','2025-02-25 14:32:29',1),(81,10,120,'Your appointment with Dr. Dr. John Doe on 2025-04-14 has been confirmed.','confirmed','2025-02-25 14:33:14',1),(82,10,121,'Your appointment with Dr. Dr. John Doe on 2025-04-28 has been confirmed.','confirmed','2025-02-25 14:34:01',1),(83,10,122,'Your appointment with Dr. Dr. John Doe on 2025-04-21 has been canceled. Click here to reschedule: http://localhost:3000/doctor/1','cancelled','2025-02-25 14:48:50',1),(84,8,119,'Your appointment with Dr. Dr. John Doe on 2025-04-07 has been canceled. Click here to reschedule: http://localhost:3000/doctor/1','cancelled','2025-02-25 19:27:03',1);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_cancellation_requests`
--

DROP TABLE IF EXISTS `schedule_cancellation_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule_cancellation_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reason` varchar(255) NOT NULL,
  `request_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `doctor_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_cancellation_requests`
--

LOCK TABLES `schedule_cancellation_requests` WRITE;
/*!40000 ALTER TABLE `schedule_cancellation_requests` DISABLE KEYS */;
INSERT INTO `schedule_cancellation_requests` VALUES (1,'Personal reasons','2025-03-10','Approved',1),(2,'Medical Emergency','2025-02-25','Approved',1),(3,'Personal reasons','2025-03-03','Approved',1),(4,'Personal reasons','2025-03-10','Approved',1),(5,'Medical Emergency','2025-03-03','Approved',1),(6,'Scheduling Conflict','2025-02-25','Approved',2),(7,'Personal Illness','2025-03-10','Approved',1),(9,'Personal Illness','2025-03-17','Approved',1),(10,'Personal Illness','2025-03-03','Approved',2),(11,'Personal Illness','2025-03-11','Approved',2),(12,'Personal Illness','2025-03-25','Approved',2),(13,'Travel/Out of Town','2025-03-12','Approved',3),(14,'Travel/Out of Town','2025-03-19','Approved',3),(15,'Personal Illness','2025-02-26','Approved',1),(16,'Unexpected Surgery','2025-03-24','Approved',1),(17,'Travel/Out of Town','2025-03-31','Approved',1),(18,'Personal Illness','2025-04-21','Approved',1),(19,'Travel/Out of Town','2025-04-07','Approved',1),(20,'Personal Illness','2025-03-05','Approved',2),(21,'Personal Illness','2025-03-12','Approved',2);
/*!40000 ALTER TABLE `schedule_cancellation_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialties`
--

DROP TABLE IF EXISTS `specialties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialties`
--

LOCK TABLES `specialties` WRITE;
/*!40000 ALTER TABLE `specialties` DISABLE KEYS */;
INSERT INTO `specialties` VALUES (1,'Cardiology','lung.png'),(2,'Dermatology','skin.png'),(3,'Dentition','teeth.png'),(4,'Neurology','brain.png'),(5,'Ophthalmology','eye.png'),(6,'Pulmonology','lung.png'),(7,'Nephrology','kidney.png'),(8,'Radiology','xray.png'),(9,'Gynecology','gyno.png'),(10,'Oncology','cancer.png'),(11,'Surgery','surgeon.png'),(12,'Orthopedics','bone.png'),(13,'Psychiatry','mind.png'),(14,'Pediatrics','kids.png');
/*!40000 ALTER TABLE `specialties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL DEFAULT 'Unknown',
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  CONSTRAINT `users_chk_1` CHECK ((`gender` in (_utf8mb4'Male',_utf8mb4'Female',_utf8mb4'Other')))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Unknown','susu','tianasu693@gmail.com','$2a$10$Jpbw3iWYEetPU22imjQe.uaFkFCld7wxsd9dsFAjj5uJ2z1gX5zq6',21,'female','Su Wai Wai Tun',NULL,NULL,NULL),(2,'Unknown','tiana','susu@gmail.com','$2a$10$T5V1INd7R/yn2Q.i1IJKiOsZwPdjvwhjWFbgOoKERqEtwIn3TBrB6',21,'female','Su Wai Wai Tun',NULL,NULL,NULL),(4,'Unknown','aa','aa@gmail.com','$2a$10$oShgRceVygBMBM9hmNWtIOuaKrrvFK2vXoBg42hOGB1Kp2njqbH16',21,'male','abc',NULL,NULL,NULL),(5,'Unknown','swwt','swwt@gmail.com','$2a$10$7OU/R4bPoHvsX0OE4C66AOwDKSmaglcLRE448ruTvtunxjpygZz3a',21,'female','Su Wai Wai Tun',NULL,NULL,NULL),(8,'Unknown','thiri','thiri@gmail.com','$2a$10$WzLp4y4xxqokuCbpbXtHMuNiMmBRa0NyhWR32fwhJjzTZl55XHYWS',21,'female','Myat Thiri Kyaw',NULL,NULL,NULL),(9,'Unknown','sss','ss@gmail.com','$2a$10$iJTq/.Ixk2mTB2KOzhla/.u0eJUQgnLO9c463AxEq7cvQydxZz4l.',21,'female','Su Wai Wai Tun',NULL,NULL,NULL),(10,'Unknown','kkkk','k@gmail.com','$2a$10$ZcodfjCTOZhr9Muo1xMMIOPA3UJNJSPegUl1XFxp9aboQTSY9j3JW',21,'female','kaung khant ko',NULL,NULL,NULL),(11,'Unknown','aas','aaaa@gmail.com','$2a$10$EStCcM7DkTZ6jRNbt0ViqeNMq4yBzSVvTpXBcfwufo2LdtwYAyidy',21,'female','asd',NULL,NULL,NULL),(12,'Unknown','kkk','kkk@gmail.com','$2a$10$0GonzIEfeqbmFfuTsxnD5Oe/YJsYIS5KpNRBMYO/o1XLPaZYTfOrK',21,'male','kaung khant ko',NULL,NULL,NULL),(13,'Unknown','b','b@gmail.com','$2a$10$EnVITG//8xt/eFABGfRmXOuA1Kt4ClrlCE4A2J8q/OLFZrP.F0cNu',22,'female','b',NULL,NULL,NULL),(14,'Unknown','testuser','test@example.com','$2a$10$EAsy1pXN0A1a/KpS0Foyt.LgIggXueMZ4kPLoJbzPBzPjCwevf7qe',20,'male','Test User',NULL,NULL,'/profile-images/user_14_1740730830317.jpg'),(15,'Unknown','kkk2','kkk2@gmail.com','$2a$10$.OdaSJM9wl1cY7/czHlpv.4M0G1FgCT6t2DLg3tMUdhpPMVf18VUW',21,'male','kaung khant ko',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-28 20:17:56
