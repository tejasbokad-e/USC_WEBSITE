import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Download, Upload, Plus, Trash2 } from 'lucide-react';
import { getAllStudyMaterials, createStudyMaterial, deleteStudyMaterial, uploadFile, getAllDepartments } from '@/db/api';
import type { StudyMaterialWithRelations, Department } from '@/types';
import { toast } from 'sonner';

export default function StudyMaterialsPage() {
  const { profile, isPresident, isDepartmentHead } = useAuth();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<StudyMaterialWithRelations[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    is_public: false,
    department_id: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const canUpload = isPresident || isDepartmentHead;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [materialsRes, departmentsRes] = await Promise.all([
        getAllStudyMaterials(),
        getAllDepartments(),
      ]);

      setMaterials(materialsRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error('Failed to load materials:', error);
      toast.error('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      // Upload file to storage
      const timestamp = Date.now();
      const fileName = `${timestamp}_${selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data: uploadData, error: uploadError } = await uploadFile(selectedFile, fileName);

      if (uploadError || !uploadData) {
        toast.error('Failed to upload file');
        return;
      }

      // Create material record
      const { error: createError } = await createStudyMaterial({
        title: uploadForm.title,
        description: uploadForm.description || undefined,
        file_url: uploadData.url,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        is_public: uploadForm.is_public,
        department_id: uploadForm.department_id || undefined,
      });

      if (createError) {
        toast.error('Failed to create material record');
        return;
      }

      toast.success('Material uploaded successfully');
      setShowUpload(false);
      setUploadForm({ title: '', description: '', is_public: false, department_id: '' });
      setSelectedFile(null);
      loadData();
    } catch (error) {
      console.error('Failed to upload material:', error);
      toast.error('Failed to upload material');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const { error } = await deleteStudyMaterial(materialId);

      if (error) {
        toast.error('Failed to delete material');
        return;
      }

      toast.success('Material deleted successfully');
      loadData();
    } catch (error) {
      console.error('Failed to delete material:', error);
      toast.error('Failed to delete material');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 px-4">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study Materials</h1>
            <p className="text-muted-foreground">Access learning resources and documents</p>
          </div>
          {canUpload && (
            <Button onClick={() => setShowUpload(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Material
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materials.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No study materials available</p>
              </CardContent>
            </Card>
          ) : (
            materials.map((material) => (
              <Card key={material.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{material.title}</CardTitle>
                  <CardDescription>
                    {material.department?.display_name || 'General'}
                    {material.is_public && ' • Public'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {material.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
                  )}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>File: {material.file_name}</p>
                    <p>Size: {formatFileSize(material.file_size)}</p>
                    <p>Uploaded by: {material.uploader?.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1" size="sm">
                      <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    {(isPresident || (isDepartmentHead && material.department_id === profile?.department_id)) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(material.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Upload Dialog */}
        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Study Material</DialogTitle>
              <DialogDescription>Add a new learning resource</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  placeholder="Material title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={uploadForm.department_id}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, department_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter(dept => {
                        if (isPresident) return true;
                        if (isDepartmentHead) return dept.id === profile?.department_id;
                        return false;
                      })
                      .map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.display_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="public">Public Access</Label>
                <Switch
                  id="public"
                  checked={uploadForm.is_public}
                  onCheckedChange={(checked) => setUploadForm({ ...uploadForm, is_public: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>File (PDF only) *</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpload(false)} disabled={uploading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
