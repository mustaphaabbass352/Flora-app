export interface Product {
  id: string;
  name: string;
  sku: string;
  batch: string;
  stockUnits: number; // Current Warehouse Stock
  category: string;
  unitsPerPallet: number; 
  unitName: string; 
}

export enum TransferStatus {
  DOCKED = 'Docked',
  IN_TRANSIT = 'In-Transit',
  DELIVERED = 'Delivered',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  FINALIZED = 'Finalized'
}

export interface Transaction {
  id: string;
  timestamp: Date;
  itemName: string;
  sku: string;
  batch: string;
  palletsChange: number;
  unitsChange: number;
  totalUnitsChange: number;
  previousTotalUnits: number;
  currentTotalUnits: number;
  status: TransferStatus;
  type: 'ADD' | 'REMOVE' | 'DOCK' | 'DAY_CLOSE';
  note?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: Date;
  productId: string;
  productName: string;
  checker1Name: string;
  checker1Count: number;
  checker2Name: string;
  checker2Count: number;
  variance: number;
  reconciled: boolean;
  resolvedValue?: number;
  resolvedAt?: Date;
}

export interface DockMovement {
  id: string;
  timestamp: Date;
  productId: string;
  productName: string;
  pallets: number;
  units: number;
  totalUnits: number;
  verifiedBy?: string; // Names of the workers who finalized the count
}

// Result of Gemini AI command parsing
export interface ParseResult {
  action: 'ADD' | 'REMOVE' | 'UNKNOWN';
  quantity: number;
  productNameMatch: string;
  confidence: number;
  note?: string;
}
