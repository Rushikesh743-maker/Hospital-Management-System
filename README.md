# 🏥 Hospital Management System (Basic)

## 📌 Project Overview

This is a simple Hospital Management System website built using PHP and MySQL.
It allows users to manage **Doctors, Patients, and Appointments** in an easy and organized way.

This project does not include login/authentication and focuses on basic database operations (CRUD).

---

## 🎯 Features

### 👨‍⚕️ Doctors

* Add new doctor
* View all doctors
* Delete doctor

### 👤 Patients

* Add new patient
* View all patients
* Delete patient

### 📅 Appointments

* Create appointment (select doctor, patient, date)
* View all appointments
* Delete appointment

---

## 🛠️ Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** PHP
* **Database:** MySQL

---

## 🗂️ Project Structure

```
/project-folder
│── index.html
│── doctors.php
│── patients.php
│── appointments.php
│── db.php
│── style.css
```

---

## 🗄️ Database Tables

### Doctors Table

* id (Primary Key)
* name
* specialization
* contact

### Patients Table

* id (Primary Key)
* name
* age
* disease
* contact

### Appointments Table

* id (Primary Key)
* doctor_id
* patient_id
* date

---

## ⚙️ Setup Instructions

1. Install XAMPP / WAMP
2. Start Apache and MySQL
3. Create a database (e.g., `hospital_db`)
4. Import SQL tables
5. Place project folder in `htdocs`
6. Open browser and run:

```
http://localhost/project-folder
```

---

## 🚀 Usage

* Navigate between Doctors, Patients, and Appointments pages
* Use forms to add data
* View records in tables
* Delete records when needed

---

## ❗ Notes

* This is a basic project for learning DBMS and web development
* No authentication system is included
* Focus is on simple CRUD operations

---

## 📚 Future Improvements

* Add login system (Admin/Doctor/Patient)
* Add update/edit functionality
* Improve UI design
* Add search and filters

---

## 👨‍💻 Author

Your Name

---

## 📄 License

This project is for educational purposes only.
