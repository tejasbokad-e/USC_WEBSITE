import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BookOpen, Download } from 'lucide-react';
import { getPublicStudyMaterials } from '@/db/api';
import type { StudyMaterialWithRelations } from '@/types';
import { toast } from 'sonner';

export default function PublicMaterialsPage() {
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<StudyMaterialWithRelations[]>([]);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const { data, error } = await getPublicStudyMaterials();

      if (error) {
        toast.error('Failed to load materials');
        return;
      }

      setMaterials(data);
    } catch (error) {
      console.error('Failed to load materials:', error);
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container py-8 px-4">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Public Study Materials</h1>
          <p className="text-muted-foreground">Free access to learning resources</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materials.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No public materials available</p>
              </CardContent>
            </Card>
          ) : (
            materials.map((material) => (
              <Card key={material.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{material.title}</CardTitle>
                  <CardDescription>
                    {material.department?.display_name || 'General'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {material.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
                  )}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>File: {material.file_name}</p>
                    <p>Size: {formatFileSize(material.file_size)}</p>
                  </div>
                  <Button asChild className="w-full" size="sm">
                    <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
