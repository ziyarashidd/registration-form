create table employee (
id  int AUTO_INCREMENT PRIMARY KEY,
name varchar(50) unique,
email varchar(50),
phone numeric(10),
designation varchar(50),
gender varchar(20),
course varchar(30),
date varchar(30)
);