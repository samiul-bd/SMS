# Assignment & Submission Management System (SMS)

A full-stack, role-based educational web application built for schools and colleges to manage courses, assignments, student submissions, and grading workflows.

---

## Project Overview

The **Assignment & Submission Management System** provides tailored interfaces and secure RESTful workflows for three distinct user roles:

* **Admin**:
  - Manage user accounts & roles.
  - Approve anonymous public registration requests and assign approved system roles (`Student`, `Teacher`, `Admin`).
  - Create and edit courses & subjects.
  - Allocate teachers to subjects and enroll students into courses.
  - View all assignments & inspect student submission details with full answer text, scores, and teacher feedback.
  - Manage application-level settings (institution name, academic terms, passing thresholds, late policies).
* **Teacher**: Create/edit/delete assignments, draft vs. published state control, set deadlines and maximum marks, inspect student submissions, and award marks with feedback.
* **Student**: View enrolled course assignments, submit text answers, update submissions before deadlines, and track evaluation status, marks awarded, and teacher feedback.
* **Anonymous Visitor**: Public account registration on `/register` with pending Admin review notification.

---

## Demo Credentials

The database automatically seeds default accounts upon system startup:

| Role | Email | Password | Account Status |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sms.com` | `Admin@123` | Active (Pre-approved) |
| **Teacher** | `teacher@sms.com` | `Teacher@123` | Active (Pre-approved) |
| **Student** | `student@sms.com` | `Student@123` | Active (Pre-approved) |

*Note: Newly registered accounts via the public `/register` page start in **Pending Approval** status and require an Admin to assign their role and activate the account from `/admin/users`.*

---

## Technology Stack

* **Backend API**: ASP.NET Core Web API (.NET 10), C#, Clean Architecture
* **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Axios, React Hook Form, Zod
* **Database**: PostgreSQL (Entity Framework Core 10 ORM)
* **Authentication**: JWT Bearer Tokens, BCrypt Password Hashing
* **Containerization**: Docker & Docker Compose (Full-stack 3-container orchestration)
* **Testing**: xUnit, Moq, FluentAssertions, EF Core In-Memory DB (6 unit tests)

---

## Project Structure

```text
SMS/
├── API/                        # Backend solution (.NET 10 Web API)
│   ├── Domain/                 # Core entities, enums, DTOs, interfaces
│   ├── Application/            # Abstractions, contracts, and logic interfaces
│   ├── Application.UnitTests/  # xUnit unit test project
│   ├── Infrastructure/         # Business services implementation & security
│   ├── Persistence/            # ApplicationDbContext, EF Migrations, DbInitializer
│   ├── WebAPI/                 # Controllers, Swagger/OpenAPI, Program.cs
│   ├── Dockerfile              # Backend container build script
│   └── docker-compose.yml      # Standalone API & DB compose script
│
├── sms-client/                 # Frontend client (Next.js 16)
│   ├── src/app/
│   │   ├── admin/              # Admin dashboard, users, academic, allocations, reports & settings
│   │   ├── teacher/            # Teacher dashboard, assignment creation & grading submissions
│   │   ├── student/            # Student portal & submission modal
│   │   ├── register/           # Public user registration page
│   │   └── login/              # Unified login page
│   ├── src/services/api.ts     # Axios instance with JWT interceptors
│   ├── Dockerfile              # Next.js standalone container build script
│   └── package.json
│
├── docker-compose.yml          # Root multi-container full-stack docker orchestration
└── README.md                   # Complete project documentation
```

---

## Quick Setup Instructions

### Option 1: Running with Docker Compose (Recommended - Full Stack)

Run all 3 containers (PostgreSQL + .NET Backend API + Next.js Frontend) with a single command from the project root directory:

1. Open your terminal in the root `SMS` folder:
   ```bash
   docker-compose up --build
   ```
2. Services will be available at:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000/swagger](http://localhost:5000/swagger)
   - **PostgreSQL DB**: `localhost:5432`

---

### Option 2: Local Manual Setup

#### 1. Backend Setup (.NET 10 & PostgreSQL)

1. Ensure PostgreSQL is installed and running locally.
2. Update connection string in `API/WebAPI/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Database=sms_db;Username=postgres;Password=yourpassword"
   }
   ```
3. Run Entity Framework Core Database Migrations:
   ```bash
   cd API
   dotnet ef database update --project Persistence --startup-project WebAPI
   ```
   *(The system automatically seeds demo accounts upon startup).*
4. Run the Web API:
   ```bash
   dotnet run --project WebAPI
   ```
   Swagger API documentation will be available at [http://localhost:5000/swagger](http://localhost:5000/swagger).

#### 2. Frontend Setup (Next.js)

1. Navigate to `sms-client`:
   ```bash
   cd sms-client
   ```
2. Install dependencies and start development server:
   ```bash
   npm install
   npm run dev
   ```
3. Access the web client at [http://localhost:3000](http://localhost:3000).

---

## Running Unit Tests

Backend unit tests cover core business rules, deadline enforcement, permission checks, score validation, and account approval restrictions.

To run the unit test suite:

```bash
dotnet test API/Application.UnitTests/Application.UnitTests.csproj
```

**Test Suite Coverage**:
- `GetAssignmentsByTeacherId_ShouldReturnOnlyTeacherAssignments`
- `ReviewSubmission_ShouldFail_WhenMarksExceedMaxMarks`
- `LoginAsync_ShouldReturnError_WhenUserIsNotApproved`
- `ApproveUserAsync_ShouldApproveAndChangeUserRole`

---

## System Design Assumptions & Decisions

1. **Anonymous Registration & Approval**: Anonymous visitors can submit registration requests on `/register`. Accounts start in `IsApproved = false` state and cannot log in until an Admin assigns a role and approves them on `/admin/users`.
2. **Role Access Control**: Roles (`Admin`, `Teacher`, `Student`) are encoded directly inside JWT Claims. Every API endpoint enforces role authorization via `[Authorize(Roles = "...")]`.
3. **Assignment Submissions**: Students are allowed to resubmit/update their written answer multiple times **before** the assignment deadline. Once the deadline passes, submissions are locked.
4. **Re-evaluation Workflow**: If a student resubmits prior to the deadline, the submission status resets to `Submitted` / `Pending` so teachers can re-evaluate the updated work.
5. **Draft vs. Published**: Assignments saved in `Draft` state are visible only to the teacher who created them and are hidden from student portals until set to `Published`.
6. **Database Seeding**: Demo accounts are hashed using BCrypt and seeded asynchronously on initial startup if no existing users are found in the database.