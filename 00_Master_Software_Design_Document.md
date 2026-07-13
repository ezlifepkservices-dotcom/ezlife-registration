# EZ Life ERP — Master Software Design Document (SDD)

**Version:** 0.1 Foundation Draft  
**Status:** Architecture Freeze in Progress  
**Project Type:** Reusable SaaS / ERP Platform  
**Primary Stack:** Next.js 16, TypeScript, Tailwind CSS, Supabase, PostgreSQL, Vercel, GitHub

---

## 1. Project Vision

EZ Life ERP is a reusable SaaS / ERP platform for managing:

- Public registrations
- Member approvals
- Member accounts
- Referral networks
- Installment payments
- Overdue and suspension workflows
- Balloting
- Notifications
- Documents
- Reports
- Admin and member portals

The first active service is **Umrah**. All remaining services must remain disabled and show **Coming Soon** until enabled by an authorized administrator.

The platform should be reusable for future clients through configurable branding, services and business rules.

---

## 2. Current Completed Scope

### Public Website

- Navbar
- Hero
- About
- Services
- How It Works
- Referral Program
- Balloting
- Partnership
- CTA
- Footer

### Registration

- Full name
- Mobile
- WhatsApp
- Email
- City
- Interested services
- Referral code
- Consent
- React Hook Form
- Zod validation
- Supabase storage

### Admin

- Admin login
- Admin dashboard
- Sidebar
- Header
- Registrations
- Approvals
- Members
- Payments overview
- Reports placeholders
- Balloting placeholders
- Overdue and suspended member placeholders

### Authentication

- Admin Supabase login
- Member Supabase login
- Profiles table
- Admin role validation
- Member role validation
- Admin route protection foundation

### Deployment

- GitHub repository
- Vercel deployment
- Supabase integration
- Production build previously passed

---

## 3. Final User Roles

| Role | Purpose |
|---|---|
| super_admin | Full platform control |
| admin | Operational administration |
| staff | Permission-based operational access |
| finance | Payments and financial reports |
| support | Member support and communication |
| auditor | Read-only reports and audit logs |
| member | Member portal access |

Permissions will later be moved to a dedicated permission system. For the first production version, role-level guards may be used.

---

## 4. Final Route Structure

```text
/
├── register
├── login                         # Redirect / compatibility route
├── admin
│   ├── login
│   ├── dashboard
│   ├── registrations
│   ├── approvals
│   ├── members
│   ├── members/[id]
│   ├── referrals
│   ├── payments
│   ├── overdue
│   ├── suspended
│   ├── balloting
│   ├── reports
│   ├── notifications
│   ├── documents
│   ├── settings
│   └── profile
└── member
    ├── login
    ├── change-password
    ├── dashboard
    ├── profile
    ├── referrals
    ├── payments
    ├── balloting
    ├── documents
    ├── notifications
    ├── settings
    └── suspended
```

### Route Rules

- `/admin/*` is accessible only to active admin roles.
- `/member/*` is accessible only to active member roles.
- Suspended members are redirected to `/member/suspended`.
- Members with `must_change_password = true` are redirected to `/member/change-password`.
- Logged-out users are redirected to the correct login page.
- Admin users must not access member pages as members.
- Member users must not access admin routes.

---

## 5. Final Source Structure

```text
app/
├── admin/
├── member/
├── api/
│   ├── admin/
│   ├── member/
│   ├── auth/
│   ├── payments/
│   ├── referrals/
│   ├── balloting/
│   └── notifications/
├── register/
├── layout.tsx
└── page.tsx

components/
├── admin/
├── member/
├── shared/
├── ui/
├── forms/
├── tables/
├── modals/
└── charts/

features/
├── authentication/
├── registrations/
├── members/
├── referrals/
├── payments/
├── balloting/
├── notifications/
├── documents/
└── reports/

lib/
├── supabase/
├── auth/
├── validation/
├── constants/
├── permissions/
└── utils/

types/
├── database.ts
├── auth.ts
├── member.ts
├── registration.ts
├── referral.ts
├── payment.ts
└── balloting.ts

docs/
├── 00_Master_Software_Design_Document.md
├── 01_Project_Architecture.md
├── 02_Database_Design.md
├── 03_Design_System.md
├── 04_Business_Rules.md
├── 05_Development_Roadmap.md
├── 06_API_Documentation.md
├── 07_Deployment_Guide.md
├── 08_User_Manual.md
├── 09_Project_Ideas_Backlog.md
└── decisions/
```

### Current Structure Decisions

- Keep `components/admin`.
- Rename or migrate `components/dashboard` to `components/member`.
- Move current root `/dashboard/*` member pages under `/member/*`.
- Keep public marketing components in `components/marketing` or root temporarily.
- Do not commit `.next`, `node_modules` or `.env.local`.
- Replace dynamic placeholder routes with real module pages over time.
- Avoid duplicate layout wrappers.

---

## 6. Authentication Architecture

### Admin Login Flow

```text
Admin Login
→ Supabase Auth
→ profiles lookup
→ role check
→ status check
→ /admin/dashboard
```

### Member Approval and Login Flow

```text
Registration
→ Pending
→ Admin Approval
→ Supabase Auth User
→ members row
→ profiles row
→ Member ID
→ Referral Code
→ Temporary Password
→ Member Login
→ must_change_password check
→ Change Password
→ Member Dashboard
```

### Security Rules

- `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side.
- Browser code may use only the anon key.
- Sensitive operations must be performed in server routes.
- Every protected route must verify role and status.
- RLS policies must be enabled on all business tables.
- Admin authorization must not rely only on email.
- Authentication and authorization are separate checks.

---

## 7. Database Architecture

### Existing Tables

- profiles
- members
- registrations
- services
- registration_services

### Required Core Tables

- member_referrals
- member_status_history
- payments
- payment_history
- payment_proofs
- balloting_events
- balloting_entries
- balloting_winners
- notifications
- documents
- support_tickets
- settings
- audit_logs

### Standard Columns

Business tables should normally include:

```text
id
created_at
updated_at
created_by
updated_by
status
deleted_at (where soft delete is required)
```

### Profiles

```text
id
auth_user_id
member_id
full_name
email
role
status
must_change_password
created_at
updated_at
```

### Members

Recommended final columns:

```text
id
auth_user_id
member_code
full_name
mobile
whatsapp
email
city
cnic
address
referral_code
referred_by_member_id
service_id
status
joined_at
suspension_reason
suspended_at
suspended_by
created_at
updated_at
```

### Referral Relationship

The main referral relationship should be stored on the member:

```text
members.referred_by_member_id → members.id
```

A separate `member_referrals` table may store history, metadata or immutable audit events.

This supports:

- Unlimited direct referrals
- Unlimited levels
- Direct referral count
- Total descendant count
- Level-wise counts
- Branch-wise counts
- Admin drill-down
- Member network tree

---

## 8. Referral Business Rules

- A member may refer unlimited people.
- Each approved member has one permanent referrer, except direct/root members.
- Referral parent cannot be changed after approval without super-admin authorization.
- Referral code must belong to an active member.
- Suspended or blocked referral codes cannot be used for new registrations.
- Member dashboard shows:
  - Direct referrals
  - Total network
  - Level-wise count
  - Active, pending and suspended counts
  - Network tree
- Admin dashboard shows the complete hierarchy for any member.
- The system must prevent referral loops.
- A member cannot refer themselves.
- Duplicate member records must be prevented by unique email/mobile rules.

---

## 9. Member Status Rules

Supported statuses:

```text
pending
active
suspended
blocked
cancelled
```

### Suspended Member

- Can be allowed to authenticate only to see suspension information.
- Cannot access normal member features.
- Cannot submit new referrals.
- Is excluded from balloting.
- Suspension reason must be recorded.
- Suspension action must create an audit log.
- Reactivation must also create an audit log.

### Blocked Member

- Cannot use the member portal.
- Requires admin intervention.
- Used for permanent or serious restrictions.

---

## 10. Payment Architecture

### Payment Statuses

```text
pending
submitted
under_review
approved
rejected
overdue
waived
cancelled
```

### Core Flow

```text
Monthly Due Created
→ Member Submits Payment
→ Proof Uploaded
→ Admin Reviews
→ Approved / Rejected
→ Receipt Generated
→ Eligibility Updated
```

### Required Data

- Member
- Service
- Billing month
- Due date
- Amount due
- Amount paid
- Payment method
- Transaction ID
- Proof
- Verification status
- Verified by
- Verified at
- Remarks

### Rules Pending Client Confirmation

- Monthly amount
- Due date
- Grace period
- Late fee
- Automatic suspension threshold
- Reactivation conditions
- Winner payment obligations

---

## 11. Balloting Architecture

### Eligibility Engine

Eligibility may depend on:

- Active status
- Minimum membership duration
- Required referrals
- Payment clearance
- Document verification
- No active suspension

### Balloting Flow

```text
Create Event
→ Freeze Eligibility Rules
→ Generate Eligible List
→ Admin Review
→ Conduct Ballot
→ Select Winner(s)
→ Save Audit Record
→ Publish Result
→ Notify Members
```

### Audit Requirements

- Event name
- Date/time
- Eligible member count
- Rules used
- Selected winner(s)
- Conducted by
- Immutable result record

---

## 12. UI / UX Design System

### Design Direction

- Professional SaaS / ERP
- Dark-first admin and member portals
- Clean public marketing site
- Consistent spacing
- Compact data tables
- Responsive layouts
- Clear status colors
- Accessible controls

### Core Components

- Button
- Input
- Select
- Textarea
- Checkbox
- Radio
- Card
- Stat Card
- Table
- Badge
- Modal
- Drawer
- Alert
- Empty State
- Skeleton
- Pagination
- Search
- Filter Bar
- Date Picker
- File Upload
- Toast

### Layout Rules

- Admin and member layouts must be separate.
- Layout wrapper must not be duplicated inside pages if already applied by route layout.
- Tables scroll inside their container, not across the whole page.
- Maximum 10–25 rows per page, configurable.
- Mobile uses horizontal table scrolling or responsive cards.
- Every module must support loading, empty, error and success states.

---

## 13. API Standards

### API Response Format

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed."
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable message"
  }
}
```

### API Rules

- Validate request bodies with Zod.
- Verify session server-side.
- Verify role and status server-side.
- Use service-role key only on the server.
- Log sensitive admin actions.
- Use transactions or rollback logic for multi-step operations.
- Never expose temporary passwords after the initial approval response.
- Avoid permanent deletion of financial or audit records.

---

## 14. Coding Standards

- Always provide complete files, never partial snippets.
- One component should have one clear responsibility.
- Use PascalCase for React components.
- Use kebab-case for URLs.
- Avoid duplicate business logic.
- Move shared logic into utilities or feature services.
- Type all API payloads.
- Do not use `any` unless strictly necessary.
- Keep secrets out of client components.
- Run `npm run build` before every push.
- Keep documentation updated with each milestone.

---

## 15. Git and Release Workflow

```text
Code
→ Local Test
→ npm run build
→ Git Status
→ Git Add
→ Git Commit
→ Git Push
→ Vercel Deployment
→ Live Test
→ Changelog Update
```

### Version Plan

```text
v0.1 Foundation
v0.2 Authentication
v0.3 Member Management
v0.4 Referral Engine
v0.5 Payments
v0.6 Balloting
v0.7 Reports and Notifications
v0.8 Security and Testing
v1.0 Production Release
```

---

## 16. Development Roadmap

### Milestone 0 — Foundation

- Architecture freeze
- Database design
- Business rules
- UI design system
- Documentation structure
- README and CHANGELOG
- Folder restructuring plan

### Milestone 1 — Authentication

- Admin login
- Member login
- Change password
- Forgot password
- Route protection
- Session handling
- Role and status guards

### Milestone 2 — Member Management

- Registration listing
- Approval
- Rejection
- Member creation
- Member details
- Edit member
- Suspend
- Reactivate
- Block
- Status history

### Milestone 3 — Referral Engine

- Referral validation
- Referral parent relationship
- Direct referrals
- Total descendants
- Level-wise counts
- Member tree
- Admin tree
- Referral reports

### Milestone 4 — Payments

- Payment plans
- Monthly dues
- Submission
- Proof upload
- Verification
- Receipts
- Overdue
- Suspension integration

### Milestone 5 — Balloting

- Eligibility rules
- Events
- Eligible list
- Winner selection
- Audit records
- Results
- Notifications

### Milestone 6 — Operations

- Documents
- Notifications
- Support tickets
- Reports
- Settings
- Staff permissions

### Milestone 7 — Production

- RLS audit
- Security testing
- Responsive testing
- Error monitoring
- Backups
- Admin manual
- Member guide
- Client training
- Production release

---

## 17. Immediate Next Implementation Order

After this document is accepted:

1. Finalize database schema for members and referrals.
2. Finalize route and folder migration plan.
3. Create shared UI component foundation.
4. Complete member change-password flow.
5. Complete member route protection.
6. Complete approvals and member creation flow.
7. Build member management and suspension.
8. Build referral engine.

---

## 18. Open Business Decisions

The following must be confirmed before their modules are implemented:

- Monthly installment amount
- Due date rule
- Grace period
- Late fee
- Automatic suspension rule
- Number of months before balloting
- Required direct referrals for eligibility
- Whether total network affects eligibility
- Winner’s remaining payment obligations
- Referral reassignment policy
- Rejected registration reapplication policy
- CNIC and passport requirements
- Staff permission matrix
- Email and WhatsApp notification strategy

---

## 19. Architecture Freeze Rule

Once this document is approved:

- Existing completed features will be preserved.
- Structural changes will be made through planned migrations.
- New modules must follow this document.
- Business-rule changes must be recorded before implementation.
- Architecture changes must be documented in `docs/decisions/`.

---

## 20. New Chat Continuation Message

> Continue EZ Life ERP from the Master Software Design Document. Follow the approved architecture, database, business rules, UI system and roadmap. Work step by step. Always provide complete files, never partial snippets.
