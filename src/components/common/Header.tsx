import React, { useState } from 'react';
import {
  Users,
  ChevronDown,
  RotateCcw,
  Shield,
  Briefcase,
  Layers,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeScreen, setActiveScreen }) => {
  const {
    currentEmployee,
    setCurrentEmployeeId,
    employees,
    departments,
    designations,
    roles,
    requests,
    resetAllData
  } = useApp();

  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const currentDept = departments.find(d => d.id === currentEmployee.department_id);
  const currentDesig = designations.find(d => d.id === currentEmployee.designation_id);
  const currentRole = roles.find(r => r.id === currentEmployee.role_id);

  // Compute pending actionable tasks for current persona
  const pendingApprovalsCount = requests.filter(req => {
    if (req.current_stage !== 'PENDING_LINE_APPROVAL' && req.current_stage !== 'PENDING_MD_APPROVAL') {
      return false;
    }
    if (currentRole?.name === 'MD') return true; // MD can view and approve ALL line tickets with bypass!
    if (currentRole?.name === 'DEPT_HEAD') return req.department_id === currentEmployee.department_id;
    if (req.line_approval_step === 'L1') {
      const requester = employees.find(e => e.emp_id === req.requested_by);
      return requester?.reporting_manager_id === currentEmployee.emp_id;
    }
    return false;
  }).length;

  const pendingITCount = requests.filter(r => r.current_stage === 'IT_SOURCING').length;
  const pendingFinanceCount = requests.filter(r => r.current_stage === 'PENDING_FINANCE_BUDGET').length;
  const pendingIntakeCount = requests.filter(r => r.current_stage === 'DELIVERED_PENDING_TAGGING').length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-xl tracking-tighter select-none relative overflow-hidden">
              {/* Custom 'A' insignia matching the brand logo */}
              <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
                <path
                  d="M50 20 L22 76 C22 76 34 76 38 66 L46 46 C47 43 53 43 54 46 L62 66 C66 76 78 76 78 76 Z"
                  fill="#FFFFFF"
                />
                <rect x="33" y="56" width="34" height="8" rx="4" fill="#93C5FD" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Aegis</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Asset OS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Enterprise Asset & Multi-Tier Workflow Platform</p>
            </div>
          </div>

          {/* Right Controls: Persona Switcher, Quick Alerts & Reset */}
          <div className="flex items-center gap-3">
            {/* Quick alert indicator if actionable items exist */}
            {pendingApprovalsCount > 0 && (
              <button
                onClick={() => setActiveScreen('SCR-03')}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors"
                title={`${pendingApprovalsCount} tickets require your line approval / short-circuit review`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>{pendingApprovalsCount} Pending Approval{pendingApprovalsCount > 1 ? 's' : ''}</span>
              </button>
            )}

            {currentRole?.name === 'IT_ADMIN' && pendingITCount > 0 && (
              <button
                onClick={() => setActiveScreen('SCR-04')}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>{pendingITCount} Sourcing</span>
              </button>
            )}

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-700 font-semibold text-xs flex items-center justify-center border border-blue-200 shrink-0">
                  {currentEmployee.emp_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <span>{currentEmployee.emp_name}</span>
                    <span className="text-[10px] font-mono text-slate-500 font-normal">({currentEmployee.emp_id})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span>{currentDesig?.name}</span>
                    <span>·</span>
                    <span className="font-semibold text-blue-600">{currentRole?.name}</span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {personaDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setPersonaDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-84 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Switch Persona Simulator
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Test approvals, short-circuits, and procurement from different department roles
                      </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                      {employees.map(emp => {
                        const desig = designations.find(d => d.id === emp.designation_id);
                        const dept = departments.find(d => d.id === emp.department_id);
                        const role = roles.find(r => r.id === emp.role_id);
                        const isCurrent = emp.emp_id === currentEmployee.emp_id;

                        return (
                          <button
                            key={emp.emp_id}
                            onClick={() => {
                              setCurrentEmployeeId(emp.emp_id);
                              setPersonaDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                              isCurrent ? 'bg-blue-50/60' : ''
                            }`}
                          >
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {emp.emp_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-semibold truncate ${isCurrent ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>
                                  {emp.emp_name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {emp.emp_id}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {desig?.name}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                                <span>{dept?.code}</span>
                                <span>·</span>
                                <span className="font-semibold text-blue-600">{role?.name}</span>
                                {role?.name === 'MD' && (
                                  <span className="text-amber-700 bg-amber-50 px-1 rounded font-bold">
                                    Bypass Authority
                                  </span>
                                )}
                                {role?.name === 'FINANCE_HEAD' && (
                                  <span className="text-emerald-700 bg-emerald-50 px-1 rounded font-bold">
                                    Budget Clearer
                                  </span>
                                )}
                              </div>
                            </div>
                            {isCurrent && (
                              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 self-center" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="px-3 pt-2 mt-1 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Data persists in local storage</span>
                      <button
                        onClick={() => {
                          if (confirm('Reset all demo data back to default initial state?')) {
                            resetAllData();
                            setPersonaDropdownOpen(false);
                          }
                        }}
                        className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-medium hover:underline p-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Data</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
