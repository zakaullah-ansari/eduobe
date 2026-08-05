'use client';
import { useState } from 'react';
import { useSystemSettings, useUpdateSettings, useEmailTemplates, useCreateEmailTemplate, useTestEmail, useTestSMS } from '@/services/settings.service';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Settings, Mail, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const statusColors = { active: 'default', inactive: 'secondary' } as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<'general' | 'email' | 'sms' | 'templates'>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: settings, isLoading: settingsLoading } = useSystemSettings();
  const { data: templates, isLoading: templatesLoading } = useEmailTemplates();
  const updateSettings = useUpdateSettings();
  const testEmail = useTestEmail();
  const testSMS = useTestSMS();

  const templateColumns: ColumnDef<any>[] = [
    { accessorKey: 'templateNumber', header: 'Template No.', cell: ({ row }) => <Badge variant="outline">{row.getValue('templateNumber')}</Badge> },
    { accessorKey: 'name', header: 'Name', cell: ({ row }) => <Link href={`/settings/templates/${row.original.id}`} className="font-medium hover:underline">{row.getValue('name')}</Link> },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge variant="secondary">{row.getValue('category')}</Badge> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusColors[row.getValue('status') as keyof typeof statusColors] || 'default'}>{row.getValue('status')}</Badge> },
    { id: 'actions', cell: ({ row }) => (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem asChild><Link href={`/settings/templates/${row.original.id}`}>View Details</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href={`/settings/templates/${row.original.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-red-600" onClick={() => { if (confirm('Delete?')) toast.success('Deleted'); }}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>) },
  ];

  const filteredTemplates = templates?.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleTestEmail = () => {
    testEmail.mutate({ to: 'test@example.com', subject: 'Test Email', body: 'This is a test email from EduOBE' });
  };

  const handleTestSMS = () => {
    testSMS.mutate({ to: '+919876543210', message: 'This is a test SMS from EduOBE' });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6"><h1 className="text-3xl font-bold">System Settings</h1><p className="text-muted-foreground mt-1">Configure system settings and preferences</p></div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6"><TabsList><TabsTrigger value="general">General</TabsTrigger><TabsTrigger value="email">Email</TabsTrigger><TabsTrigger value="sms">SMS</TabsTrigger><TabsTrigger value="templates">Email Templates</TabsTrigger></TabsList></Tabs>
      
      {tab === 'general' && (
        <Card>
          <CardHeader><CardTitle>General Settings</CardTitle><CardDescription>Configure institution and system settings</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Institution Name</Label><Input placeholder="Institution Name" defaultValue={settings?.institutionName} /></div>
              <div className="space-y-2"><Label>Institution Code</Label><Input placeholder="Institution Code" defaultValue={settings?.institutionCode} /></div>
              <div className="space-y-2"><Label>Address</Label><Input placeholder="Address" defaultValue={settings?.address} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input placeholder="Phone" defaultValue={settings?.phone} /></div>
              <div className="space-y-2"><Label>Email</Label><Input placeholder="Email" defaultValue={settings?.email} /></div>
              <div className="space-y-2"><Label>Website</Label><Input placeholder="Website" defaultValue={settings?.website} /></div>
            </div>
            <div className="flex items-center space-x-2"><Switch checked={settings?.maintenanceMode} /><Label>Maintenance Mode</Label></div>
            <Button onClick={() => { updateSettings.mutate({ institutionName: 'Test' }); toast.success('Settings updated'); }}>Save Settings</Button>
          </CardContent>
        </Card>
      )}

      {tab === 'email' && (
        <Card>
          <CardHeader><CardTitle>Email Settings</CardTitle><CardDescription>Configure SMTP settings for email notifications</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>SMTP Host</Label><Input placeholder="smtp.example.com" defaultValue={settings?.smtpHost} /></div>
              <div className="space-y-2"><Label>SMTP Port</Label><Input placeholder="587" defaultValue={settings?.smtpPort} /></div>
              <div className="space-y-2"><Label>SMTP Username</Label><Input placeholder="Username" defaultValue={settings?.smtpUsername} /></div>
              <div className="space-y-2"><Label>SMTP Password</Label><Input type="password" placeholder="Password" defaultValue={settings?.smtpPassword} /></div>
              <div className="space-y-2"><Label>From Email</Label><Input placeholder="noreply@example.com" defaultValue={settings?.smtpFromEmail} /></div>
            </div>
            <Button onClick={handleTestEmail}><Send className="mr-2 h-4 w-4" />Test Email</Button>
          </CardContent>
        </Card>
      )}

      {tab === 'sms' && (
        <Card>
          <CardHeader><CardTitle>SMS Settings</CardTitle><CardDescription>Configure SMS provider settings</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>SMS Provider</Label><Input placeholder="Twilio" defaultValue={settings?.smsProvider} /></div>
              <div className="space-y-2"><Label>API Key</Label><Input type="password" placeholder="API Key" defaultValue={settings?.smsApiKey} /></div>
              <div className="space-y-2"><Label>Sender ID</Label><Input placeholder="EduOBE" defaultValue={settings?.smsSenderId} /></div>
            </div>
            <Button onClick={handleTestSMS}><Send className="mr-2 h-4 w-4" />Test SMS</Button>
          </CardContent>
        </Card>
      )}

      {tab === 'templates' && (
        <>
          <Card className="mb-6"><CardContent className="pt-6"><Input placeholder="Search templates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></CardContent></Card>
          <div className="mb-4 flex justify-end"><Button asChild><Link href="/settings/templates/new"><Mail className="mr-2 h-4 w-4" />Create Template</Link></Button></div>
          <DataTable columns={templateColumns} data={filteredTemplates || []} isLoading={templatesLoading} />
          <div className="mt-4 text-sm text-muted-foreground text-center">Total: {filteredTemplates?.length || 0} templates</div>
        </>
      )}
    </div>
  );
}
