import {
  Department,
  Designation,
  Role,
  Employee,
  AssetCategory,
  AssetMaster,
  AssetItem,
  AssetAssignment,
  DynamicFormTemplate,
  AssetRequest,
  ApprovalAuditLog,
  ProcurementOrder
} from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 1, name: 'Engineering', code: 'ENG', is_active: true, created_at: '2025-01-10T09:00:00Z' },
  { id: 2, name: 'Operations & Plant', code: 'OPS', is_active: true, created_at: '2025-01-10T09:00:00Z' },
  { id: 3, name: 'IT Infrastructure', code: 'IT', is_active: true, created_at: '2025-01-10T09:00:00Z' },
  { id: 4, name: 'Finance & Accounts', code: 'FIN', is_active: true, created_at: '2025-01-10T09:00:00Z' },
  { id: 5, name: 'Human Resources & Admin', code: 'HR', is_active: true, created_at: '2025-01-10T09:00:00Z' },
  { id: 6, name: 'Sales & Marketing', code: 'SLS', is_active: true, created_at: '2025-01-10T09:00:00Z' },
];

export const INITIAL_DESIGNATIONS: Designation[] = [
  { id: 1, name: 'Managing Director / CEO', level: 5, is_active: true },
  { id: 2, name: 'Chief Financial Officer (CFO)', level: 5, is_active: true },
  { id: 3, name: 'Vice President of Engineering (L2)', level: 4, is_active: true },
  { id: 4, name: 'Head of Operations (L2)', level: 4, is_active: true },
  { id: 5, name: 'IT Infrastructure Lead', level: 4, is_active: true },
  { id: 6, name: 'Engineering Manager (L1)', level: 3, is_active: true },
  { id: 7, name: 'Operations Lead (L1)', level: 3, is_active: true },
  { id: 8, name: 'Senior Finance Officer (Fin L1)', level: 3, is_active: true },
  { id: 9, name: 'IT Systems & Procurement Admin', level: 3, is_active: true },
  { id: 10, name: 'Senior Software Engineer', level: 2, is_active: true },
  { id: 11, name: 'Software Engineer', level: 1, is_active: true },
  { id: 12, name: 'Plant Operations Technician', level: 1, is_active: true },
  { id: 13, name: 'HR Generalist', level: 1, is_active: true },
];

export const INITIAL_ROLES: Role[] = [
  { id: 1, name: 'SUPER_ADMIN', description: 'Full organizational authority, role assignments and template config' },
  { id: 2, name: 'MD', description: 'Managing Director: Highest line approver with direct short-circuit bypass' },
  { id: 3, name: 'FINANCE_HEAD', description: 'CFO / Finance Head: Final budget signatory with direct clearance bypass' },
  { id: 4, name: 'FINANCE_L1', description: 'Finance Officer: Primary budget & cost center reviewer' },
  { id: 5, name: 'IT_ADMIN', description: 'IT Procurement Desk & Barcode Intake / Asset Custodian' },
  { id: 6, name: 'DEPT_HEAD', description: 'Department Head (L2 Approver): Can pre-empt L1 manager approvals' },
  { id: 7, name: 'EMPLOYEE', description: 'Standard employee / requester' },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    emp_id: 'EMP-001',
    emp_name: 'Dr. Eleanor Vance',
    email: 'eleanor.vance@aegis-corp.com',
    contact_no: '+1 (555) 019-2831',
    home_contact_no: '+1 (555) 998-1122',
    address: 'Suite 400, 100 Financial Center Blvd, San Francisco, CA',
    department_id: 1,
    designation_id: 1,
    reporting_manager_id: null,
    role_id: 2, // MD
    is_active: true,
    created_at: '2024-01-01T08:00:00Z'
  },
  {
    emp_id: 'EMP-300',
    emp_name: 'Arthur Pendelton',
    email: 'arthur.pendelton@aegis-corp.com',
    contact_no: '+1 (555) 301-4455',
    home_contact_no: '+1 (555) 301-8899',
    address: '77 Wall Street Ave, Financial District, SF, CA',
    department_id: 4,
    designation_id: 2,
    reporting_manager_id: 'EMP-001',
    role_id: 3, // FINANCE_HEAD
    is_active: true,
    created_at: '2024-01-05T08:00:00Z'
  },
  {
    emp_id: 'EMP-301',
    emp_name: 'Priya Sharma',
    email: 'priya.sharma@aegis-corp.com',
    contact_no: '+1 (555) 302-7722',
    home_contact_no: '+1 (555) 302-3344',
    address: '42 Market Street, Apt 8B, San Francisco, CA',
    department_id: 4,
    designation_id: 8,
    reporting_manager_id: 'EMP-300',
    role_id: 4, // FINANCE_L1
    is_active: true,
    created_at: '2024-03-12T08:00:00Z'
  },
  {
    emp_id: 'EMP-101',
    emp_name: 'David Sterling',
    email: 'david.sterling@aegis-corp.com',
    contact_no: '+1 (555) 101-9988',
    home_contact_no: '+1 (555) 101-4433',
    address: '185 Technology Way, Silicon Valley, CA',
    department_id: 1,
    designation_id: 3, // VP Engineering (L2)
    reporting_manager_id: 'EMP-001',
    role_id: 6, // DEPT_HEAD
    is_active: true,
    created_at: '2024-02-01T08:00:00Z'
  },
  {
    emp_id: 'EMP-102',
    emp_name: 'Sarah Jenkins',
    email: 'sarah.jenkins@aegis-corp.com',
    contact_no: '+1 (555) 102-3344',
    home_contact_no: '+1 (555) 102-7766',
    address: '512 Marina Blvd, San Francisco, CA',
    department_id: 1,
    designation_id: 6, // Engineering Manager (L1)
    reporting_manager_id: 'EMP-101',
    role_id: 7, // EMPLOYEE (acts as L1 Line Approver for her reports)
    is_active: true,
    created_at: '2024-04-15T08:00:00Z'
  },
  {
    emp_id: 'EMP-104',
    emp_name: 'Alex Chen',
    email: 'alex.chen@aegis-corp.com',
    contact_no: '+1 (555) 104-5511',
    home_contact_no: '+1 (555) 104-9922',
    address: '940 Howard Street, Apt 3C, San Francisco, CA',
    department_id: 1,
    designation_id: 11, // Software Engineer
    reporting_manager_id: 'EMP-102', // Reports to Sarah Jenkins
    role_id: 7, // EMPLOYEE
    is_active: true,
    created_at: '2024-06-20T08:00:00Z'
  },
  {
    emp_id: 'EMP-105',
    emp_name: 'Mei Lin',
    email: 'mei.lin@aegis-corp.com',
    contact_no: '+1 (555) 105-8833',
    home_contact_no: '+1 (555) 105-1177',
    address: '1440 Mission St, San Francisco, CA',
    department_id: 1,
    designation_id: 10, // Senior Software Engineer
    reporting_manager_id: 'EMP-102',
    role_id: 7,
    is_active: true,
    created_at: '2024-05-10T08:00:00Z'
  },
  {
    emp_id: 'EMP-201',
    emp_name: 'Marcus Brody',
    email: 'marcus.brody@aegis-corp.com',
    contact_no: '+1 (555) 201-6677',
    home_contact_no: '+1 (555) 201-9988',
    address: '220 Bush Street, San Francisco, CA',
    department_id: 3,
    designation_id: 9, // IT Admin & Sourcing Lead
    reporting_manager_id: 'EMP-001',
    role_id: 5, // IT_ADMIN
    is_active: true,
    created_at: '2024-02-15T08:00:00Z'
  },
  {
    emp_id: 'EMP-401',
    emp_name: 'Carlos Mendez',
    email: 'carlos.mendez@aegis-corp.com',
    contact_no: '+1 (555) 401-2211',
    home_contact_no: '+1 (555) 401-3322',
    address: '88 Industrial Parkway, Hayward, CA',
    department_id: 2,
    designation_id: 4, // Head of Operations (L2)
    reporting_manager_id: 'EMP-001',
    role_id: 6, // DEPT_HEAD
    is_active: true,
    created_at: '2024-01-20T08:00:00Z'
  },
  {
    emp_id: 'EMP-402',
    emp_name: 'Vikram Patel',
    email: 'vikram.patel@aegis-corp.com',
    contact_no: '+1 (555) 402-9900',
    home_contact_no: '+1 (555) 402-5566',
    address: '1240 Bayview Dr, San Mateo, CA',
    department_id: 2,
    designation_id: 7, // Operations Lead (L1)
    reporting_manager_id: 'EMP-401',
    role_id: 7,
    is_active: true,
    created_at: '2024-03-01T08:00:00Z'
  },
  {
    emp_id: 'EMP-403',
    emp_name: 'Jordan Lee',
    email: 'jordan.lee@aegis-corp.com',
    contact_no: '+1 (555) 403-1144',
    home_contact_no: '+1 (555) 403-8822',
    address: '335 Fremont Blvd, Fremont, CA',
    department_id: 2,
    designation_id: 12, // Plant Operations Technician
    reporting_manager_id: 'EMP-402',
    role_id: 7,
    is_active: true,
    created_at: '2024-07-01T08:00:00Z'
  },
  {
    emp_id: 'EMP-999',
    emp_name: 'Admin System Controller',
    email: 'admin@aegis-corp.com',
    contact_no: '+1 (555) 999-0000',
    address: 'Corporate Headquarters, SF, CA',
    department_id: 3,
    designation_id: 5,
    reporting_manager_id: 'EMP-001',
    role_id: 1, // SUPER_ADMIN
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const INITIAL_CATEGORIES: AssetCategory[] = [
  { id: 1, name: 'IT Hardware & Compute', code: 'ITH', depreciation_rate: 33.33, icon: 'Laptop' },
  { id: 2, name: 'Machinery & Plant Systems', code: 'MCH', depreciation_rate: 15.00, icon: 'Wrench' },
  { id: 3, name: 'Office Ergonomics & Furniture', code: 'OFE', depreciation_rate: 10.00, icon: 'Armchair' },
  { id: 4, name: 'Testing & Lab Instruments', code: 'TLI', depreciation_rate: 20.00, icon: 'Cpu' },
  { id: 5, name: 'Mobile & Communications', code: 'CMT', depreciation_rate: 25.00, icon: 'Smartphone' },
  { id: 6, name: 'Corporate Fleet & Transport', code: 'VEH', depreciation_rate: 20.00, icon: 'Car' }
];

export const INITIAL_ASSET_MASTERS: AssetMaster[] = [
  {
    id: 1,
    generic_name: 'Apple MacBook Pro 16" M3 Max',
    category_id: 1,
    part_number: 'AP-MBP16-M3X-36G',
    description: 'High-performance engineering laptop with Apple M3 Max 14-core CPU, 30-core GPU, 36GB Unified Memory, 1TB SSD, Liquid Retina XDR display.',
    uom: 'UNIT',
    created_at: '2024-02-10T10:00:00Z'
  },
  {
    id: 2,
    generic_name: 'Dell XPS 15 Workstation 9530',
    category_id: 1,
    part_number: 'DL-XPS15-I9-32G',
    description: 'Intel Core i9-13900H, 32GB DDR5 RAM, NVIDIA RTX 4070 8GB, 1TB PCIe NVMe SSD, 15.6" OLED 3.5K Touch display.',
    uom: 'UNIT',
    created_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 3,
    generic_name: 'High-Performance GPU Box RTX 4090',
    category_id: 1,
    part_number: 'SRV-GPU-4090-64G',
    description: 'Custom AI/ML training workstation with Dual NVIDIA RTX 4090 24GB, AMD Threadripper PRO 5955WX, 128GB ECC RAM, 4TB Gen4 SSD, Liquid Cooled.',
    uom: 'UNIT',
    created_at: '2024-03-01T10:00:00Z'
  },
  {
    id: 4,
    generic_name: 'Dell UltraSharp 32" 4K Video Conferencing Monitor',
    category_id: 1,
    part_number: 'DL-U3223QZ-4K',
    description: '31.5-inch 4K UHD IPS Black monitor with integrated 4K Sony Starvis webcam, dual 14W speakers, USB-C 90W power delivery.',
    uom: 'UNIT',
    created_at: '2024-03-05T10:00:00Z'
  },
  {
    id: 5,
    generic_name: 'Herman Miller Aeron Ergonomic Chair (Size B)',
    category_id: 3,
    part_number: 'HM-AER-B-GRF',
    description: 'Pellicle 8Z breathable mesh, PostureFit SL adjustable spinal support, fully adjustable arms with tilt limiter and forward tilt mechanism.',
    uom: 'UNIT',
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 6,
    generic_name: 'Electric Dual-Motor Sit-Stand Desk 1500mm',
    category_id: 3,
    part_number: 'DSK-SITST-150-OAK',
    description: 'Heavy duty three-stage telescopic legs, dual synchronized motors with anti-collision gyroscope, 4 memory presets, solid oak tabletop.',
    uom: 'UNIT',
    created_at: '2024-01-25T10:00:00Z'
  },
  {
    id: 7,
    generic_name: 'Fluke 289 True-RMS Industrial Data Logging Multimeter',
    category_id: 4,
    part_number: 'FLK-289-TRMS-IND',
    description: 'High performance industrial logging multimeter with TrendCapture, 50,000 count resolution, optical USB interface, low pass filter.',
    uom: 'SET',
    created_at: '2024-04-10T10:00:00Z'
  },
  {
    id: 8,
    generic_name: 'Automated CNC 5-Axis Precision Milling Unit',
    category_id: 2,
    part_number: 'CNC-5AX-HAAS-VF2',
    description: 'High speed vertical machining center with 30-pocket tool changer, 12,000 RPM spindle, high-pressure coolant through spindle, 440V 3-phase.',
    uom: 'UNIT',
    created_at: '2024-04-18T10:00:00Z'
  }
];

export const INITIAL_ASSET_ITEMS: AssetItem[] = [
  {
    id: 1,
    asset_master_id: 1,
    unique_asset_code: 'AST-ENG-2025-0012',
    serial_number: 'C02G90XXMD6M',
    purchase_cost: 3499.00,
    purchase_date: '2025-01-15',
    warranty_expiry_date: '2028-01-15',
    vendor_details: {
      vendor_name: 'Apple Enterprise Direct',
      invoice_no: 'INV-AP-88910',
      contact: 'enterprise@apple.com'
    },
    status: 'ALLOCATED',
    current_assigned_emp_id: 'EMP-104', // Alex Chen
    created_at: '2025-01-15T11:00:00Z'
  },
  {
    id: 2,
    asset_master_id: 4,
    unique_asset_code: 'AST-ENG-2025-0018',
    serial_number: 'CN-0M2789-74261-34A',
    purchase_cost: 899.00,
    purchase_date: '2025-01-20',
    warranty_expiry_date: '2028-01-20',
    vendor_details: {
      vendor_name: 'Dell Commercial Solutions',
      invoice_no: 'INV-DL-44102',
      contact: 'orders@dell.com'
    },
    status: 'ALLOCATED',
    current_assigned_emp_id: 'EMP-104', // Alex Chen
    created_at: '2025-01-20T11:00:00Z'
  },
  {
    id: 3,
    asset_master_id: 5,
    unique_asset_code: 'AST-OFE-2025-0005',
    serial_number: 'HM-AER-991204',
    purchase_cost: 1395.00,
    purchase_date: '2025-02-01',
    warranty_expiry_date: '2037-02-01',
    vendor_details: {
      vendor_name: 'Design Within Reach Corporate',
      invoice_no: 'INV-DWR-1092',
      contact: 'dwr-corp@dwr.com'
    },
    status: 'ALLOCATED',
    current_assigned_emp_id: 'EMP-102', // Sarah Jenkins
    created_at: '2025-02-01T11:00:00Z'
  },
  {
    id: 4,
    asset_master_id: 7,
    unique_asset_code: 'AST-OPS-2025-0004',
    serial_number: 'FLK-892134-A2',
    purchase_cost: 1120.00,
    purchase_date: '2025-03-05',
    warranty_expiry_date: '2027-03-05',
    vendor_details: {
      vendor_name: 'TestEquity Industrial Supply',
      invoice_no: 'INV-TE-98711',
      contact: 'sales@testequity.com'
    },
    status: 'ALLOCATED',
    current_assigned_emp_id: 'EMP-403', // Jordan Lee
    created_at: '2025-03-05T11:00:00Z'
  },
  {
    id: 5,
    asset_master_id: 2,
    unique_asset_code: 'AST-ITH-2026-0042',
    serial_number: 'DL-XP-99410384',
    purchase_cost: 2650.00,
    purchase_date: '2026-02-10',
    warranty_expiry_date: '2029-02-10',
    vendor_details: {
      vendor_name: 'Dell Commercial Solutions',
      invoice_no: 'INV-DL-55209',
      contact: 'orders@dell.com'
    },
    status: 'IN_STOCK',
    current_assigned_emp_id: null,
    created_at: '2026-02-10T14:00:00Z'
  },
  {
    id: 6,
    asset_master_id: 6,
    unique_asset_code: 'AST-OFE-2026-0099',
    serial_number: 'DSK-OAK-88712',
    purchase_cost: 750.00,
    purchase_date: '2026-03-01',
    warranty_expiry_date: '2031-03-01',
    vendor_details: {
      vendor_name: 'Apex Modern Workspace',
      invoice_no: 'INV-APX-3312',
      contact: 'hello@apexwork.com'
    },
    status: 'IN_STOCK',
    current_assigned_emp_id: null,
    created_at: '2026-03-01T14:00:00Z'
  }
];

export const INITIAL_ASSIGNMENTS: AssetAssignment[] = [
  {
    id: 1,
    asset_item_id: 1,
    emp_id: 'EMP-104',
    allocated_date: '2025-01-15T14:00:00Z',
    returned_date: null,
    condition_on_alloc: 'Brand new in sealed box, verified MDM profile loaded.',
    condition_on_return: null,
    allocated_by: 'EMP-201' // Marcus Brody (IT Admin)
  },
  {
    id: 2,
    asset_item_id: 2,
    emp_id: 'EMP-104',
    allocated_date: '2025-01-20T14:30:00Z',
    returned_date: null,
    condition_on_alloc: 'Brand new factory condition, DP & Thunderbolt cables attached.',
    condition_on_return: null,
    allocated_by: 'EMP-201'
  },
  {
    id: 3,
    asset_item_id: 3,
    emp_id: 'EMP-102',
    allocated_date: '2025-02-01T15:00:00Z',
    returned_date: null,
    condition_on_alloc: 'Fully assembled with lumbar adjustment calibrated.',
    condition_on_return: null,
    allocated_by: 'EMP-201'
  },
  {
    id: 4,
    asset_item_id: 4,
    emp_id: 'EMP-403',
    allocated_date: '2025-03-05T16:00:00Z',
    returned_date: null,
    condition_on_alloc: 'NIST traceable calibration test report enclosed.',
    condition_on_return: null,
    allocated_by: 'EMP-201'
  }
];

export const INITIAL_DYNAMIC_TEMPLATES: DynamicFormTemplate[] = [
  {
    id: 1,
    department_id: 1, // Engineering
    category_id: 1, // IT Hardware
    version: 1,
    is_active: true,
    created_at: '2025-01-10T00:00:00Z',
    form_schema: {
      title: 'Engineering High-Performance Computing Request',
      description: 'Custom hardware specification matrix for Software, AI & Firmware Engineering teams.',
      fields: [
        {
          field_key: 'device_type',
          label: 'Device Form Factor',
          ui_component: 'select',
          required: true,
          options: ['Laptop (Portability)', 'Heavy Workstation Desktop', 'Server Rack Unit', 'Dedicated High-Performance GPU Rig'],
          placeholder: 'Select preferred form factor'
        },
        {
          field_key: 'ram_gb',
          label: 'System RAM Capacity (GB)',
          ui_component: 'number_input',
          required: true,
          placeholder: '64',
          validation: { min: 16, max: 256 },
          help_text: 'Minimum 32GB recommended for local Docker & Kubernetes compilation'
        },
        {
          field_key: 'operating_system',
          label: 'Primary Operating System',
          ui_component: 'select',
          required: true,
          options: ['macOS Sequoia (Apple Silicon)', 'Ubuntu 24.04 LTS (Kernel 6.8)', 'Fedora Workstation 41', 'Windows 11 Enterprise (WSL2)']
        },
        {
          field_key: 'storage_nvme',
          label: 'Primary NVMe Storage',
          ui_component: 'select',
          required: true,
          options: ['1 TB NVMe Gen4 (Standard)', '2 TB NVMe Gen4 (High Load)', '4 TB NVMe Gen4 (Dataset Intensive)']
        },
        {
          field_key: 'software_stack',
          label: 'Pre-provisioned Engineering Toolchains',
          ui_component: 'checkbox_group',
          required: false,
          options: ['Docker Engine & Compose', 'PostgreSQL & pgAdmin', 'JDK 21 LTS', 'Node.js LTS & Bun', 'Rust Toolchain & Cargo', 'PyTorch & CUDA 12 Toolkit', 'Android Studio & NDK']
        },
        {
          field_key: 'monitor_accessory',
          label: 'Display & Docking Peripheral Needs',
          ui_component: 'select',
          required: false,
          options: ['None (Stand-alone)', 'Dual 27-inch 4K Displays + CalDigit TB4 Dock', 'Single 34-inch Curved UltraWide 144Hz + USB-C Hub']
        },
        {
          field_key: 'project_cost_center',
          label: 'Project Code / Chargeable Client Sprint',
          ui_component: 'text_input',
          required: true,
          placeholder: 'e.g. PRJ-CORE-ENG-2026'
        }
      ]
    }
  },
  {
    id: 2,
    department_id: 2, // Operations & Plant
    category_id: 2, // Machinery & Plant Systems
    version: 1,
    is_active: true,
    created_at: '2025-01-10T00:00:00Z',
    form_schema: {
      title: 'Operations Industrial Machinery & Plant Tooling Specification',
      description: 'Physical requirements, power tolerances, floor locations, and safety compliance specs.',
      fields: [
        {
          field_key: 'operating_voltage',
          label: 'Operating Voltage & Power Phase',
          ui_component: 'select',
          required: true,
          options: ['110V Single Phase (Standard Bench)', '220V Single Phase (Medium Duty)', '440V 3-Phase Industrial (Heavy Machine)']
        },
        {
          field_key: 'floor_bay_number',
          label: 'Plant Floor Bay / Production Cell Number',
          ui_component: 'text_input',
          required: true,
          placeholder: 'e.g. Cell 4B - Assembly Line North'
        },
        {
          field_key: 'calibration_req',
          label: 'Calibration & QA Accreditation Required',
          ui_component: 'select',
          required: true,
          options: ['ISO/IEC 17025 Accredited Lab Certificate', 'NIST Traceable Factory Calibration', 'Standard Internal QA Check Only']
        },
        {
          field_key: 'duty_cycle_hours',
          label: 'Expected Duty Cycle (Hours / Day)',
          ui_component: 'number_input',
          required: true,
          placeholder: '16',
          validation: { min: 1, max: 24 }
        },
        {
          field_key: 'safety_containment',
          label: 'Mandatory Safety & Containment Interlocks',
          ui_component: 'checkbox_group',
          required: false,
          options: ['Dual Emergency Stop Hardware Button', 'Plexiglass Optical Curtain Shield', 'Class IV Laser Grounding Shield', 'Positive Pressure HEPA Extraction']
        },
        {
          field_key: 'maintenance_sla',
          label: 'Vendor Service Level Agreement (SLA)',
          ui_component: 'select',
          required: true,
          options: ['4-Hour Onsite Critical Response (24x7)', 'Next Business Day Onsite Technician', 'Annual Preventive Maintenance Pack']
        }
      ]
    }
  },
  {
    id: 3,
    department_id: 5, // HR & Admin
    category_id: 3, // Office Ergonomics & Furniture
    version: 1,
    is_active: true,
    created_at: '2025-01-10T00:00:00Z',
    form_schema: {
      title: 'Office Ergonomics & Facility Accommodation Request',
      description: 'Workstation health accommodations, seating requirements and room layouts.',
      fields: [
        {
          field_key: 'accommodation_reason',
          label: 'Health / Ergonomic Assessment Status',
          ui_component: 'select',
          required: true,
          options: ['Physician / Ergonomic Specialist Recommendation', 'Scheduled 3-Year Standard Office Refresh', 'New Onboarding Setup', 'Return-to-Office Reconfiguration']
        },
        {
          field_key: 'chair_size_spec',
          label: 'Ergonomic Chair Size & Lumbar Profile',
          ui_component: 'select',
          required: true,
          options: ['Size B (Medium - Fits 5ft 3in to 6ft 0in)', 'Size C (Large - Fits 5ft 10in to 6ft 6in)', 'Size A (Small - Fits 4ft 10in to 5ft 4in)']
        },
        {
          field_key: 'desk_dimensions',
          label: 'Motorized Desk Surface Dimension',
          ui_component: 'select',
          required: true,
          options: ['1500mm x 800mm (Standard Cubicle)', '1800mm x 900mm (Executive / Lab Table)', '1200mm x 700mm (Compact Hot-Desk)']
        },
        {
          field_key: 'desk_location',
          label: 'Building Wing & Desk ID',
          ui_component: 'text_input',
          required: true,
          placeholder: 'e.g. Building B, 3rd Floor, Desk B3-14'
        },
        {
          field_key: 'additional_accessories',
          label: 'Ergonomic Support Accessories',
          ui_component: 'checkbox_group',
          required: false,
          options: ['Anti-fatigue Standing Mat', 'Adjustable Dual Monitor Arm Mount', 'Under-desk Cable Management Spine', 'Ergonomic Footrest with Tilt']
        }
      ]
    }
  }
];

export const INITIAL_REQUESTS: AssetRequest[] = [
  {
    id: 1,
    request_ticket_no: 'REQ-2026-0104',
    requested_by: 'EMP-104', // Alex Chen (Software Engineer)
    department_id: 1, // Engineering
    category_id: 1, // IT Hardware
    asset_master_id: 3, // High-Performance GPU Box RTX 4090
    purpose: 'Local LLM fine-tuning and inference latency benchmarking for client real-time search pilot without relying on cloud rate limits.',
    urgency: 'Critical',
    current_stage: 'PENDING_LINE_APPROVAL',
    line_approval_step: 'L1', // Pending Sarah Jenkins (or MD pre-empt)
    custom_field_values: {
      device_type: 'Dedicated High-Performance GPU Rig',
      ram_gb: 128,
      operating_system: 'Ubuntu 24.04 LTS (Kernel 6.8)',
      storage_nvme: '4 TB NVMe Gen4 (Dataset Intensive)',
      software_stack: ['Docker Engine & Compose', 'PyTorch & CUDA 12 Toolkit', 'PostgreSQL & pgAdmin'],
      monitor_accessory: 'Dual 27-inch 4K Displays + CalDigit TB4 Dock',
      project_cost_center: 'PRJ-AI-MODEL-PILOT'
    },
    created_at: '2026-03-24T09:30:00Z'
  },
  {
    id: 2,
    request_ticket_no: 'REQ-2026-0098',
    requested_by: 'EMP-105', // Mei Lin (Senior Software Engineer)
    department_id: 1,
    category_id: 1,
    asset_master_id: 2, // Dell XPS 15 Workstation 9530
    purpose: 'Replacement workstation for client on-premise infrastructure deployment sprints.',
    urgency: 'Urgent',
    current_stage: 'IT_SOURCING',
    line_approval_step: 'COMPLETED',
    custom_field_values: {
      device_type: 'Heavy Workstation Desktop',
      ram_gb: 64,
      operating_system: 'Windows 11 Enterprise (WSL2)',
      storage_nvme: '2 TB NVMe Gen4 (High Load)',
      software_stack: ['Docker Engine & Compose', 'JDK 21 LTS', 'Node.js LTS & Bun'],
      project_cost_center: 'PRJ-INFRA-SPRINT'
    },
    created_at: '2026-03-21T11:15:00Z'
  },
  {
    id: 3,
    request_ticket_no: 'REQ-2026-0082',
    requested_by: 'EMP-403', // Jordan Lee (Operations Technician)
    department_id: 2, // Operations
    category_id: 2, // Machinery / Testing
    asset_master_id: 8, // Automated CNC 5-Axis
    purpose: 'Precision tooling expansion for production line B to machine rapid titanium motor casing prototypes in-house.',
    urgency: 'Critical',
    current_stage: 'PENDING_FINANCE_BUDGET',
    line_approval_step: 'COMPLETED',
    budget_approval_step: 'FINANCE_L1', // Waiting on Priya Sharma or CFO Arthur Pendelton direct clearance
    custom_field_values: {
      operating_voltage: '440V 3-Phase Industrial (Heavy Machine)',
      floor_bay_number: 'Bay 7 - High Precision CNC Wing',
      calibration_req: 'ISO/IEC 17025 Accredited Lab Certificate',
      duty_cycle_hours: 18,
      safety_containment: ['Dual Emergency Stop Hardware Button', 'Class IV Laser Grounding Shield', 'Positive Pressure HEPA Extraction'],
      maintenance_sla: '4-Hour Onsite Critical Response (24x7)'
    },
    created_at: '2026-03-15T08:00:00Z'
  },
  {
    id: 4,
    request_ticket_no: 'REQ-2026-0065',
    requested_by: 'EMP-102', // Sarah Jenkins (Manager)
    department_id: 1,
    category_id: 3, // Office Ergonomics
    asset_master_id: 6, // Electric Dual-Motor Sit-Stand Desk
    purpose: 'Ergonomic Sit-Stand desk accommodation for ongoing team collaboration zone.',
    urgency: 'Standard',
    current_stage: 'DELIVERED_PENDING_TAGGING', // IT Intake & Barcode Allocation Console ready!
    line_approval_step: 'COMPLETED',
    budget_approval_step: 'CLEARED',
    custom_field_values: {
      accommodation_reason: 'Scheduled 3-Year Standard Office Refresh',
      chair_size_spec: 'Size B (Medium - Fits 5ft 3in to 6ft 0in)',
      desk_dimensions: '1800mm x 900mm (Executive / Lab Table)',
      desk_location: 'Building B, 2nd Floor, Pod 2C',
      additional_accessories: ['Anti-fatigue Standing Mat', 'Adjustable Dual Monitor Arm Mount']
    },
    created_at: '2026-03-05T14:20:00Z'
  },
  {
    id: 5,
    request_ticket_no: 'REQ-2025-0012',
    requested_by: 'EMP-104',
    department_id: 1,
    category_id: 1,
    asset_master_id: 1,
    purpose: 'Standard onboarding engineering workstation setup.',
    urgency: 'Standard',
    current_stage: 'ALLOCATED_CLOSED',
    line_approval_step: 'COMPLETED',
    budget_approval_step: 'CLEARED',
    custom_field_values: {
      device_type: 'Laptop (Portability)',
      ram_gb: 36,
      operating_system: 'macOS Sequoia (Apple Silicon)',
      storage_nvme: '1 TB NVMe Gen4 (Standard)',
      software_stack: ['Docker Engine & Compose', 'Node.js LTS & Bun', 'Rust Toolchain & Cargo']
    },
    created_at: '2025-01-10T10:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: ApprovalAuditLog[] = [
  {
    id: 1,
    request_id: 2,
    approval_flow_type: 'HIERARCHY_REQUEST',
    approver_id: 'EMP-102', // Sarah Jenkins
    approver_role_executed: 'L1',
    action: 'APPROVED',
    comments: 'Reviewed sprint workloads; allocation justified for urgent client deployment.',
    action_timestamp: '2026-03-21T13:40:00Z'
  },
  {
    id: 2,
    request_id: 2,
    approval_flow_type: 'HIERARCHY_REQUEST',
    approver_id: 'EMP-001', // Eleanor Vance (MD)
    approver_role_executed: 'MD',
    action: 'BYPASS_APPROVED',
    comments: 'MD Direct Approval: Pre-empted remaining queue. Expedite procurement via IT team immediately.',
    action_timestamp: '2026-03-22T09:10:00Z'
  },
  {
    id: 3,
    request_id: 3,
    approval_flow_type: 'HIERARCHY_REQUEST',
    approver_id: 'EMP-402',
    approver_role_executed: 'L1',
    action: 'APPROVED',
    comments: 'Verified plant capacity and floor bay readiness.',
    action_timestamp: '2026-03-15T10:30:00Z'
  },
  {
    id: 4,
    request_id: 3,
    approval_flow_type: 'HIERARCHY_REQUEST',
    approver_id: 'EMP-401',
    approver_role_executed: 'L2',
    action: 'APPROVED',
    comments: 'Operations department head sign-off for manufacturing expansion.',
    action_timestamp: '2026-03-16T11:00:00Z'
  },
  {
    id: 5,
    request_id: 3,
    approval_flow_type: 'HIERARCHY_REQUEST',
    approver_id: 'EMP-001',
    approver_role_executed: 'MD',
    action: 'APPROVED',
    comments: 'MD approval granted. Proceed to IT/Ops sourcing for vendor quotations.',
    action_timestamp: '2026-03-17T14:15:00Z'
  },
  {
    id: 6,
    request_id: 4,
    approval_flow_type: 'HIERARCHY_REQUEST',
    approver_id: 'EMP-001',
    approver_role_executed: 'MD',
    action: 'BYPASS_APPROVED',
    comments: 'Direct executive clearance for workplace accommodation.',
    action_timestamp: '2026-03-06T10:00:00Z'
  },
  {
    id: 7,
    request_id: 4,
    approval_flow_type: 'FINANCE_BUDGET',
    approver_id: 'EMP-300', // Arthur Pendelton (CFO)
    approver_role_executed: 'FINANCE_HEAD',
    action: 'BYPASS_APPROVED',
    comments: 'CFO Direct Budget Clearance: Approved under Q1 facilities allocation. PO released.',
    action_timestamp: '2026-03-08T15:20:00Z'
  }
];

export const INITIAL_PROCUREMENT_ORDERS: ProcurementOrder[] = [
  {
    id: 1,
    request_id: 3,
    vendor_name: 'Haas Automation Western Direct',
    quotation_number: 'QT-HAAS-2026-8819',
    quotation_amount: 54500.00,
    quotation_attachment_url: 'https://docs.aegis-corp.internal/quotes/QT-HAAS-8819.pdf',
    currency: 'USD',
    it_poc_id: 'EMP-201', // Marcus Brody
    budget_status: 'PENDING_FINANCE_L1',
    delivery_eta: '2026-04-20',
    notes: 'Includes installation, 3-phase hookup certification, and 12-month onsite warranty.',
    created_at: '2026-03-18T16:00:00Z'
  },
  {
    id: 2,
    request_id: 4,
    vendor_name: 'Apex Modern Workspace Solutions',
    quotation_number: 'QT-APX-9941',
    quotation_amount: 750.00,
    quotation_attachment_url: 'https://docs.aegis-corp.internal/quotes/QT-APX-9941.pdf',
    currency: 'USD',
    it_poc_id: 'EMP-201',
    budget_status: 'APPROVED',
    po_number: 'PO-AEGIS-2026-0044',
    delivery_eta: '2026-03-24',
    notes: 'Delivery received at Dock 2. Waiting for IT barcoding & barcode tag stickering.',
    created_at: '2026-03-07T11:00:00Z'
  }
];
