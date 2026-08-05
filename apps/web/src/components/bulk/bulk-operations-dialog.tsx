'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, UserCheck, CheckCircle, XCircle } from 'lucide-react';
import { useBulkDelete, useBulkUpdate, useBulkAssign, useBulkApprove, useBulkReject } from '@/services/bulk-operations.service';
import { toast } from 'sonner';

interface BulkOperationsDialogProps {
  module: string;
  selectedIds: string[];
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function BulkOperationsDialog({ module, selectedIds, onSuccess, children }: BulkOperationsDialogProps) {
  const [open, setOpen] = useState(false);
  const [operation, setOperation] = useState<'delete' | 'update' | 'assign' | 'approve' | 'reject'>('delete');
  const [updates, setUpdates] = useState<Record<string, any>>({});
  const [assignTo, setAssignTo] = useState('');
  const [assignValue, setAssignValue] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const bulkDelete = useBulkDelete();
  const bulkUpdate = useBulkUpdate();
  const bulkAssign = useBulkAssign();
  const bulkApprove = useBulkApprove();
  const bulkReject = useBulkReject();

  const handleOperation = async () => {
    let mutation;
    let config: any;

    switch (operation) {
      case 'delete':
        mutation = bulkDelete;
        config = { module, ids: selectedIds };
        break;
      case 'update':
        mutation = bulkUpdate;
        config = { module, ids: selectedIds, updates };
        break;
      case 'assign':
        mutation = bulkAssign;
        config = { module, ids: selectedIds, assignTo, assignValue };
        break;
      case 'approve':
        mutation = bulkApprove;
        config = { module, ids: selectedIds };
        break;
      case 'reject':
        mutation = bulkReject;
        config = { module, ids: selectedIds, reason: rejectReason };
        break;
    }

    mutation.mutate(config, {
      onSuccess: () => {
        setOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  };

  const getOperationIcon = () => {
    switch (operation) {
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'update':
        return <Edit className="h-4 w-4" />;
      case 'assign':
        return <UserCheck className="h-4 w-4" />;
      case 'approve':
        return <CheckCircle className="h-4 w-4" />;
      case 'reject':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getOperationLabel = () => {
    switch (operation) {
      case 'delete':
        return 'Delete';
      case 'update':
        return 'Update';
      case 'assign':
        return 'Assign';
      case 'approve':
        return 'Approve';
      case 'reject':
        return 'Reject';
    }
  };

  const isOperationDisabled = () => {
    switch (operation) {
      case 'delete':
        return bulkDelete.isPending;
      case 'update':
        return bulkUpdate.isPending || Object.keys(updates).length === 0;
      case 'assign':
        return bulkAssign.isPending || !assignTo || !assignValue;
      case 'approve':
        return bulkApprove.isPending;
      case 'reject':
        return bulkReject.isPending || !rejectReason;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" disabled={selectedIds.length === 0}>
            Bulk Operations ({selectedIds.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Operations</DialogTitle>
          <DialogDescription>
            Perform bulk operations on {selectedIds.length} selected {module}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Operation</Label>
            <Select value={operation} onValueChange={(value) => setOperation(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="assign">Assign</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {operation === 'update' && (
            <div className="space-y-2">
              <Label>Field to Update</Label>
              <Input
                placeholder="Field name"
                value={Object.keys(updates)[0] || ''}
                onChange={(e) => setUpdates({ [e.target.value]: updates[Object.keys(updates)[0]] || '' })}
              />
              <Input
                placeholder="New value"
                value={updates[Object.keys(updates)[0]] || ''}
                onChange={(e) => setUpdates({ [Object.keys(updates)[0]]: e.target.value })}
              />
            </div>
          )}

          {operation === 'assign' && (
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Input
                placeholder="Field to assign"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              />
              <Input
                placeholder="Value to assign"
                value={assignValue}
                onChange={(e) => setAssignValue(e.target.value)}
              />
            </div>
          )}

          {operation === 'reject' && (
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Input
                placeholder="Reason for rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}

          {operation === 'delete' && (
            <div className="bg-destructive/10 p-4 rounded-lg">
              <p className="text-sm text-destructive">
                Warning: This action cannot be undone. {selectedIds.length} {module} will be permanently deleted.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleOperation}
            disabled={isOperationDisabled()}
            variant={operation === 'delete' ? 'destructive' : 'default'}
          >
            {getOperationIcon()}
            <span className="ml-2">{getOperationLabel()} {selectedIds.length} {module}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
