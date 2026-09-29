import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Zap,
  Check,
  X,
  Building,
  AlertCircle,
  Clock,
  ExternalLink,
  PieChart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssetRequest, ProcurementOrder } from '../../types';

export const SCR05_FinanceBudgetHub: React.FC = () => {
  const {
    currentEmployee,
    requests,
    procurementOrders,
    departments,
    assetMasters,
    roles,
    getEmployee,
    getDepartment,
    getAssetMaster,
    approveBudgetProposal,
    rejectBudgetProposal
  } = useApp();

  const currentRole = roles.find(r => r.id === currentEmployee.role_id);
  const isCFO = currentRole?.name === 'FINANCE_HEAD' || currentRole?.name === 'SUPER_ADMIN' || currentRole?.name === 'MD';

  const [selectedReq, setSelectedReq] = useState<AssetRequest | null>(null);
  const [comments, setComments] = useState('');
  const [rejectModalReq, setRejectModalReq] = useState<AssetRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Tickets awaiting Finance budget clearance
  const pendingBudgetRequests = requests.filter(r => r.current_stage === 'PENDING_FINANCE_BUDGET');
  const clearedOrders = procurementOrders.filter(p => p.budget_status === 'APPROVED');

  // Simulated departmental budget figures
  const deptBudgets: Record<number, { allocated: number; spent: number }> = {
    1: { allocated: 250000, spent: 142500 }, // Engineering
    2: { allocated: 380000, spent: 215000 }, // Operations
    3: { allocated: 190000, spent: 88400 },  // IT
    4: { allocated: 120000, spent: 45000 },  // Finance
    5: { allocated: 90000, spent: 34200 },   // HR
    6: { allocated: 150000, spent: 92000 },  // Sales
  };

  const handleApprove = (req: AssetRequest, isDirectBypass: boolean) => {
    const approverRole: 'FINANCE_L1' | 'FINANCE_HEAD' = isCFO ? 'FINANCE_HEAD' : 'FINANCE_L1';
    approveBudgetProposal(
      req.id,
      approverRole,
      isDirectBypass,
      comments || (isDirectBypass ? 'Direct CFO Budget Approval & PO Issued' : 'Finance L1 Verified')
    );
    setComments('');
    setSelectedReq(null);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalReq || !rejectReason.trim()) return;

    const approverRole: 'FINANCE_L1' | 'FINANCE_HEAD' = isCFO ? 'FINANCE_HEAD' : 'FINANCE_L1';
    rejectBudgetProposal(rejectModalReq.id, approverRole, rejectReason);
    setRejectModalReq(null);
    setRejectReason('');
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              <span>Finance Budget Clearance Hub (SCR-05)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify vendor proposals against cost center allocations. Two-tier approval: Finance L1 → CFO / Finance Head with direct short-circuit clearance.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              {isCFO ? 'CFO' : 'L1'}
            </div>
            <div>
              <div className="font-semibold text-slate-800">
                Acting Role: <span className="text-emerald-700 font-bold">{currentRole?.name}</span>
              </div>
              <div className="text-[11px] text-slate-600">
                {isCFO ? (
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" /> Direct Final Clearance: 1-Click PO Generation
                  </span>
                ) : (
                  <span>Finance L1 Verification: Prepares variance review for CFO</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Queue & Department Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Proposals Pending Clearance */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Pending Budget Clearance Queue ({pendingBudgetRequests.length})</span>
            </h2>
          </div>

          {pendingBudgetRequests.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No vendor proposals are currently waiting for finance clearance.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBudgetRequests.map(req => {
                const order = procurementOrders.find(p => p.request_id === req.id);
                const requester = getEmployee(req.requested_by);
                const dept = getDepartment(req.department_id);
                const master = getAssetMaster(req.asset_master_id);
                const deptBudget = dept ? deptBudgets[dept.id] : undefined;
                const quoteAmt = order?.quotation_amount || 0;
                const remainingBudget = deptBudget ? deptBudget.allocated - deptBudget.spent : 100000;
                const budgetHealth = (quoteAmt / remainingBudget) * 100;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {req.request_ticket_no}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {req.budget_approval_step || 'FINANCE_L1'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block text-[10px] uppercase">Quoted Amount</span>
                        <span className="text-base font-extrabold text-slate-950 font-mono">
                          ${quoteAmt.toLocaleString()} {order?.currency || 'USD'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{master?.generic_name}</h3>
                        <div className="text-xs text-slate-500 mt-1">
                          <span>Requester: <strong className="text-slate-700">{requester?.emp_name}</strong></span>
                          <span className="mx-1">·</span>
                          <span>Dept: <strong className="text-slate-700">{dept?.name}</strong></span>
                        </div>
                        <div className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                          <span className="font-semibold text-slate-700">Vendor:</span> {order?.vendor_name} (Quote #{order?.quotation_number})
                        </div>
                      </div>

                      {/* Department Budget Health Box */}
                      {deptBudget && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                          <div className="flex justify-between font-medium">
                            <span className="text-slate-500">Dept Budget Available:</span>
                            <span className="font-bold text-slate-900">${remainingBudget.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full ${
                                budgetHealth > 80 ? 'bg-red-500' : budgetHealth > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (deptBudget.spent / deptBudget.allocated) * 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Total Cap: ${deptBudget.allocated.toLocaleString()}</span>
                            <span>{budgetHealth < 50 ? 'Within Variance Buffer' : 'Requires CFO Review'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex gap-2">
                        {order?.quotation_attachment_url && (
                          <a
                            href={order.quotation_attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 p-1 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Inspect Supplier PDF Quote</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRejectModalReq(req)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Reject / Revise
                        </button>

                        {/* Direct CFO Short-Circuit Clearance Button */}
                        {isCFO && (
                          <button
                            onClick={() => handleApprove(req, true)}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Direct Final Budget Clearance (Issue PO)</span>
                          </button>
                        )}

                        {/* Standard Fin L1 Endorsement */}
                        {!isCFO && (
                          <button
                            onClick={() => handleApprove(req, false)}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <span>Finance L1 Endorse & Route to CFO</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Cost Center & PO Release Log */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>Department Budget Allocation</span>
            </h3>

            <div className="space-y-3 text-xs">
              {departments.map(dept => {
                const b = deptBudgets[dept.id] || { allocated: 100000, spent: 40000 };
                const pct = Math.round((b.spent / b.allocated) * 100);

                return (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-700">{dept.name}</span>
                      <span className="font-mono text-slate-900">${(b.allocated - b.spent).toLocaleString()} left</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Spent: ${b.spent.toLocaleString()}</span>
                      <span>Cap: ${b.allocated.toLocaleString()} ({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cleared POs */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cleared Purchase Orders ({clearedOrders.length})</span>
            </h3>

            <div className="space-y-2 text-xs">
              {clearedOrders.map(order => (
                <div key={order.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-purple-700 block">{order.po_number}</span>
                    <span className="text-[11px] text-slate-500">{order.vendor_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">${order.quotation_amount.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded block font-semibold">
                      Budget Cleared
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6">
            <h3 className="text-base font-bold text-red-700 mb-1">Reject / Request Quote Revision</h3>
            <p className="text-xs text-slate-500 mb-4">
              Ticket: <strong>{rejectModalReq.request_ticket_no}</strong>. Specify budget constraints or renegotiation notes.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Budget Rejection Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Cost exceeds Q1 department cap; request IT sourcing team to negotiate 10% volume discount."
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
                  Confirm Budget Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
