import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { slugify, SYSTEM_TYPES, type BrandInput, type CategoryInput, type ProductInput, type SystemType } from '@ic/shared';
import { Prisma } from '@prisma/client';
import { parsePagination } from '../common/pagination';
import { PrismaService } from '../prisma/prisma.service';

export interface ProductListQuery {
  brand?: string;
  category?: string;
  system?: string;
  minArea?: string;
  q?: string;
  page?: string;
  limit?: string;
}

const productInclude = {
  brand: { select: { id: true, name: true, slug: true } },
  category: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.ProductInclude;

type SlugModel = 'product' | 'brand' | 'category';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  private async uniqueSlug(model: SlugModel, wanted: string | undefined, fallback: string, excludeId?: string) {
    const base = slugify(wanted || fallback);
    if (!base) throw new BadRequestException('Slug konnte nicht erzeugt werden');

    const exists = async (slug: string) => {
      const where = { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) };
      const delegate = this.prisma[model] as unknown as { count(args: { where: object }): Promise<number> };
      return (await delegate.count({ where })) > 0;
    };

    let slug = base;
    for (let i = 2; await exists(slug); i++) slug = `${base}-${i}`;
    return slug;
  }

  // ---------- Products ----------

  async listProducts(query: ProductListQuery, includeInactive = false) {
    const { page, pageSize, skip, take } = parsePagination(query.page, query.limit ?? '12', 100);
    const where: Prisma.ProductWhereInput = {};
    if (!includeInactive) where.active = true;
    if (query.brand) where.brand = { slug: query.brand };
    if (query.category) where.category = { slug: query.category };
    if (query.system && (SYSTEM_TYPES as readonly string[]).includes(query.system)) {
      where.systemType = query.system as SystemType;
    }
    const minArea = Number.parseInt(query.minArea ?? '', 10);
    if (!Number.isNaN(minArea)) where.areaM2 = { gte: minArea };
    if (query.q?.trim()) where.title = { contains: query.q.trim(), mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
        skip,
        take,
      }),
      this.prisma.product.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({ where: { slug, active: true }, include: productInclude });
    if (!product) throw new NotFoundException('Produkt nicht gefunden');
    return product;
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: productInclude });
    if (!product) throw new NotFoundException('Produkt nicht gefunden');
    return product;
  }

  async createProduct(input: ProductInput) {
    const slug = await this.uniqueSlug('product', input.slug, input.title);
    return this.prisma.product.create({ data: { ...input, slug }, include: productInclude });
  }

  async updateProduct(id: string, input: ProductInput) {
    const slug = await this.uniqueSlug('product', input.slug, input.title, id);
    return this.prisma.product.update({ where: { id }, data: { ...input, slug }, include: productInclude });
  }

  async deleteProduct(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { ok: true };
  }

  // ---------- Brands ----------

  listBrands(includeInactive = false) {
    return this.prisma.brand.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: [{ sort: 'asc' }, { name: 'asc' }],
      include: includeInactive ? { _count: { select: { products: true } } } : undefined,
    });
  }

  async createBrand(input: BrandInput) {
    const slug = await this.uniqueSlug('brand', input.slug, input.name);
    return this.prisma.brand.create({ data: { ...input, slug } });
  }

  async updateBrand(id: string, input: BrandInput) {
    const slug = await this.uniqueSlug('brand', input.slug, input.name, id);
    return this.prisma.brand.update({ where: { id }, data: { ...input, slug } });
  }

  async deleteBrand(id: string) {
    await this.prisma.brand.delete({ where: { id } });
    return { ok: true };
  }

  // ---------- Categories ----------

  listCategories(withCounts = false) {
    return this.prisma.category.findMany({
      orderBy: [{ sort: 'asc' }, { name: 'asc' }],
      include: withCounts ? { _count: { select: { products: true } } } : undefined,
    });
  }

  async createCategory(input: CategoryInput) {
    const slug = await this.uniqueSlug('category', input.slug, input.name);
    return this.prisma.category.create({ data: { ...input, slug } });
  }

  async updateCategory(id: string, input: CategoryInput) {
    const slug = await this.uniqueSlug('category', input.slug, input.name, id);
    return this.prisma.category.update({ where: { id }, data: { ...input, slug } });
  }

  async deleteCategory(id: string) {
    await this.prisma.category.delete({ where: { id } });
    return { ok: true };
  }
}
