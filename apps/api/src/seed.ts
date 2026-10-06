import { DEMO_BRANDS, DEMO_CATEGORIES, DEMO_PRODUCTS, demoProductSpecs, slugify } from '@ic/shared';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password && (await prisma.adminUser.count()) === 0) {
    await prisma.adminUser.create({
      data: { email: email.toLowerCase(), passwordHash: await argon2.hash(password), name: 'Administrator' },
    });
    console.log(`Admin created: ${email}`);
  }

  const brandIds = new Map<string, string>();
  for (const [i, name] of DEMO_BRANDS.entries()) {
    const slug = slugify(name);
    const brand = await prisma.brand.upsert({ where: { slug }, update: {}, create: { name, slug, sort: i } });
    brandIds.set(name, brand.id);
  }

  const categoryIds = new Map<string, string>();
  for (const [i, c] of DEMO_CATEGORIES.entries()) {
    const slug = slugify(c.name);
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name: c.name, slug, description: c.description, sort: i },
    });
    categoryIds.set(c.name, category.id);
  }

  for (const [i, p] of DEMO_PRODUCTS.entries()) {
    const slug = slugify(p.title);
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: p.title,
        brandId: brandIds.get(p.brand)!,
        categoryId: categoryIds.get(p.category)!,
        systemType: p.systemType,
        coolingKw: p.coolingKw,
        heatingKw: p.heatingKw,
        areaM2: p.areaM2,
        energyClass: p.energyClass,
        priceFrom: p.priceFrom,
        description: p.description,
        images: [p.image],
        specs: demoProductSpecs(p),
        sort: i,
      },
    });
  }

  console.log(
    `Seeded ${DEMO_BRANDS.length} brands, ${DEMO_CATEGORIES.length} categories, ${DEMO_PRODUCTS.length} products.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
