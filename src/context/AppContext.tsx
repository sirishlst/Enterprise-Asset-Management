import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ProcurementOrder,
  RequestStage,
  LineApprovalStep,
  BudgetApprovalStep,
  AuditAction
} from '../types';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DESIGNATIONS,
  INITIAL_ROLES,
  INITIAL_EMPLOYEES,
  INITIAL_CATEGORIES,
  INITIAL_ASSET_MASTERS,
  INITIAL_ASSET_ITEMS,
  INITIAL_ASSIGNMENTS,
  INITIAL_DYNAMIC_TEMPLATES,
  INITIAL_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PROCUREMENT_ORDERS
} from '../data/initialData';

interface AppContextType {
  // Current user & persona
  currentEmployee: Employee;
  setCurrentEmployeeId: (empId: string) => void;

  // Master collections
  departments: Department[];
  designations: Designation[];
  roles: Role[];
  employees: Employee[];
  categories: AssetCategory[];
  assetMasters: AssetMaster[];
  assetItems: AssetItem[];
  assignments: AssetAssignment[];
  dynamicTemplates: DynamicFormTemplate[];
  requests: AssetRequest[];
  auditLogs: ApprovalAuditLog[];
  procurementOrders: ProcurementOrder[];

  // Helper functions
  getEmployee: (empId: string | null) => Employee | undefined;
  getDepartment: (deptId: number) => Department | undefined;
  getDesignation: (desigId: number) => Designation | undefined;
  getRole: (roleId: number) => Role | undefined;
  getCategory: (catId: number) => AssetCategory | undefined;
  getAssetMaster: (masterId: number) => AssetMaster | undefined;
  getReportingChain: (empId: string) => {
    requester: Employee;
    l1Manager?: Employee;
    l2Head?: Employee;
    md?: Employee;
  };
  getTemplateFor: (departmentId: number, categoryId: number) => DynamicFormTemplate | undefined;

  // Actions
  createRequest: (payload: {
    department_id: number;
    category_id: number;
    asset_master_id: number;
    purpose: string;
    urgency: 'Standard' | 'Urgent' | 'Critical';
    custom_field_values: Record<string, any>;
  }) => AssetRequest;

  approveLineRequest: (
    requestId: number,
    approverRole: 'L1' | 'L2' | 'MD',
    isBypassOrPreempt: boolean,
    comments: string
  ) => void;

  rejectLineRequest: (
    requestId: number,
    approverRole: 'L1' | 'L2' | 'MD',
    reason: string
  ) => void;

  submitProcurementProposal: (
    requestId: number,
    order: {
      vendor_name: string;
      quotation_number: string;
      quotation_amount: number;
      quotation_attachment_url?: string;
      currency: string;
      delivery_eta?: string;
      notes?: string;
    }
  ) => void;

  approveBudgetProposal: (
    requestId: number,
    approverRole: 'FINANCE_L1' | 'FINANCE_HEAD',
    isDirectClearance: boolean,
    comments: string
  ) => void;

  rejectBudgetProposal: (
    requestId: number,
    approverRole: 'FINANCE_L1' | 'FINANCE_HEAD',
    reason: string
  ) => void;

  completeAssetIntakeAndAllocation: (
    requestId: number,
    data: {
      serial_number: string;
      unique_asset_code: string;
      purchase_cost: number;
      warranty_expiry_date: string;
      condition: string;
      vendor_name: string;
    }
  ) => AssetItem;

  saveDynamicTemplate: (template: DynamicFormTemplate) => void;

  // Admin Master CRUD
  saveEmployee: (emp: Employee) => void;
  updateEmployeeReportingAndRole: (
    empId: string,
    updates: { reporting_manager_id?: string | null; role_id?: number; designation_id?: number; department_id?: number }
  ) => void;
  saveDepartment: (dept: Department) => void;
  saveDesignation: (desig: Designation) => void;
  saveAssetMaster: (master: AssetMaster) => void;
  saveAssetCategory: (category: AssetCategory) => void;
  processAssetReturn: (assignmentId: number, condition: string, nextStatus: 'IN_STOCK' | 'UNDER_MAINTENANCE' | 'SCRAPPED') => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'aegis_asset_mgnt_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Failed to load storage for key: ${key}`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save storage for key: ${key}`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(() =>
    loadFromStorage('departments', INITIAL_DEPARTMENTS)
  );
  const [designations, setDesignations] = useState<Designation[]>(() =>
    loadFromStorage('designations', INITIAL_DESIGNATIONS)
  );
  const [roles] = useState<Role[]>(INITIAL_ROLES);
  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadFromStorage('employees', INITIAL_EMPLOYEES)
  );
  const [categories, setCategories] = useState<AssetCategory[]>(() =>
    loadFromStorage('categories', INITIAL_CATEGORIES)
  );
  const [assetMasters, setAssetMasters] = useState<AssetMaster[]>(() =>
    loadFromStorage('asset_masters', INITIAL_ASSET_MASTERS)
  );
  const [assetItems, setAssetItems] = useState<AssetItem[]>(() =>
    loadFromStorage('asset_items', INITIAL_ASSET_ITEMS)
  );
  const [assignments, setAssignments] = useState<AssetAssignment[]>(() =>
    loadFromStorage('assignments', INITIAL_ASSIGNMENTS)
  );
  const [dynamicTemplates, setDynamicTemplates] = useState<DynamicFormTemplate[]>(() =>
    loadFromStorage('dynamic_templates', INITIAL_DYNAMIC_TEMPLATES)
  );
  const [requests, setRequests] = useState<AssetRequest[]>(() =>
    loadFromStorage('requests', INITIAL_REQUESTS)
  );
  const [auditLogs, setAuditLogs] = useState<ApprovalAuditLog[]>(() =>
    loadFromStorage('audit_logs', INITIAL_AUDIT_LOGS)
  );
  const [procurementOrders, setProcurementOrders] = useState<ProcurementOrder[]>(() =>
    loadFromStorage('procurement_orders', INITIAL_PROCUREMENT_ORDERS)
  );

  // Active persona
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>(() =>
    loadFromStorage('current_employee_id', 'EMP-104') // Default: Alex Chen (Software Engineer)
  );

  // Sync to local storage
  useEffect(() => saveToStorage('departments', departments), [departments]);
  useEffect(() => saveToStorage('designations', designations), [designations]);
  useEffect(() => saveToStorage('employees', employees), [employees]);
  useEffect(() => saveToStorage('categories', categories), [categories]);
  useEffect(() => saveToStorage('asset_masters', assetMasters), [assetMasters]);
  useEffect(() => saveToStorage('asset_items', assetItems), [assetItems]);
  useEffect(() => saveToStorage('assignments', assignments), [assignments]);
  useEffect(() => saveToStorage('dynamic_templates', dynamicTemplates), [dynamicTemplates]);
  useEffect(() => saveToStorage('requests', requests), [requests]);
  useEffect(() => saveToStorage('audit_logs', auditLogs), [auditLogs]);
  useEffect(() => saveToStorage('procurement_orders', procurementOrders), [procurementOrders]);
  useEffect(() => saveToStorage('current_employee_id', currentEmployeeId), [currentEmployeeId]);

  const currentEmployee = employees.find(e => e.emp_id === currentEmployeeId) || employees[0];

  const getEmployee = (empId: string | null) => {
    if (!empId) return undefined;
    return employees.find(e => e.emp_id === empId);
  };

  const getDepartment = (deptId: number) => departments.find(d => d.id === deptId);
  const getDesignation = (desigId: number) => designations.find(d => d.id === desigId);
  const getRole = (roleId: number) => roles.find(r => r.id === roleId);
  const getCategory = (catId: number) => categories.find(c => c.id === catId);
  const getAssetMaster = (masterId: number) => assetMasters.find(m => m.id === masterId);

  // Calculate full reporting chain for an employee
  const getReportingChain = (empId: string) => {
    const requester = employees.find(e => e.emp_id === empId)!;
    let l1Manager: Employee | undefined;
    let l2Head: Employee | undefined;

    // MD is always the top executive role
    const md = employees.find(e => {
      const r = roles.find(role => role.id === e.role_id);
      return r?.name === 'MD';
    });

    if (requester.reporting_manager_id) {
      l1Manager = employees.find(e => e.emp_id === requester.reporting_manager_id);
      if (l1Manager && l1Manager.reporting_manager_id && l1Manager.reporting_manager_id !== md?.emp_id) {
        l2Head = employees.find(e => e.emp_id === l1Manager!.reporting_manager_id);
      } else if (l1Manager && l1Manager.emp_id === md?.emp_id) {
        // Reporting directly to MD
        l1Manager = md;
      }
    }

    // If no distinct l2Head found, check for DEPT_HEAD in same department
    if (!l2Head && l1Manager && l1Manager.role_id !== 6 && l1Manager.emp_id !== md?.emp_id) {
      l2Head = employees.find(e => e.department_id === requester.department_id && e.role_id === 6);
    }

    return { requester, l1Manager, l2Head, md };
  };

  const getTemplateFor = (departmentId: number, categoryId: number) => {
    const directMatch = dynamicTemplates.find(
      t => t.is_active && t.department_id === departmentId && t.category_id === categoryId
    );
    if (directMatch) return directMatch;
    // Fallback: match category or department
    return dynamicTemplates.find(t => t.category_id === categoryId) || dynamicTemplates[0];
  };

  const createRequest = (payload: {
    department_id: number;
    category_id: number;
    asset_master_id: number;
    purpose: string;
    urgency: 'Standard' | 'Urgent' | 'Critical';
    custom_field_values: Record<string, any>;
  }): AssetRequest => {
    const ticketNo = `REQ-2026-${String(requests.length + 101).padStart(4, '0')}`;
    const newRequest: AssetRequest = {
      id: Date.now(),
      request_ticket_no: ticketNo,
      requested_by: currentEmployee.emp_id,
      department_id: payload.department_id,
      category_id: payload.category_id,
      asset_master_id: payload.asset_master_id,
      purpose: payload.purpose,
      urgency: payload.urgency,
      current_stage: 'PENDING_LINE_APPROVAL',
      line_approval_step: 'L1',
      custom_field_values: payload.custom_field_values,
      created_at: new Date().toISOString()
    };

    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const approveLineRequest = (
    requestId: number,
    approverRole: 'L1' | 'L2' | 'MD',
    isBypassOrPreempt: boolean,
    comments: string
  ) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;

        let nextStage: RequestStage = req.current_stage;
        let nextStep: LineApprovalStep = req.line_approval_step;

        if (approverRole === 'MD') {
          // MD short-circuits directly to IT Sourcing!
          nextStage = 'IT_SOURCING';
          nextStep = 'COMPLETED';
        } else if (approverRole === 'L2') {
          // L2 approval moves directly to MD approval
          nextStage = 'PENDING_MD_APPROVAL';
          nextStep = 'MD';
        } else if (approverRole === 'L1') {
          // L1 approval moves to L2 (or MD if no L2 needed)
          const chain = getReportingChain(req.requested_by);
          if (chain.l2Head) {
            nextStage = 'PENDING_LINE_APPROVAL';
            nextStep = 'L2';
          } else {
            nextStage = 'PENDING_MD_APPROVAL';
            nextStep = 'MD';
          }
        }

        return {
          ...req,
          current_stage: nextStage,
          line_approval_step: nextStep
        };
      })
    );

    // Record audit log
    const auditAction: AuditAction = isBypassOrPreempt ? 'BYPASS_APPROVED' : 'APPROVED';
    const newLog: ApprovalAuditLog = {
      id: Date.now(),
      request_id: requestId,
      approval_flow_type: 'HIERARCHY_REQUEST',
      approver_id: currentEmployee.emp_id,
      approver_role_executed: approverRole,
      action: auditAction,
      comments: comments || (isBypassOrPreempt ? `${approverRole} Direct Bypass Clearance` : `Approved by ${approverRole}`),
      action_timestamp: new Date().toISOString()
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const rejectLineRequest = (
    requestId: number,
    approverRole: 'L1' | 'L2' | 'MD',
    reason: string
  ) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          current_stage: 'REJECTED',
          rejection_reason: reason
        };
      })
    );

    const newLog: ApprovalAuditLog = {
      id: Date.now(),
      request_id: requestId,
      approval_flow_type: 'HIERARCHY_REQUEST',
      approver_id: currentEmployee.emp_id,
      approver_role_executed: approverRole,
      action: 'REJECTED',
      comments: reason,
      action_timestamp: new Date().toISOString()
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const submitProcurementProposal = (
    requestId: number,
    order: {
      vendor_name: string;
      quotation_number: string;
      quotation_amount: number;
      quotation_attachment_url?: string;
      currency: string;
      delivery_eta?: string;
      notes?: string;
    }
  ) => {
    const newOrder: ProcurementOrder = {
      id: Date.now(),
      request_id: requestId,
      vendor_name: order.vendor_name,
      quotation_number: order.quotation_number,
      quotation_amount: order.quotation_amount,
      quotation_attachment_url: order.quotation_attachment_url || 'https://docs.aegis-corp.internal/quotes/' + order.quotation_number + '.pdf',
      currency: order.currency,
      it_poc_id: currentEmployee.emp_id,
      budget_status: 'PENDING_FINANCE_L1',
      delivery_eta: order.delivery_eta,
      notes: order.notes,
      created_at: new Date().toISOString()
    };

    setProcurementOrders(prev => {
      const filtered = prev.filter(p => p.request_id !== requestId);
      return [newOrder, ...filtered];
    });

    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          current_stage: 'PENDING_FINANCE_BUDGET',
          budget_approval_step: 'FINANCE_L1'
        };
      })
    );
  };

  const approveBudgetProposal = (
    requestId: number,
    approverRole: 'FINANCE_L1' | 'FINANCE_HEAD',
    isDirectClearance: boolean,
    comments: string
  ) => {
    const isFinalApproval = approverRole === 'FINANCE_HEAD' || isDirectClearance;
    const poNumber = `PO-AEGIS-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;

    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;
        if (isFinalApproval) {
          return {
            ...req,
            current_stage: 'DELIVERED_PENDING_TAGGING',
            budget_approval_step: 'CLEARED'
          };
        } else {
          return {
            ...req,
            budget_approval_step: 'FINANCE_HEAD'
          };
        }
      })
    );

    setProcurementOrders(prev =>
      prev.map(order => {
        if (order.request_id !== requestId) return order;
        return {
          ...order,
          budget_status: isFinalApproval ? 'APPROVED' : 'PENDING_FINANCE_HEAD',
          po_number: isFinalApproval ? (order.po_number || poNumber) : undefined
        };
      })
    );

    const newLog: ApprovalAuditLog = {
      id: Date.now(),
      request_id: requestId,
      approval_flow_type: 'FINANCE_BUDGET',
      approver_id: currentEmployee.emp_id,
      approver_role_executed: approverRole,
      action: isDirectClearance ? 'BYPASS_APPROVED' : 'APPROVED',
      comments: comments || (isDirectClearance ? 'CFO Direct Final Budget Clearance. PO released.' : 'Finance L1 sign-off. Routed to CFO.'),
      action_timestamp: new Date().toISOString()
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const rejectBudgetProposal = (
    requestId: number,
    approverRole: 'FINANCE_L1' | 'FINANCE_HEAD',
    reason: string
  ) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          current_stage: 'REJECTED',
          rejection_reason: `Finance Budget Rejection: ${reason}`
        };
      })
    );

    setProcurementOrders(prev =>
      prev.map(order => {
        if (order.request_id !== requestId) return order;
        return {
          ...order,
          budget_status: 'REJECTED'
        };
      })
    );

    const newLog: ApprovalAuditLog = {
      id: Date.now(),
      request_id: requestId,
      approval_flow_type: 'FINANCE_BUDGET',
      approver_id: currentEmployee.emp_id,
      approver_role_executed: approverRole,
      action: 'REJECTED',
      comments: reason,
      action_timestamp: new Date().toISOString()
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const completeAssetIntakeAndAllocation = (
    requestId: number,
    data: {
      serial_number: string;
      unique_asset_code: string;
      purchase_cost: number;
      warranty_expiry_date: string;
      condition: string;
      vendor_name: string;
    }
  ): AssetItem => {
    const targetReq = requests.find(r => r.id === requestId);
    if (!targetReq) throw new Error('Request ticket not found');

    const newItem: AssetItem = {
      id: Date.now(),
      asset_master_id: targetReq.asset_master_id,
      unique_asset_code: data.unique_asset_code,
      serial_number: data.serial_number,
      purchase_cost: data.purchase_cost,
      purchase_date: new Date().toISOString().split('T')[0],
      warranty_expiry_date: data.warranty_expiry_date,
      vendor_details: {
        vendor_name: data.vendor_name,
        invoice_no: `INV-AUTO-${Math.floor(10000 + Math.random() * 90000)}`
      },
      status: 'ALLOCATED',
      current_assigned_emp_id: targetReq.requested_by,
      created_at: new Date().toISOString()
    };

    const newAssignment: AssetAssignment = {
      id: Date.now(),
      asset_item_id: newItem.id,
      emp_id: targetReq.requested_by,
      allocated_date: new Date().toISOString(),
      returned_date: null,
      condition_on_alloc: data.condition || 'Brand new, tested & operational.',
      condition_on_return: null,
      allocated_by: currentEmployee.emp_id
    };

    setAssetItems(prev => [newItem, ...prev]);
    setAssignments(prev => [newAssignment, ...prev]);

    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          current_stage: 'ALLOCATED_CLOSED'
        };
      })
    );

    return newItem;
  };

  const saveDynamicTemplate = (template: DynamicFormTemplate) => {
    setDynamicTemplates(prev => {
      const existsIndex = prev.findIndex(t => t.id === template.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = template;
        return copy;
      } else {
        return [template, ...prev];
      }
    });
  };

  const saveEmployee = (emp: Employee) => {
    setEmployees(prev => {
      const idx = prev.findIndex(e => e.emp_id === emp.emp_id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = emp;
        return copy;
      }
      return [...prev, emp];
    });
  };

  const updateEmployeeReportingAndRole = (
    empId: string,
    updates: { reporting_manager_id?: string | null; role_id?: number; designation_id?: number; department_id?: number }
  ) => {
    setEmployees(prev =>
      prev.map(e => {
        if (e.emp_id !== empId) return e;
        return {
          ...e,
          ...updates
        };
      })
    );
  };

  const saveDepartment = (dept: Department) => {
    setDepartments(prev => {
      const idx = prev.findIndex(d => d.id === dept.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = dept;
        return copy;
      }
      return [...prev, dept];
    });
  };

  const saveDesignation = (desig: Designation) => {
    setDesignations(prev => {
      const idx = prev.findIndex(d => d.id === desig.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = desig;
        return copy;
      }
      return [...prev, desig];
    });
  };

  const saveAssetMaster = (master: AssetMaster) => {
    setAssetMasters(prev => {
      const idx = prev.findIndex(m => m.id === master.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = master;
        return copy;
      }
      return [...prev, master];
    });
  };

  const saveAssetCategory = (category: AssetCategory) => {
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === category.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = category;
        return copy;
      }
      return [...prev, category];
    });
  };

  const processAssetReturn = (
    assignmentId: number,
    condition: string,
    nextStatus: 'IN_STOCK' | 'UNDER_MAINTENANCE' | 'SCRAPPED'
  ) => {
    const targetAssignment = assignments.find(a => a.id === assignmentId);
    if (!targetAssignment) return;

    setAssignments(prev =>
      prev.map(a => {
        if (a.id !== assignmentId) return a;
        return {
          ...a,
          returned_date: new Date().toISOString(),
          condition_on_return: condition
        };
      })
    );

    setAssetItems(prev =>
      prev.map(item => {
        if (item.id !== targetAssignment.asset_item_id) return item;
        return {
          ...item,
          status: nextStatus,
          current_assigned_emp_id: null
        };
      })
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setDepartments(INITIAL_DEPARTMENTS);
    setDesignations(INITIAL_DESIGNATIONS);
    setEmployees(INITIAL_EMPLOYEES);
    setCategories(INITIAL_CATEGORIES);
    setAssetMasters(INITIAL_ASSET_MASTERS);
    setAssetItems(INITIAL_ASSET_ITEMS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setDynamicTemplates(INITIAL_DYNAMIC_TEMPLATES);
    setRequests(INITIAL_REQUESTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setProcurementOrders(INITIAL_PROCUREMENT_ORDERS);
    setCurrentEmployeeId('EMP-104');
  };

  return (
    <AppContext.Provider
      value={{
        currentEmployee,
        setCurrentEmployeeId,
        departments,
        designations,
        roles,
        employees,
        categories,
        assetMasters,
        assetItems,
        assignments,
        dynamicTemplates,
        requests,
        auditLogs,
        procurementOrders,
        getEmployee,
        getDepartment,
        getDesignation,
        getRole,
        getCategory,
        getAssetMaster,
        getReportingChain,
        getTemplateFor,
        createRequest,
        approveLineRequest,
        rejectLineRequest,
        submitProcurementProposal,
        approveBudgetProposal,
        rejectBudgetProposal,
        completeAssetIntakeAndAllocation,
        saveDynamicTemplate,
        saveEmployee,
        updateEmployeeReportingAndRole,
        saveDepartment,
        saveDesignation,
        saveAssetMaster,
        saveAssetCategory,
        processAssetReturn,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
