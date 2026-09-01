const { z } = require("zod");

// ============= CRM VALIDATION ===========

// Banner Schemas
const addBannerSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for storeId"),
    images: z
      .array(
        z.object({
          url: z.string().min(1, "Image URL is required"),
          altText: z.string().max(200),
          link: z.string().url("Invalid URL for link").optional(),
          text: z.string().max(200).optional(),
        })
      )
      .min(1, "At least one image is required"),
    status: z.enum(["active", "deactive"]).default("active"),
    position: z.enum(["top", "bottom", "between"]),
    page: z.enum(["home", "catalogue"]),
  }),
});

const updateBannerSchema = z.object({
  body: z
    .object({
      _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
      name: z.string().min(3).max(100).optional(),
      store: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store")
        .optional(),
      images: z
        .array(
          z.object({
            url: z.string().min(1, "Image URL is required"),
            altText: z.string().min(1, "Alt text is required").max(200),
            link: z.string().url("Invalid URL for link").optional(),
            text: z.string().max(200).optional(),
          })
        )
        .optional(),
      status: z.enum(["active", "deactive"]).optional(),
      position: z.enum(["top", "bottom", "between"]).optional(),
      page: z.enum(["home", "catalogue"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
    }),
});

const updateBannerStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    status: z.enum(["active", "deactive"]),
  }),
});

// Category Schemas
const addCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    cover: z.string(),
    status: z.enum(["active", "deactive"]).default("active"),
  }),
});

const updateCategorySchema = z.object({
  body: z
    .object({
      _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
      name: z.string().min(1, "Name is required"),
      store: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
      cover: z.string(),
      status: z.enum(["active", "deactive"]).default("active").optional(),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
    }),
});

const updateCategoryStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    status: z.enum(["active", "deactive"]),
  }),
});

// Coupon Schemas
const addCouponSchema = z.object({
  body: z.object({
    couponCode: z.string().min(1, "Coupon code is required"),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    description: z.string().optional(),
    discountType: z.enum(["flat", "percent"]).default("percent"),
    discountValue: z.number().min(0, "Discount value cannot be negative"),
    status: z.enum(["active", "deactive"]).default("active"),
    exp_date: z.coerce.date(),
  }),
});

const updateCouponSchema = z.object({
  body: z
    .object({
      _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
      couponCode: z.string().min(1, "Coupon code is required").optional(),
      store: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store")
        .optional(),
      description: z.string().optional(),
      discountType: z.enum(["flat", "percent"]).optional(),
      discountValue: z.number().min(0).optional(),
      status: z.enum(["active", "deactive"]).optional(),
      exp_date: z.coerce.date().optional(),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
    }),
});

const updateCouponStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    status: z.enum(["active", "deactive"]),
  }),
});

// Policy Page Schemas
const addPolicyPageSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    status: z.enum(["active", "deactive"]).default("active"),
  }),
});

const updatePolicyPageSchema = z.object({
  body: z
    .object({
      _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
      title: z.string().min(1, "Title is required").optional(),
      content: z.string().min(1, "Content is required").optional(),
      status: z.enum(["active", "deactive"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
    }),
});

const updatePolicyPageStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    status: z.enum(["active", "deactive"]),
  }),
});

// POS Configuration Schemas
const addPosConfigurationSchema = z.object({
  body: z.object({
    store_ip: z.string().ip({
      version: "v4",
      message: "Invalid IPv4 address for store_ip",
    }),
    mac_address: z
      .string()
      .regex(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, "Invalid MAC address"),
    weight_scale_port: z.string().min(1, "Weight scale port is required"),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    baud_rate: z.number().int().min(0, "Baud rate cannot be negative"),
    data_bits: z.number().int(),
    parity: z.enum(["none", "even", "odd"]).default("none"),
    stop_bits: z.number(),
    flow_type: z.boolean(),
    printer_ip: z.string().ip({
      version: "v4",
      message: "Invalid IPv4 address for printer_ip",
    }),
    printer_port: z.number().int().min(0).max(65535, "Invalid port number"),
    surcharge: z.number().min(0, "Surcharge cannot be negative"),
    status: z.enum(["active", "deactive"]).default("active"),
    pos_name: z.string().min(1, "POS name is required"),
    pos_pin: z.string().min(1, "Pin is required"),
  }),
});

const updatePosConfigurationSchema = z.object({
  body: z
    .object({
      _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
      store_ip: z
        .string()
        .ip({
          version: "v4",
          message: "Invalid IPv4 address for store_ip",
        })
        .optional(),
      mac_address: z
        .string()
        .regex(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, "Invalid MAC address")
        .optional(),
      weight_scale_port: z
        .string()
        .min(1, "Weight scale port is required")
        .optional(),
      store: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store")
        .optional(),
      baud_rate: z
        .number()
        .int()
        .min(0, "Baud rate cannot be negative")
        .optional(),
      data_bits: z.number().int().optional(),
      parity: z.enum(["none", "even", "odd"]).optional(),
      stop_bits: z.number().optional(),
      flow_type: z.boolean().optional(),
      printer_ip: z
        .string()
        .ip({
          version: "v4",
          message: "Invalid IPv4 address for printer_ip",
        })
        .optional(),
      printer_port: z
        .number()
        .int()
        .min(0)
        .max(65535, "Invalid port number")
        .optional(),
      surcharge: z.number().min(0, "Surcharge cannot be negative").optional(),
      status: z.enum(["active", "deactive"]).optional(),
      pos_name: z.string().min(1, "POS name is required").optional(),
      pos_pin: z.string().min(1, "Pin is required").optional(),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
    }),
});

const updatePosConfigurationStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    status: z.enum(["active", "deactive"]),
  }),
});

// Product Schemas
const addProductSchema = z.object({
  body: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    cover: z.string(),
    name: z.string().min(1, "Name is required"),
    images: z.array(z.string()).optional(),
    onlinePrice: z.number().min(0, "Original price cannot be negative"),
    sellingPrice: z.number().min(0, "Sell price cannot be negative"),
    discount: z.number().min(0).default(0),
    description: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    status: z.enum(["active", "deactive"]).default("active"),
    variations: z
      .array(
        z.object({
          name: z.string().min(1, "Variation name is required"),
          original_price: z
            .number()
            .min(0, "Original price cannot be negative"),
          sell_price: z.number().min(0, "Sell price cannot be negative"),
          discount: z.number().min(0),
        })
      )
      .optional(),
    size: z.string(),
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for category"),
    subCategory: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for sub_category"),
    in_offer: z.boolean().default(true),
    stockStatus: z.boolean().default(true),
    quantityUnit: z.string().optional(),
    quantity: z.number().min(0),
    posPrice: z.number().min(1, "posPrice required"),
  }),
});

const updateProductSchema = z.object({
  body: z
    .object({
      _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
      store: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
      cover: z.string(),
      name: z.string().min(1, "Name is required"),
      images: z.array(z.string()),
      onlinePrice: z.number().min(0),
      sellingPrice: z.number().min(0),
      discount: z.number().min(0),
      description: z.string(),
      rating: z.number().min(0).max(5).optional(),
      status: z.enum(["active", "deactive"]).optional(),
      variations: z
        .array(
          z.object({
            name: z.string().min(1, "Variation name is required"),
            original_price: z
              .number()
              .min(0, "Original price cannot be negative"),
            sell_price: z.number().min(0, "Sell price cannot be negative"),
            discount: z.number().min(0),
          })
        )
        .optional(),
      size: z.string(),
      category: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for category"),
      subCategory: z
        .string()
        .regex(
          /^[0-9a-fA-F]{24}$/,
          "Invalid MongoDB ObjectId for sub_category"
        ),
      in_offer: z.boolean().optional(),
      stockStatus: z.boolean(),
      quantityUnit: z.string(),
      quantity: z.number().min(0),
      posPrice: z.number().min(1, "posPrice Required"),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
    }),
});

const updateProductStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    status: z.enum(["active", "deactive"]),
  }),
});

// Store Schemas
const addStoreSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    mobile: z.string().min(1, "Mobile is required"),
    abn: z.string().min(1, "ABN is required"),
    address: z.string().min(1, "Address is required"),
    notes: z.string().optional(),
    cover: z.string(),
    status: z.enum(["active", "deactive"]).default("active"),
    commission: z.number().min(0, "Commission cannot be negative"),
    open_time: z.string().min(1, "Open time is required"),
    close_time: z.string().min(1, "Close time is required"),
    isClosed: z.boolean().optional(),
    certificate_url: z.string().url("Invalid URL for certificate").optional(),
    certificate_type: z
      .string()
      .min(1, "Certificate type is required")
      .optional(),
    city: z.string(),
    email: z.string().email("Invalid email address"),
    pin: z.string().min(4, "PIN must be at least 4 characters"),
  }),
});

const updateStoreSchema = z.object({
  body: z
    .object({
      _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
      name: z.string().min(1, "Name is required"),
      mobile: z.string().min(1, "Mobile is required"),
      abn: z.string().min(1, "ABN is required"),
      address: z.string().min(1, "Address is required"),
      notes: z.string().optional(),
      cover: z.string(),
      status: z.enum(["active", "deactive"]).optional(),
      commission: z.number().min(0, "Commission cannot be negative"),
      open_time: z.string().min(1, "Open time is required"),
      close_time: z.string().min(1, "Close time is required"),
      isClosed: z.boolean().optional(),
      certificate_url: z.string().optional(),
      certificate_type: z.string().optional(),
      city: z.string(),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
      email: z.string().email("Invalid email address"),
      pin: z.string().min(4, "PIN must be at least 4 characters"),
    }),
});

const updateStoreStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    status: z.enum(["active", "deactive"]),
  }),
});

// Subcategory Schemas
const addSubcategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    cover: z.string(),
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for category"),
    status: z.enum(["active", "deactive"]).default("active"),
  }),
});

const updateSubcategorySchema = z.object({
  body: z
    .object({
      _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
      name: z.string().min(1, "Name is required").optional(),
      cover: z.string().optional(),
      category: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for category")
        .optional(),
      status: z.enum(["active", "deactive"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
    }),
});

const updateSubcategoryStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    status: z.enum(["active", "deactive"]),
  }),
});

// SubMenu Schemas
const addSubMenuSchema = z.object({
  body: z.object({
    name: z.string().min(1, "SubMenu name is required"),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    subMenu: z
      .array(
        z
          .string()
          .regex(
            /^[0-9a-fA-F]{24}$/,
            "Invalid MongoDB ObjectId for subMenu item"
          )
      )
      .min(1, "At least one subMenu item is required"),
  }),
});

const updateSubMenuSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    name: z.string().optional(),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    subMenu: z
      .array(
        z
          .string()
          .regex(
            /^[0-9a-fA-F]{24}$/,
            "Invalid MongoDB ObjectId for subMenu item"
          )
      )
      .min(1, "At least one subMenu item is required"),
  }),
});

const updateSubMenuStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    status: z.enum(["active", "deactive"]),
  }),
});

// User Schemas
const staffTypeEnum = z.enum(["owner", "manager", "cashier", "admin"]);
const objectIdString = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid store id");

const registerUserSchema = z.object({
  body: z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        "Password must be 8-20 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    gender: z.enum(["male", "female", "other"]),
    type: staffTypeEnum,
    status: z.enum(["active", "deactive"]).default("active"),
    cover: z.string().url("Invalid URL for cover image").optional(),
    mobile: z
      .string()
      .regex(/^\+?\d{9,15}$/, "Mobile number must be 7 to 15 digits"),
    country_code: z.string().min(1, "Country code is required"),
    stores: z.array(objectIdString).optional(),
    staff_code: z.string().regex(/^\d{4}$/, "Operator number must be 4 digits").optional(),
    staff_pin: z.string().regex(/^\d{4}$/, "Staff PIN must be 4 digits").optional(),
  }),
});

const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address or passsword"),
    password: z.string().min(1, "Password cannot be blank"),
  }),
});

const updateUserSchema = z.object({
  body: z
    .object({
      _id: z.string().optional(),
      first_name: z.string().min(1, "First name is required").optional(),
      last_name: z.string().min(1, "Last name is required").optional(),
      email: z.string().email("Invalid email address").optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
      type: staffTypeEnum.optional(),
      status: z.enum(["active", "deactive"]).optional(),
      cover: z.string().url("Invalid URL for cover image").optional(),
      mobile: z
        .string()
        .regex(/^\d{9,11}$/, "Mobile number must be 7 to 15 digits")
        .optional(),
      country_code: z.string().min(1, "Country code is required").optional(),
      address: z.array(z.object({})).optional(),
      stores: z.array(objectIdString).optional(),
      staff_code: z.string().regex(/^\d{4}$/, "Operator number must be 4 digits").optional(),
      staff_pin: z.string().regex(/^\d{4}$/, "Staff PIN must be 4 digits").optional(),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
    }),
});

// // Order Schemas
// const getOrderByMonthSchema = z.object({
//     body: z.object({
//         year: z.number().int().min(1900).max(2100), // Assuming a reasonable range for years
//     }),
// });

// const getOrderByDateSchema = z.object({
//     body: z.object({
//         start_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid date format for start_date" }),
//         end_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid date format for end_date" }),
//     }),
// });

// const getOrderByUserIdSchema = z.object({
//     body: z.object({
//         userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for userId"),
//     }),
// });

// const getOrderCountSchema = z.object({
//     query: z.object({
//         start_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid date format for start_date" }),
//         end_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid date format for end_date" }),
//     }),
// });

// const getSubcategoryByCategoryIdSchema = z.object({
//     body: z.object({
//         category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for category"),
//     }),
// });

// Driver POS Configuration Schema

// ============= CRM VALIDATION ENDS ====================

// ============= E COMMERCE VALIDATION ===================

// ECommerce Store Schemas
const getStoreByIdSchema = z.object({
  query: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for id")
      .optional(),
  }),
});

// ECommerce Menu Schemas
const getMenuSchema = z.object({
  query: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

// ECommerce Category Schemas

const getCategorySchema = z.object({
  query: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

// ECommerce Subscriber Schemas
const addSubscriberSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
});

// ECommerce Policy Page Schemas
const getPolicyPageByIdSchema = z.object({
  query: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for id"),
  }),
});

// ECommerce Banner Schema
const getRetailBannerSchema = z.object({
  body: z.object({
    storeId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for storeId"),
    page: z.string().min(1, "Page is Required"),
  }),
});

// // ECommerce Product Schemas

const getProductForHomeSchema = z.object({
  body: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

const getFilterProductSchema = z.object({
  body: z.object({
    discount: z.boolean().optional(),
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
      .optional(),
    subCategory: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid subCategory ID")
      .optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    sortBy: z
      .enum([
        "price_low_high",
        "price_high_low",
        "discount",
        "a_to_z",
        "z_to_a",
      ])
      .optional(),
    search: z.string().optional(),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store")
      .optional(),
  }),
});

// ECommerce Subcategory Schemas
const subCategoryByStoreSchema = z.object({
  query: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

const registerEcomUserSchema = z.object({
  body: z.object({
    first_name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Gender must be male, female, or other" }),
    }),
    status: z.enum(["active", "deactive"]).optional(), // default handled in DB
    cover: z.string().trim().optional(),
    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^\+?\d{10,15}$/, "Please enter a valid mobile number"),
    country_code: z.string().trim().min(1, "Country code is required"),
    address: z.array(z.object({})).optional(), // Adjust shape if needed
  }),
});

const loginEcomUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

// const getProductsByCategorySchema = z.object({
//   body: z.object({
//     store: z
//       .string()
//       .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
//     category: z
//       .string()
//       .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for category"),
//   }),
// });

// ECommerce Contact Schemas
const addContactSchema = z.object({
  body: z.object({
    full_name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    contact: z
      .string()
      .regex(
        /^(?:\+?(\d{1,3}))?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
        "Invalid contact number"
      ),
    notes: z.string().min(1, "Notes are required"),
  }),
});

// ECommerce Cart Schemas
const addCartSchema = z.object({
  body: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    user_id: z.string().min(1, "User ID is required"), // Assuming userId can be a string or ObjectId
    product_details: z
      .array(
        z.object({
          product: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for product"),
          weight: z.number().min(0, "Weight cannot be negative").optional(),
          price: z.number().min(0, "Price cannot be negative"),
          quantity: z
            .number()
            .int()
            .min(1, "Quantity must be at least 1")
            .optional(),
          variationId: z.string().optional(),
        })
      )
      .min(1, "Product details cannot be empty"),
  }),
});

const getCartSchema = z.object({
  query: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    user_id: z.string().min(1, "User ID is required"),
  }),
});

// ============== ECOMMERCE VALIDATION ENDS =================

const getPosConfigurationByMacSchema = z.object({
  body: z.object({
    mac_address: z
      .string()
      .regex(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, "Invalid MAC address"),
  }),
});

// Retail Barcode Product Schemas
const addBarcodeProductSchema = z.object({
  body: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    cover: z.string().url("Invalid URL for cover image").optional(),
    name: z.string().min(1, "Name is required"),
    images: z.array(z.string().url("Invalid URL for image")).optional(),
    original_price: z.number().min(0, "Original price cannot be negative"),
    sell_price: z.number().min(0, "Sell price cannot be negative"),
    discount: z.number().min(0).optional(),
    descriptions: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    status: z.enum(["active", "deactive"]).default("active"),
    size: z.string().optional(),
    variations: z.string().optional(), // Assuming variations is a JSON string
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for category"),
    sub_category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for sub_category")
      .optional(),
    in_offer: z.boolean().optional(),
    in_stock: z.boolean().optional(),
    unit: z.string().optional(),
    quantity: z.number().min(0).optional(),
    stock_quantity: z.number().min(0).optional(),
    barcode: z.string().min(1, "Barcode is required"),
  }),
});

const getBarcodeProductsByStoreSchema = z.object({
  body: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

const updateBarcodeProductSchema = z.object({
  body: z
    .object({
      _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
      store: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store")
        .optional(),
      cover: z.string().url("Invalid URL for cover image").optional(),
      name: z.string().min(1, "Name is required").optional(),
      images: z.array(z.string().url("Invalid URL for image")).optional(),
      original_price: z.number().min(0).optional(),
      sell_price: z.number().min(0).optional(),
      discount: z.number().min(0).optional(),
      descriptions: z.string().optional(),
      rating: z.number().min(0).max(5).optional(),
      status: z.enum(["active", "deactive"]).optional(),
      size: z.string().optional(),
      variations: z.string().optional(),
      category: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for category")
        .optional(),
      sub_category: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for sub_category")
        .optional(),
      in_offer: z.boolean().optional(),
      in_stock: z.boolean().optional(),
      unit: z.string().optional(),
      quantity: z.number().min(0).optional(),
      stock_quantity: z.number().min(0).optional(),
      barcode: z.string().min(1, "Barcode is required").optional(),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
    }),
});

const getBarcodeProductsByBarcodeSchema = z.object({
  body: z.object({
    barcode: z.string().min(1, "Barcode is required"),
  }),
});

// Retail Category Schemas
const addRetailCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    cover: z.string().url("Invalid URL for cover image"),
    status: z.enum(["active", "deactive"]).default("active"),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

const updateRetailCategorySchema = z.object({
  body: z
    .object({
      _id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
      name: z.string().min(1, "Name is required").optional(),
      cover: z.string().url("Invalid URL for cover image").optional(),
      status: z.enum(["active", "deactive"]).default("active").optional(),
      store: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 1, {
      message: "Data is required and cannot be empty",
      path: ["body"],
    }),
});

// Retail Order Schemas
const addOrderSchema = z.object({
  body: z.object({
    store_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store_id"),
    user_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for user_id")
      .optional(),
    date_time: z
      .string()
      .refine((val) => !val || !isNaN(new Date(val).getTime()), {
        message: "Invalid date format for date_time",
      })
      .optional(),
    payment_mode: z.string().min(1, "Payment mode is required"),
    order_number: z.string().optional(),
    product_details: z.string().min(1, "Product details are required"),
    notes: z.string().optional(),
    address: z.string().min(1, "Address is required"),
    driver_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for driver_id")
      .optional(),
    sub_total: z.number().min(0, "Sub total cannot be negative"),
    surcharge: z.number().min(0, "Surcharge cannot be negative").optional(),
    delivery_charge: z.number().min(0).optional(),
    couponCode: z.string().nullish(),
    discount: z.number().min(0).optional(),
    order_type: z.string().optional(),
    change_amount: z.number().min(0).optional(),
    tender_amount: z.number().min(0).optional(),
    split_cash_amount: z.number().min(0).optional(),
    split_card_amount: z.number().min(0).optional(),
    reference_id: z.string().optional(),
    status: z.string().optional(),
    order_status: z.string().optional(),
    grand_total: z.number().min(0, "Grand total cannot be negative").optional(),
    unique_id: z.string().optional(),
    tip_amount: z.number().min(0).optional(),
    pickup_date: z.string().nullish(),
    pickup_start_date: z.string().nullish(),
    pickup_end_date: z.string().nullish(),
    store_name: z.string().optional(),
    deliverytype: z.string().optional(),
    delivery_type: z.string().optional(),
    isPrinted: z.boolean().optional(),
    payment_status: z.string().optional(),
    order_platform: z.string().optional(),
  }),
});

const getOrderHistorySchema = z.object({
  body: z.object({
    start_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format for start_date",
    }),
    end_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format for end_date",
    }),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

const getOrderCountRetailSchema = z.object({
  body: z.object({
    start_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format for start_date",
    }),
    end_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format for end_date",
    }),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

const deleteOrderSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
  }),
});

const getLatestOrderbyDateSchema = z.object({
  body: z.object({
    start_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format for start_date",
    }),
    end_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format for end_date",
    }),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

const getOrderbyUserIdRetailSchema = z.object({
  body: z.object({
    user_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for user_id"),
  }),
});

const getOrderByIdRetailSchema = z.object({
  query: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for id"),
  }),
});

const orderPaymentStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    payment_status: z.string().min(1, "Payment status is required"),
  }),
});

const productByStoreIdSchema = z.object({
  body: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

const productByStoreIdandCategoryIdSchema = z.object({
  body: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for category"),
  }),
});

const productByStoreIdandIdSchema = z.object({
  query: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
  }),
  body: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
  }),
});

const getProductsBySubcategorySchema = z.object({
  body: z.object({
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    sub_category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for sub_category"),
  }),
});

// Retail Transaction Schemas
const addTransactionSchema = z.object({
  body: z.object({
    ref_id: z.string().min(1, "Reference ID is required"),
    date: z
      .string()
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid date format for date",
      })
      .optional(),
    amount: z.string().min(1, "Amount is required"),
    store_id: z.string().min(1, "Store ID is required"),
    transaction_receipt: z.string().min(1, "Transaction receipt is required"),
    pos_id: z.string().min(1, "POS ID is required"),
    status: z.boolean(),
  }),
});

const getTransactionByDateSchema = z.object({
  body: z.object({
    start_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format for start_date",
    }),
    end_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format for end_date",
    }),
    store_id: z.string().min(1, "Store ID is required"),
  }),
});

// Retail User Schemas
const getRetailUserByIdSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
  }),
});

const updateRetailUserSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    data: z
      .object({
        first_name: z.string().min(1, "First name is required").optional(),
        last_name: z.string().min(1, "Last name is required").optional(),
        email: z.string().email("Invalid email address").optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        type: z.string().min(1, "User type is required").optional(),
        status: z.enum(["active", "deactive"]).optional(),
        cover: z.string().url("Invalid URL for cover image").optional(),
        mobile: z.string().min(1, "Mobile number is required").optional(),
        country_code: z.string().min(1, "Country code is required").optional(),
        address: z.array(z.object({})).optional(), // Assuming address is an array of objects, schema can be more detailed if needed
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: "Data is required and cannot be empty",
        path: ["body.data"],
      }),
  }),
});

const updateRetailUserAddressSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    address: z.object({
      id: z.string().optional(), // Assuming address has an id for identification
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zip: z.string().min(1, "Zip code is required"),
      country: z.string().min(1, "Country is required"),
    }),
  }),
});

const deleteRetailUserAddressSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    addressId: z.string().min(1, "Address ID is required"),
  }),
});

const verifyTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
  }),
});

const sendEmailSchema = z.object({
  body: z.object({
    to: z.string().email("Invalid recipient email address"),
    html: z.string().min(1, "HTML content is required"),
    cc: z.array(z.string().email("Invalid CC email address")).optional(),
  }),
});

const sendOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    purpose: z.enum(["register", "reset"]).optional(),
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    otp: z
      .string()
      .min(6, "OTP must be 6 digits")
      .max(6, "OTP must be 6 digits"),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    Otp: z
      .string()
      .min(6, "OTP must be 6 digits")
      .max(6, "OTP must be 6 digits"),
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        "Password must be 8-20 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  }),
});

// Retail Order Number Schema
const getOrderNumberSchema = z.object({
  body: z.object({
    storeId: z.string().min(1, "Store ID is required"),
    gmtTime: z.object({
      time: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid date format for gmtTime.time",
      }),
      timeZone: z.string().min(1, "Timezone is required"),
    }),
  }),
});

const updateEcomUserPasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        "Password must be 8-20 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  }),
});

const updateEcomUserAddressSchema = z.object({
  body: z.object({
    address: z.object({
      id: z.string().optional(), // Assuming address has an id for identification
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zip: z.string().min(1, "Zip code is required"),
      country: z.string().min(1, "Country is required"),
    }),
  }),
});

const deleteEcomUserAddressSchema = z.object({
  body: z.object({
    addressId: z.string().min(1, "Address ID is required"),
  }),
});

const getOrderByMonthSchema = z.object({
  body: z.object({
    year: z.number().int().min(1900).max(2100),
  }),
});

const getOrderByDateSchema = z.object({
  body: z.object({
    start_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format for start_date",
    }),
    end_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format for end_date",
    }),
  }),
});

const getOrderByUserIdSchema = z.object({
  body: z.object({
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for userId"),
  }),
});

const getOrderCountSchema = z.object({
  query: z.object({
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }),
});

const updateOrderSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    order_status: z
      .enum([
        "pending",
        "confirmed",
        "packed",
        "out_for_delivery",
        "completed",
        "cancelled",
      ])
      .optional(),
    notes: z.string().optional(),
  }),
});

const updateUserStatusSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    status: z.enum(["active", "deactive"]),
  }),
});

const adjustStockSchema = z.object({
  body: z.object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for _id"),
    quantity: z.number().min(0),
    reason: z.string().min(1, "Reason is required"),
    note: z.string().optional(),
  }),
});

const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, "Coupon code is required"),
    store: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for store"),
    sub_total: z.number().min(0).optional(),
  }),
});

const updateSettingsSchema = z.object({
  body: z.object({
    supportEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    supportPhone: z.string().optional(),
    currencySymbol: z.string().optional(),
    lowStockThreshold: z.number().min(0).optional(),
  }),
});

const posObjectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const posUnlockSchema = z.object({
  body: z.object({
    posId: posObjectId,
    pin: z.string().min(4, "PIN is required").max(8),
  }),
});

const posBarcodeSchema = z.object({
  body: z.object({
    barcode: z.string().min(1, "Barcode is required"),
  }),
});

const posSaleSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product: posObjectId,
          quantity: z.number().positive().optional(),
          weight: z.number().positive().optional(),
        })
      )
      .min(1, "Bag is empty"),
    notes: z.string().optional(),
    tender_amount: z.number().min(0, "Tender amount is required"),
  }),
});

const posSaleIdSchema = z.object({
  params: z.object({
    id: posObjectId,
  }),
  body: z
    .object({
      pin: z.string().regex(/^\d{4}$/, "Manager PIN must be 4 digits").optional(),
    })
    .optional(),
});

const posSignonSchema = z.object({
  body: z.object({
    staff_code: z.string().regex(/^\d{4}$/, "Operator number must be 4 digits"),
    pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
  }),
});

module.exports = {
  updateEcomUserPasswordSchema,
  updateEcomUserAddressSchema,
  deleteEcomUserAddressSchema,
  addBannerSchema,
  updateBannerSchema,
  updateBannerStatusSchema,
  addCategorySchema,
  updateCategorySchema,
  updateCategoryStatusSchema,
  addCouponSchema,
  updateCouponSchema,
  updateCouponStatusSchema,
  addPolicyPageSchema,
  updatePolicyPageSchema,
  updatePolicyPageStatusSchema,
  addPosConfigurationSchema,
  updatePosConfigurationSchema,
  updatePosConfigurationStatusSchema,
  addProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
  addStoreSchema,
  updateStoreSchema,
  updateStoreStatusSchema,
  addSubcategorySchema,
  updateSubcategorySchema,
  updateSubcategoryStatusSchema,
  addSubMenuSchema,
  updateSubMenuSchema,
  updateSubMenuStatusSchema,
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  getPosConfigurationByMacSchema,
  getRetailBannerSchema,
  addBarcodeProductSchema,
  getBarcodeProductsByStoreSchema,
  updateBarcodeProductSchema,
  getBarcodeProductsByBarcodeSchema,
  addCartSchema,
  getCartSchema,
  addRetailCategorySchema,
  updateRetailCategorySchema,
  addContactSchema,
  getMenuSchema,
  getCategorySchema,
  addOrderSchema,
  getOrderHistorySchema,
  getOrderCountRetailSchema,
  deleteOrderSchema,
  getLatestOrderbyDateSchema,
  getOrderbyUserIdRetailSchema,
  getOrderByIdRetailSchema,
  orderPaymentStatusSchema,
  getPolicyPageByIdSchema,
  productByStoreIdSchema,
  productByStoreIdandCategoryIdSchema,
  productByStoreIdandIdSchema,
  getProductsBySubcategorySchema,
  getStoreByIdSchema,
  subCategoryByStoreSchema,
  addSubscriberSchema,
  addTransactionSchema,
  getTransactionByDateSchema,
  getRetailUserByIdSchema,
  updateRetailUserSchema,
  updateRetailUserAddressSchema,
  deleteRetailUserAddressSchema,
  verifyTokenSchema,
  sendEmailSchema,
  sendOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  getOrderNumberSchema,
  getProductForHomeSchema,
  getFilterProductSchema,
  registerEcomUserSchema,
  loginEcomUserSchema,
  getOrderByMonthSchema,
  getOrderByDateSchema,
  getOrderByUserIdSchema,
  getOrderCountSchema,
  updateOrderSchema,
  updateUserStatusSchema,
  adjustStockSchema,
  validateCouponSchema,
  updateSettingsSchema,
  posUnlockSchema,
  posBarcodeSchema,
  posSaleSchema,
  posSaleIdSchema,
  posSignonSchema,
};
