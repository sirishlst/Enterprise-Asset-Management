import React, { useState } from 'react';
import {
  Laptop,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  Shield,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Building,
  UserCheck,
  DollarSign,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssetItem, AssetMaster, AssetRequest } from '../../types';
import { AssetTagModal } from '../common/AssetTagModal';

interface SCR01Props {
  onNavigateToRequest: () => void;
}

export const SCR01_EmployeeDashboard: React.FC<SCR01Props> = ({ onNavigateToRequest }) => {
  const {
    currentEmployee,
    assetItems,
    assetMasters,
    categories,
    assignments,
    requests,
    departments,
    designations,
    procurementOrders,
    auditLogs,
    getEmployee,
    processAssetReturn
  } = useApp();

  const [selectedTagItem, setSelectedTagItem] = useState<{ item: AssetItem; master?: AssetMaster } | null>(null);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState<AssetRequest | null>(null);
  const [returnModalItem, setReturnModalItem] = useState<AssetItem | null>(null);
  const [returnCondition, setReturnCondition] = useState('');
  const [returnNextStatus, setReturnNextStatus] = useState<'IN_STOCK' | 'UNDER_MAINTENANCE' | 'SCRAPPED'>('IN_STOCK');

  // Filter items assigned to current employee
  const myAssignedItems = assetItems.filter(item => item.current_assigned_emp_id === currentEmployee.emp_id);
  const myRequests = requests.filter(req => req.requested_by === currentEmployee.emp_id);

  const currentDept = departments.find(d => d.id === currentEmployee.department_id);
  const currentDesig = designations.find(d => d.id === currentEmployee.designation_id);
  const reportingManager = getEmployee(currentEmployee.reporting_manager_id);

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalItem) return;
    const assignment = assignments.find(
      a => a.asset_item_id === returnModalItem.id && a.returned_date === null
    );
    if (assignment) {
      processAssetReturn(assignment.id, returnCondition || 'Returned by employee in good condition.', returnNextStatus);
    }
    setReturnModalItem(null);
    setReturnCondition('');
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'PENDING_LINE_APPROVAL':
      case 'PENDING_MD_APPROVAL':
        return { label: 'Line Approval', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'IT_SOURCING':
        return { label: 'IT Sourcing & Quotes', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'PENDING_FINANCE_BUDGET':
        return { label: 'Finance Budget Clearance', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'PO_RAISED':
      case 'DELIVERED_PENDING_TAGGING':
        return { label: 'Procured · Intake & Barcoding', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'ALLOCATED_CLOSED':
        return { label: 'Allocated & Active', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'REJECTED':
        return { label: 'Rejected', bg: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { label: stage, bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Requester Profile */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-700 font-bold text-xl flex items-center justify-center border border-blue-200 shrink-0">
              {currentEmployee.emp_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{currentEmployee.emp_name}</h1>
                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {currentEmployee.emp_id}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span>{currentDesig?.name}</span>
                <span>·</span>
                <span>{currentDept?.name} ({currentDept?.code})</span>
                {reportingManager && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      Reports to: <strong className="text-slate-700 font-semibold">{reportingManager.emp_name}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToRequest}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Raise Asset Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Active Assigned Assets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Laptop className="w-5 h-5 text-blue-600" />
              <span>My Assigned Assets ({myAssignedItems.length})</span>
            </h2>
            <p className="text-xs text-slate-500">Physical hardware & tools registered under your employee custody</p>
          </div>
        </div>

        {myAssignedItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No Assets Currently Assigned</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              You currently do not have any company hardware or machinery tagged under your custody.
            </p>
            <button
              onClick={onNavigateToRequest}
              className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200 transition-colors"
            >
              Submit an Asset Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myAssignedItems.map(item => {
              const master = assetMasters.find(m => m.id === item.asset_master_id);
              const cat = categories.find(c => c.id === master?.category_id);
              const assignment = assignments.find(
                a => a.asset_item_id === item.id && a.returned_date === null
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {cat?.name || 'Asset'}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Allocated</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                      {master?.generic_name || 'Enterprise Asset'}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600 mt-3 bg-slate-50/70 p-3 rounded-lg border border-slate-100 font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans text-[11px]">Asset Tag:</span>
                        <span className="font-bold text-slate-900">{item.unique_asset_code}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans text-[11px]">Serial No:</span>
                        <span className="text-slate-800 truncate max-w-[170px]">{item.serial_number}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans text-[11px]">Part No:</span>
                        <span className="text-slate-700">{master?.part_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans text-[11px]">Warranty To:</span>
                        <span className="font-sans text-slate-800">{item.warranty_expiry_date || 'Standard'}</span>
                      </div>
                    </div>

                    {assignment && (
                      <div className="mt-3 text-[11px] text-slate-500">
                        <span className="text-slate-400">Handover Condition: </span>
                        <span>{assignment.condition_on_alloc}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedTagItem({ item, master })}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline p-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Barcode Tag</span>
                    </button>
                    <button
                      onClick={() => setReturnModalItem(item)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:underline p-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Return / Transfer</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section: Pending & Recent Requests Tracker */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>My Asset Request Pipeline ({myRequests.length})</span>
            </h2>
            <p className="text-xs text-slate-500">Track stage progression from Line Manager approval to IT handover</p>
          </div>
        </div>

        {myRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            You have not submitted any asset requests yet.
          </div>
        ) : (
          <div className="space-y-3">
            {myRequests.map(req => {
              const master = assetMasters.find(m => m.id === req.asset_master_id);
              const badge = getStageBadge(req.current_stage);
              const order = procurementOrders.find(p => p.request_id === req.id);

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {req.request_ticket_no}
                        </span>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">
                          Raised on {new Date(req.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Urgency: {req.urgency}
                        </span>
                      </div>

                      <div className="font-bold text-slate-900 text-sm">
                        {master?.generic_name || 'Custom Hardware Specification'}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1">
                        <span className="text-slate-400 font-medium">Business Purpose: </span>
                        {req.purpose}
                      </p>
                    </div>

                    {/* Right: Stage Stepper Progress Indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Step 1: Raised */}
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Raised</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

                      {/* Step 2: Line Approval */}
                      <div
                        className={`flex items-center gap-1 text-[11px] ${
                          req.line_approval_step === 'COMPLETED'
                            ? 'text-emerald-700 font-medium'
                            : req.current_stage === 'REJECTED'
                            ? 'text-red-600'
                            : 'text-amber-700 font-semibold'
                        }`}
                      >
                        {req.line_approval_step === 'COMPLETED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>Line Appr</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

                      {/* Step 3: IT Sourcing */}
                      <div
                        className={`flex items-center gap-1 text-[11px] ${
                          ['PENDING_FINANCE_BUDGET', 'PO_RAISED', 'DELIVERED_PENDING_TAGGING', 'ALLOCATED_CLOSED'].includes(req.current_stage)
                            ? 'text-emerald-700 font-medium'
                            : req.current_stage === 'IT_SOURCING'
                            ? 'text-blue-700 font-semibold'
                            : 'text-slate-400'
                        }`}
                      >
                        <span>IT Quotes</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

                      {/* Step 4: Finance */}
                      <div
                        className={`flex items-center gap-1 text-[11px] ${
                          ['PO_RAISED', 'DELIVERED_PENDING_TAGGING', 'ALLOCATED_CLOSED'].includes(req.current_stage)
                            ? 'text-emerald-700 font-medium'
                            : req.current_stage === 'PENDING_FINANCE_BUDGET'
                            ? 'text-indigo-700 font-semibold'
                            : 'text-slate-400'
                        }`}
                      >
                        <span>Budget</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

                      {/* Step 5: Handover */}
                      <div
                        className={`flex items-center gap-1 text-[11px] ${
                          req.current_stage === 'ALLOCATED_CLOSED'
                            ? 'text-emerald-700 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        <span>Handover</span>
                      </div>

                      <button
                        onClick={() => setSelectedRequestDetails(req)}
                        className="ml-3 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>

                  {/* If PO raised or delivered */}
                  {order && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span>Vendor: <strong className="text-slate-700">{order.vendor_name}</strong></span>
                        <span>Quote: <strong className="text-slate-700">${order.quotation_amount.toLocaleString()}</strong></span>
                        {order.po_number && (
                          <span className="font-mono text-purple-700 font-semibold">PO: {order.po_number}</span>
                        )}
                      </div>
                      {order.delivery_eta && (
                        <span>Expected Delivery: <strong className="text-slate-700">{order.delivery_eta}</strong></span>
                      )}
                    </div>
                  )}

                  {req.rejection_reason && (
                    <div className="mt-2.5 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Rejection Reason:</strong> {req.rejection_reason}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: View Full Request Details & Audit Trail */}
      {selectedRequestDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{selectedRequestDetails.request_ticket_no}</span>
                  <span className="text-xs text-slate-500">· Full Ticket Audit</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Raised on {new Date(selectedRequestDetails.created_at).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedRequestDetails(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Dynamic Field Payload */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Dynamic Form Specifications (Department Custom Fields)
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(selectedRequestDetails.custom_field_values).map(([key, val]) => (
                    <div key={key} className={Array.isArray(val) ? 'col-span-2' : ''}>
                      <span className="text-slate-400 block capitalize font-medium">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {Array.isArray(val) ? val.join(', ') : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Audit Trail */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Approval & Bypass Audit Log
                </h4>
                <div className="space-y-2">
                  {auditLogs
                    .filter(log => log.request_id === selectedRequestDetails.id)
                    .map(log => {
                      const approver = getEmployee(log.approver_id);
                      return (
                        <div
                          key={log.id}
                          className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">
                              {approver ? approver.emp_name : log.approver_id} ({log.approver_role_executed})
                            </span>
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
                          </div>
                          <p className="text-slate-600">{log.comments}</p>
                          <div className="text-[10px] text-slate-400">
                            {new Date(log.action_timestamp).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  {auditLogs.filter(log => log.request_id === selectedRequestDetails.id).length === 0 && (
                    <div className="text-xs text-slate-400 italic">No approvals logged yet. Pending action.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedRequestDetails(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Asset Return / Maintenance Transfer */}
      {returnModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Initiate Asset Return / Transfer</h3>
            <p className="text-xs text-slate-500 mb-4">
              Return <strong>{returnModalItem.unique_asset_code}</strong> back to IT inventory.
            </p>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Condition & Reason on Return
                </label>
                <textarea
                  required
                  rows={3}
                  value={returnCondition}
                  onChange={e => setReturnCondition(e.target.value)}
                  placeholder="e.g. Completed project assignment; hardware wiped clean and undamaged."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Inventory Disposition
                </label>
                <select
                  value={returnNextStatus}
                  onChange={e => setReturnNextStatus(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="IN_STOCK">Return to Stock (Ready for re-allocation)</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance / Inspection</option>
                  <option value="SCRAPPED">Damaged / Scrapped</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnModalItem(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Confirm Asset Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Tag Modal */}
      {selectedTagItem && (
        <AssetTagModal
          item={selectedTagItem.item}
          master={selectedTagItem.master}
          onClose={() => setSelectedTagItem(null)}
        />
      )}
    </div>
  );
};
