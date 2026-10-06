import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService, type ProductListQuery } from './catalog.service';

@Controller()
export class PublicCatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('products')
  listProducts(@Query() query: ProductListQuery) {
    return this.catalog.listProducts(query);
  }

  @Get('products/:slug')
  getProduct(@Param('slug') slug: string) {
    return this.catalog.getProductBySlug(slug);
  }

  @Get('brands')
  listBrands() {
    return this.catalog.listBrands();
  }

  @Get('categories')
  listCategories() {
    return this.catalog.listCategories();
  }
}
