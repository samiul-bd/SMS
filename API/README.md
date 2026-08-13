# Assignment & Submission Management System

A robust, role-based Assignment & Submission Management System built with **ASP.NET Core Web API**, **Clean Architecture**, and **PostgreSQL**, designed for educational institutions to manage courses, assignments, and student submissions.

## 🚀 Features

* **Role-Based Access Control (RBAC):** Distinct permissions and workflows for **Admin**, **Teacher**, and **Student**.
* **Admin Module:** Manage users, courses, subjects, assign teachers to subjects, and view system-wide assignments and submissions.
* **Teacher Module:** Create, update, delete assignments, set deadlines, define maximum marks, publish/draft assignments, review student submissions, and provide marks/feedback.
* **Student Module:** View enrolled course assignments, submit answers, update submissions before the deadline, and track submission status, marks, and teacher feedback.
* **Security:** JWT-based authentication and authorization.
* **Testing:** Comprehensive unit tests covering business rules and workflows using xUnit and FluentAssertions.

---

## 🛠️ Technology Stack

* **Backend:** ASP.NET Core Web API (.NET 10), C#, Entity Framework Core (EF Core)
* **Architecture:** Clean Architecture (Domain, Application, Infrastructure, Persistence, WebAPI)
* **Database:** PostgreSQL
* **Authentication:** JWT Bearer Token
* **Testing:** xUnit, Moq, FluentAssertions, EF Core In-Memory Database
* **Containerization:** Docker & Docker Compose

---

## 📁 Project Structure

```text
├── Domain                # Core business entities, enums, and base classes
├── Application           # Interfaces, DTOs, and business logic abstractions
├── Infrastructure        # External services and database implementations
├── Persistence           # ApplicationDbContext and EF Core Migrations
├── WebAPI                # Controllers, Program.h, and presentation layer
└── Application.UnitTests # xUnit test suites for business rules