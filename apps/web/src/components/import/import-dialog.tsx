'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useImportData, useDownloadTemplate, parseExcelFile, validateImportData } from '@/services/import-export.service';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

interface ImportDialogProps {
  module: string;
  requiredFields: string[];
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function ImportDialog({ module, requiredFields, onSuccess, children }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload');

  const importData = useImportData();
  const downloadTemplate = useDownloadTemplate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    try {
      const data = await parseExcelFile(selectedFile);
      setPreview(data.slice(0, 10)); // Show first 10 rows
      
      const validation = validateImportData(data, requiredFields);
      setErrors(validation.errors);
      
      if (validation.valid) {
        setStep('preview');
      }
    } catch (error) {
      toast.error('Failed to parse file');
      setErrors(['Failed to parse file. Please check the file format.']);
    }
  };

  const handleImport = async () => {
    if (!file) {
      return;
    }

    setStep('importing');

    importData.mutate(
      {
        module,
        file,
        skipDuplicates,
        updateExisting,
      },
      {
        onSuccess: (result) => {
          setStep('complete');
          
          if (onSuccess) {
            onSuccess();
          }

          setTimeout(() => {
            setOpen(false);
            setStep('upload');
            setFile(null);
            setPreview([]);
            setErrors([]);
          }, 2000);
        },
        onError: () => {
          setStep('preview');
        },
      }
    );
  };

  const handleDownloadTemplate = () => {
    downloadTemplate.mutate(module);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Import Data</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import {module}</DialogTitle>
          <DialogDescription>
            Import {module} data from an Excel file
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Download Template</Label>
              <Button variant="outline" onClick={handleDownloadTemplate} disabled={downloadTemplate.isPending}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Upload File</Label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {errors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {errors.length > 5 && (
                      <li>...and {errors.length - 5} more errors</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                File validated successfully. {preview.length} rows previewed.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skipDuplicates"
                  checked={skipDuplicates}
                  onCheckedChange={(checked) => setSkipDuplicates(checked as boolean)}
                />
                <Label htmlFor="skipDuplicates">Skip duplicate records</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="updateExisting"
                  checked={updateExisting}
                  onCheckedChange={(checked) => setUpdateExisting(checked as boolean)}
                />
                <Label htmlFor="updateExisting">Update existing records</Label>
              </div>
            </div>

            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {preview[0] && Object.keys(preview[0]).map((key) => (
                      <th key={key} className="text-left p-2">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index} className="border-b">
                      {Object.values(row).map((value: any, idx) => (
                        <td key={idx} className="p-2">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="space-y-4 text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p>Importing data...</p>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-4 text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p>Import completed successfully!</p>
          </div>
        )}

        <DialogFooter>
          {step === 'upload' && (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </>
          )}

          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={importData.isPending}>
                Import {preview.length} Records
              </Button>
            </>
          )}

          {step === 'complete' && (
            <Button onClick={() => setOpen(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
