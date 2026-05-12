export interface Product {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  description?: string;
  stock?: number;
  images: string[];
  isFeatured: boolean;
  isDiscounted: boolean;
  category?: { 
    _id: string; 
    id?: string; 
    name: string; 
    slug?: string; 
  };
  brand?: { 
    _id?: string; 
    id?: string; 
    name: string; 
  };
  hasColors?: boolean;
  isMultipleColor?: boolean;
  isMultipleSize?: boolean;
  sizeVariants?: { id?: string; _id?: string; name: string; stock: number }[];
  colorVariants?: { id?: string; _id?: string; name: string; hexCode: string; stock: number }[];
}
