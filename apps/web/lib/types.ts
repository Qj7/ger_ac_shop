import type { FormattedAnswer, LeadStatus, LeadType, QuizAnswers, SystemType } from '@ic/shared';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  sort: number;
  active: boolean;
  _count?: { products: number };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort: number;
  _count?: { products: number };
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brandId: string;
  categoryId: string;
  brand: Pick<Brand, 'id' | 'name' | 'slug'>;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  systemType: SystemType;
  coolingKw: number | null;
  heatingKw: number | null;
  areaM2: number | null;
  energyClass: string | null;
  priceFrom: number | null;
  description: string;
  specs: ProductSpec[];
  images: string[];
  active: boolean;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  salutation: string | null;
  company: string | null;
  name: string | null;
  email: string;
  phone: string | null;
  zip: string | null;
  message: string | null;
  answers: QuizAnswers;
  source: Record<string, string>;
  notes: string | null;
  productId: string | null;
  product: { id: string; title: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
  formattedAnswers?: FormattedAnswer[];
}

export interface AdminStats {
  newLeads: number;
  last7: number;
  last30: number;
  total: number;
  activeProducts: number;
  latest: Lead[];
}
