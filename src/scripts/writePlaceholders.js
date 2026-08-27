const fs = require("fs");
const path = require("path");

const UPLOADS = path.join(__dirname, "..", "uploads");

const writeSvg = (filename, { bg, fg, emoji, label, width = 800, height = 800 }) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="${height * 0.46}" font-size="${Math.round(width * 0.22)}" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  <text x="50%" y="${height * 0.72}" font-size="${Math.round(width * 0.055)}" font-family="Segoe UI, Arial, sans-serif" fill="${fg}" text-anchor="middle">${label}</text>
</svg>`;
  fs.writeFileSync(path.join(UPLOADS, filename), svg);
};

const PLACEHOLDERS = [
  { file: "store-noida.svg", bg: "#1b5e20", fg: "#e8f5e9", emoji: "🌾", label: "GreenFarm Noida", width: 800, height: 800 },
  { file: "store-delhi.svg", bg: "#33691e", fg: "#f1f8e9", emoji: "🌿", label: "GreenFarm Delhi", width: 800, height: 800 },
  { file: "cat-vegetables.svg", bg: "#c8e6c9", fg: "#1b5e20", emoji: "🥦", label: "Vegetables" },
  { file: "cat-fruits.svg", bg: "#ffe0b2", fg: "#e65100", emoji: "🍎", label: "Fruits" },
  { file: "cat-dairy.svg", bg: "#e3f2fd", fg: "#0d47a1", emoji: "🥛", label: "Dairy" },
  { file: "cat-groceries.svg", bg: "#fff3e0", fg: "#e65100", emoji: "🧺", label: "Groceries" },
  { file: "cat-herbs.svg", bg: "#dcedc8", fg: "#33691e", emoji: "🌱", label: "Herbs" },
  { file: "sub-leafy.svg", bg: "#a5d6a7", fg: "#1b5e20", emoji: "🥬", label: "Leafy greens" },
  { file: "sub-root.svg", bg: "#ffccbc", fg: "#bf360c", emoji: "🥕", label: "Root veg" },
  { file: "sub-seasonal-veg.svg", bg: "#c5e1a5", fg: "#33691e", emoji: "🫑", label: "Seasonal veg" },
  { file: "sub-seasonal-fruit.svg", bg: "#ffcdd2", fg: "#b71c1c", emoji: "🥭", label: "Seasonal fruit" },
  { file: "sub-citrus.svg", bg: "#fff9c4", fg: "#f57f17", emoji: "🍊", label: "Citrus" },
  { file: "sub-milk.svg", bg: "#e1f5fe", fg: "#01579b", emoji: "🥛", label: "Milk" },
  { file: "sub-fresh-dairy.svg", bg: "#f3e5f5", fg: "#6a1b9a", emoji: "🧀", label: "Fresh dairy" },
  { file: "sub-staples.svg", bg: "#d7ccc8", fg: "#4e342e", emoji: "🌾", label: "Staples" },
  { file: "sub-oils.svg", bg: "#ffe082", fg: "#ff6f00", emoji: "🫙", label: "Oils" },
  { file: "sub-fresh-herbs.svg", bg: "#b2dfdb", fg: "#004d40", emoji: "🌿", label: "Fresh herbs" },
  { file: "p-spinach.svg", bg: "#81c784", fg: "#1b5e20", emoji: "🥬", label: "Spinach" },
  { file: "p-tomato.svg", bg: "#ef9a9a", fg: "#b71c1c", emoji: "🍅", label: "Tomato" },
  { file: "p-potato.svg", bg: "#d7ccc8", fg: "#4e342e", emoji: "🥔", label: "Potato" },
  { file: "p-onion.svg", bg: "#ce93d8", fg: "#4a148c", emoji: "🧅", label: "Onion" },
  { file: "p-cauliflower.svg", bg: "#f5f5f5", fg: "#33691e", emoji: "🥦", label: "Cauliflower" },
  { file: "p-carrot.svg", bg: "#ffcc80", fg: "#e65100", emoji: "🥕", label: "Carrot" },
  { file: "p-capsicum.svg", bg: "#a5d6a7", fg: "#1b5e20", emoji: "🫑", label: "Capsicum" },
  { file: "p-broccoli.svg", bg: "#66bb6a", fg: "#1b5e20", emoji: "🥦", label: "Broccoli" },
  { file: "p-banana.svg", bg: "#fff59d", fg: "#f57f17", emoji: "🍌", label: "Banana" },
  { file: "p-apple.svg", bg: "#ef9a9a", fg: "#b71c1c", emoji: "🍎", label: "Apple" },
  { file: "p-mango.svg", bg: "#ffe082", fg: "#e65100", emoji: "🥭", label: "Mango" },
  { file: "p-orange.svg", bg: "#ffcc80", fg: "#e65100", emoji: "🍊", label: "Orange" },
  { file: "p-pomegranate.svg", bg: "#e57373", fg: "#b71c1c", emoji: "🍎", label: "Pomegranate" },
  { file: "p-grapes.svg", bg: "#ce93d8", fg: "#4a148c", emoji: "🍇", label: "Grapes" },
  { file: "p-milk.svg", bg: "#e3f2fd", fg: "#0d47a1", emoji: "🥛", label: "Milk" },
  { file: "p-paneer.svg", bg: "#fff8e1", fg: "#5d4037", emoji: "🧀", label: "Paneer" },
  { file: "p-curd.svg", bg: "#fce4ec", fg: "#880e4f", emoji: "🥣", label: "Curd" },
  { file: "p-ghee.svg", bg: "#ffe082", fg: "#e65100", emoji: "🫙", label: "Ghee" },
  { file: "p-rice.svg", bg: "#fff3e0", fg: "#5d4037", emoji: "🍚", label: "Basmati rice" },
  { file: "p-dal.svg", bg: "#ffcc80", fg: "#e65100", emoji: "🫘", label: "Toor dal" },
  { file: "p-atta.svg", bg: "#d7ccc8", fg: "#4e342e", emoji: "🌾", label: "Wheat atta" },
  { file: "p-oil.svg", bg: "#fff59d", fg: "#f57f17", emoji: "🫙", label: "Mustard oil" },
  { file: "p-coriander.svg", bg: "#a5d6a7", fg: "#1b5e20", emoji: "🌿", label: "Coriander" },
  { file: "p-mint.svg", bg: "#80cbc4", fg: "#004d40", emoji: "🌱", label: "Mint" },
  { file: "p-chilli.svg", bg: "#ef9a9a", fg: "#b71c1c", emoji: "🌶️", label: "Green chilli" },
  { file: "banner-top-1.svg", bg: "#2e7d32", fg: "#ffffff", emoji: "🚜", label: "Farm fresh this week", width: 1600, height: 600 },
  { file: "banner-top-2.svg", bg: "#558b2f", fg: "#ffffff", emoji: "🥬", label: "COD on every order", width: 1600, height: 600 },
  { file: "banner-mid.svg", bg: "#f9a825", fg: "#3e2723", emoji: "🎟️", label: "Use FARM10 at checkout", width: 1600, height: 400 },
  { file: "banner-bottom.svg", bg: "#1565c0", fg: "#e3f2fd", emoji: "🚚", label: "Same-day delivery nearby", width: 1600, height: 400 },
  { file: "avatar.svg", bg: "#eceff1", fg: "#37474f", emoji: "🙂", label: "Customer" },
];

const writePlaceholders = () => {
  fs.mkdirSync(UPLOADS, { recursive: true });
  PLACEHOLDERS.forEach((item) => writeSvg(item.file, item));
};

module.exports = { writePlaceholders, UPLOADS };
