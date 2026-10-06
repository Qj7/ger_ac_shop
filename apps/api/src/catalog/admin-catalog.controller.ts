import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  brandInputSchema,
  categoryInputSchema,
  productInputSchema,
  type BrandInput,
  type CategoryInput,
  type ProductInput,
} from '@ic/shared';
import { AdminGuard } from '../auth/admin.guard';
import { ZodPipe } from '../common/zod.pipe';
import { CatalogService, type ProductListQuery } from './catalog.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminCatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('products')
  listProducts(@Query() query: ProductListQuery) {
    return this.catalog.listProducts({ limit: '50', ...query }, true);
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.catalog.getProduct(id);
  }

  @Post('products')
  createProduct(@Body(new ZodPipe(productInputSchema)) body: ProductInput) {
    return this.catalog.createProduct(body);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body(new ZodPipe(productInputSchema)) body: ProductInput) {
    return this.catalog.updateProduct(id, body);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.catalog.deleteProduct(id);
  }

  @Get('brands')
  listBrands() {
    return this.catalog.listBrands(true);
  }

  @Post('brands')
  createBrand(@Body(new ZodPipe(brandInputSchema)) body: BrandInput) {
    return this.catalog.createBrand(body);
  }

  @Patch('brands/:id')
  updateBrand(@Param('id') id: string, @Body(new ZodPipe(brandInputSchema)) body: BrandInput) {
    return this.catalog.updateBrand(id, body);
  }

  @Delete('brands/:id')
  deleteBrand(@Param('id') id: string) {
    return this.catalog.deleteBrand(id);
  }

  @Get('categories')
  listCategories() {
    return this.catalog.listCategories(true);
  }

  @Post('categories')
  createCategory(@Body(new ZodPipe(categoryInputSchema)) body: CategoryInput) {
    return this.catalog.createCategory(body);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body(new ZodPipe(categoryInputSchema)) body: CategoryInput) {
    return this.catalog.updateCategory(id, body);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.catalog.deleteCategory(id);
  }
}
