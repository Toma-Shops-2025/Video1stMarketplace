import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, Video } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import supabase from '@/lib/supabase';

interface MediaUploadProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
}

// Utility to sanitize file names
function sanitizeFileName(name: string) {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '') // Only allow a-z, A-Z, 0-9, dot, dash, underscore
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ onUpload, maxFiles = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; type: 'image' | 'video'; name: string }[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (uploadedFiles.length + files.length > maxFiles) {
      toast({ title: 'Error', description: `Maximum ${maxFiles} files allowed`, variant: 'destructive' });
      return;
    }

    setUploading(true);
    const newFiles: { url: string; type: 'image' | 'video'; name: string }[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const safeName = sanitizeFileName(file.name);
        const fileName = `${Math.random()}_${safeName}`;
        const isVideo = file.type.startsWith('video/');
        const bucket = isVideo ? 'product-videos' : 'product-images';

        const { error: uploadError, data } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        newFiles.push({
          url: publicUrl,
          type: isVideo ? 'video' : 'image',
          name: file.name
        });
      }

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onUpload(updatedFiles.map(f => f.url));
      toast({ title: 'Success', description: 'Files uploaded successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Error', description: 'Failed to upload files', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    onUpload(updatedFiles.map(f => f.url));
  };

  return (
    <div className="space-y-4">
      <Label>Photos & Videos</Label>
      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Upload photos and videos of your item
              </p>
              <p className="text-xs text-gray-500">
                Supports JPG, PNG, MP4, MOV (max {maxFiles} files)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="media-upload"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              disabled={uploading}
              onClick={() => document.getElementById('media-upload')?.click()}
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Uploaded Files</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                          <span className="ml-2 text-xs text-gray-600 truncate">
                            {file.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaUpload;