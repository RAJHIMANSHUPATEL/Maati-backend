const unsplash = (id, w = 900, h = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const CATALOG = [
  {
    name: "Vegetables",
    cover: unsplash("photo-1540420773420-3366772f4999"),
    subs: [
      {
        name: "Leafy greens",
        cover: unsplash("photo-1576045057995-568f588f82fb"),
        products: [
          {
            name: "Palak (Spinach)",
            cover: unsplash("photo-1576045057995-568f588f82fb"),
            online: 45,
            sell: 39,
            qty: 3,
            unit: "kilogram",
            desc: "Farm-washed palak, packed the same morning. Ideal for saag and smoothies.",
          },
          {
            name: "Dhaniya bunch",
            cover: unsplash("photo-1618375569900-6c5ea1ad0c0d"),
            online: 20,
            sell: 18,
            qty: 40,
            unit: "piece",
            desc: "Crisp coriander with roots on. One bunch seasons a family meal.",
          },
        ],
      },
      {
        name: "Root vegetables",
        cover: unsplash("photo-1518977676601-b53f82aba655"),
        products: [
          {
            name: "Potato",
            cover: unsplash("photo-1518977676601-b53f82aba655"),
            online: 35,
            sell: 30,
            qty: 200,
            unit: "kilogram",
            desc: "UP farm potatoes. Medium size, good for sabzi and fries.",
          },
          {
            name: "Red onion",
            cover: unsplash("photo-1508747703725-719777637510"),
            online: 40,
            sell: 36,
            qty: 180,
            unit: "kilogram",
            desc: "Pungent Nashik-style red onions. Store in a cool, dry basket.",
          },
          {
            name: "Carrot",
            cover: unsplash("photo-1598170845058-32b9d6a5da37"),
            online: 70,
            sell: 59,
            qty: 80,
            unit: "kilogram",
            desc: "Sweet orange carrots from the morning harvest. Snack or grate into raita.",
          },
        ],
      },
      {
        name: "Seasonal veg",
        cover: unsplash("photo-1563565375-f3fdfdbefa83"),
        products: [
          {
            name: "Desi tomato",
            cover: unsplash("photo-1592924357228-91a4daadcfea"),
            online: 50,
            sell: 42,
            qty: 120,
            unit: "kilogram",
            desc: "Ripe cooking tomatoes with a tart finish. Best used within 3 days.",
          },
          {
            name: "Cauliflower",
            cover: unsplash("photo-1568584711075-3d021a7c3ca3"),
            online: 55,
            sell: 48,
            qty: 45,
            unit: "piece",
            desc: "Tight white gobhi heads. One piece is about 600–800g.",
          },
          {
            name: "Green capsicum",
            cover: unsplash("photo-1563565375-f3fdfdbefa83"),
            online: 90,
            sell: 79,
            qty: 60,
            unit: "kilogram",
            desc: "Firm shimla mirch. Dice for stir-fry or stuff with paneer.",
          },
          {
            name: "Broccoli",
            cover: unsplash("photo-1459411621453-7b03977f4bfc"),
            online: 140,
            sell: 119,
            qty: 0,
            unit: "piece",
            desc: "Currently out of stock — next harvest lands mid-week.",
          },
        ],
      },
    ],
  },
  {
    name: "Fruits",
    cover: unsplash("photo-1619566636858-adf3ef46400b"),
    subs: [
      {
        name: "Seasonal fruit",
        cover: unsplash("photo-1571771894821-ce9b6c11b08e"),
        products: [
          {
            name: "Robusta banana",
            cover: unsplash("photo-1571771894821-ce9b6c11b08e"),
            online: 60,
            sell: 52,
            qty: 90,
            unit: "kilogram",
            desc: "Ready-to-eat bananas. About 6–7 pieces per kilo.",
          },
          {
            name: "Shimla apple",
            cover: unsplash("photo-1560806887-1e4cd0b6cbd6"),
            online: 180,
            sell: 159,
            qty: 70,
            unit: "kilogram",
            desc: "Crisp Himachal apples. Keep refrigerated after opening the pack.",
          },
          {
            name: "Alphonso mango",
            cover: unsplash("photo-1553279768-865429fa0078"),
            online: 220,
            sell: 189,
            qty: 35,
            unit: "kilogram",
            desc: "Seasonal Hapus-style mango. Soft, fragrant, and dessert-ready.",
          },
          {
            name: "Pomegranate",
            cover: unsplash("photo-1541348141845-6cb6f86b923f"),
            online: 200,
            sell: 175,
            qty: 40,
            unit: "kilogram",
            desc: "Heavy anaar with ruby arils. One fruit yields a large bowl.",
          },
          {
            name: "Green grapes",
            cover: unsplash("photo-1537640538966-79f369143f8f"),
            online: 130,
            sell: 110,
            qty: 28,
            unit: "kilogram",
            desc: "Seedless Nashik grapes. Rinse and chill before serving.",
          },
        ],
      },
      {
        name: "Citrus",
        cover: unsplash("photo-1547514701-4278210176e7"),
        products: [
          {
            name: "Kinnow orange",
            cover: unsplash("photo-1547514701-4278210176e7"),
            online: 90,
            sell: 78,
            qty: 55,
            unit: "kilogram",
            desc: "Juicy kinnow from Punjab. About 4–5 fruits per kilo.",
          },
        ],
      },
    ],
  },
  {
    name: "Dairy",
    cover: unsplash("photo-1628088062854-d1870b4553da"),
    subs: [
      {
        name: "Milk",
        cover: unsplash("photo-1563636619-e9143da7973b"),
        products: [
          {
            name: "Full cream milk 1L",
            cover: unsplash("photo-1563636619-e9143da7973b"),
            online: 68,
            sell: 62,
            qty: 80,
            unit: "liter",
            desc: "Chilled full-cream pouch. Keep below 4°C and use in 2 days of opening.",
          },
        ],
      },
      {
        name: "Fresh dairy",
        cover: unsplash("photo-1486297678162-eb2a19b0a9d2"),
        products: [
          {
            name: "Malai paneer 200g",
            cover: unsplash("photo-1631452180519-c014fe946bcc"),
            online: 110,
            sell: 99,
            qty: 40,
            unit: "piece",
            desc: "Soft block paneer. Soak 10 minutes in warm water before cooking.",
          },
          {
            name: "Set dahi 400g",
            cover: unsplash("photo-1488477181946-6428a0291777"),
            online: 45,
            sell: 40,
            qty: 50,
            unit: "piece",
            desc: "Thick set curd. Tangy enough for kadhi and raita.",
          },
          {
            name: "Cow ghee 500ml",
            cover: unsplash("photo-1474979266404-7eaacbcd87c5"),
            online: 620,
            sell: 549,
            qty: 18,
            unit: "piece",
            desc: "Slow-clarified cow ghee. Granular texture, nutty aroma.",
          },
        ],
      },
    ],
  },
  {
    name: "Groceries",
    cover: unsplash("photo-1586201375761-83865001e31c"),
    subs: [
      {
        name: "Staples",
        cover: unsplash("photo-1596797038530-2c107229654b"),
        products: [
          {
            name: "Basmati rice 1kg",
            cover: unsplash("photo-1586201375761-83865001e31c"),
            online: 180,
            sell: 159,
            qty: 70,
            unit: "kilogram",
            desc: "Aged extra-long grain. Soak 20 minutes before dum cooking.",
          },
          {
            name: "Toor dal 1kg",
            cover: unsplash("photo-1596797038530-2c107229654b"),
            online: 160,
            sell: 145,
            qty: 65,
            unit: "kilogram",
            desc: "Unpolished arhar dal. Pressure-cooks in 4–5 whistles.",
          },
          {
            name: "Whole wheat atta 1kg",
            cover: unsplash("photo-1574323347407-f5e1ad6d020b"),
            online: 55,
            sell: 49,
            qty: 90,
            unit: "kilogram",
            desc: "Stone-ground chakki atta. Soft rotis without extra oil.",
          },
        ],
      },
      {
        name: "Oils",
        cover: unsplash("photo-1474979266404-7eaacbcd87c5"),
        products: [
          {
            name: "Mustard oil 1L",
            cover: unsplash("photo-1474979266404-7eaacbcd87c5"),
            online: 210,
            sell: 189,
            qty: 32,
            unit: "liter",
            desc: "Kachi ghani mustard oil. Heat until it just smokes before tadka.",
          },
        ],
      },
    ],
  },
  {
    name: "Herbs",
    cover: unsplash("photo-1466692476866-aef57df3b0ff"),
    subs: [
      {
        name: "Fresh herbs",
        cover: unsplash("photo-1628555048866-e205b0d1b2c5"),
        products: [
          {
            name: "Pudina bunch",
            cover: unsplash("photo-1628556270448-4d4e4148e1b1"),
            online: 18,
            sell: 15,
            qty: 2,
            unit: "piece",
            desc: "Garden mint. Low stock this week — wrap in a damp cloth in the fridge.",
          },
          {
            name: "Green chilli",
            cover: unsplash("photo-1583119022894-919a68a3d0e3"),
            online: 30,
            sell: 25,
            qty: 50,
            unit: "kilogram",
            desc: "Hot hari mirch. A handful is enough for a kadhai.",
          },
        ],
      },
    ],
  },
];

const STORE_IMAGES = {
  noida: unsplash("photo-1488459716781-31db52582fe9", 800, 800),
  delhi: unsplash("photo-1542838132-92c53300491e", 800, 800),
};

const BANNER_IMAGES = {
  top1: unsplash("photo-1464226184884-fa280b87c399", 1600, 700),
  top2: unsplash("photo-1542838132-92c53300491e", 1600, 700),
  mid: unsplash("photo-1540420773420-3366772f4999", 1400, 500),
  bottom: unsplash("photo-1516594798947-e65505dbb29d", 1400, 500),
};

const AVATAR = unsplash("photo-1544005313-94ddf0286df2", 200, 200);

module.exports = { CATALOG, STORE_IMAGES, BANNER_IMAGES, AVATAR };
