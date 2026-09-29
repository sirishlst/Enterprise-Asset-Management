import React, { useState } from 'react';
import {
  ShoppingBag,
  Upload,
  ArrowRight,
  FileCheck,
  Building,
  DollarSign,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssetRequest } from '../../types';

export const SCR04_ProcurementDesk: React.FC = () => {
  const {
    currentEmployee,
    requests,
    procurementOrders,
    assetMasters,
    departments,
    getEmployee,
    getDepartment,
    getAssetMaster,
    submitProcurementProposal
  } = useApp();

  const [selectedReq, setSelectedReq] = useState<AssetRequest | null>(null);

  // Proposal Form State
  const [vendorName, setVendorName] = useState('');
  const [quotationNumber, setQuotationNumber] = useState('');
  const [quotationAmount, setQuotationAmount] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');
  const [deliveryEta, setDeliveryEta] = useState('');
  const [notes, setNotes] = useState('');

  // Tickets awaiting IT sourcing (stage: IT_SOURCING)
  const pendingSourcing = requests.filter(r => r.current_stage === 'IT_SOURCING');
  const alreadySourced = requests.filter(r =>
    ['PENDING_FINANCE_BUDGET', 'PO_RAISED', 'DELIVERED_PENDING_TAGGING', 'ALLOCATED_CLOSED'].includes(r.current_stage)
  );

  const handleOpenProposalModal = (req: AssetRequest) => {
    setSelectedReq(req);
    const existingOrder = procurementOrders.find(p => p.request_id === req.id);
    if (existingOrder) {
      setVendorName(existingOrder.vendor_name);
      setQuotationNumber(existingOrder.quotation_number);
      setQuotationAmount(existingOrder.quotation_amount);
      setCurrency(existingOrder.currency);
      setDeliveryEta(existingOrder.delivery_eta || '');
      setNotes(existingOrder.notes || '');
    } else {
      setVendorName('Dell Commercial Solutions');
      setQuotationNumber(`QT-${req.request_ticket_no.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`);
      setQuotationAmount(2499);
      setCurrency('USD');
      setDeliveryEta(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
      setNotes('Includes standard 3-year onsite hardware warranty, priority dispatch.');
    }
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || quotationAmount <= 0) {
      alert('Please enter a valid quotation amount greater than 0.');
      return;
    }

    submitProcurementProposal(selectedReq.id, {
      vendor_name: vendorName,
      quotation_number: quotationNumber,
      quotation_amount: quotationAmount,
      currency,
      delivery_eta: deliveryEta,
      notes
    });

    setSelectedReq(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <span>IT Sourcing & Procurement Desk (SCR-04)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Line-approved tickets move here for vendor quotation collection, cost modeling, and submission to Finance for budget clearance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
              {pendingSourcing.length} Ready for Supplier Quotes
            </span>
          </div>
        </div>
      </div>

      {/* Sourcing Queue */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Pending Vendor Quotation Queue ({pendingSourcing.length})</span>
        </h2>

        {pendingSourcing.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No line-approved tickets currently waiting for sourcing proposals.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingSourcing.map(req => {
              const requester = getEmployee(req.requested_by);
              const dept = getDepartment(req.department_id);
              const master = getAssetMaster(req.asset_master_id);

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-700">
                        {req.request_ticket_no}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Line Approved (MD)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {master?.generic_name}
                    </h3>

                    <div className="text-xs text-slate-500 space-y-1 mb-3">
                      <div>
                        Requester: <strong className="text-slate-800">{requester?.emp_name}</strong> ({dept?.name})
                      </div>
                      <div className="line-clamp-2">
                        Purpose: <span className="text-slate-700">{req.purpose}</span>
                      </div>
                    </div>

                    {/* Dynamic Specs preview */}
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                      <span className="text-slate-400 font-bold uppercase block text-[10px]">Requested Specs:</span>
                      {Object.entries(req.custom_field_values).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="capitalize">{k.replace(/_/g, ' ')}:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                            {Array.isArray(v) ? v.join(', ') : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenProposalModal(req)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Attach Vendor Proposal & Route to Finance</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sourced Proposals in Pipeline */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Active Procurement Proposals in Finance / Delivery Pipeline ({alreadySourced.length})</span>
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Ticket No</th>
                <th className="px-4 py-3">Item Requested</th>
                <th className="px-4 py-3">Supplier / Vendor</th>
                <th className="px-4 py-3">Quote Amount</th>
                <th className="px-4 py-3">Quotation #</th>
                <th className="px-4 py-3">Current Stage</th>
                <th className="px-4 py-3">PO Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {alreadySourced.map(req => {
                const order = procurementOrders.find(p => p.request_id === req.id);
                const master = getAssetMaster(req.asset_master_id);

                return (
                  <tr key={req.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">
                      {req.request_ticket_no}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {master?.generic_name}
                    </td>
                    <td className="px-4 py-3">
                      {order?.vendor_name || 'Standard Catalog Supplier'}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      ${order ? order.quotation_amount.toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {order?.quotation_number || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 uppercase">
                        {req.current_stage.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-purple-700">
                      {order?.po_number || 'Pending PO'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attach Vendor Proposal Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Attach Vendor Quotation & Sourcing Proposal</h3>
                <span className="text-xs font-mono text-blue-600">{selectedReq.request_ticket_no}</span>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProposalSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selected Supplier / Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={e => setVendorName(e.target.value)}
                  placeholder="e.g. Dell Enterprise Direct, Siemens AG, Herman Miller"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Formal Quotation # <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={quotationNumber}
                    onChange={e => setQuotationNumber(e.target.value)}
                    placeholder="QT-2026-9812"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quoted Total Cost ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={quotationAmount || ''}
                    onChange={e => setQuotationAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Delivery ETA
                  </label>
                  <input
                    type="date"
                    value={deliveryEta}
                    onChange={e => setDeliveryEta(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vendor Spec Sheet / Quotation PDF (Simulated link)
                </label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate font-mono">https://docs.aegis-corp.internal/quotes/{quotationNumber || 'QT'}.pdf</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warranty & SLA Terms / Procurement Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. 3-year standard NBD onsite service, certified enterprise bulk pricing."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <span>Submit & Route to Finance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
