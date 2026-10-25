/**
 * KATALOG PRODUK
 * Fetch API, async/await, JSON, DOM, forEach, event listener.
 */

// 1. URL API 
const API_URL = "https://dummyjson.com/products?limit=194";

// 2. Elemen DOM
const statusEl = document.getElementById("status");
const gridEl = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");

let allProducts = [];

// 3. Format harga Rupiah
function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

// 4. Mengamankan teks sebelum dimasukkan ke HTML
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// 5. Menampilkan status
function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
  statusEl.style.display = "block";
}

// 6. Mengisi pilihan kategori
function populateCategoryOptions(products) {
  const categories = [...new Set(products.map((product) => product.category))].sort();
  categorySelect.replaceChildren();

  const optionAll = document.createElement("option");
  optionAll.value = "";
  optionAll.textContent = "Semua kategori";
  categorySelect.appendChild(optionAll);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.replace(/-/g, " ");
    categorySelect.appendChild(option);
  });
}

// 7. Membuat kartu satu produk
function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const title = escapeHTML(product.title);
  const category = escapeHTML(product.category);
  const image = escapeHTML(product.thumbnail || product.images?.[0] || "");

  const rating = Number(product.rating || 0).toFixed(1);
  const stock = Number(product.stock || 0);
  
  // Konversi harga ke Rupiah
  const priceRupiah = Number(product.price) * 15000; 

  card.innerHTML = `
    <img class="product-image" src="${image}" alt="${title}" loading="lazy">
    <span class="category-badge">${category}</span>
    <h2 class="product-title">${title}</h2>
    <p class="product-price">${formatRupiah(priceRupiah)}</p>
    <div class="product-meta">
      <span class="rating">★ ${rating}</span>
      <span>Stok: ${stock}</span>
    </div>
    <a class="product-button" href="./form.html?product=${encodeURIComponent(product.title)}&price=${encodeURIComponent(priceRupiah)}">
      Buat Caption
    </a>
  `;

  const imageEl = card.querySelector(".product-image");
  imageEl.addEventListener("error", () => {
    imageEl.style.display = "none";
  }, { once: true });

  return card;
}

// 8. Filter dan tampilkan produk
function renderProducts(products) {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;

  const filteredProducts = products.filter((product) => {
    const matchesName = product.title.toLowerCase().includes(keyword);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesName && matchesCategory;
  });

  gridEl.replaceChildren();

  if (filteredProducts.length === 0) {
    showStatus("Tidak ada produk yang cocok.");
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = "Produk tidak ditemukan. Coba kata kunci lain.";
    gridEl.appendChild(emptyMessage);
    return;
  }

  filteredProducts.forEach((product) => {
    gridEl.appendChild(createProductCard(product));
  });

  showStatus(`${filteredProducts.length} produk ditemukan.`);
}

// 9. Fetch API
async function fetchProducts() {
  try {
    showStatus("Memuat produk...");
    gridEl.replaceChildren();

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Status ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data.products)) throw new Error("Format data tidak valid.");

    allProducts = data.products;
    populateCategoryOptions(allProducts);
    renderProducts(allProducts);

  } catch (error) {
    gridEl.replaceChildren();
    showStatus(`Gagal memuat data: ${error.message}. Periksa koneksi internet.`, true);
    console.error("Fetch error:", error);
  }
}

// 10. Event listener pencarian & filter
searchInput.addEventListener("input", () => renderProducts(allProducts));
categorySelect.addEventListener("change", () => renderProducts(allProducts));

// 11. Jalankan aplikasi
fetchProducts();