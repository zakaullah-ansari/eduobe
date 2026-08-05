'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Download, IndianRupee, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { useFeeStructures, usePayments, useGenerateReceipt } from '@/services/fee.service';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = {
  active: 'default',
  archived: 'secondary',
} as const;

const paymentStatusColors = {
  pending: 'secondary',
  completed: 'default',
  failed: 'destructive',
  refunded: 'outline',
} as const;

const paymentMethodLabels = {
  cash: 'Cash',
  card: 'Card',
  online: 'Online',
  cheque: 'Cheque',
  'bank-transfer': 'Bank Transfer',
} as const;

export default function FeesPage() {
  const [tab, setTab] = useState<'structures' | 'payments'>('structures');
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { data: structures, isLoading: structuresLoading } = useFeeStructures(filters);
  const { data: payments, isLoading: paymentsLoading } = usePayments(filters);
  const generateReceipt = useGenerateReceipt();

  const handleDownloadReceipt = async (paymentId: string) => {
    await generateReceipt.mutateAsync(paymentId);
  };

  const structureColumns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'batch',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Batch
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const structure = row.original;
          return (
            <div>
              <p className="font-medium">{structure.batch?.name}</p>
              <p className="text-sm text-muted-foreground">
                {structure.batch?.program?.name}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: 'academicYear',
        header: 'Academic Year',
      },
      {
        accessorKey: 'semester',
        header: 'Semester',
      },
      {
        accessorKey: 'totalFee',
        header: () => (
          <div className="flex items-center">
            <IndianRupee className="mr-2 h-4 w-4" />
            Total Fee
          </div>
        ),
        cell: ({ row }) => {
          const amount = row.getValue('totalFee') as number;
          return `₹${amount.toLocaleString('en-IN')}`;
        },
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: ({ row }) => {
          const date = row.getValue('dueDate') as string;
          return format(new Date(date), 'MMM dd, yyyy');
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as keyof typeof statusColors;
          return (
            <Badge variant={statusColors[status] || 'default'}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const structure = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/fees/structures/${structure.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/fees/structures/${structure.id}/edit`}>
                    Edit
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const paymentColumns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'student',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Student
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const payment = row.original;
          return (
            <div>
              <p className="font-medium">
                {payment.student?.firstName} {payment.student?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {payment.student?.rollNumber}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: 'receiptNumber',
        header: 'Receipt No.',
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue('receiptNumber')}</Badge>
        ),
      },
      {
        accessorKey: 'amount',
        header: () => (
          <div className="flex items-center">
            <IndianRupee className="mr-2 h-4 w-4" />
            Amount
          </div>
        ),
        cell: ({ row }) => {
          const amount = row.getValue('amount') as number;
          return `₹${amount.toLocaleString('en-IN')}`;
        },
      },
      {
        accessorKey: 'paymentDate',
        header: 'Payment Date',
        cell: ({ row }) => {
          const date = row.getValue('paymentDate') as string;
          return format(new Date(date), 'MMM dd, yyyy');
        },
      },
      {
        accessorKey: 'paymentMethod',
        header: () => (
          <div className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Method
          </div>
        ),
        cell: ({ row }) => {
          const method = row.getValue('paymentMethod') as keyof typeof paymentMethodLabels;
          return paymentMethodLabels[method];
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as keyof typeof paymentStatusColors;
          return (
            <Badge variant={paymentStatusColors[status] || 'default'}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const payment = row.original;
          const isCompleted = payment.status === 'completed';
          
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/fees/payments/${payment.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                {isCompleted && (
                  <DropdownMenuItem onClick={() => handleDownloadReceipt(payment.id)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [generateReceipt]
  );

  const filteredStructures = useMemo(() => {
    if (!searchQuery) return structures || [];
    
    const query = searchQuery.toLowerCase();
    return (structures || []).filter(
      (structure) =>
        structure.batch?.name.toLowerCase().includes(query) ||
        structure.batch?.program?.name.toLowerCase().includes(query)
    );
  }, [structures, searchQuery]);

  const filteredPayments = useMemo(() => {
    if (!searchQuery) return payments || [];
    
    const query = searchQuery.toLowerCase();
    return (payments || []).filter(
      (payment) =>
        payment.student?.firstName.toLowerCase().includes(query) ||
        payment.student?.lastName.toLowerCase().includes(query) ||
        payment.student?.rollNumber.toLowerCase().includes(query) ||
        payment.receiptNumber.toLowerCase().includes(query)
    );
  }, [payments, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Fee Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage fee structures and track payments
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="structures">Fee Structures</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder={tab === 'structures' ? 'Search by batch or program...' : 'Search by student or receipt...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {tab === 'structures' && (
              <>
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filters.academicYear || ''}
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        academicYear: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value="">All Years</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2023-24">2023-24</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filters.status || ''}
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        status: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </>
            )}

            {tab === 'payments' && (
              <>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filters.paymentMethod || ''}
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        paymentMethod: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value="">All Methods</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="online">Online</option>
                    <option value="cheque">Cheque</option>
                    <option value="bank-transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filters.status || ''}
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        status: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {tab === 'structures' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/academic/fees/structures/new">
                <IndianRupee className="mr-2 h-4 w-4" />
                Create Fee Structure
              </Link>
            </Button>
          </div>
          <DataTable
            columns={structureColumns}
            data={filteredStructures}
            isLoading={structuresLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <IndianRupee className="inline h-4 w-4 mr-1" />
            Total: {filteredStructures.length} fee structures
          </div>
        </>
      )}

      {tab === 'payments' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/academic/fees/payments/new">
                <CreditCard className="mr-2 h-4 w-4" />
                Record Payment
              </Link>
            </Button>
          </div>
          <DataTable
            columns={paymentColumns}
            data={filteredPayments}
            isLoading={paymentsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <CreditCard className="inline h-4 w-4 mr-1" />
            Total: {filteredPayments.length} payments
          </div>
        </>
      )}
    </div>
  );
}
