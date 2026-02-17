import React, { useState } from 'react';
import { Product, Transaction, TransferStatus } from './types';
import { INITIAL_PRODUCTS } from './constants';
import InventoryTable from './components/InventoryTable';
import LogTable from './components/LogTable';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Manual Form State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [actionType, setActionType] = useState<'ADD' | 'REMOVE' | null>(null);
  const [palletQty, setPalletQty] = useState<string>('');
  const [unitQty, setUnitQty] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleManualUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedProductId) {
      setError("Please select a product.");
      return;
    }
    if (!actionType) {
      setError("Please select a movement type.");
      return;
    }
    
    const pQty = parseInt(palletQty || '0');
    const uQty = parseInt(unitQty || '0');

    if (pQty === 0 && uQty === 0) {
      setError("Please enter a quantity for pallets or loose units.");
      return;
    }

    if (!selectedProduct) return;

    const totalChange = (pQty * selectedProduct.unitsPerPallet) + uQty;
    let newTotalUnits = selectedProduct.stockUnits;

    if (actionType === 'ADD') {
      newTotalUnits += totalChange;
    } else {
      if (totalChange > selectedProduct.stockUnits) {
        setError(`Insufficient Stock: Requested (${totalChange}) exceeds available (${selectedProduct.stockUnits}).`);
        return;
      }
      newTotalUnits -= totalChange;
    }

    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id ? { ...p, stockUnits: newTotalUnits } : p
    );
    
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      itemName: selectedProduct.name,
      sku: selectedProduct.sku,
      batch: selectedProduct.batch,
      palletsChange: pQty,
      unitsChange: uQty,
      totalUnitsChange: actionType === 'ADD' ? totalChange : -totalChange,
      previousTotalUnits: selectedProduct.stockUnits,
      currentTotalUnits: newTotalUnits,
      status: actionType === 'REMOVE' ? TransferStatus.IN_TRANSIT : TransferStatus.COMPLETED,
      type: actionType,
    };

    setProducts(updatedProducts);
    setTransactions(prev => [...prev, newTransaction]);
    
    setPalletQty('');
    setUnitQty('');
    setSelectedProductId('');
    setActionType(null);
  };

  const totalItemCount = products.reduce((acc, p) => acc + p.stockUnits, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-emerald-900 border-b border-emerald-950 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-900 font-black text-2xl shadow-inner">
              F
            </div>
            <div>
              <h1 className="brand-font text-2xl text-white leading-none font-bold">Flora Tissues</h1>
              <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-black mt-1">Inventory Control</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8">
            <div className="text-right">
              <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest">Global Stock</p>
              <p className="text-xl font-bold text-white leading-none mt-1">
                {totalItemCount.toLocaleString()} <span className="text-[10px] font-normal opacity-50">UNITS</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <InventoryTable products={products} />
            <LogTable transactions={transactions} />
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sticky top-28">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H4a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="font-bold text-xl text-slate-800 tracking-tight">Post Transaction</h2>
              </div>

              <form onSubmit={handleManualUpdate} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Flora Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>-- Select Item --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Action Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setActionType('REMOVE')}
                      className={`py-3 px-4 rounded-xl text-[10px] font-black tracking-widest transition-all border-2 ${
                        actionType === 'REMOVE' 
                        ? 'bg-rose-50 border-rose-500 text-rose-700' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 uppercase'
                      }`}
                    >
                      SHIP OUT
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionType('ADD')}
                      className={`py-3 px-4 rounded-xl text-[10px] font-black tracking-widest transition-all border-2 ${
                        actionType === 'ADD' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 uppercase'
                      }`}
                    >
                      STOCK IN
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Pallets</label>
                    <input
                      type="number"
                      min="0"
                      value={palletQty}
                      onChange={(e) => setPalletQty(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-lg font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                      {selectedProduct ? selectedProduct.unitName : 'Loose Units'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={unitQty}
                      onChange={(e) => setUnitQty(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-lg font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {selectedProduct && (palletQty || unitQty) && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Calculation</span>
                    <span className="text-sm font-bold text-slate-700">
                      ({selectedProduct.unitsPerPallet} × {palletQty || 0}) + {unitQty || 0} = <span className="text-emerald-600">{(parseInt(palletQty || '0') * selectedProduct.unitsPerPallet) + parseInt(unitQty || '0')}</span>
                    </span>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${
                    !actionType ? 'bg-slate-100 text-slate-300 cursor-not-allowed' :
                    actionType === 'ADD' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100' 
                      : 'bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-100'
                  }`}
                >
                  Apply {actionType === 'ADD' ? 'Inbound' : 'Outbound'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Flora Tissues Manufacturing Co. Limited | Industrial Inventory System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;