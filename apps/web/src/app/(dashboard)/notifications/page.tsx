'use client';
import { useState } from 'react';
import { useNotifications, useUnreadNotifications, useCreateNotification, useSendNotification, useMarkAsRead } from '@/services/notification.service';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Bell, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const statusColors = { draft: 'secondary', sent: 'default', read: 'outline', archived: 'secondary' } as const;
const typeColors = { info: 'default', success: 'default', warning: 'secondary', error: 'destructive' } as const;

export default function NotificationsPage() {
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();
  const { data: unreadNotifications, isLoading: unreadLoading } = useUnreadNotifications();

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'notificationNumber', header: 'Notification No.', cell: ({ row }) => <Badge variant="outline">{row.getValue('notificationNumber')}</Badge> },
    { accessorKey: 'title', header: 'Title', cell: ({ row }) => <Link href={`/notifications/${row.original.id}`} className="font-medium hover:underline">{row.getValue('title')}</Link> },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant={typeColors[row.getValue('type') as keyof typeof typeColors] || 'default'}>{row.getValue('type')}</Badge> },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge variant="secondary">{row.getValue('category')}</Badge> },
    { accessorKey: 'priority', header: 'Priority', cell: ({ row }) => <Badge variant={row.getValue('priority') === 'urgent' ? 'destructive' : 'secondary'}>{row.getValue('priority')}</Badge> },
    { accessorKey: 'targetAudience', header: 'Target', cell: ({ row }) => <Badge variant="outline">{row.getValue('targetAudience')}</Badge> },
    { accessorKey: 'sentDate', header: 'Sent Date', cell: ({ row }) => row.original.sentDate ? format(new Date(row.original.sentDate), 'MMM dd, yyyy') : 'N/A' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusColors[row.getValue('status') as keyof typeof statusColors] || 'default'}>{row.getValue('status')}</Badge> },
    { id: 'actions', cell: ({ row }) => (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem asChild><Link href={`/notifications/${row.original.id}`}>View Details</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href={`/notifications/${row.original.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>{row.original.status === 'draft' && <DropdownMenuItem><Send className="mr-2 h-4 w-4" />Send</DropdownMenuItem>}{row.original.status === 'sent' && <DropdownMenuItem><CheckCircle className="mr-2 h-4 w-4" />Mark as Read</DropdownMenuItem>}<DropdownMenuSeparator /><DropdownMenuItem className="text-red-600" onClick={() => { if (confirm('Delete?')) toast.success('Deleted'); }}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>) },
  ];

  const filteredNotifications = notifications?.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUnread = unreadNotifications?.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6"><h1 className="text-3xl font-bold">Notifications</h1><p className="text-muted-foreground mt-1">Manage notifications and alerts</p></div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6"><TabsList><TabsTrigger value="all">All Notifications</TabsTrigger><TabsTrigger value="unread">Unread ({unreadNotifications?.length || 0})</TabsTrigger></TabsList></Tabs>
      <Card className="mb-6"><CardContent className="pt-6"><Input placeholder="Search notifications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></CardContent></Card>
      {tab === 'all' && (<><div className="mb-4 flex justify-end"><Button asChild><Link href="/notifications/new"><Bell className="mr-2 h-4 w-4" />Create Notification</Link></Button></div><DataTable columns={columns} data={filteredNotifications || []} isLoading={notificationsLoading} /><div className="mt-4 text-sm text-muted-foreground text-center">Total: {filteredNotifications?.length || 0} notifications</div></>)}
      {tab === 'unread' && (<><DataTable columns={columns} data={filteredUnread || []} isLoading={unreadLoading} /><div className="mt-4 text-sm text-muted-foreground text-center">Total: {filteredUnread?.length || 0} unread notifications</div></>)}
    </div>
  );
}
