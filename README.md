# CampusFix

### Full-Stack Campus Complaint & Maintenance Management System

CampusFix is a full-stack web application designed to simplify the process of reporting and managing classroom and campus maintenance issues.

Students can report problems such as non-working fans, lights, projectors, furniture, Wi-Fi, plumbing, and other classroom issues. Administrators can review, accept, reject, track, and resolve complaints through a centralized dashboard.

## Live Demo

[CampusFix Live Website](https://campusfix-snpsu.ai.studio/)

## GitHub Repository

[CampusFix on GitHub](https://github.com/Naveen-K17/CampusFix)

---

## Features

### Student

- Student registration and login
- CSE class selection from CSE-1 to CSE-50
- Report classroom and campus issues
- Select Block A, Block B, or Block C
- Enter room number manually
- Select complaint category
- Add detailed description
- Upload images of the issue
- Set complaint priority
- Track complaint status
- View complaint history
- View complaint timeline
- Receive real-time status updates
- Receive notifications from administrators

### Admin

- Secure admin login
- Admin dashboard
- View all complaints
- Search and filter complaints
- View complaint details
- View uploaded images
- Accept complaints
- Reject complaints with a reason
- Move complaints to In Progress
- Mark complaints as Resolved
- Add remarks
- View complaint history
- Receive new complaint notifications
- View complaint analytics

### Super Admin

- Manage administrators
- Approve admin access
- Reject admin access
- Enable or disable administrator accounts
- Manage administrator permissions

---

## Complaint Workflow

```text
Student
   ↓
Submit Complaint
   ↓
Complaint Stored in Supabase
   ↓
Admin Reviews
   ↓
Accept / Reject
   ↓
Accepted
   ↓
In Progress
   ↓
Resolved
   ↓
Student Receives Real-Time Update
