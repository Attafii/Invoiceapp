"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Download
} from 'lucide-react';

import { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/lib/invoice-utils';

interface InvoiceListProps {
  invoices: Invoice[];
  onView?: (invoice: Invoice) => void;
  onEdit?: (invoice: Invoice) => void;
  onDownload?: (invoice: Invoice) => void;
  onCreateNew?: () => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

const statusLabels = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
};

export function InvoiceList({ 
  invoices, 
  onView, 
  onEdit, 
  onDownload, 
  onCreateNew 
}: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filteredInvoices = React.useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const stats = React.useMemo(() => {
    return {
      total: invoices.length,
      draft: invoices.filter(inv => inv.status === 'draft').length,
      sent: invoices.filter(inv => inv.status === 'sent').length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
    };
  }, [invoices]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        {onCreateNew && (
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-600">Total Invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
            <p className="text-xs text-gray-600">Draft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
            <p className="text-xs text-gray-600">Sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <p className="text-xs text-gray-600">Paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-gray-600">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices by number or client name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.client.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {invoice.client.address.split('\n')[0]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={statusColors[invoice.status]}
                      >
                        {statusLabels[invoice.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(invoice)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDownload && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownload(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary */}
      {filteredInvoices.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Showing {filteredInvoices.length} of {invoices.length} invoices
              </span>
              <span className="font-medium">
                Total Value: {formatCurrency(stats.totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}