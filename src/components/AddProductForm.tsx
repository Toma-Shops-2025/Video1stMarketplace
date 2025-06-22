import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from './CategorySection';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  category: z.string().min(1, 'Category is required'),
  images: z.any(),
  video: z.any()
});

const AddProductForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: any) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('title')}
          placeholder="Product Title"
          className="w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>
        )}
      </div>

      <div>
        <Select {...register('category')}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.filter(cat => cat.slug !== 'all').map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message as string}</p>
        )}
      </div>

      <div>
        <Textarea
          {...register('description')}
          placeholder="Product Description"
          className="w-full"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>
        )}
      </div>

      <div>
        <Input
          {...register('price')}
          type="number"
          step="0.01"
          placeholder="Price"
          className="w-full"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message as string}</p>
        )}
      </div>

      <div>
        <Input
          {...register('images')}
          type="file"
          multiple
          accept="image/*"
          className="w-full"
        />
        {errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images.message as string}</p>
        )}
      </div>

      <div>
        <Input
          {...register('video')}
          type="file"
          accept="video/*"
          className="w-full"
        />
        {errors.video && (
          <p className="text-red-500 text-sm mt-1">{errors.video.message as string}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Add Product
      </Button>
    </form>
  );
};

export default AddProductForm; 