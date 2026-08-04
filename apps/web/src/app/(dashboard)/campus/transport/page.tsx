'use client';

import { useState } from 'react';
import { useRoutes, useBuses, useSubscriptions, useDeleteRoute } from '@/services/transport.service';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Map, Bus, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusColors = {
  active: 'default',
  inactive: 'secondary',
  suspended: 'destructive',
  maintenance: 'outline',
  retired: 'secondary',
  expired: 'outline',
  cancelled: 'destructive',
} as const;

export default function TransportPage() {
  const [tab, setTab] = useState<'routes' | 'buses' | 'subscriptions'>('routes');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: routes, isLoading: routesLoading } = useRoutes();
  const { data: buses, isLoading: busesLoading } = useBuses();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const deleteMutation = useDeleteRoute();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const routeColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Route Name',
      cell: ({ row }) => {
        const route = row.original;
        return (
          <Link
            href={`/campus/transport/routes/${route.id}`}
            className="font-medium hover:underline"
          >
            {route.name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'routeNumber',
      header: 'Route No.',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('routeNumber')}</Badge>,
    },
    {
      accessorKey: 'startPoint',
      header: 'Start Point',
    },
    {
      accessorKey: 'endPoint',
      header: 'End Point',
    },
    {
      accessorKey: 'buses',
      header: () => (
        <div className="flex items-center">
          <Bus className="mr-2 h-4 w-4" />
          Buses
        </div>
      ),
      cell: ({ row }) => row.original._count?.buses || 0,
    },
    {
      accessorKey: 'subscribers',
      header: () => (
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Subscribers
        </div>
      ),
      cell: ({ row }) => row.original._count?.subscribers || 0,
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
        const route = row.original;
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
                <Link href={`/campus/transport/routes/${route.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/transport/routes/${route.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(route.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const busColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'busNumber',
      header: 'Bus Number',
      cell: ({ row }) => {
        const bus = row.original;
        return (
          <Link
            href={`/campus/transport/buses/${bus.id}`}
            className="font-medium hover:underline"
          >
            {bus.busNumber}
          </Link>
        );
      },
    },
    {
      accessorKey: 'route',
      header: 'Route',
      cell: ({ row }) => row.original.route?.name || 'N/A',
    },
    {
      accessorKey: 'vehicleType',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('vehicleType')}</Badge>,
    },
    {
      accessorKey: 'capacity',
      header: 'Capacity',
    },
    {
      accessorKey: 'driver',
      header: 'Driver',
      cell: ({ row }) => row.original.driver || 'N/A',
    },
    {
      accessorKey: 'gpsEnabled',
      header: 'GPS',
      cell: ({ row }) => (
        <Badge variant={row.original.gpsEnabled ? 'default' : 'secondary'}>
          {row.original.gpsEnabled ? 'Enabled' : 'Disabled'}
        </Badge>
      ),
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
        const bus = row.original;
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
                <Link href={`/campus/transport/buses/${bus.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/campus/transport/buses/${bus.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const subscriptionColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'student',
      header: 'Student',
      cell: ({ row }) => {
        const subscription = row.original;
        return (
          <div>
            <p className="font-medium">
              {subscription.student?.firstName} {subscription.student?.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {subscription.student?.rollNumber}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'route',
      header: 'Route',
      cell: ({ row }) => row.original.route?.name || 'N/A',
    },
    {
      accessorKey: 'bus',
      header: 'Bus',
      cell: ({ row }) => row.original.bus?.busNumber || 'N/A',
    },
    {
      accessorKey: 'monthlyFee',
      header: 'Monthly Fee',
      cell: ({ row }) => `₹${(row.getValue('monthlyFee') as number).toLocaleString('en-IN')}`,
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => {
        const status = row.getValue('paymentStatus') as string;
        return (
          <Badge variant={status === 'paid' ? 'default' : status === 'overdue' ? 'destructive' : 'secondary'}>
            {status}
          </Badge>
        );
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
  ];

  const filteredRoutes = routes?.filter(
    (route) =>
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBuses = buses?.filter(
    (bus) =>
      bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.route?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscriptions = subscriptions?.filter(
    (subscription) =>
      subscription.student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.student?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.route?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transport Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage bus routes, vehicles, and student subscriptions
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="buses">Buses</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Input
                placeholder={tab === 'routes' ? 'Search routes...' : tab === 'buses' ? 'Search buses...' : 'Search subscriptions...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tab === 'routes' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/transport/routes/new">
                <Map className="mr-2 h-4 w-4" />
                Add Route
              </Link>
            </Button>
          </div>
          <DataTable
            columns={routeColumns}
            data={filteredRoutes || []}
            isLoading={routesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Map className="inline h-4 w-4 mr-1" />
            Total: {filteredRoutes?.length || 0} routes
          </div>
        </>
      )}

      {tab === 'buses' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/transport/buses/new">
                <Bus className="mr-2 h-4 w-4" />
                Add Bus
              </Link>
            </Button>
          </div>
          <DataTable
            columns={busColumns}
            data={filteredBuses || []}
            isLoading={busesLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Bus className="inline h-4 w-4 mr-1" />
            Total: {filteredBuses?.length || 0} buses
          </div>
        </>
      )}

      {tab === 'subscriptions' && (
        <>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href="/campus/transport/subscriptions/new">
                <Users className="mr-2 h-4 w-4" />
                New Subscription
              </Link>
            </Button>
          </div>
          <DataTable
            columns={subscriptionColumns}
            data={filteredSubscriptions || []}
            isLoading={subscriptionsLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <Users className="inline h-4 w-4 mr-1" />
            Total: {filteredSubscriptions?.length || 0} subscriptions
          </div>
        </>
      )}
    </div>
  );
}
