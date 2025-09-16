"use client"

import React, { useState } from 'react';
import { InvoiceForm } from '@/components/invoice/invoice-form';
import { InvoiceList } from '@/components/invoice/invoice-list';
import { InvoiceDisplay } from '@/components/invoice/invoice-display';
import { Invoice } from '@/types/invoice';

type ViewMode = 'list' | 'create' | 'view' | 'edit';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  const handleSaveInvoice = (invoice: Invoice) => {
    setInvoices(prev => {
      const existingIndex = prev.findIndex(inv => inv.id === invoice.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = invoice;
        return updated;
      }
      return [...prev, invoice];
    });
    
    // Show success message or redirect
    alert('Invoice saved successfully!');
    setViewMode('list');
  };

  const handleSendInvoice = (invoice: Invoice) => {
    handleSaveInvoice(invoice);
    // Here you would typically integrate with an email service
    alert('Invoice sent successfully!');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setViewMode('view');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setViewMode('edit');
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Here you would typically generate a PDF
    alert(`Downloading invoice ${invoice.invoiceNumber}...`);
  };

  const handleCreateNew = () => {
    setCurrentInvoice(null);
    setViewMode('create');
  };

  const handleBackToList = () => {
    setCurrentInvoice(null);
    setViewMode('list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {viewMode === 'list' && (
        <InvoiceList
          invoices={invoices}
          onView={handleViewInvoice}
          onEdit={handleEditInvoice}
          onDownload={handleDownloadInvoice}
          onCreateNew={handleCreateNew}
        />
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <div>
          <div className="max-w-6xl mx-auto p-6">
            <button
              onClick={handleBackToList}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to invoices
            </button>
          </div>
          <InvoiceForm
            onSave={handleSaveInvoice}
            onSend={handleSendInvoice}
            initialData={viewMode === 'edit' && currentInvoice ? {
              clientName: currentInvoice.client.name,
              clientAddress: currentInvoice.client.address,
              invoiceDate: currentInvoice.invoiceDate.toISOString().split('T')[0],
              dueDate: currentInvoice.dueDate.toISOString().split('T')[0],
              lineItems: currentInvoice.lineItems.map(item => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
              taxRate: currentInvoice.taxRate,
            } : undefined}
          />
        </div>
      )}

      {viewMode === 'view' && currentInvoice && (
        <div>
          <div className="max-w-4xl mx-auto p-6">
            <button
              onClick={handleBackToList}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to invoices
            </button>
          </div>
          <InvoiceDisplay
            invoice={currentInvoice}
            onEdit={() => handleEditInvoice(currentInvoice)}
            onDownload={() => handleDownloadInvoice(currentInvoice)}
            onSend={() => handleSendInvoice(currentInvoice)}
          />
        </div>
      )}
    </div>
  );
}