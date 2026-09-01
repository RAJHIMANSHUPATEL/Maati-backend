/**
 * Seed local MongoDB `ecom_pos` with enough catalog, users, coupons, and orders
 * to exercise the website + CRM. Does not touch any other database.
 *
 *   npm run seed
 */
require("../config/loadEnv");

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const bcrypt = require("bcrypt");
const { CATALOG, STORE_IMAGES, BANNER_IMAGES, AVATAR } = require("./seedCatalog");

const User = require("../models/user.model");
const Store = require("../models/store.model");
const Category = require("../models/category.model");
const Subcategory = require("../models/subcategory.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const Order = require("../models/order.model");
const Banner = require("../models/banner.model");
const SiteSettings = require("../models/siteSettings.model");
const PolicyPage = require("../models/policyPage.model");
const City = require("../models/city.model");
const Contact = require("../models/contact.model");
const SubMenu = require("../models/subMenu.model");
const StockMovement = require("../models/stockMovement.model");
const OrderCounter = require("../models/orderCounter.model");
const Subscriber = require("../models/subscriber.model");
const PosConfiguration = require("../models/posConfiguration.model");
const BarcodeProduct = require("../models/barcodeProduct.model");

const LOCAL_DB = "ecom_pos";

const assertLocalDb = (url) => {
  if (!url) {
    throw new Error("MONGO_URL is missing in .env");
  }
  const dbName = url.split("/").pop().split("?")[0];
  if (dbName !== LOCAL_DB) {
    throw new Error(
      `Refusing to seed. MONGO_URL must point at local database "${LOCAL_DB}" (got "${dbName}").`
    );
  }
  if (!/localhost|127\.0\.0\.1/.test(url)) {
    throw new Error("Refusing to seed a remote MongoDB. Use mongodb://127.0.0.1:27017/ecom_pos");
  }
};

const hash = (plain) => bcrypt.hash(plain, 10);

const pctOff = (online, sell) =>
  online > sell ? Math.round(((online - sell) / online) * 100) : 0;

const seedStoreCatalog = async (store) => {
  const categoryDocs = [];
  const productDocs = [];

  for (const cat of CATALOG) {
    const category = await Category.create({
      name: cat.name,
      store: store._id,
      cover: cat.cover,
      isEcommerce: true,
      status: "active",
    });
    categoryDocs.push(category);

    for (const sub of cat.subs) {
      const subcategory = await Subcategory.create({
        name: sub.name,
        cover: sub.cover,
        category: category._id,
        status: "active",
      });

      for (const p of sub.products) {
        const discount = pctOff(p.online, p.sell);
        const product = await Product.create({
          store: store._id,
          cover: p.cover,
          name: p.name,
          images: [p.cover],
          onlinePrice: p.online,
          sellingPrice: p.sell,
          discount,
          discountGiven: p.online - p.sell,
          description: p.desc,
          rating: 4.2,
          status: "active",
          category: category._id,
          subCategory: subcategory._id,
          in_offer: discount > 0,
          stockStatus: p.qty > 0,
          quantityUnit: p.unit,
          quantity: p.qty,
          posPrice: p.sell,
        });
        productDocs.push(product);
      }
    }
  }

  await SubMenu.create({
    name: `${store.name} menu`,
    store: store._id,
    subMenu: categoryDocs.map((c) => c._id),
    status: "active",
  });

  await Banner.create([
    {
      name: `${store.name} hero`,
      store: store._id,
      images: [
        {
          url: BANNER_IMAGES.top1,
          altText: "Morning harvest at the farm",
          link: "/products",
          text: "Picked this morning. On your table by evening.",
        },
        {
          url: BANNER_IMAGES.top2,
          altText: "Produce aisle",
          link: "/products",
          text: "Cash on delivery on every order.",
        },
      ],
      status: "active",
      position: "top",
      page: "home",
    },
    {
      name: `${store.name} mid`,
      store: store._id,
      images: [
        {
          url: BANNER_IMAGES.mid,
          altText: "Seasonal vegetables",
          link: "/products",
          text: "Use FARM10 at checkout for 10% off.",
        },
      ],
      status: "active",
      position: "between",
      page: "home",
    },
    {
      name: `${store.name} footer`,
      store: store._id,
      images: [
        {
          url: BANNER_IMAGES.bottom,
          altText: "Grocery delivery",
          link: "/products",
          text: "Same-day delivery in Noida and Delhi.",
        },
      ],
      status: "active",
      position: "bottom",
      page: "home",
    },
  ]);

  return productDocs;
};

const seed = async () => {
  const mongoUrl = process.env.MONGO_URL;
  assertLocalDb(mongoUrl);

  await mongoose.connect(mongoUrl);
  console.log("Connected to", mongoose.connection.host, mongoose.connection.name);

  const collections = [
    User, Store, Category, Subcategory, Product, Coupon, Order, Banner,
    SiteSettings, PolicyPage, City, Contact, SubMenu, StockMovement,
    OrderCounter, Subscriber, PosConfiguration, BarcodeProduct,
  ];
  await Promise.all(collections.map((model) => model.deleteMany({})));
  console.log("Cleared ecom_pos collections");

  const adminPass = await hash("Admin@123");
  const customerPass = await hash("Customer@123");

  const [admin, ops, customer, priya, arjun] = await User.create([
    {
      first_name: "Maati",
      last_name: "Admin",
      email: "admin@greenfarm.test",
      password: adminPass,
      gender: "other",
      type: "owner",
      status: "active",
      cover: AVATAR,
      mobile: "9876543210",
      country_code: "+91",
      staff_code: "9001",
      staff_pin: "1111",
    },
    {
      first_name: "Ops",
      last_name: "Manager",
      email: "ops@greenfarm.test",
      password: adminPass,
      gender: "female",
      type: "manager",
      status: "active",
      cover: AVATAR,
      mobile: "9876543211",
      country_code: "+91",
      staff_code: "2001",
      staff_pin: "1111",
    },
    {
      first_name: "Rahul",
      last_name: "Sharma",
      email: "customer@greenfarm.test",
      password: customerPass,
      gender: "male",
      type: "user",
      status: "active",
      cover: AVATAR,
      mobile: "9876500001",
      country_code: "+91",
      address: [
        {
          street: "12 Sector 62, near Metro",
          city: "Noida",
          state: "Uttar Pradesh",
          zip: "201309",
          country: "India",
        },
      ],
    },
    {
      first_name: "Priya",
      last_name: "Mehta",
      email: "priya@greenfarm.test",
      password: customerPass,
      gender: "female",
      type: "user",
      status: "active",
      cover: AVATAR,
      mobile: "9876500002",
      country_code: "+91",
      address: [
        {
          street: "44 GK-2, M Block",
          city: "Delhi",
          state: "Delhi",
          zip: "110048",
          country: "India",
        },
      ],
    },
    {
      first_name: "Arjun",
      last_name: "Singh",
      email: "arjun@greenfarm.test",
      password: customerPass,
      gender: "male",
      type: "user",
      status: "active",
      cover: AVATAR,
      mobile: "9876500003",
      country_code: "+91",
      address: [
        {
          street: "8 Raj Nagar Extension",
          city: "Ghaziabad",
          state: "Uttar Pradesh",
          zip: "201017",
          country: "India",
        },
      ],
    },
    {
      first_name: "Inactive",
      last_name: "User",
      email: "inactive@greenfarm.test",
      password: customerPass,
      gender: "male",
      type: "user",
      status: "deactive",
      cover: AVATAR,
      mobile: "9876500004",
      country_code: "+91",
    },
  ]);

  const [noida, delhi] = await Store.create([
    {
      name: "Maati Noida",
      mobile: "1204123456",
      abn: "GF-NDA-001",
      address: "Plot 18, Sector 63, Noida",
      notes: "Flagship dark store. Same-day delivery across Noida and Greater Noida.",
      cover: STORE_IMAGES.noida,
      status: "active",
      commission: 8,
      open_time: "07:00",
      close_time: "22:00",
      isClosed: false,
      city: "Noida",
      email: "noida@greenfarm.test",
      pin: "201301",
      deliveryCharges: 40,
    },
    {
      name: "Maati Delhi",
      mobile: "1141234567",
      abn: "GF-DEL-002",
      address: "A-12 Okhla Phase 2, New Delhi",
      notes: "South Delhi hub. Delivery till 9:30 pm.",
      cover: STORE_IMAGES.delhi,
      status: "active",
      commission: 8,
      open_time: "07:00",
      close_time: "21:30",
      isClosed: false,
      city: "Delhi",
      email: "delhi@greenfarm.test",
      pin: "110020",
      deliveryCharges: 49,
    },
  ]);

  await User.findByIdAndUpdate(ops._id, { $set: { stores: [noida._id] } });
  await User.create([
    {
      first_name: "Noida",
      last_name: "Cashier",
      email: "cashier.noida@greenfarm.test",
      password: adminPass,
      gender: "male",
      type: "cashier",
      status: "active",
      cover: AVATAR,
      mobile: "9876543220",
      country_code: "+91",
      stores: [noida._id],
      staff_code: "1001",
      staff_pin: "1111",
    },
    {
      first_name: "Delhi",
      last_name: "Cashier",
      email: "cashier.delhi@greenfarm.test",
      password: adminPass,
      gender: "female",
      type: "cashier",
      status: "active",
      cover: AVATAR,
      mobile: "9876543221",
      country_code: "+91",
      stores: [delhi._id],
      staff_code: "1002",
      staff_pin: "1111",
    },
  ]);

  const noidaProducts = await seedStoreCatalog(noida);
  const delhiProducts = await seedStoreCatalog(delhi);

  await PosConfiguration.create([
    {
      store_ip: "192.168.1.11",
      mac_address: "aa:bb:cc:dd:ee:11",
      weight_scale_port: "COM3",
      store: noida._id,
      baud_rate: 9600,
      data_bits: 8,
      parity: "none",
      stop_bits: 1,
      flow_type: false,
      printer_ip: "192.168.1.21",
      printer_port: 9100,
      surcharge: 0,
      status: "active",
      pos_name: "NOIDA T1",
      pos_pin: "1234",
    },
    {
      store_ip: "192.168.1.12",
      mac_address: "aa:bb:cc:dd:ee:22",
      weight_scale_port: "COM3",
      store: delhi._id,
      baud_rate: 9600,
      data_bits: 8,
      parity: "none",
      stop_bits: 1,
      flow_type: false,
      printer_ip: "192.168.1.22",
      printer_port: 9100,
      surcharge: 0,
      status: "active",
      pos_name: "DELHI T1",
      pos_pin: "1234",
    },
  ]);

  const barcodePairs = [
    { name: "Palak (Spinach)", noida: "8901234000011", delhi: "8901234000042" },
    { name: "Dhaniya bunch", noida: "8901234000028", delhi: "8901234000059" },
    { name: "Mustard oil 1L", noida: "8901234000035", delhi: "8901234000066" },
  ];
  const barcodeDocs = [];
  for (const storePack of [
    { store: noida, products: noidaProducts, city: "noida" },
    { store: delhi, products: delhiProducts, city: "delhi" },
  ]) {
    for (const pair of barcodePairs) {
      const product = storePack.products.find((p) => p.name === pair.name);
      if (!product) continue;
      barcodeDocs.push({
        store: storePack.store._id,
        cover: product.cover,
        name: product.name,
        images: product.images || [],
        original_price: product.onlinePrice,
        sell_price: product.posPrice,
        discount: product.discount,
        descriptions: product.description,
        status: "active",
        category: product.category,
        sub_category: product.subCategory,
        in_stock: product.stockStatus,
        unit: product.quantityUnit,
        quantity: product.quantity,
        stock_quantity: product.quantity,
        barcode: storePack.city === "delhi" ? pair.delhi : pair.noida,
      });
    }
  }
  if (barcodeDocs.length) {
    await BarcodeProduct.create(barcodeDocs);
  }

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  await Coupon.create([
    {
      coupon_code: "FARM10",
      store: noida._id,
      description: "10% off Noida store",
      discount_type: "percent",
      discount_value: 10,
      status: "active",
      exp_date: nextYear,
    },
    {
      coupon_code: "FLAT50",
      store: noida._id,
      description: "₹50 off Noida store",
      discount_type: "flat",
      discount_value: 50,
      status: "active",
      exp_date: nextYear,
    },
    {
      coupon_code: "WELCOME20",
      store: delhi._id,
      description: "20% off Delhi store",
      discount_type: "percent",
      discount_value: 20,
      status: "active",
      exp_date: nextYear,
    },
    {
      coupon_code: "DELHI50",
      store: delhi._id,
      description: "₹50 off Delhi store",
      discount_type: "flat",
      discount_value: 50,
      status: "active",
      exp_date: nextYear,
    },
    {
      coupon_code: "EXPIRED",
      store: noida._id,
      description: "Expired coupon for negative tests",
      discount_type: "percent",
      discount_value: 50,
      status: "active",
      exp_date: new Date("2024-01-01"),
    },
    {
      coupon_code: "INACTIVE",
      store: noida._id,
      description: "Deactivated coupon",
      discount_type: "flat",
      discount_value: 25,
      status: "deactive",
      exp_date: nextYear,
    },
  ]);

  await SiteSettings.create({
    supportEmail: "support@maati.test",
    supportPhone: "+91 98765 43210",
    currencySymbol: "₹",
    lowStockThreshold: 5,
  });

  await PolicyPage.create([
    {
      title: "Privacy Policy",
      status: "active",
      content: "<p>Maati collects only what is needed to fulfil orders. We do not sell customer data.</p>",
    },
    {
      title: "Terms & Conditions",
      status: "active",
      content: "<p>Orders are COD-only. Cancel before packing for a full refund of item value.</p>",
    },
    {
      title: "About Us",
      status: "active",
      content: "<p>Maati is a daily mandi for Noida and Delhi. We source vegetables, fruit, dairy and staples from nearby plots and send them the same day.</p>",
    },
    {
      title: "Refund Policy",
      status: "active",
      content: "<p>Report damaged produce within 24 hours for replacement or credit.</p>",
    },
  ]);

  await City.create([{ name: "Noida" }, { name: "Delhi" }, { name: "Ghaziabad" }]);

  await Contact.create([
    {
      full_name: "Neha Kapoor",
      email: "neha@example.com",
      contact: "9811112233",
      notes: "Do you deliver to Indirapuram on Sundays?",
    },
    {
      full_name: "Vikram Joshi",
      email: "vikram@example.com",
      contact: "9822223344",
      notes: "Need bulk potatoes for a canteen.",
    },
  ]);

  await Subscriber.create([
    { email: "newsletter@example.com" },
    { email: "priya@greenfarm.test" },
  ]);

  const farm10 = await Coupon.findOne({ coupon_code: "FARM10" });
  const customers = [customer, priya, arjun];
  const storePacks = [
    { store: noida, products: noidaProducts.filter((p) => p.quantity > 0), delivery: 40 },
    { store: delhi, products: delhiProducts.filter((p) => p.quantity > 0), delivery: 49 },
  ];
  const statuses = [
    "pending",
    "confirmed",
    "packed",
    "out_for_delivery",
    "completed",
    "cancelled",
  ];

  const orders = [];
  const now = new Date();
  let seq = 1;
  for (let month = 0; month < now.getMonth() + 1; month += 1) {
    for (let n = 0; n < 3; n += 1) {
      const pack = storePacks[(month + n) % storePacks.length];
      const user = customers[(month + n) % customers.length];
      const a = pack.products[(seq * 2) % pack.products.length];
      const b = pack.products[(seq * 2 + 3) % pack.products.length];
      const lines = [
        { product: a._id, name: a.name, price: a.sellingPrice, quantity: 1, image: a.cover, unit: a.quantityUnit },
        { product: b._id, name: b.name, price: b.sellingPrice, quantity: 2, image: b.cover, unit: b.quantityUnit },
      ];
      const subTotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
      const useCoupon = n === 0 && pack.store._id.equals(noida._id);
      const discount = useCoupon ? Math.round(subTotal * 0.1 * 100) / 100 : 0;
      const createdAt = new Date(now.getFullYear(), month, 4 + n * 8, 11, 30);
      const dateKey = createdAt.toISOString().slice(0, 10).replace(/-/g, "");
      const storeCode = String(pack.store._id).slice(-4).toUpperCase();
      const padded = String(seq).padStart(4, "0");
      const status = statuses[seq % statuses.length];
      const addr = user.address?.[0];
      const address = addr
        ? `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`
        : "Pickup at store";

      orders.push({
        store_id: pack.store._id,
        user_id: user._id,
        order_number: `ORD-${storeCode}-${dateKey}-${padded}`,
        unique_id: `UQ-${storeCode}-${dateKey}-${padded}`,
        product_details: JSON.stringify(lines),
        sub_total: subTotal,
        surcharge: pack.delivery,
        coupon_code: useCoupon ? farm10._id : undefined,
        discount,
        grand_total: subTotal - discount + pack.delivery,
        payment_mode: "cash_on_delivery",
        payment_status: status === "completed" ? "completed" : "pending",
        delivery_type: n === 2 ? "pickup" : "delivery",
        address: n === 2 ? "Store pickup" : address,
        delivery_charge: n === 2 ? 0 : pack.delivery,
        order_platform: "web",
        order_status: status,
        notes: n === 1 ? "Please call before delivery" : "",
        store_name: pack.store.name,
        createdAt,
        updatedAt: createdAt,
      });
      seq += 1;
    }
  }

  await Order.insertMany(orders);

  const spinach = noidaProducts.find((p) => p.name.includes("Spinach") || p.name.includes("Palak"));
  if (spinach) {
    await StockMovement.create({
      product: spinach._id,
      delta: -12,
      quantityAfter: spinach.quantity,
      reason: "order",
      note: "Seed history",
    });
  }

  console.log("\nSeeded ecom_pos");
  console.log("  CRM owner:      admin@greenfarm.test / Admin@123");
  console.log("  CRM manager:    ops@greenfarm.test / Admin@123  (Noida only)");
  console.log("  Website login:  customer@greenfarm.test / Customer@123");
  console.log("  Coupons:        FARM10 (Noida 10%), FLAT50 (Noida ₹50), WELCOME20 (Delhi 20%)");
  console.log("  POS tills:      NOIDA T1 / 1234, DELHI T1 / 1234");
  console.log("  POS sign-on:    Noida 1001 / 1111, Delhi 1002 / 1111, manager 2001 / 1111");
  console.log("  Barcode demo:   8901234000011 (Noida Palak)");
  console.log(`  Products/store: ${noidaProducts.length}`);
  console.log(`  Orders:         ${orders.length}`);
};

seed()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Seed failed:", error.message);
    console.error(error);
    try {
      await mongoose.disconnect();
    } catch (_) {
      /* ignore */
    }
    process.exit(1);
  });
