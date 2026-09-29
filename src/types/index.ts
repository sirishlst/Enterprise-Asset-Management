export type RoleCode = 
  | 'SUPER_ADMIN' 
  | 'MD' 
  | 'FINANCE_HEAD' 
  | 'FINANCE_L1' 
  | 'IT_ADMIN' 
  | 'DEPT_HEAD' 
  | 'EMPLOYEE';

export interface Department {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

export interface Designation {
  id: number;
  name: string;
  level: number; // 1: Junior, 2: Mid/Senior, 3: Manager (L1), 4: Dept Head/VP (L2), 5: Executive/MD
  is_active: boolean;
}

export interface Role {
  id: number;
  name: RoleCode;
  description: string;
}

export interface Employee {
  emp_id: string;
  emp_name: string;
  email: string;
  contact_no: string;
  home_contact_no?: string;
  address?: string;
  department_id: number;
  designation_id: number;
  reporting_manager_id: string | null;
  role_id: number;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface AssetCategory {
  id: number;
  name: string;
  code: string;
  depreciation_rate: number; // percentage per year
  icon?: string;
}

export interface AssetMaster {
  id: number;
  generic_name: string;
  category_id: number;
  part_number: string;
  description: string;
  uom: 'UNIT' | 'SET' | 'MTR' | 'PACK';
  created_at: string;
}

export type AssetStatus = 
  | 'IN_STOCK' 
  | 'ALLOCATED' 
  | 'UNDER_MAINTENANCE' 
  | 'SCRAPPED' 
  | 'IN_PROCUREMENT';

export interface AssetItem {
  id: number;
  asset_master_id: number;
  unique_asset_code: string; // e.g. AST-ENG-2026-0042
  serial_number: string;
  purchase_cost: number;
  purchase_date: string;
  warranty_expiry_date: string;
  vendor_details: {
    vendor_name: string;
    invoice_no?: string;
    contact?: string;
  };
  status: AssetStatus;
  current_assigned_emp_id: string | null;
  created_at: string;
}

export interface AssetAssignment {
  id: number;
  asset_item_id: number;
  emp_id: string;
  allocated_date: string;
  returned_date: string | null;
  condition_on_alloc: string;
  condition_on_return: string | null;
  allocated_by: string; // emp_id
}

export type UIComponentType = 
  | 'select' 
  | 'number_input' 
  | 'text_input' 
  | 'checkbox_group' 
  | 'file_upload' 
  | 'date_picker' 
  | 'textarea';

export interface FormField {
  field_key: string;
  label: string;
  ui_component: UIComponentType;
  required: boolean;
  options?: string[];
  placeholder?: string;
  help_text?: string;
  validation?: {
    min?: number;
    max?: number;
    allowed_extensions?: string[];
    max_size_mb?: number;
  };
}

export interface DynamicFormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface DynamicFormTemplate {
  id: number;
  department_id: number;
  category_id: number;
  version: number;
  form_schema: DynamicFormSchema;
  is_active: boolean;
  created_at: string;
}

export type RequestStage =
  | 'DRAFT'
  | 'PENDING_LINE_APPROVAL'
  | 'PENDING_MD_APPROVAL'
  | 'IT_SOURCING'
  | 'PENDING_FINANCE_BUDGET'
  | 'PO_RAISED'
  | 'DELIVERED_PENDING_TAGGING'
  | 'ALLOCATED_CLOSED'
  | 'REJECTED';

export type LineApprovalStep = 'L1' | 'L2' | 'MD' | 'COMPLETED';
export type BudgetApprovalStep = 'FINANCE_L1' | 'FINANCE_HEAD' | 'CLEARED';

export interface AssetRequest {
  id: number;
  request_ticket_no: string; // e.g. REQ-2026-0104
  requested_by: string; // emp_id
  department_id: number;
  category_id: number;
  asset_master_id: number;
  purpose: string;
  urgency: 'Standard' | 'Urgent' | 'Critical';
  current_stage: RequestStage;
  line_approval_step: LineApprovalStep;
  budget_approval_step?: BudgetApprovalStep;
  custom_field_values: Record<string, any>;
  rejection_reason?: string;
  created_at: string;
}

export type AuditAction = 'APPROVED' | 'REJECTED' | 'BYPASS_APPROVED' | 'PRE_EMPTED';

export interface ApprovalAuditLog {
  id: number;
  request_id: number;
  approval_flow_type: 'HIERARCHY_REQUEST' | 'FINANCE_BUDGET';
  approver_id: string; // emp_id
  approver_role_executed: 'L1' | 'L2' | 'MD' | 'FINANCE_L1' | 'FINANCE_HEAD';
  action: AuditAction;
  comments: string;
  action_timestamp: string;
}

export interface ProcurementOrder {
  id: number;
  request_id: number;
  vendor_name: string;
  quotation_number: string;
  quotation_amount: number;
  quotation_attachment_url?: string;
  currency: string;
  it_poc_id: string;
  budget_status: 'PENDING_FINANCE_L1' | 'PENDING_FINANCE_HEAD' | 'APPROVED' | 'REJECTED';
  po_number?: string;
  delivery_eta?: string;
  notes?: string;
  created_at: string;
}
