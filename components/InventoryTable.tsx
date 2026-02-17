import React from 'react';
import { Product } from '../types';

interface InventoryTableProps {
  products: Product[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ products }) => {
  return (
    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-lg">Inventory Breakdown</h3>
        <span className="text-[10px] font-black px-2.5 py-1 rounded bg-slate-100 text-slate-500 uppercase tracking-widest">
          On-Hand Quantities
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Configuration</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Stock Level (PLT + LSE)</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total Units</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const fullPallets = Math.floor(product.stockUnits / product.unitsPerPallet);
              const looseUnits = product.stockUnits % product.unitsPerPallet;

              return (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700 text-sm">{product.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">SKU: {product.sku}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded">
                      {product.unitsPerPallet} {product.unitName}/PLT
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-slate-700">
                        {fullPallets} <span className="text-[10px] text-slate-400 font-black uppercase">Pallets</span>
                      </span>
                      {looseUnits > 0 && (
                        <span className="text-[11px] font-bold text-emerald-600">
                          + {looseUnits} <span className="text-[9px] uppercase font-black">{product.unitName}</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-black ${
                      product.stockUnits === 0 ? 'bg-slate-50 text-slate-300' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {product.stockUnits.toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;