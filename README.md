# Aegis Enterprise Asset Management System

A multi-department enterprise asset management and procurement platform with dynamic form schemas, multi-tier hierarchical approvals, direct executive short-circuit bypass, IT vendor sourcing, finance budget clearance, thermal barcode tagging, and organization hierarchy matrix.

---

## Key Features & Architecture

### 1. Dynamic Form Engine (EAV-lite Architecture)
- Custom request forms dynamically configured per **(Department × Asset Category)** tuple.
- Supports `select`, `number_input`, `text_input`, `checkbox_group`, `textarea`, `date_picker`, and file attachment references.
- Visual dynamic form builder with real-time JSON preview and schema versioning.

### 2. Multi-Level Governance & Short-Circuit Pre-emption
- Standard Line Hierarchy: `Employee` → `L1 (Reporting Manager)` → `L2 (Department Head / VP)` → `MD (Managing Director)`.
- **Short-Circuit Bypass Rules:**
  - **Managing Director (MD):** Direct bypass clearance on any pending ticket, immediately routing to IT Sourcing and marking preceding line approvals as `BYPASS_APPROVED`.
  - **L2 (Department Head):** Can pre-empt L1 approval directly to MD.
  - Complete immutable audit logging with timestamps, approver role executed, and comments.

### 3. IT Procurement & Sourcing Desk
- Collects vendor quotations, quotes numbers, currency, delivery SLAs, and warranty terms.
- Attaches technical spec sheets and routes to Finance for budget clearance.

### 4. Finance Budget Clearance Hub
- Two-tier review: `Finance Officer (Fin L1)` → `CFO / Finance Head`.
- **CFO Direct Budget Clearance:** One-click final sign-off that releases the formal Purchase Order (`PO-AEGIS-2026-XXXX`).
- Departmental budget variance and expenditure utilization tracking.

### 5. Barcode Intake & Asset Allocation Console
- Hardware serial number ingestion with simulated barcode scanner.
- Internal unique asset tag generation (`AST-DEPT-YYYY-ID`).
- High-durability 300 DPI thermal barcode and QR label printable preview.
- Single-click handover binding hardware custody to employee.

### 6. Role & Org Hierarchy Matrix
- Recursive organizational tree visualization.
- Super Admin controls to designate MD, CFO, and Finance approvers.
- Full Employee Master CRUD (`emp_id`, `emp_name`, `email`, `contact_no`, `home_contact_no`, `address`, `department`, `designation`, `reporting_manager_id`, `role`).
- Department and Designation master registries.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Tooling:** Vite, Node.js

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/sirishlst/Enterprise-Asset-Management.git
cd Enterprise-Asset-Management

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License
MIT
