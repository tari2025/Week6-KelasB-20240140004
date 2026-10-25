/**
 * FORM CAPTION - BIG SHOP
 */

// 1. Ambil semua elemen HTML yang dibutuhkan
const captionForm = document.getElementById("captionForm");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const templateSelect = document.getElementById("templateSelect");
const captionResult = document.getElementById("captionResult");
const formStatus = document.getElementById("formStatus");
const copyButton = document.getElementById("copyButton");

// 2. Fungsi untuk format Rupiah
function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

// 3. Fungsi menampilkan pesan status (sukses / error)
function showFormStatus(message, type) {
  if (formStatus) {
    formStatus.textContent = message;
    formStatus.className = type;
  }
}

// 4. Fungsi mengambil data dari URL (jika user klik dari halaman katalog)
function loadProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const product = params.get("product");
  const price = params.get("price");

  // Jika ada data 'product' di URL, isi otomatis ke input
  if (product !== null && productNameInput) {
    productNameInput.value = decodeURIComponent(product);
  }

  // Jika ada data 'price' di URL, isi otomatis ke input
  if (price !== null && price !== "" && Number(price) >= 0 && productPriceInput) {
    productPriceInput.value = price;
  }
}

// 5. Fungsi membuat teks caption berdasarkan template
function generateCaption(name, price, template) {
  const formattedPrice = formatRupiah(price);

  if (template === "promo") {
    return `🔥 PROMO SPESIAL HARI INI! 🔥

Siapa yang sudah menunggu ${name}? Sekarang hadir dengan harga menarik!

💰 Cuma ${formattedPrice} saja!
✅ Kualitas terbaik
✅ Produk pilihan
✅ Cocok untuk kebutuhanmu

Jangan sampai kehabisan!
Yuk, dapatkan ${name} sekarang juga!

#Promo #ProdukPilihan #BelanjaHemat`;
  }

  if (template === "formal") {
    return `Perkenalkan, ${name}.

Produk pilihan untuk memenuhi kebutuhan Anda dengan harga ${formattedPrice}.

Kami mengutamakan kualitas dan kenyamanan dalam setiap pilihan produk.

Terima kasih telah mempercayai kami.

#ProdukPilihan #KualitasTerbaik`;
  }

  // Default: Template Santai
  return `Hai, teman-teman! 👋

Kenalan yuk dengan ${name}! ✨

Harganya cuma ${formattedPrice}. Cocok untuk kamu yang sedang mencari produk menarik!

Yuk, dapatkan sekarang juga! 🛍️

#Belanja #ProdukFavorit #Rekomendasi`;
}

// 6. Event Listener saat form di-submit (Tombol "Buat Caption" ditekan)
if (captionForm) {
  captionForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Mencegah halaman reload

    const name = productNameInput.value.trim();
    const priceValue = productPriceInput.value;
    const price = Number(priceValue);
    const template = templateSelect.value;

    // Validasi: Cek apakah input kosong atau harga minus
    if (!name || priceValue.trim() === "" || !Number.isFinite(price) || price < 0) {
      captionResult.value = "";
      showFormStatus("Nama produk dan harga wajib diisi dengan benar.", "error");
      return;
    }

    // Generate caption dan tampilkan di textarea
    captionResult.value = generateCaption(name, price, template);
    showFormStatus("Caption berhasil dibuat!", "success");
  });
}

// 7. Event Listener saat tombol "Salin Caption" diklik
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const caption = captionResult.value.trim();

    if (!caption) {
      showFormStatus("Buat caption terlebih dahulu.", "error");
      return;
    }

    // Copy ke clipboard
    try {
      await navigator.clipboard.writeText(caption);
      showFormStatus("Caption berhasil disalin!", "success");
    } catch (error) {
      // Fallback jika browser memblokir API clipboard
      captionResult.focus();
      captionResult.select();
      const copied = document.execCommand("copy");

      if (copied) {
        showFormStatus("Caption berhasil disalin!", "success");
      } else {
        showFormStatus("Gagal menyalin. Silakan salin manual.", "error");
      }
    }
  });
}

// 8. Jalankan saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  loadProductFromURL();
});