import React, { useState } from 'react';
import {
  CheckCheck,
  Zap,
  Check,
  X,
  Clock,
  ShieldAlert,
  UserCheck,
  FileText,
  AlertTriangle,
  History,
  Building,
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssetRequest, ApprovalAuditLog } from '../../types';

export const SCR03_ApprovalHub: React.FC = () => {
  const {
    currentEmployee,
    requests,
    auditLogs,
    employees,
    departments,
    assetMasters,
    roles,
    getEmployee,
    getDepartment,
    getAssetMaster,
    getReportingChain,
    approveLineRequest,
    rejectLineRequest
  } = useApp();

  const currentRole = roles.find(r => r.id === currentEmployee.role_id);
  const isMD = currentRole?.name === 'MD' || currentRole?.name === 'SUPER_ADMIN';
  const isDeptHead = currentRole?.name === 'DEPT_HEAD';

  const [activeTab, setActiveTab] = useState<'MY_QUEUE' | 'ALL_PENDING' | 'AUDIT_HISTORY'>('MY_QUEUE');
  const [selectedTicket, setSelectedTicket] = useState<AssetRequest | null>(null);
  const [actionComments, setActionComments] = useState('');
  const [rejectModalReq, setRejectModalReq] = useState<AssetRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Determine if a ticket is in "My Direct Action Queue"
  const isActionableForCurrent = (req: AssetRequest): boolean => {
    if (req.current_stage !== 'PENDING_LINE_APPROVAL' && req.current_stage !== 'PENDING_MD_APPROVAL') {
      return false;
    }

    // MD can approve ANY pending ticket at any line stage!
    if (isMD) return true;

    // Dept Head (L2) can approve any ticket from their department
    if (isDeptHead && req.department_id === currentEmployee.department_id) {
      return true;
    }

    // Direct L1 Line Manager check
    if (req.line_approval_step === 'L1') {
      const requester = employees.find(e => e.emp_id === req.requested_by);
      return requester?.reporting_manager_id === currentEmployee.emp_id;
    }

    return false;
  };

  // Filter requests based on tab
  const displayedRequests = requests.filter(req => {
    if (activeTab === 'MY_QUEUE') {
      return isActionableForCurrent(req);
    }
    if (activeTab === 'ALL_PENDING') {
      return req.current_stage === 'PENDING_LINE_APPROVAL' || req.current_stage === 'PENDING_MD_APPROVAL';
    }
    return true; // AUDIT_HISTORY
  });

  const handleApprove = (req: AssetRequest, isBypass: boolean) => {
    let approverRole: 'L1' | 'L2' | 'MD' = 'L1';
    if (isMD) approverRole = 'MD';
    else if (isDeptHead) approverRole = 'L2';

    approveLineRequest(
      req.id,
      approverRole,
      isBypass,
      actionComments || (isBypass ? `${approverRole} Direct Bypass Approval` : 'Approved')
    );
    setActionComments('');
    setSelectedTicket(null);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalReq || !rejectReason.trim()) return;

    let approverRole: 'L1' | 'L2' | 'MD' = 'L1';
    if (isMD) approverRole = 'MD';
    else if (isDeptHead) approverRole = 'L2';

    rejectLineRequest(rejectModalReq.id, approverRole, rejectReason);
    setRejectModalReq(null);
    setRejectReason('');
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Role Info Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCheck className="w-6 h-6 text-blue-600" />
              <span>Hierarchical Line Approval Hub (SCR-03)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Multi-level governance chain: Requester → L1 Manager → L2 Dept Head → MD (Executive). Short-circuit pre-emption enabled.
            </p>
          </div>

          {/* Current Authorization Status Callout */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              {currentRole?.name === 'MD' ? 'MD' : currentRole?.name === 'DEPT_HEAD' ? 'L2' : 'L1'}
            </div>
            <div>
              <div className="font-semibold text-slate-800">
                Acting Role: <span className="text-blue-600 font-bold">{currentRole?.name}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {isMD ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> Supreme Bypass: You can directly approve all line stages
                  </span>
                ) : isDeptHead ? (
                  <span className="text-indigo-700 font-medium">L2 Pre-empt: Can approve ahead of L1 managers</span>
                ) : (
                  <span>Standard L1 Line Approvals for direct reports</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('MY_QUEUE')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'MY_QUEUE'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>My Actionable Queue</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full">
            {requests.filter(isActionableForCurrent).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ALL_PENDING')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ALL_PENDING'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>All Pending Tickets</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full">
            {requests.filter(r => r.current_stage === 'PENDING_LINE_APPROVAL' || r.current_stage === 'PENDING_MD_APPROVAL').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_HISTORY')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'AUDIT_HISTORY'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Log Ledger</span>
        </button>
      </div>

      {/* Tab 1 & 2: Requests Table & Detail View */}
      {activeTab !== 'AUDIT_HISTORY' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Tickets List */}
          <div className="lg:col-span-2 space-y-3">
            {displayedRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
                No tickets currently require approval in this queue.
              </div>
            ) : (
              displayedRequests.map(req => {
                const requester = getEmployee(req.requested_by);
                const dept = getDepartment(req.department_id);
                const master = getAssetMaster(req.asset_master_id);
                const chain = getReportingChain(req.requested_by);
                const isSelected = selectedTicket?.id === req.id;
                const canAct = isActionableForCurrent(req);

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedTicket(req)}
                    className={`bg-white rounded-xl border p-5 transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-100'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {req.request_ticket_no}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-amber-50 text-amber-700 border border-amber-200">
                          Current Step: {req.line_approval_step}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          req.urgency === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {req.urgency}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-1">
                      {master?.generic_name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 mb-3">
                      <span>Requester: <strong className="text-slate-700">{requester?.emp_name}</strong> ({requester?.emp_id})</span>
                      <span>·</span>
                      <span>Dept: <strong className="text-slate-700">{dept?.name}</strong></span>
                      {chain.l1Manager && (
                        <>
                          <span>·</span>
                          <span>Reports to: <strong className="text-slate-700">{chain.l1Manager.emp_name}</strong></span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded border border-slate-100 mb-3">
                      <span className="text-slate-400 font-medium">Purpose: </span>
                      {req.purpose}
                    </p>

                    {/* Hierarchy Flow Visual */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-slate-400">Escalation path:</span>
                        <span className="font-semibold text-slate-700">{requester?.emp_name.split(' ')[0]}</span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <span className={`font-semibold ${req.line_approval_step === 'L1' ? 'text-amber-600 underline' : 'text-slate-700'}`}>
                          {chain.l1Manager?.emp_name.split(' ')[0] || 'L1'}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <span className={`font-semibold ${req.line_approval_step === 'L2' ? 'text-amber-600 underline' : 'text-slate-700'}`}>
                          {chain.l2Head?.emp_name.split(' ')[0] || 'L2'}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <span className={`font-semibold ${req.line_approval_step === 'MD' ? 'text-amber-600 underline' : 'text-slate-700'}`}>
                          MD
                        </span>
                      </div>

                      {canAct && (
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Ticket Inspection & Approval Actions Panel */}
          <div>
            {selectedTicket ? (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs sticky top-20 space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 block">
                      {selectedTicket.request_ticket_no}
                    </span>
                    <span className="text-xs text-slate-500">
                      Step: {selectedTicket.line_approval_step} Approver Review
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {selectedTicket.urgency} Priority
                  </span>
                </div>

                {/* Dynamic Specs Submitted */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Dynamic Form Values (Requester Specs)
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-2 max-h-48 overflow-y-auto">
                    {Object.entries(selectedTicket.custom_field_values).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}:</span>
                        <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]">
                          {Array.isArray(v) ? v.join(', ') : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments Box */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Approval / Endorsement Comments
                  </label>
                  <textarea
                    rows={2}
                    value={actionComments}
                    onChange={e => setActionComments(e.target.value)}
                    placeholder="e.g. Approved. Technical justification reviewed and verified."
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Pre-emption / Short-Circuit Button for MD */}
                {isMD && selectedTicket.line_approval_step !== 'COMPLETED' && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>MD Direct Short-Circuit Clearance</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Pre-empt remaining line approvers and immediately dispatch ticket to IT Procurement.
                    </p>
                    <button
                      onClick={() => handleApprove(selectedTicket, true)}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Execute MD Direct Bypass Approval</span>
                    </button>
                  </div>
                )}

                {/* Pre-emption Button for L2 Dept Head */}
                {isDeptHead && selectedTicket.line_approval_step === 'L1' && (
                  <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                      <Zap className="w-4 h-4 text-indigo-600" />
                      <span>L2 Pre-empt L1 Line Approval</span>
                    </div>
                    <p className="text-[11px] text-indigo-800">
                      Endorse directly as Department Head, bypassing L1 and forwarding to MD.
                    </p>
                    <button
                      onClick={() => handleApprove(selectedTicket, true)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>L2 Pre-empt Approve</span>
                    </button>
                  </div>
                )}

                {/* Standard Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setRejectModalReq(selectedTicket)}
                    className="py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject Ticket</span>
                  </button>

                  <button
                    onClick={() => handleApprove(selectedTicket, false)}
                    className="py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Standard Approve</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                Select a ticket from the left to inspect specifications and submit line approval.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab 3: Complete Audit Log Ledger */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Immutable Governance & Approval Audit Trail
            </h3>
            <span className="text-xs text-slate-500 font-mono">{auditLogs.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/60 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Workflow Type</th>
                  <th className="px-4 py-3">Approver</th>
                  <th className="px-4 py-3">Role Executed</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.map(log => {
                  const req = requests.find(r => r.id === log.request_id);
                  const approver = getEmployee(log.approver_id);

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(log.action_timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                        {req ? req.request_ticket_no : `ID #${log.request_id}`}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {log.approval_flow_type}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                        {approver ? approver.emp_name : log.approver_id}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                        {log.approver_role_executed}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.action === 'BYPASS_APPROVED'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : log.action === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                        {log.comments}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6">
            <h3 className="text-base font-bold text-red-700 mb-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Reject Asset Request</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ticket: <strong>{rejectModalReq.request_ticket_no}</strong>. Please provide a clear operational reason for rejection.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Existing departmental hardware inventory can be re-allocated; please contact IT store."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalReq(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
