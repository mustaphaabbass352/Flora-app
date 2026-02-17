
export interface Product {
  id: string;
  name: string;
  sku: string;
  batch: string;
  stockUnits: number; // Total individual units (bags/boxes/buckets)
  category: string;
  unitsPerPallet: number; 
  unitName: string; // e.g., "Bags", "Boxes", "Buckets"
}

export enum TransferStatus {
  IN_TRANSIT = 'In-Transit',
  DELIVERED = 'Delivered',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
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
  type: 'ADD' | 'REMOVE';
  note?: string;
}

export interface ParseResult {
  action: 'ADD' | 'REMOVE' | 'UNKNOWN';
  quantity: number;
  productNameMatch: string;
  confidence: number;
  note?: string;
}
