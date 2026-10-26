/**
 * @file form.js — halaman Caption.
 * Validasi nama dan harga, lalu membuat caption dari template.
 */

const templates = {
  promo: (nama, harga, tag) => `🔥🔥 PROMO SPESIAL HARI INI! 🔥🔥

Siapa yang udah nungguin ${nama}? Akhirnya hadir dengan harga yang bikin kaget! 😱

💰 Cuma ${harga} aja!
✅ Kualitas terjamin
✅ Stok terbatas, siapa cepat dia dapat
✅ Pengiriman cepat ke seluruh Indonesia

Jangan sampai nyesel karena kehabisan ya! ⏰
Langsung checkout sekarang sebelum harga balik normal 🛒💨

#Promo #${tag} #DiskonHariIni #BelanjaHemat`,

  santai: (nama, harga, tag) => `Hai bestie! 👋✨

Lagi cari ${nama}? Pas banget, kamu nyasar ke tempat yang tepat 😎

Gak perlu nguras dompet, cukup ${harga} aja udah bisa kamu bawa pulang. Worth it parah sih ini, beneran deh! 🤌

Cocok buat dipakai sendiri, atau dijadiin kado buat orang tersayang 🎁💕

Yuk mampir, chat aja kalau ada yang mau ditanyain~ 💬

#${tag} #RekomendasiProduk #RacunBelanja #WorthIt`,

  formal: (nama, harga, tag) => `Dengan bangga kami persembahkan:
✦ ${nama} ✦

Produk ini dipilih secara cermat untuk memberikan kualitas terbaik dan pengalaman yang memuaskan bagi Anda.

Harga: ${harga}

Keunggulan:
• Kualitas terjamin dan telah melalui kontrol mutu
• Layanan pelanggan yang responsif
• Pengiriman aman dan tepat waktu

Untuk pemesanan dan informasi lebih lanjut, silakan hubungi kami melalui pesan langsung. Terima kasih atas kepercayaan Anda.

#${tag} #ProdukBerkualitas #BelanjaAman`,
};

const form = document.getElementById("form");
const captionOutput = document.getElementById("caption");
const statusOutput = document.getElementById("formStatus");
const copyButton = document.getElementById("copyButton");

const rules = {
  nama: (v) => {
    v = v.trim();

    if (!v) return "Nama produk wajib diisi.";
    if (v.length < 3)
      return `Nama produk minimal 3 karakter (sekarang ${v.length}).`;
    if (v.length > 60)
      return `Nama produk maksimal 60 karakter (sekarang ${v.length}).`;
    if (!/\p{L}/u.test(v))
      return "Nama produk harus mengandung huruf.";

    return "";
  },

  harga: (v) => {
    if (!v.trim()) return "Harga wajib diisi.";

    const n = Number(v);

    if (!Number.isInteger(n))
      return "Harga harus angka bulat, tanpa koma.";
    if (n < 1000) return "Harga minimal Rp 1.000.";
    if (n > 100000000)
      return "Harga maksimal Rp 100.000.000.";

    return "";
  },
};

function showStatus(message, type) {
  statusOutput.textContent = message;
  statusOutput.className = type;
}

function validate(id) {
  const input = document.getElementById(id);
  const errorElement = document.getElementById(`${id}-error`);

  if (!input || !errorElement) return false;

  const message = rules[id](input.value);

  errorElement.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");

  return !message;
}

function createTag(nama) {
  return nama
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function loadProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const nama = params.get("product");
  const harga = params.get("price");

  if (nama !== null) {
    document.getElementById("nama").value = nama;
  }

  if (
    harga !== null &&
    harga.trim() !== "" &&
    Number.isInteger(Number(harga))
  ) {
    document.getElementById("harga").value = harga;
  }
}

// Validasi langsung ketika pengguna mengetik.
Object.keys(rules).forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    validate(id);
    showStatus("", "");
  });
});

// Membuat caption.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const invalid = Object.keys(rules).filter((id) => !validate(id));

  if (invalid.length > 0) {
    captionOutput.value = "";
    showStatus("Periksa kembali nama dan harga produk.", "error");
    document.getElementById(invalid[0]).focus();
    return;
  }

  const nama = document.getElementById("nama").value.trim();
  const harga = Number(
    document.getElementById("harga").value
  ).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const template = document.getElementById("template").value;
  const tag = createTag(nama);

  if (!templates[template]) {
    showStatus("Template tidak valid.", "error");
    return;
  }

  captionOutput.value = templates[template](nama, harga, tag);
  showStatus("Caption berhasil dibuat!", "success");
});

// Menyalin caption.
copyButton.addEventListener("click", async () => {
  const caption = captionOutput.value.trim();

  if (!caption) {
    showStatus("Buat caption terlebih dahulu.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(caption);
    showStatus("Caption berhasil disalin!", "success");
  } catch {
    captionOutput.focus();
    captionOutput.select();

    try {
      const copied = document.execCommand("copy");

      if (copied) {
        showStatus("Caption berhasil disalin!", "success");
      } else {
        showStatus("Gagal menyalin. Salin caption secara manual.", "error");
      }
    } catch {
      showStatus("Gagal menyalin. Salin caption secara manual.", "error");
    }
  }
});

// Mengisi otomatis data dari katalog.
loadProductFromURL();
