// 1. Ambil semua elemen HTML yang dibutuhkan
const captionForm = document.getElementById("captionForm");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const templateSelect = document.getElementById("templateSelect");
const captionResult = document.getElementById("captionResult");
const formStatus = document.getElementById("formStatus");
const copyButton = document.getElementById("copyButton");

// 2. Format harga Rupiah
function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

// 3. Tampilkan pesan status (sukses / error)
function showFormStatus(message, type) {
  if (formStatus) {
    formStatus.textContent = message;
    formStatus.className = type;
  }
}

// 4. Ambil data produk dari URL (jika dari halaman katalog)
function loadProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const product = params.get("product");
  const price = params.get("price");

  if (product !== null && productNameInput) {
    productNameInput.value = decodeURIComponent(product);
  }

  if (price !== null && price !== "" && Number(price) >= 0 && productPriceInput) {
    productPriceInput.value = price;
  }
}

// 5. Logika pembuatan caption
function generateCaption(name, price, template) {
  const formattedPrice = formatRupiah(price);

  if (template === "promo") {
    return `🔥 PROMO SPESIAL HARI INI! 🔥\n\nSiapa yang sudah menunggu ${name}? Sekarang hadir dengan harga menarik!\n\n💰 Cuma ${formattedPrice} saja!\n✅ Kualitas terbaik\n✅ Produk pilihan\n\nJangan sampai kehabisan!\nYuk, dapatkan ${name} sekarang juga!\n\n#Promo #ProdukPilihan #BelanjaHemat`;
  }

  if (template === "formal") {
    return `Perkenalkan, ${name}.\n\nProduk pilihan untuk memenuhi kebutuhan Anda dengan harga ${formattedPrice}.\n\nKami mengutamakan kualitas dan kenyamanan.\n\nTerima kasih telah mempercayai kami.\n\n#ProdukPilihan #KualitasTerbaik`;
  }

  return `Hai, teman-teman! 👋\n\nKenalan yuk dengan ${name}! ✨\n\nHarganya cuma ${formattedPrice}. Cocok untuk kamu!\n\nYuk, dapatkan sekarang juga! 🛍️\n\n#Belanja #ProdukFavorit #Rekomendasi`;
}

// 6. Event saat tombol "Buat Caption" ditekan
if (captionForm) {
  captionForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Mencegah halaman reload

    const name = productNameInput.value.trim();
    const priceValue = productPriceInput.value;
    const price = Number(priceValue);
    const template = templateSelect.value;

    // Validasi sederhana
    if (!name || priceValue.trim() === "" || !Number.isFinite(price) || price < 0) {
      captionResult.value = "";
      showFormStatus("Nama produk dan harga wajib diisi dengan benar.", "error");
      return;
    }

    // Tampilkan hasil caption
    captionResult.value = generateCaption(name, price, template);
    showFormStatus("Caption berhasil dibuat!", "success");
  });
}

// 7. Event saat tombol "Salin Caption" ditekan
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const caption = captionResult.value.trim();

    if (!caption) {
      showFormStatus("Buat caption terlebih dahulu.", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(caption);
      showFormStatus("Caption berhasil disalin!", "success");
    } catch (error) {
      captionResult.focus();
      captionResult.select();
      document.execCommand("copy");
      showFormStatus("Caption berhasil disalin!", "success");
    }
  });
}

// 8. Jalankan saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  loadProductFromURL();
});