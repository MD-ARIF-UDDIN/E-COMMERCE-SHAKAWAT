'use client';
import ProductForm from '@/components/admin/ProductForm';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <ProductForm 
        id={id} 
        onSuccess={() => router.push('/admin/products')} 
        onCancel={() => router.push('/admin/products')} 
      />
    </div>
  );
}
