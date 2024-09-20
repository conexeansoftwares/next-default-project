import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { UploadIcon, UserIcon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

interface FileUploadFieldProps {
  form: any;
  name: string;
  photoUrl?: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export type FileUploadFieldRef = {
  reset: () => void;
};

const FileUploadField = forwardRef<FileUploadFieldRef, FileUploadFieldProps>(
  ({ form, name, photoUrl, maxSizeMB = 0.5, maxWidthOrHeight = 800 }, ref) => {
    const [previewUrl, setPreviewUrl] = useState<string | null | undefined>(photoUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        form.setValue(name, undefined);
      },
    }));

    useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }, [previewUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        form.setValue(name, selectedFile);
      } else {
        setPreviewUrl(null);
        form.setValue(name, undefined);
      }
    };

    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <FormField
        control={form.control}
        name={name}
        render={() => (
          <FormItem>
            <FormLabel>Foto do colaborador</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-48 h-48 relative overflow-hidden rounded-md border border-input">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Preview da foto de perfil"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <UserIcon className="w-24 h-24 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <input
                    ref={fileInputRef}
                    id={name}
                    name={name}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                    aria-label="Escolher uma foto de perfil"
                  />
                  <Button type="button" onClick={handleUploadClick} className='w-full'>
                    Escolher Foto
                    <UploadIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

FileUploadField.displayName = 'FileUploadField';

export default FileUploadField;
