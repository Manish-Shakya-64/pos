let customers = JSON.parse(localStorage.getItem("customers")) || [
  {
    id: 1,
    name: "Sharma Pan Bhandar",
    phone: "9876543210",
    address: "15 MG Road, Indore, MP",
    email: "sharma.pan@example.com",
    balance: 2500,
  },
  {
    id: 2,
    name: "Gupta General Store",
    phone: "9123456780",
    address: "22 Nehru Nagar, Bhopal, MP",
    email: "gupta.store@example.com",
    balance: 1200,
  },
  {
    id: 3,
    name: "Patel Kirana & Pan Shop",
    phone: "9988776655",
    address: "Station Road, Nagpur, MH",
    email: "patel.kirana@example.com",
    balance: 0,
  },
];

let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: 1,
    name: "Gold Flake Kings",
    price: 350,
    stock: 200,
    description: "Premium cigarette pack of 20 sticks",
    category: "Cigarettes",
  },
  {
    id: 2,
    name: "Classic Milds",
    price: 320,
    stock: 150,
    description: "Mild cigarette pack of 20 sticks",
    category: "Cigarettes",
  },
  {
    id: 3,
    name: "Bidi (Tendu Leaves)",
    price: 50,
    stock: 1000,
    description: "Local handmade bidi bundle (25 sticks)",
    category: "Bidi",
  },
  {
    id: 4,
    name: "Pan Masala Rajnigandha",
    price: 180,
    stock: 300,
    description: "Premium pan masala pouch 50g",
    category: "Pan Masala",
  },
  {
    id: 5,
    name: "Gutkha Vimal",
    price: 10,
    stock: 2000,
    description: "Single pouch gutkha 5g",
    category: "Gutkha",
  },
  {
    id: 6,
    name: "Cigar (Imported)",
    price: 1200,
    stock: 30,
    description: "Premium imported hand-rolled cigar",
    category: "Cigars",
  },
];

let sales = JSON.parse(localStorage.getItem("sales")) || [
  {
    id: 1,
    date: "2025-08-23",
    customerId: 1,
    products: [{ productId: 1, quantity: 5, subtotal: 1750 }],
    total: 1750,
  },
  {
    id: 2,
    date: "2025-08-22",
    customerId: 2,
    products: [{ productId: 3, quantity: 20, subtotal: 1000 }],
    total: 1000,
  },
  {
    id: 3,
    date: "2025-08-21",
    customerId: 3,
    products: [
      { productId: 2, quantity: 3, subtotal: 960 },
      { productId: 5, quantity: 50, subtotal: 500 },
    ],
    total: 1460,
  },
  {
    id: 4,
    date: "2025-08-20",
    customerId: 1,
    products: [{ productId: 4, quantity: 10, subtotal: 1800 }],
    total: 1800,
  },
];

let settings = JSON.parse(localStorage.getItem("settings")) || {
  shopName: "Shree Tobacco Traders",
  gstNumber: "GSTMP1234567",
  phone: "9998887770",
  address: "Plot 45, Wholesale Market, Indore, MP",
  email: "shreetobacco@example.com",
};

export function getCustomers() {
  return customers;
}

export function addCustomer(customer) {
  customer.id = customers.length + 1;
  customers.push(customer);
  localStorage.setItem("customers", JSON.stringify(customers));
}

export function updateCustomer(updatedCustomer) {
  customers = customers.map((c) =>
    c.id === updatedCustomer.id ? updatedCustomer : c
  );
  localStorage.setItem("customers", JSON.stringify(customers));
}

export function deleteCustomer(id) {
  customers = customers.filter((c) => c.id !== id);
  localStorage.setItem("customers", JSON.stringify(customers));
}

export function getProducts() {
  return products;
}

export function addProduct(product) {
  product.id = products.length + 1;
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));
}

export function updateProduct(updatedProduct) {
  products = products.map((p) =>
    p.id === updatedProduct.id ? updatedProduct : p
  );
  localStorage.setItem("products", JSON.stringify(products));
}

export function deleteProduct(id) {
  products = products.filter((p) => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
}

export function getSales() {
  return sales;
}

export function addSale(sale) {
  sale.id = sales.length + 1;
  sales.push(sale);
  localStorage.setItem("sales", JSON.stringify(sales));
}

export function getSettings() {
  return settings;
}

export function updateSettings(newSettings) {
  settings = { ...settings, ...newSettings };
  localStorage.setItem("settings", JSON.stringify(settings));
}

// Generate a unique HSL color based on a string (category name)
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360; // Hue between 0-359
  return `hsl(${h}, 65%, 55%)`; // Nice mid-saturation colors
}

export function getCategoryData() {
  // Get products from both in-file and localStorage
  let storedProducts = JSON.parse(localStorage.getItem("products")) || [];
  let allProducts = [...products, ...storedProducts];

  // Count products per category
  const categoryCount = allProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  // Build chart data with dynamic colors
  const categoryData = Object.keys(categoryCount).map((key) => ({
    name: key,
    value: categoryCount[key],
    color: stringToColor(key),
  }));

  // Extract colors in same order
  const COLORS = categoryData.map((c) => c.color);

  return { categoryData, COLORS };
}
