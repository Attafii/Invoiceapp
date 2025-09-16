export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Client {
  name: string;
  address: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: Client;
  invoiceDate: Date;
  dueDate: Date;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceFormData {
  clientName: string;
  clientAddress: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  taxRate: number;
}