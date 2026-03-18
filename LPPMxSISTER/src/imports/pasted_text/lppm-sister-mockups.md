Act as a senior UI/UX designer.

Design a complete web application mockup for a university research management system called **LPPM x SISTER**.

The system is integrated with an external academic system (SISTER) which acts as the **source of truth for validating research and publication data**.

Focus ONLY on UI/UX mockups and layout (no backend, no code).

Design should be clean, modern, and professional, similar to SaaS dashboards.

---

# SYSTEM CONCEPT (IMPORTANT CONTEXT)

This system is NOT a standalone system.

It works as a **validation and management layer on top of SISTER data**.

Key flow:

• Lecturer submits research (pengajuan)
• Reviewer validates submission
• Reviewer checks data validity against SISTER
• If valid → Approved → becomes publication
• If not → Rejected

---

# USER ROLES

## Public (Umum)

Can:

• View homepage
• View articles
• View publications

---

## Lecturer (Dosen)

Can:

• Login using credentials (no registration UI needed)
• Submit research (pengajuan penelitian)
• View submission status (Pending / Approved / Rejected)
• View personal profile

---

## Reviewer

IMPORTANT ROLE

Responsibilities:

• Review ALL lecturer submissions
• Validate research data against SISTER
• Decide:

* Valid → Approve
* Invalid → Reject

UI must reflect:

• Validation status
• SISTER data comparison
• Decision clarity

---

## Admin

VERY LIMITED ROLE

Responsibilities:

• Assign user roles
• Manage articles (create/edit/delete)

Admin does NOT:

• Review research
• Approve publications
• Handle academic workflow

---

# LOGIN PAGE (UPDATED)

Login page should be simple:

• Username
• Password
• Login button

NO:

• Register
• Role selection

System automatically determines role after login.

---

# DOSEN FLOW (UPDATED)

Dashboard should show:

• List of submitted research
• Status:

* Pending
* Approved
* Rejected

• Button: "Ajukan Penelitian"

---

# REVIEWER PAGE (CRITICAL UPDATE)

This is the MOST IMPORTANT UI.

Each research item must show:

---

LEFT SIDE:
Submission data (from Dosen)

• Judul
• Penulis
• Data input

RIGHT SIDE:
SISTER Data (reference)

• Data dari API SISTER
• Matching / mismatch indicator

---

VALIDATION STATUS

• Valid (match SISTER)
• Invalid (data mismatch)

---

ACTIONS

[ Approve ]
[ Reject ]

---

Design must clearly show:

• Comparison between submission vs SISTER
• Decision confidence

---

# ADMIN DASHBOARD (UPDATED)

Focus ONLY on:

## User Management

• List users
• Assign roles

## Artikel Management

• Create article
• Edit article
• Delete article

NO research-related UI.

---

# DATA HANDLING

For mockup purposes:

Use **dummy data**.

Include:

• Fake research titles
• Fake lecturer names
• Fake publication data

---

# DESIGN STYLE

Use modern SaaS dashboard style:

• Sidebar navigation
• Topbar
• Cards
• Tables
• Clean spacing

Color:

• Blue (primary)
• White
• Light gray

---

# OUTPUT REQUIRED

Create mockups for:

1. Homepage
2. Artikel page
3. Publikasi page
4. Login page
5. Dosen dashboard
6. Submit penelitian page
7. Reviewer validation page (with SISTER comparison UI)
8. Admin dashboard

Each screen must include:

• Layout structure
• UI components
• Clear hierarchy

---

Focus on clarity, usability, and role-based experience.
