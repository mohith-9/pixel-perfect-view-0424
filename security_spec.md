# Security Specification & Test-Driven Security Plan

## 1. Data Invariants

- **SiteContent (`/site_content/{contentId}`)**:
  - Read: Public can read all site content documents (`get`, `list`).
  - Write: Only verified admins can write or update content. Document ID must match payload key.
- **Projects (`/projects/{projectId}`)**:
  - Read: Public can read published projects. Admins can read all.
  - Write: Only verified admins can create, update, or delete projects.
  - Invariants: Title must be 1-200 characters. Sort order must be a number.
- **Contact Leads (`/contact_leads/{leadId}`)**:
  - Create: Public can submit an enquiry. Invariants: `name` (1-120 chars), `email` (1-200 chars), `message` (1-5000 chars), `status` must be `"new"`, `is_read` must be `false`, `created_at` must equal `request.time`.
  - Read: Strictly restricted to verified admins. Public users cannot read or list contact leads (PII protection).
  - Update: Only verified admins can update (`status`, `is_read`).
  - Delete: Only verified admins can delete.
- **Admins (`/admins/{adminId}`)**:
  - Read: Authenticated user can read their own admin record, or admins can read.
  - Write: Restricted to verified admins, or initial owner bootstrap (`boddulamohithkumar@gmail.com`, `editsofmkk@gmail.com`).

## 2. The "Dirty Dozen" Payloads

1. **Unauthenticated Site Content Write**: An anonymous user attempting to overwrite `/site_content/hero`. (Must return PERMISSION_DENIED)
2. **Unauthenticated Project Creation**: An anonymous user trying to create a project in `/projects/fake-id`. (Must return PERMISSION_DENIED)
3. **Ghost Field Injection in Lead**: A visitor creating a lead with an extra `is_admin: true` or `role: admin` field. (Must return PERMISSION_DENIED)
4. **Lead Status Spoofing**: A visitor submitting a lead with `status: "converted"` instead of `"new"`. (Must return PERMISSION_DENIED)
5. **Lead Read-Flag Tampering**: A visitor submitting a lead with `is_read: true`. (Must return PERMISSION_DENIED)
6. **Public Lead List Scraping**: An unauthenticated user or regular user attempting to query or list `/contact_leads`. (Must return PERMISSION_DENIED)
7. **Lead Modification by Non-Admin**: An unauthenticated user attempting to mark a lead as read via `update`. (Must return PERMISSION_DENIED)
8. **Unauthorized Lead Deletion**: A visitor attempting to delete a lead from `/contact_leads`. (Must return PERMISSION_DENIED)
9. **Project Deletion by Non-Admin**: An unauthenticated attacker attempting to delete `/projects/project-123`. (Must return PERMISSION_DENIED)
10. **Oversized String Attack (Denial of Wallet)**: A visitor sending a 500KB message in `contact_leads`. (Must return PERMISSION_DENIED)
11. **Admin Escalation by Regular User**: An arbitrary signed-in user creating `/admins/{their_uid}`. (Must return PERMISSION_DENIED)
12. **Timestamp Forgery**: Submitting a lead with a forged future timestamp rather than `request.time`. (Must return PERMISSION_DENIED)
