-- MediCare database
-- Run once:  mysql -u root -p < db.sql
-- (or paste it into MySQL Workbench and run it)

CREATE DATABASE IF NOT EXISTS medicare_db;
USE medicare_db;

-- 1. Patients
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(20) UNIQUE,
    patient_name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    `condition` VARCHAR(255),
    doctor VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doctors (doctor_name is unique because other tables refer to doctors by name)
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(100) NOT NULL UNIQUE,
    specialization VARCHAR(100),
    department VARCHAR(100),
    experience INT DEFAULT 0,
    availability VARCHAR(30) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id VARCHAR(20) UNIQUE,
    patient_name VARCHAR(100) NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Medicines
CREATE TABLE IF NOT EXISTS medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_id VARCHAR(20) UNIQUE,
    medicine_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    quantity INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    expiry_date DATE,
    supplier VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bills
CREATE TABLE IF NOT EXISTS bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id VARCHAR(20) UNIQUE,
    patient_name VARCHAR(100) NOT NULL,
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    medicine_cost DECIMAL(10,2) DEFAULT 0,
    test_cost DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(30) DEFAULT 'Pending',
    bill_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- Sample data (safe to run again; duplicates are ignored) ----------

INSERT IGNORE INTO doctors (id, doctor_name, specialization, department, experience, availability) VALUES
(1, 'Dr. Amit Gupta', 'Cardiologist',  'Cardiology',  12, 'Available'),
(2, 'Dr. Neha Mehta', 'Dermatologist', 'Dermatology',  8, 'Available'),
(3, 'Dr. Raj Kumar',  'Neurologist',   'Neurology',   10, 'Unavailable');

INSERT IGNORE INTO patients (id, patient_id, patient_name, age, gender, blood_group, `condition`, doctor, status) VALUES
(1, 'P001', 'Rahul Sharma', 28, 'Male',   'B+', 'Heart Problem', 'Dr. Amit Gupta', 'Active'),
(2, 'P002', 'Priya Singh',  32, 'Female', 'O+', 'Skin Problem',  'Dr. Neha Mehta', 'Active'),
(3, 'P003', 'Arjun Verma',  45, 'Male',   'A+', 'Neurological',  'Dr. Raj Kumar',  'Discharged');

INSERT IGNORE INTO appointments (id, appointment_id, patient_name, doctor_name, department, appointment_date, appointment_time, status) VALUES
(1, 'A001', 'Rahul Sharma', 'Dr. Amit Gupta', 'Cardiology',  CURDATE(), '10:00:00', 'Confirmed'),
(2, 'A002', 'Priya Singh',  'Dr. Neha Mehta', 'Dermatology', CURDATE(), '11:30:00', 'Pending'),
(3, 'A003', 'Arjun Verma',  'Dr. Raj Kumar',  'Neurology',   CURDATE(), '13:00:00', 'Completed');

INSERT IGNORE INTO medicines (id, medicine_id, medicine_name, category, quantity, price, expiry_date, supplier, status) VALUES
(1, 'M001', 'Paracetamol', 'Tablet',  500, 20.00, '2027-05-31', 'ABC Pharma', 'Available'),
(2, 'M002', 'Amoxicillin', 'Capsule', 200, 80.00, '2026-12-31', 'XYZ Pharma', 'Available');

INSERT IGNORE INTO bills (id, bill_id, patient_name, consultation_fee, medicine_cost, test_cost, total_amount, payment_status, bill_date) VALUES
(1, 'B001', 'Rahul Sharma', 800, 500, 700, 2000, 'Paid',    CURDATE()),
(2, 'B002', 'Priya Singh',  600, 300, 400, 1300, 'Pending', CURDATE());
