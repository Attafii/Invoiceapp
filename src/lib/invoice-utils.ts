import { LineItem, Invoice, InvoiceFormData } from '@/types/invoice';

// Generate a unique invoice number
export function generateInvoiceNumber(): string {
  const prefix = 'INV';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

// Calculate line item amount
export function calculateLineItemAmount(quantity: number, unitPrice: number): number {
  return Math.round((quantity * unitPrice) * 100) / 100;
}

// Calculate invoice subtotal
export function calculateSubtotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.amount, 0);
}

// Calculate tax amount
export function calculateTax(subtotal: number, taxRate: number): number {
  return Math.round((subtotal * (taxRate / 100)) * 100) / 100;
}

// Calculate invoice total
export function calculateTotal(subtotal: number, tax: number): number {
  return Math.round((subtotal + tax) * 100) / 100;
}

// Convert form data to line items
export function convertToLineItems(formLineItems: InvoiceFormData['lineItems']): LineItem[] {
  return formLineItems.map((item, index) => ({
    id: `item-${index + 1}`,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    amount: calculateLineItemAmount(item.quantity, item.unitPrice)
  }));
}

// Create invoice from form data
export function createInvoiceFromForm(formData: InvoiceFormData): Invoice {
  const lineItems = convertToLineItems(formData.lineItems);
  const subtotal = calculateSubtotal(lineItems);
  const tax = calculateTax(subtotal, formData.taxRate);
  const total = calculateTotal(subtotal, tax);

  return {
    id: crypto.randomUUID(),
    invoiceNumber: generateInvoiceNumber(),
    client: {
      name: formData.clientName,
      address: formData.clientAddress
    },
    invoiceDate: new Date(formData.invoiceDate),
    dueDate: new Date(formData.dueDate),
    lineItems,
    subtotal,
    tax,
    taxRate: formData.taxRate,
    total,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Format date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR').format(date);
}