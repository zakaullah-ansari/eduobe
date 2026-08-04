'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { useRooms, useDeleteRoom } from '@/services/room.service';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const statusColors = {
  available: 'default',
  occupied: 'secondary',
  maintenance: 'outline',
  reserved: 'destructive',
} as const;

const typeLabels = {
  classroom: 'Classroom',
  lab: 'Lab',
  'lecture-hall': 'Lecture Hall',
  'seminar-room': 'Seminar Room',
  'exam-hall': 'Exam Hall',
} as const;

export default function RoomsPage() {
  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { data: rooms, isLoading } = useRooms(filters);
  const deleteMutation = useDeleteRoom();

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Room Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const room = row.original;
          return (
            <Link
              href={`/academic/rooms/${room.id}`}
              className="font-medium hover:underline"
            >
              {room.name}
            </Link>
          );
        },
      },
      {
        accessorKey: 'building',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Building
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: 'floor',
        header: 'Floor',
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.getValue('type') as keyof typeof typeLabels;
          return <Badge variant="outline">{typeLabels[type]}</Badge>;
        },
      },
      {
        accessorKey: 'capacity',
        header: () => (
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Capacity
          </div>
        ),
      },
      {
        accessorKey: 'equipment',
        header: 'Equipment',
        cell: ({ row }) => {
          const equipment = row.original.equipment || [];
          return equipment.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {equipment.slice(0, 3).map((item: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
              {equipment.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{equipment.length - 3}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">None</span>
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
      {
        id: 'actions',
        cell: ({ row }) => {
          const room = row.original;
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
                  <Link href={`/academic/rooms/${room.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/academic/rooms/${room.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(room.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteMutation]
  );

  const filteredRooms = useMemo(() => {
    if (!searchQuery) return rooms || [];
    
    const query = searchQuery.toLowerCase();
    return (rooms || []).filter(
      (room) =>
        room.name.toLowerCase().includes(query) ||
        room.building.toLowerCase().includes(query) ||
        room.equipment?.some((eq: string) => eq.toLowerCase().includes(query))
    );
  }, [rooms, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage classrooms, labs, and other facilities
          </p>
        </div>
        <Button asChild>
          <Link href="/academic/rooms/new">
            <Building2 className="mr-2 h-4 w-4" />
            Add Room
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by name, building, or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Building</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.building || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    building: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Buildings</option>
                <option value="Main Building">Main Building</option>
                <option value="Science Block">Science Block</option>
                <option value="Engineering Block">Engineering Block</option>
                <option value="Library Building">Library Building</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.type || ''}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    type: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Types</option>
                <option value="classroom">Classroom</option>
                <option value="lab">Lab</option>
                <option value="lecture-hall">Lecture Hall</option>
                <option value="seminar-room">Seminar Room</option>
                <option value="exam-hall">Exam Hall</option>
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
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredRooms}
        isLoading={isLoading}
      />

      <div className="mt-4 text-sm text-muted-foreground text-center">
        <Building2 className="inline h-4 w-4 mr-1" />
        Total: {filteredRooms.length} rooms
      </div>
    </div>
  );
}
