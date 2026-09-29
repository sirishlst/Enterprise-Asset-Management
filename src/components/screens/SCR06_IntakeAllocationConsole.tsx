import React, { useState } from 'react';
import {
  Barcode,
  CheckCircle2,
  Tag,
  Printer,
  QrCode,
  Scan,
  ShieldCheck,
  UserCheck,
  PackageCheck,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssetRequest, AssetItem, AssetMaster } from '../../types';
import { AssetTagModal } from '../common/AssetTagModal';

export const SCR06_IntakeAllocationConsole: React.FC = () => {
  const {
    currentEmployee,
    requests,
    procurementOrders,
    assetMasters,
    departments,
    assetItems,
    assignments,
    getEmployee,
    getDepartment,
    getAssetMaster,
    completeAssetIntakeAndAllocation
  } = useApp();

  const [activeIntakeReq, setActiveIntakeReq] = useState<AssetRequest | null>(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [purchaseCost, setPurchaseCost] = useState<number>(0);
  const [warrantyDate, setWarrantyDate] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [handoverCondition, setHandoverCondition] = useState('');
  const [selectedTagPreview, setSelectedTagPreview] = useState<{ item: AssetItem; master?: AssetMaster } | null>(null);

  // Tickets awaiting hardware intake & tagging
  const intakeQueue = requests.filter(r => r.current_stage === 'DELIVERED_PENDING_TAGGING');

  // Recently completed allocations
  const recentlyAllocated = requests.filter(r => r.current_stage === 'ALLOCATED_CLOSED');

  const handleStartIntake = (req: AssetRequest) => {
    setActiveIntakeReq(req);
    const order = procurementOrders.find(p => p.request_id === req.id);
    const dept = getDepartment(req.department_id);

    // Auto-generate unique asset code
    const generatedCode = `AST-${dept?.code || 'GEN'}-2026-${String(assetItems.length + 101).padStart(4, '0')}`;
    const autoSerial = `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setAssetCode(generatedCode);
    setSerialNumber(autoSerial);
    setPurchaseCost(order ? order.quotation_amount : 1200);
    setVendorName(order ? order.vendor_name : 'Direct Enterprise OEM');
    // Set 3 years warranty from today
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 3);
    setWarrantyDate(expiry.toISOString().split('T')[0]);
    setHandoverCondition('Brand new sealed box. Operational diagnostics passed, corporate MDM policy applied.');
  };

  const handleCompleteIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIntakeReq || !serialNumber.trim() || !assetCode.trim()) {
      alert('Please fill all hardware identifiers including Serial Number and Asset Code.');
      return;
    }

    const newItem = completeAssetIntakeAndAllocation(activeIntakeReq.id, {
      serial_number: serialNumber,
      unique_asset_code: assetCode,
      purchase_cost: purchaseCost,
      warranty_expiry_date: warrantyDate,
      condition: handoverCondition,
      vendor_name: vendorName
    });

    const master = getAssetMaster(activeIntakeReq.asset_master_id);
    setActiveIntakeReq(null);
    // Show printable sticker modal
    setSelectedTagPreview({ item: newItem, master });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Barcode className="w-6 h-6 text-purple-600" />
              <span>Intake, Barcoding & Asset Allocation Console (SCR-06)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Physical inventory receiving: Scan incoming vendor serial numbers, generate enterprise asset tags, print barcode stickers, and bind hardware custody to employees.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 bg-purple-50 text-purple-800 rounded-lg border border-purple-200">
              {intakeQueue.length} Delivered · Ready for Tagging
            </span>
          </div>
        </div>
      </div>

      {/* Intake Queue */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-purple-600" />
          <span>Incoming Hardware Intake Queue ({intakeQueue.length})</span>
        </h2>

        {intakeQueue.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No delivered orders currently waiting for barcode intake. All approved hardware is allocated.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intakeQueue.map(req => {
              const order = procurementOrders.find(p => p.request_id === req.id);
              const requester = getEmployee(req.requested_by);
              const dept = getDepartment(req.department_id);
              const master = getAssetMaster(req.asset_master_id);

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-purple-700">
                        {req.request_ticket_no}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        {order?.po_number || 'PO Cleared'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {master?.generic_name}
                    </h3>

                    <div className="text-xs text-slate-500 space-y-1 mb-3">
                      <div>
                        Assign To: <strong className="text-slate-800">{requester?.emp_name}</strong> ({requester?.emp_id})
                      </div>
                      <div>
                        Dept: <span className="text-slate-700">{dept?.name}</span>
                      </div>
                      <div>
                        Supplier: <span className="text-slate-700">{order?.vendor_name}</span> (${order?.quotation_amount.toLocaleString()})
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleStartIntake(req)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Initiate Intake & Barcode Generation</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recently Handed Over Ledger */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Recently Tagged & Handed Over Hardware</span>
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Asset Tag Code</th>
                <th className="px-4 py-3">Model / Generic Name</th>
                <th className="px-4 py-3">Assigned Custodian</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Ticket Origin</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentlyAllocated.map(req => {
                const requester = getEmployee(req.requested_by);
                const dept = getDepartment(req.department_id);
                const master = getAssetMaster(req.asset_master_id);
                const item = assetItems.find(i => i.current_assigned_emp_id === req.requested_by && i.asset_master_id === req.asset_master_id);

                return (
                  <tr key={req.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">
                      {item ? item.unique_asset_code : 'AST-GEN-001'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {master?.generic_name}
                    </td>
                    <td className="px-4 py-3">
                      {requester?.emp_name} <span className="text-slate-400 font-mono">({requester?.emp_id})</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {dept?.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {req.request_ticket_no}
                    </td>
                    <td className="px-4 py-3">
                      {item && (
                        <button
                          onClick={() => setSelectedTagPreview({ item, master })}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline p-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Reprint Tag</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intake Modal */}
      {activeIntakeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Physical Asset Intake & Barcode Allocation</h3>
                <span className="text-xs font-mono text-purple-700">Ticket: {activeIntakeReq.request_ticket_no}</span>
              </div>
              <button
                onClick={() => setActiveIntakeReq(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteIntake} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Auto-Generated Unique Asset Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Unique Asset Tag Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={assetCode}
                    onChange={e => setAssetCode(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-blue-700 bg-blue-50/50"
                  />
                  <span className="text-[10px] text-slate-400">Barcode tag format: AST-DEPT-YYYY-ID</span>
                </div>

                {/* Serial Number from Vendor */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hardware Serial Number (SN) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      value={serialNumber}
                      onChange={e => setSerialNumber(e.target.value)}
                      placeholder="e.g. C02G90XXMD6M"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setSerialNumber(`SN-SCAN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`)}
                      title="Simulate Barcode Gun Scan"
                      className="px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1 shrink-0"
                    >
                      <Scan className="w-3.5 h-3.5 text-purple-600" />
                      <span>Scan</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Purchase Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={purchaseCost}
                    onChange={e => setPurchaseCost(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Warranty Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={warrantyDate}
                    onChange={e => setWarrantyDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supplier / Vendor Details
                </label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={e => setVendorName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Handover Condition & Inspection Notes
                </label>
                <textarea
                  rows={2}
                  value={handoverCondition}
                  onChange={e => setHandoverCondition(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 flex items-start gap-2 text-xs text-purple-900">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Automated Custody Assignment:</strong> Confirming intake will automatically bind this asset record to{' '}
                  <strong>{getEmployee(activeIntakeReq.requested_by)?.emp_name}</strong> and close ticket{' '}
                  <strong>{activeIntakeReq.request_ticket_no}</strong>.
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveIntakeReq(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Complete Intake & Handover</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Tag Preview Modal */}
      {selectedTagPreview && (
        <AssetTagModal
          item={selectedTagPreview.item}
          master={selectedTagPreview.master}
          onClose={() => setSelectedTagPreview(null)}
        />
      )}
    </div>
  );
};
