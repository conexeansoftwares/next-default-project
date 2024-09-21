'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import Link from 'next/link';
import { CircleArrowLeft } from 'lucide-react';
import {
  ShortcutFormData,
  shortcutFormSchema,
  colorOptions,
  ColorValue,
} from '@/schemas/shortcutSchema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ShortcutFormProps {
  initialData?: ShortcutFormData;
  onSubmit: (values: ShortcutFormData) => Promise<void>;
  submitButtonText: string;
}

const DEFAULT_COLOR: ColorValue = 'bg-background';

export const ShortcutForm = forwardRef<
  { reset: () => void },
  ShortcutFormProps
>(({ initialData, onSubmit, submitButtonText }, ref) => {
  const form = useForm<ShortcutFormData>({
    resolver: zodResolver(shortcutFormSchema),
    defaultValues: initialData || {
      url: '',
      label: '',
      color: DEFAULT_COLOR,
    },
  });

  useImperativeHandle(ref, () => ({
    reset: () => form.reset(),
  }));

  return (
    <>
      <div className="w-full flex justify-end">
        <Link href={'/shortcuts'}>
          <Button>
            <CircleArrowLeft className="w-4 h-4 me-2" /> Voltar
          </Button>
        </Link>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL *</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe a URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rótulo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe o rótulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma cor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <span
                              className={`inline-block w-4 h-4 mr-2 ${option.value} rounded-full`}
                            ></span>
                            {option.value
                              .split('-')[1]
                              .charAt(0)
                              .toUpperCase() +
                              option.value.split('-')[1].slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end w-100 mt-6">
            <Button type="submit">{submitButtonText}</Button>
          </div>
        </form>
      </Form>
    </>
  );
});

ShortcutForm.displayName = 'ShortcutForm';
