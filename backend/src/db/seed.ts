/**
 * Populates the database with initial data so APIs return something.
 * Frontend gets all data only from API calls to the backend; this runs on the backend.
 * - When the server starts, it auto-runs if the DB has no banners (no manual seed step).
 * - Optional: run "npm run seed" from backend to populate without starting the server.
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { sequelize } from "../config/db";
import {
  User,
  Banner,
  Category,
  Collection,
  Product,
  ProductVariant,
  ProductImage,
  ProductCollection,
  ProductReview,
  Attribute,
  AttributeValue,
  associate,
} from "./models";

const BANNERS = [
  { title: "OWN THE", highlight: "OVERSIZED", subtitle: "VIBE", cta: "Shop Oversized Tees", collectionSlug: "oversized-graphic-tshirt", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", sortOrder: 0 },
  { title: "Best Sellers", highlight: "THIS WEEK", subtitle: "", cta: "Shop Best Sellers", collectionSlug: "best-sellers", imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80", sortOrder: 1 },
  { title: "Graphic", highlight: "ROUND NECK", subtitle: "T-SHIRTS", cta: "Shop Graphic Tees", collectionSlug: "graphic-round-neck", imageUrl: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80", sortOrder: 2 },
];

const CATEGORIES = [
  { slug: "oversized-graphic-tshirt", name: "Oversized Unisex Graphic T-Shirt" },
  { slug: "best-sellers", name: "Best Sellers" },
  { slug: "graphic-round-neck", name: "Graphic Round Neck Tshirts" },
  { slug: "yoga-tshirt", name: "Yoga Tshirt" },
  { slug: "writer-tshirt", name: "Writer Tshirt" },
  { slug: "lawyer-polo", name: "Lawyer Polo Tshirt" },
  { slug: "journalism-tshirt", name: "Journalism Tshirt" },
  { slug: "chef-tshirt", name: "Chef Tshirt" },
];

const COLLECTION_IMAGES: Record<string, string> = {
  "oversized-graphic-tshirt": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "best-sellers": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
  "graphic-round-neck": "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
  "yoga-tshirt": "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
  "writer-tshirt": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
  "lawyer-polo": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  "journalism-tshirt": "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
  "chef-tshirt": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
};

const COLLECTIONS = [
  { slug: "oversized-graphic-tshirt", name: "Oversized Unisex Graphic T-Shirt", description: "Shop oversized graphic tees" },
  { slug: "best-sellers", name: "Best Sellers", description: "Best selling products" },
  { slug: "graphic-round-neck", name: "Graphic Round Neck Tshirts", description: "Graphic round neck tees" },
  { slug: "yoga-tshirt", name: "Yoga Tshirt", description: "Yoga wear" },
  { slug: "writer-tshirt", name: "Writer Tshirt", description: "Writer tees" },
  { slug: "lawyer-polo", name: "Lawyer Polo", description: "Lawyer polos" },
  { slug: "journalism-tshirt", name: "Journalism Tshirt", description: "Journalism tees" },
  { slug: "chef-tshirt", name: "Chef Tshirt", description: "Chef wear" },
];

const IMG = {
  t1: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
  t2: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
  t3: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
  t4: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
  t5: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
  t6: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  t7: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  t8: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
};

// At least 5 products per collection (8 collections). Price ₹1 or ₹2.
const PRODUCTS = [
  { title: "Yoga Chakras White Round Neck", slug: "yoga-chakras-white", categorySlug: "yoga-tshirt", collectionSlugs: ["yoga-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t1, IMG.t2] },
  { title: "Yoga Flow Stretch Tee", slug: "yoga-flow-stretch", categorySlug: "yoga-tshirt", collectionSlugs: ["yoga-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t2, IMG.t3] },
  { title: "Yoga Zen Grey Tee", slug: "yoga-zen-grey", categorySlug: "yoga-tshirt", collectionSlugs: ["yoga-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t3, IMG.t1] },
  { title: "Yoga Mind Black", slug: "yoga-mind-black", categorySlug: "yoga-tshirt", collectionSlugs: ["yoga-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t6, IMG.t4] },
  { title: "Yoga Balance Navy", slug: "yoga-balance-navy", categorySlug: "yoga-tshirt", collectionSlugs: ["yoga-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t5, IMG.t2] },
  { title: "I am a Writer Navy Blue", slug: "i-am-a-writer-navy-blue", categorySlug: "writer-tshirt", collectionSlugs: ["writer-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t4, IMG.t5] },
  { title: "Writer's Block Black", slug: "writers-block-black", categorySlug: "writer-tshirt", collectionSlugs: ["writer-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t6, IMG.t1] },
  { title: "Pen & Paper White", slug: "pen-paper-white", categorySlug: "writer-tshirt", collectionSlugs: ["writer-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t1, IMG.t4] },
  { title: "Storyteller Grey", slug: "storyteller-grey", categorySlug: "writer-tshirt", collectionSlugs: ["writer-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t2, IMG.t6] },
  { title: "Author Life Navy", slug: "author-life-navy", categorySlug: "writer-tshirt", collectionSlugs: ["writer-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t5, IMG.t3] },
  { title: "Advocate Logo White Lawyer Polo", slug: "advocate-logo-pocket-white", categorySlug: "lawyer-polo", collectionSlugs: ["lawyer-polo", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t7, IMG.t8] },
  { title: "Legal Eagle Navy Polo", slug: "legal-eagle-navy-polo", categorySlug: "lawyer-polo", collectionSlugs: ["lawyer-polo", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t5, IMG.t7] },
  { title: "Justice Black Polo", slug: "justice-black-polo", categorySlug: "lawyer-polo", collectionSlugs: ["lawyer-polo", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t6, IMG.t4] },
  { title: "Counsel Grey Polo", slug: "counsel-grey-polo", categorySlug: "lawyer-polo", collectionSlugs: ["lawyer-polo", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t2, IMG.t7] },
  { title: "Brief Case White Polo", slug: "brief-case-white-polo", categorySlug: "lawyer-polo", collectionSlugs: ["lawyer-polo", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t1, IMG.t5] },
  { title: "Journalist Verified Navy", slug: "journalist-verified-navy-blue", categorySlug: "journalism-tshirt", collectionSlugs: ["journalism-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t2, IMG.t3] },
  { title: "News Breaker Black", slug: "news-breaker-black", categorySlug: "journalism-tshirt", collectionSlugs: ["journalism-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t6, IMG.t1] },
  { title: "Headline Grey Tee", slug: "headline-grey-tee", categorySlug: "journalism-tshirt", collectionSlugs: ["journalism-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t2, IMG.t4] },
  { title: "Reporter White Tee", slug: "reporter-white-tee", categorySlug: "journalism-tshirt", collectionSlugs: ["journalism-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t1, IMG.t5] },
  { title: "Byline Navy Tee", slug: "byline-navy-tee", categorySlug: "journalism-tshirt", collectionSlugs: ["journalism-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t5, IMG.t6] },
  { title: "Chef Street Style Black", slug: "chef-street-style-black", categorySlug: "chef-tshirt", collectionSlugs: ["chef-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t6, IMG.t1] },
  { title: "Kitchen King White", slug: "kitchen-king-white", categorySlug: "chef-tshirt", collectionSlugs: ["chef-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t1, IMG.t7] },
  { title: "Sous Chef Grey", slug: "sous-chef-grey", categorySlug: "chef-tshirt", collectionSlugs: ["chef-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t2, IMG.t4] },
  { title: "Line Cook Navy", slug: "line-cook-navy", categorySlug: "chef-tshirt", collectionSlugs: ["chef-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t5, IMG.t2] },
  { title: "Chef Life Black", slug: "chef-life-black", categorySlug: "chef-tshirt", collectionSlugs: ["chef-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t6, IMG.t3] },
  { title: "Depends on the day Black Graphic", slug: "depends-on-the-day-black", categorySlug: "graphic-round-neck", collectionSlugs: ["graphic-round-neck", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t8, IMG.t2] },
  { title: "Space Pocket Black Graphic", slug: "space-pocket-black", categorySlug: "graphic-round-neck", collectionSlugs: ["graphic-round-neck", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t6, IMG.t4] },
  { title: "Tokyo Navy Graphic", slug: "tokyo-navy-blue", categorySlug: "graphic-round-neck", collectionSlugs: ["graphic-round-neck", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t5, IMG.t3] },
  { title: "Retro Wave Graphic Tee", slug: "retro-wave-graphic", categorySlug: "graphic-round-neck", collectionSlugs: ["graphic-round-neck", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t1, IMG.t8] },
  { title: "Neon Nights Graphic", slug: "neon-nights-graphic", categorySlug: "graphic-round-neck", collectionSlugs: ["graphic-round-neck", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t4, IMG.t6] },
  { title: "Fibonacci Black Oversized", slug: "fibonacci-black", categorySlug: "oversized-graphic-tshirt", collectionSlugs: ["oversized-graphic-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t1, IMG.t2] },
  { title: "30000FT Flight Crew Black", slug: "30000ft-black-flight-crew", categorySlug: "oversized-graphic-tshirt", collectionSlugs: ["oversized-graphic-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t6, IMG.t4] },
  { title: "Oversized Urban Grey", slug: "oversized-urban-grey", categorySlug: "oversized-graphic-tshirt", collectionSlugs: ["oversized-graphic-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t2, IMG.t5] },
  { title: "Boxy Fit Navy", slug: "boxy-fit-navy", categorySlug: "oversized-graphic-tshirt", collectionSlugs: ["oversized-graphic-tshirt", "best-sellers"], price: 2, compareAtPrice: 3, images: [IMG.t5, IMG.t1] },
  { title: "Relaxed Crop Black", slug: "relaxed-crop-black", categorySlug: "oversized-graphic-tshirt", collectionSlugs: ["oversized-graphic-tshirt", "best-sellers"], price: 1, compareAtPrice: 2, images: [IMG.t6, IMG.t3] },
];

/** Inserts initial data. Safe to call multiple times (uses findOrCreate). Call after sync(). */
export async function populateInitialData(): Promise<void> {
  // Demo user
  const passwordHash = await bcrypt.hash("password123", 10);
  await User.findOrCreate({
    where: { email: "demo@example.com" },
    defaults: { email: "demo@example.com", passwordHash, name: "Demo User" },
  });

  // Banners (same as frontend tempData)
  for (let i = 0; i < BANNERS.length; i++) {
    const b = BANNERS[i];
    await Banner.findOrCreate({
      where: { collectionSlug: b.collectionSlug },
      defaults: {
        title: b.title,
        highlight: b.highlight,
        subtitle: b.subtitle || "",
        cta: b.cta,
        collectionSlug: b.collectionSlug,
        imageUrl: b.imageUrl,
        sortOrder: b.sortOrder,
        isActive: true,
      },
    });
  }

  // Categories
  const categoryMap: Record<string, { id: string }> = {};
  for (const c of CATEGORIES) {
    const [row] = await Category.findOrCreate({
      where: { slug: c.slug },
      defaults: { name: c.name, slug: c.slug },
    });
    categoryMap[c.slug] = { id: (row as any).id };
  }

  // Collections (with banner images for home page)
  const collectionMap: Record<string, InstanceType<typeof Collection>> = {};
  for (const c of COLLECTIONS) {
    const bannerImage = COLLECTION_IMAGES[c.slug] ?? null;
    const [row] = await Collection.findOrCreate({
      where: { slug: c.slug },
      defaults: { name: c.name, slug: c.slug, description: c.description || null, bannerImage, isActive: true },
    });
    const r = row as any;
    if (!r.bannerImage && bannerImage) {
      await row.update({ bannerImage });
    }
    collectionMap[c.slug] = row as InstanceType<typeof Collection>;
  }
  for (const c of CATEGORIES) {
    if (!collectionMap[c.slug]) {
      const bannerImage = COLLECTION_IMAGES[c.slug] ?? null;
      const [row] = await Collection.findOrCreate({
        where: { slug: c.slug },
        defaults: { name: c.name, slug: c.slug, description: null, bannerImage, isActive: true },
      });
      collectionMap[c.slug] = row as InstanceType<typeof Collection>;
    }
  }

  // Size attribute for variants
  const [sizeAttr] = await Attribute.findOrCreate({ where: { name: "Size" }, defaults: { name: "Size" } });
  const sizeM = await AttributeValue.findOrCreate({
    where: { attributeId: (sizeAttr as any).id, value: "M" },
    defaults: { attributeId: (sizeAttr as any).id, value: "M" },
  }).then(([r]) => r as any);

  // Products with variants and images
  for (const p of PRODUCTS) {
    const categoryId = categoryMap[p.categorySlug]?.id || null;
    const [prod] = await Product.findOrCreate({
      where: { slug: p.slug },
      defaults: {
        title: p.title,
        slug: p.slug,
        description: `${p.title} - Comfortable cotton`,
        categoryId,
        brand: "GEEKTEE",
        material: "Cotton",
        isActive: true,
      },
    });
    const prodId = (prod as any).id;

    const sku = `${p.slug.toUpperCase().replace(/-/g, "")}-M`;
    const [variant] = await ProductVariant.findOrCreate({
      where: { productId: prodId, sku },
      defaults: {
        productId: prodId,
        sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stockQuantity: 50,
      },
    });
    const variantId = (variant as any).id;
    await (variant as any).addAttributeValue(sizeM);

    for (let i = 0; i < p.images.length; i++) {
      await ProductImage.findOrCreate({
        where: { variantId, url: p.images[i] },
        defaults: { variantId, url: p.images[i], sortOrder: i, altText: p.title },
      });
    }

    // Set collection links (replace any existing so products show in collection pages)
    const colsToLink = p.collectionSlugs
      .map((slug) => collectionMap[slug])
      .filter(Boolean);
    if (colsToLink.length > 0) {
      await (prod as any).setCollections(colsToLink);
    }

    // Ensure price is 1 or 2 rupees (update existing variants too)
    await (variant as any).update({
      price: p.price,
      compareAtPrice: p.compareAtPrice,
    });
  }

  // Reviews for first few products (demo user)
  const demoUser = await User.findOne({ where: { email: "demo@example.com" } });
  const demoUserId = demoUser ? (demoUser as any).id : null;
  const reviewData: { slug: string; rating: number; comment: string }[] = [
    { slug: "yoga-chakras-white", rating: 5, comment: "Super comfortable, great fit!" },
    { slug: "yoga-chakras-white", rating: 4, comment: "Good quality for the price." },
    { slug: "i-am-a-writer-navy-blue", rating: 5, comment: "Love the design. Fast delivery." },
    { slug: "fibonacci-black", rating: 4, comment: "Nice oversized fit as described." },
    { slug: "depends-on-the-day-black", rating: 5, comment: "Exactly what I wanted. Will order again." },
  ];
  for (const r of reviewData) {
    const prod = await Product.findOne({ where: { slug: r.slug } });
    if (prod) {
      await ProductReview.create({
        productId: (prod as any).id,
        userId: demoUserId,
        userName: "Demo User",
        rating: r.rating,
        comment: r.comment,
      });
    }
  }

  console.log("Initial data populated: 1 user, 3 banners, 8 categories, 8 collections, 40 products (₹1-2), reviews.");
}

/** Call on every server start: ensures product–collection links and prices ₹1–2 so collection pages show products. */
export async function ensureCollectionLinksAndPrices(): Promise<void> {
  const allSlugs = [...new Set([...COLLECTIONS.map((c) => c.slug), ...CATEGORIES.map((c) => c.slug)])];
  const collectionRows = await Collection.findAll({ where: { slug: { [Op.in]: allSlugs } }, attributes: ["id", "slug"] });
  const collectionMap: Record<string, string> = {};
  for (const row of collectionRows) {
    collectionMap[(row as any).slug] = (row as any).id;
  }

  for (const p of PRODUCTS) {
    const prod = await Product.findOne({ where: { slug: p.slug }, include: [{ model: ProductVariant, as: "variants" }] });
    if (!prod) continue;
    const prodId = (prod as any).id;
    const variants = (prod as any).variants || [];
    const variant = variants[0];
    if (variant) {
      await variant.update({ price: p.price, compareAtPrice: p.compareAtPrice });
    }
    for (const slug of p.collectionSlugs) {
      const collectionId = collectionMap[slug];
      if (collectionId) {
        await ProductCollection.findOrCreate({
          where: { productId: prodId, collectionId },
          defaults: { productId: prodId, collectionId },
        });
      }
    }
  }
  console.log("Collection links and prices (₹1-2) synced.");
}

// When run as CLI: npm run seed
async function runSeed() {
  await sequelize.authenticate();
  associate();
  await sequelize.sync();
  await populateInitialData();
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
