import React from 'react';
import { Transaction, TransferStatus } from '../types';

interface LogTableProps {
  transactions: Transaction[];
}

const LogTable: React.FC<LogTableProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No pallet or bag movements logged yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-5 border-b border-slate-100 bg-slate-50/30">
        <h3 className="font-semibold text-slate-800 text-lg">Transaction History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Movement Detail</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total Units</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...transactions].reverse().map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                  {tx.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700 text-sm">{tx.itemName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{tx.sku}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className={`text-xs font-black px-3 py-1.5 rounded-lg border-2 ${
                    tx.type === 'ADD' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-rose-100 bg-rose-50 text-rose-700'
                  }`}>
                    {tx.type === 'ADD' ? '+' : '-'} {tx.palletsChange} PLT {tx.unitsChange > 0 ? `& ${tx.unitsChange} LSE` : ''}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-800">{tx.currentTotalUnits.toLocaleString()}</span>
                    <span className={`text-[10px] font-black uppercase ${tx.type === 'ADD' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'ADD' ? '↑' : '↓'} {Math.abs(tx.totalUnitsChange)} Total
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                    tx.status === TransferStatus.COMPLETED ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogTable;