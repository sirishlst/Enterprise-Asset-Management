import React from 'react';
import { X, Printer, ShieldCheck, QrCode, Tag, CheckCircle2 } from 'lucide-react';
import { AssetItem, AssetMaster } from '../../types';
import { useApp } from '../../context/AppContext';

interface AssetTagModalProps {
  item: AssetItem;
  master?: AssetMaster;
  onClose: () => void;
}

export const AssetTagModal: React.FC<AssetTagModalProps> = ({ item, master, onClose }) => {
  const { getEmployee } = useApp();
  const assignedEmp = getEmployee(item.current_assigned_emp_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Physical Asset Tag Sticker</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Sticker Preview Container */}
        <div className="p-6">
          <div className="text-xs text-slate-500 mb-3 text-center">
            Standard 3.5" x 2.0" High-Durability Polyethylene Enterprise Barcode Label
          </div>

          <div
            id="printable-asset-tag"
            className="border-2 border-slate-800 rounded-lg p-5 bg-white shadow-sm font-mono text-slate-900 relative"
          >
            {/* Top row */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div>
                  <div className="text-xs font-extrabold tracking-wider text-slate-900 uppercase">
                    Aegis Enterprise Corp
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">
                    Corporate Asset Tracking System
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-sans font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Asset</span>
              </div>
            </div>

            {/* Asset Identifier & Code */}
            <div className="text-center my-3">
              <div className="text-[11px] font-sans text-slate-500 uppercase tracking-widest">
                Unique Asset Tag
              </div>
              <div className="text-xl font-bold tracking-widest text-slate-950 font-mono py-1">
                {item.unique_asset_code}
              </div>

              {/* Barcode Graphic Simulation */}
              <div className="flex justify-center items-end gap-[2px] h-12 my-2 px-6">
                {[
                  3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3,
                  2, 4, 1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2
                ].map((width, idx) => (
                  <div
                    key={idx}
                    className="bg-black"
                    style={{
                      width: `${width}px`,
                      height: `${(idx % 5 === 0 ? 44 : 36) + (idx % 3) * 2}px`
                    }}
                  />
                ))}
              </div>
              <div className="text-[10px] text-slate-400 tracking-wider">
                *{item.unique_asset_code}*
              </div>
            </div>

            {/* Item Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-200 font-sans">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Serial Number:</span>
                <span className="font-mono font-semibold text-slate-800 break-all">{item.serial_number}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Part Number:</span>
                <span className="font-mono font-medium text-slate-800">{master?.part_number || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase">Model / Description:</span>
                <span className="font-medium text-slate-800">{master?.generic_name || 'Enterprise Hardware'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Warranty Expiry:</span>
                <span className="font-medium text-slate-800">{item.warranty_expiry_date || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Assigned Custodian:</span>
                <span className="font-medium text-slate-800">
                  {assignedEmp ? `${assignedEmp.emp_name} (${assignedEmp.emp_id})` : 'Unallocated (In Stock)'}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-sans">
              <span>Security Warning: Property of Aegis Corp. Tampering with this tag voids warranty.</span>
              <QrCode className="w-5 h-5 text-slate-700 shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Print resolution: 300 DPI Thermal Transfer
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sticker Label</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
