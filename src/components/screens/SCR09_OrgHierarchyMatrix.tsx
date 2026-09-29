import React, { useState } from 'react';
import {
  Network,
  Users,
  Shield,
  Building,
  UserPlus,
  Edit2,
  CheckCircle2,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Zap,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Employee, Department, Designation } from '../../types';

export const SCR09_OrgHierarchyMatrix: React.FC = () => {
  const {
    employees,
    departments,
    designations,
    roles,
    getEmployee,
    getDepartment,
    getDesignation,
    getRole,
    saveEmployee,
    updateEmployeeReportingAndRole,
    saveDepartment,
    saveDesignation
  } = useApp();

  const [activeTab, setActiveTab] = useState<'TREE' | 'GOVERNANCE' | 'EMPLOYEES' | 'MASTERS'>('TREE');

  // Employee Edit / Add Modal
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [isAddEmpModal, setIsAddEmpModal] = useState(false);

  // Form fields for employee
  const [empId, setEmpId] = useState('');
  const [empName, setEmpName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [homeContactNo, setHomeContactNo] = useState('');
  const [address, setAddress] = useState('');
  const [deptId, setDeptId] = useState<number>(departments[0]?.id || 1);
  const [desigId, setDesigId] = useState<number>(designations[0]?.id || 1);
  const [managerId, setManagerId] = useState<string>('');
  const [roleId, setRoleId] = useState<number>(roles[6]?.id || 7);

  // Master Modals
  const [isDeptModal, setIsDeptModal] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');

  const [isDesigModal, setIsDesigModal] = useState(false);
  const [desigName, setDesigName] = useState('');
  const [desigLevel, setDesigLevel] = useState<number>(1);

  // Handle open add modal
  const handleOpenAddEmp = () => {
    const nextId = `EMP-${String(employees.length + 101).padStart(3, '0')}`;
    setEmpId(nextId);
    setEmpName('');
    setEmail('');
    setContactNo('+1 (555) 000-0000');
    setHomeContactNo('+1 (555) 111-2222');
    setAddress('San Francisco Office, CA');
    setDeptId(departments[0]?.id || 1);
    setDesigId(designations[0]?.id || 1);
    setManagerId('EMP-102');
    setRoleId(7);
    setIsAddEmpModal(true);
  };

  // Handle open edit modal
  const handleOpenEditEmp = (emp: Employee) => {
    setEditingEmp(emp);
    setEmpId(emp.emp_id);
    setEmpName(emp.emp_name);
    setEmail(emp.email);
    setContactNo(emp.contact_no);
    setHomeContactNo(emp.home_contact_no || '');
    setAddress(emp.address || '');
    setDeptId(emp.department_id);
    setDesigId(emp.designation_id);
    setManagerId(emp.reporting_manager_id || '');
    setRoleId(emp.role_id);
  };

  const handleSaveEmpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId.trim() || !empName.trim() || !email.trim()) return;

    const saved: Employee = {
      emp_id: empId.trim(),
      emp_name: empName.trim(),
      email: email.trim(),
      contact_no: contactNo.trim(),
      home_contact_no: homeContactNo.trim(),
      address: address.trim(),
      department_id: deptId,
      designation_id: desigId,
      reporting_manager_id: managerId ? managerId : null,
      role_id: roleId,
      is_active: true,
      created_at: editingEmp ? editingEmp.created_at : new Date().toISOString()
    };

    saveEmployee(saved);
    setIsAddEmpModal(false);
    setEditingEmp(null);
  };

  const handleSaveDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim() || !deptCode.trim()) return;
    saveDepartment({
      id: Date.now(),
      name: deptName,
      code: deptCode.toUpperCase(),
      is_active: true,
      created_at: new Date().toISOString()
    });
    setIsDeptModal(false);
    setDeptName('');
    setDeptCode('');
  };

  const handleSaveDesigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desigName.trim()) return;
    saveDesignation({
      id: Date.now(),
      name: desigName,
      level: desigLevel,
      is_active: true
    });
    setIsDesigModal(false);
    setDesigName('');
  };

  // Find root employees (e.g. Eleanor Vance / MD)
  const rootEmployees = employees.filter(e => e.reporting_manager_id === null);

  // Render tree node recursively
  const renderTreeNode = (emp: Employee, depth = 0) => {
    const directReports = employees.filter(e => e.reporting_manager_id === emp.emp_id);
    const desig = getDesignation(emp.designation_id);
    const dept = getDepartment(emp.department_id);
    const role = getRole(emp.role_id);

    return (
      <div key={emp.emp_id} className={`space-y-3 ${depth > 0 ? 'ml-6 pl-4 border-l-2 border-slate-200' : ''}`}>
        <div className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-3.5 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
              role?.name === 'MD'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : role?.name === 'FINANCE_HEAD'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : role?.name === 'DEPT_HEAD'
                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {emp.emp_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">{emp.emp_name}</span>
                <span className="text-[10px] font-mono text-slate-400">({emp.emp_id})</span>
                {role?.name === 'MD' && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    MD / CEO
                  </span>
                )}
                {role?.name === 'FINANCE_HEAD' && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    CFO / Fin Head
                  </span>
                )}
                {role?.name === 'DEPT_HEAD' && (
                  <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                    L2 Dept Head
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                {desig?.name} · <span className="font-semibold text-slate-700">{dept?.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-400">
              {directReports.length} direct report{directReports.length === 1 ? '' : 's'}
            </span>
            <button
              onClick={() => handleOpenEditEmp(emp)}
              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
              title="Edit Employee & Reporting Link"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {directReports.length > 0 && (
          <div className="space-y-3">
            {directReports.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-6 h-6 text-blue-600" />
              <span>Role & Org Hierarchy Matrix (SCR-09)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Super Admin Control: Configure recursive reporting structures, assign Managing Director (MD) short-circuit authority, and assign Finance budget clearance tiers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddEmp}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>New Employee</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('TREE')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'TREE'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Recursive Org Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('GOVERNANCE')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'GOVERNANCE'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Executive & Budget Approver Assignment</span>
        </button>

        <button
          onClick={() => setActiveTab('EMPLOYEES')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'EMPLOYEES'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Employee Master Table ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('MASTERS')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'MASTERS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Departments & Designations</span>
        </button>
      </div>

      {/* Tab 1: Recursive Org Tree */}
      {activeTab === 'TREE' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Enterprise Reporting Tree</h2>
              <p className="text-xs text-slate-500">
                Visualizing hierarchy from Executive MD → Department Heads (L2) → Managers (L1) → Team Members
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Total Personnel: {employees.length}
            </span>
          </div>

          <div className="space-y-6">
            {rootEmployees.map(root => renderTreeNode(root))}
          </div>
        </div>
      )}

      {/* Tab 2: Executive Role Assignment Panel */}
      {activeTab === 'GOVERNANCE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MD Role Assignment */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Managing Director (MD) Assignment</h3>
                  <p className="text-xs text-slate-500">Highest authority line approver with short-circuit pre-emption</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong>Powers:</strong> Can bypass any ticket currently in line approval directly to IT Sourcing.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Managing Director
              </label>
              <select
                value={employees.find(e => e.role_id === 2)?.emp_id || ''}
                onChange={e => {
                  const targetEmpId = e.target.value;
                  // Demote current MD to Dept Head or Employee
                  employees.forEach(emp => {
                    if (emp.role_id === 2) updateEmployeeReportingAndRole(emp.emp_id, { role_id: 6 });
                  });
                  // Assign new MD
                  updateEmployeeReportingAndRole(targetEmpId, { role_id: 2, reporting_manager_id: null });
                }}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
              >
                {employees.map(emp => (
                  <option key={emp.emp_id} value={emp.emp_id}>
                    {emp.emp_name} ({emp.emp_id}) — {getDesignation(emp.designation_id)?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CFO / Finance Head Assignment */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Finance Head / CFO Assignment</h3>
                  <p className="text-xs text-slate-500">Signatory with direct budget clearance and PO issue authority</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <strong>Powers:</strong> Can directly approve supplier quotes bypassing Finance L1 and release POs.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select CFO / Finance Head
              </label>
              <select
                value={employees.find(e => e.role_id === 3)?.emp_id || ''}
                onChange={e => {
                  const targetEmpId = e.target.value;
                  employees.forEach(emp => {
                    if (emp.role_id === 3) updateEmployeeReportingAndRole(emp.emp_id, { role_id: 4 });
                  });
                  updateEmployeeReportingAndRole(targetEmpId, { role_id: 3 });
                }}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
              >
                {employees.map(emp => (
                  <option key={emp.emp_id} value={emp.emp_id}>
                    {emp.emp_name} ({emp.emp_id}) — {getDepartment(emp.department_id)?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Finance L1 Approver */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Finance L1 Budget Reviewer</h3>
            <p className="text-xs text-slate-500">First line of finance review for cost center allocation checks</p>

            <select
              value={employees.find(e => e.role_id === 4)?.emp_id || ''}
              onChange={e => {
                const targetEmpId = e.target.value;
                employees.forEach(emp => {
                  if (emp.role_id === 4) updateEmployeeReportingAndRole(emp.emp_id, { role_id: 7 });
                });
                updateEmployeeReportingAndRole(targetEmpId, { role_id: 4 });
              }}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
            >
              {employees.map(emp => (
                <option key={emp.emp_id} value={emp.emp_id}>
                  {emp.emp_name} ({emp.emp_id}) — {getDepartment(emp.department_id)?.name}
                </option>
              ))}
            </select>
          </div>

          {/* IT Sourcing Lead */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">IT Procurement & Sourcing Lead</h3>
            <p className="text-xs text-slate-500">Responsible for vendor quotations, intake barcoding, and hardware custody</p>

            <select
              value={employees.find(e => e.role_id === 5)?.emp_id || ''}
              onChange={e => {
                const targetEmpId = e.target.value;
                employees.forEach(emp => {
                  if (emp.role_id === 5) updateEmployeeReportingAndRole(emp.emp_id, { role_id: 7 });
                });
                updateEmployeeReportingAndRole(targetEmpId, { role_id: 5 });
              }}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
            >
              {employees.map(emp => (
                <option key={emp.emp_id} value={emp.emp_id}>
                  {emp.emp_name} ({emp.emp_id}) — {getDepartment(emp.department_id)?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Tab 3: Complete Employee Master Table */}
      {activeTab === 'EMPLOYEES' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Emp ID</th>
                  <th className="px-4 py-3">Employee Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Reporting Manager</th>
                  <th className="px-4 py-3">System Role</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {employees.map(emp => {
                  const dept = getDepartment(emp.department_id);
                  const desig = getDesignation(emp.designation_id);
                  const manager = getEmployee(emp.reporting_manager_id);
                  const role = getRole(emp.role_id);

                  return (
                    <tr key={emp.emp_id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {emp.emp_id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{emp.emp_name}</div>
                        <div className="text-[11px] text-slate-400">{emp.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {dept?.name}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {desig?.name}
                      </td>
                      <td className="px-4 py-3">
                        {manager ? (
                          <div className="font-medium text-slate-800">
                            {manager.emp_name} <span className="font-mono text-[10px] text-slate-400">({manager.emp_id})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None (Root Executive)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          role?.name === 'MD'
                            ? 'bg-amber-100 text-amber-900'
                            : role?.name === 'FINANCE_HEAD'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {role?.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                        {emp.contact_no}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleOpenEditEmp(emp)}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Departments & Designations */}
      {activeTab === 'MASTERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Departments */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Department Master</h3>
              <button
                onClick={() => setIsDeptModal(true)}
                className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded"
              >
                + Add Dept
              </button>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {departments.map(d => (
                <div key={d.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">{d.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">ID: {d.id}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {d.code}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Designations */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Designation Master</h3>
              <button
                onClick={() => setIsDesigModal(true)}
                className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded"
              >
                + Add Designation
              </button>
            </div>
            <div className="divide-y divide-slate-100 text-xs max-h-96 overflow-y-auto">
              {designations.map(d => (
                <div key={d.id} className="py-2 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{d.name}</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Tier Level {d.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      {(isAddEmpModal || editingEmp) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingEmp ? `Edit Employee (${editingEmp.emp_id})` : 'Register New Employee'}
              </h3>
              <button
                onClick={() => {
                  setIsAddEmpModal(false);
                  setEditingEmp(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEmpSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingEmp}
                    value={empId}
                    onChange={e => setEmpId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={empName}
                    onChange={e => setEmpName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex.morgan@aegis-corp.com"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Contact No</label>
                  <input
                    type="text"
                    required
                    value={contactNo}
                    onChange={e => setContactNo(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Home Contact No</label>
                  <input
                    type="text"
                    value={homeContactNo}
                    onChange={e => setHomeContactNo(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street, City, State"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={deptId}
                    onChange={e => setDeptId(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <select
                    value={desigId}
                    onChange={e => setDesigId(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    {designations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reporting Manager
                  </label>
                  <select
                    value={managerId}
                    onChange={e => setManagerId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    <option value="">-- No Manager (Root / MD) --</option>
                    {employees
                      .filter(emp => emp.emp_id !== empId)
                      .map(emp => (
                        <option key={emp.emp_id} value={emp.emp_id}>
                          {emp.emp_name} ({emp.emp_id})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">System Role</label>
                  <select
                    value={roleId}
                    onChange={e => setRoleId(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-bold text-blue-700"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddEmpModal(false);
                    setEditingEmp(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {isDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Add Department</h3>
            <form onSubmit={handleSaveDeptSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={e => setDeptName(e.target.value)}
                  placeholder="e.g. Legal & Compliance"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Code</label>
                <input
                  type="text"
                  required
                  value={deptCode}
                  onChange={e => setDeptCode(e.target.value.toUpperCase())}
                  placeholder="e.g. LEG"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono uppercase"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeptModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Designation Modal */}
      {isDesigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Add Designation</h3>
            <form onSubmit={handleSaveDesigSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation Title</label>
                <input
                  type="text"
                  required
                  value={desigName}
                  onChange={e => setDesigName(e.target.value)}
                  placeholder="e.g. Staff Security Architect"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hierarchy Level (1: Junior to 5: Exec)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={desigLevel}
                  onChange={e => setDesigLevel(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDesigModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
