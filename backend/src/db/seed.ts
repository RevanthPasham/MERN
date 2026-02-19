/**
 * Seed script: run with `npm run seed` (after DB is synced).
 * Inserts sample categories, collections, products, variants, attributes, etc. for Postman testing.
 */
import "dotenv/config";
import { sequelize } from "../config/db";
import {
  Category,
  Collection,
  Product,
  ProductVariant,
  Attribute,
  AttributeValue,
  VariantAttributeValue,
  ProductImage,
  ProductCollection,
  SizeChart,
  associate,
} from "./models";

async function seed() {
  await sequelize.authenticate();
  associate();

  // Attributes (Size, Color)
  const [sizeAttr] = await Attribute.findOrCreate({
    where: { name: "Size" },
    defaults: { name: "Size" },
  });
  const [colorAttr] = await Attribute.findOrCreate({
    where: { name: "Color" },
    defaults: { name: "Color" },
  });

  const sizeS = await AttributeValue.findOrCreate({
    where: { attributeId: sizeAttr.id, value: "S" },
    defaults: { attributeId: sizeAttr.id, value: "S" },
  }).then(([r]) => r);
  const sizeM = await AttributeValue.findOrCreate({
    where: { attributeId: sizeAttr.id, value: "M" },
    defaults: { attributeId: sizeAttr.id, value: "M" },
  }).then(([r]) => r);
  const sizeL = await AttributeValue.findOrCreate({
    where: { attributeId: sizeAttr.id, value: "L" },
    defaults: { attributeId: sizeAttr.id, value: "L" },
  }).then(([r]) => r);
  const colorBlack = await AttributeValue.findOrCreate({
    where: { attributeId: colorAttr.id, value: "Black" },
    defaults: { attributeId: colorAttr.id, value: "Black" },
  }).then(([r]) => r);
  const colorBlue = await AttributeValue.findOrCreate({
    where: { attributeId: colorAttr.id, value: "Blue" },
    defaults: { attributeId: colorAttr.id, value: "Blue" },
  }).then(([r]) => r);

  // Categories: Men, Women, Kids, Men > Hoodies
  const [men] = await Category.findOrCreate({
    where: { slug: "men" },
    defaults: { name: "Men", slug: "men" },
  });
  const [women] = await Category.findOrCreate({
    where: { slug: "women" },
    defaults: { name: "Women", slug: "women" },
  });
  const [kids] = await Category.findOrCreate({
    where: { slug: "kids" },
    defaults: { name: "Kids", slug: "kids" },
  });
  const [hoodies] = await Category.findOrCreate({
    where: { slug: "hoodies" },
    defaults: { name: "Hoodies", slug: "hoodies", parentId: men.id },
  });

  // Size chart for Hoodies
  await SizeChart.findOrCreate({
    where: { categoryId: hoodies.id },
    defaults: {
      categoryId: hoodies.id,
      imageUrl: "https://example.com/size-chart-hoodie.jpg",
      description: "Hoodie size chart (inches)",
    },
  });

  // Collections
  const [summerDrop] = await Collection.findOrCreate({
    where: { slug: "summer-drop" },
    defaults: {
      name: "Summer Drop",
      slug: "summer-drop",
      description: "Hot summer collection",
      bannerImage: "https://example.com/summer-banner.jpg",
      isActive: true,
    },
  });
  const [winterSale] = await Collection.findOrCreate({
    where: { slug: "winter-sale" },
    defaults: {
      name: "Winter Sale",
      slug: "winter-sale",
      description: "Winter sale collection",
      isActive: true,
    },
  });
  const [gymWear] = await Collection.findOrCreate({
    where: { slug: "gym-wear" },
    defaults: {
      name: "Gym Wear",
      slug: "gym-wear",
      description: "Gym & fitness wear",
      isActive: true,
    },
  });

  // Product: Hoodie (concept only)
  const [hoodieProduct] = await Product.findOrCreate({
    where: { slug: "classic-hoodie" },
    defaults: {
      title: "Classic Hoodie",
      slug: "classic-hoodie",
      description: "Comfortable classic hoodie",
      categoryId: hoodies.id,
      brand: "HouseOf",
      material: "Cotton",
      isActive: true,
    },
  });

  // Link product to collections (many-to-many)
  await (hoodieProduct as any).addCollection(summerDrop);
  await (hoodieProduct as any).addCollection(gymWear);

  // Variants: S/Black, M/Black, L/Blue (with price & stock)
  const v1 = await ProductVariant.create({
    productId: hoodieProduct.id,
    sku: "HOOD-S-BLK-001",
    price: 799,
    compareAtPrice: 999,
    stockQuantity: 5,
    weight: 0.4,
  });
  await (v1 as any).addAttributeValue(sizeS);
  await (v1 as any).addAttributeValue(colorBlack);

  const v2 = await ProductVariant.create({
    productId: hoodieProduct.id,
    sku: "HOOD-M-BLK-002",
    price: 799,
    stockQuantity: 3,
    weight: 0.45,
  });
  await (v2 as any).addAttributeValue(sizeM);
  await (v2 as any).addAttributeValue(colorBlack);

  const v3 = await ProductVariant.create({
    productId: hoodieProduct.id,
    sku: "HOOD-L-BLU-003",
    price: 849,
    stockQuantity: 2,
    weight: 0.5,
  });
  await (v3 as any).addAttributeValue(sizeL);
  await (v3 as any).addAttributeValue(colorBlue);

  // Images per variant
  await ProductImage.findOrCreate({
    where: { variantId: v1.id, url: "https://example.com/hoodie-s-black-1.jpg" },
    defaults: { variantId: v1.id, url: "https://example.com/hoodie-s-black-1.jpg", sortOrder: 0, altText: "Hoodie S Black" },
  });
  await ProductImage.findOrCreate({
    where: { variantId: v3.id, url: "https://example.com/hoodie-l-blue-1.jpg" },
    defaults: { variantId: v3.id, url: "https://example.com/hoodie-l-blue-1.jpg", sortOrder: 0, altText: "Hoodie L Blue" },
  });

  console.log("Seed completed: categories, collections, product, variants, attributes, images.");
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
