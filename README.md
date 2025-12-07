# ZoroonScript (ZS) — README.md

> ZoroonScript — bahasa scripting mini, newbie-friendly, dibuat untuk menulis UI/behavior kecil dengan sintaks ringkas (mis. @toast, @fetch, @save, @on.online) lalu ditranspile ke JavaScript.
Ringkas, readable, dan gampang dipakai di halaman web.

---

## 🔥 Fitur Utama

- Directive-friendly syntax: @toast, @fetch, @cookie, @save/@load, @repeat, @function, @if/@else, @on.online/@on.offline, @timeout/@interval, @debounce, dll.

- Auto-transpile ke JavaScript (dengan safety checks).

- Built-in runtime helpers (mis. ZS_TOAST, getCookie) agar script ZS bisa berjalan langsung di browser.

- Auto-execute script tags: `<script type="application/x-opendnf-zs">...</script>``.

---

## 📦 Instalasi / Cara pakai cepat

1) Copy zs.runtime.js ke proyekmu

> Letakkan file runtime/transpiler (contoh: zs.runtime.js) di server atau CDN. File ini memuat transpiler + loader yang mencari tag `<script type="application/x-opendnf-zs">`` dan mengeksekusi ZS.

2) Pakai di HTML

```HTMl
<!-- pastikan runtime dimuat dulu -->
<script src="/path/to/zs.runtime.js"></script>
<script type="application/x-opendnf-zs">
@toast.success "Hello dari ZS!"
@on.online { @toast.success "You are online!" }
@on.offline { @toast.error "No internet :(" }
</script>
```

> ⚠ PENTING — BUNGKUS
Jika kamu men-transpile ZS → JS lokal dan ingin menjalankan JS yang berisi await, pastikan hasil transpile dibungkus dalam async IIFE:
```JS
(async () => {
  // hasil transpile (mengandung await)
  const data = await (await fetch("https://...")).json();
  console.log(data);
})();
```

> Jika tidak membungkus, await menyebabkan SyntaxError: await is only valid in async functions atau Failed to construct AsyncFunction saat runtime mencoba membuat fungsi dinamis.
(Ya, ini yang sering bikin ReferenceError atau error tanpa pesan — jadi selalu bungkus/gunakan loader yang sudah tersedia.)


---

## ✨ Contoh sintaks ZS → hasil JS

### Toast

- ZS:

```ZS
@toast.success "Login berhasil!"
```

- Transpile → JS:
```JS
ZS_TOAST("Login berhasil!", "success");
// Note: ZS_TOAST Adalah Toaster Buatan Kami, Jadi Bukan Bawaan Browser
```
### Fetch + showToPage (contoh produk)

- ZS:

```ZS
@fecth.show(data) "https://fakestoreapi.com/products".showToPage()
```

- Transpile → JS (sederhana):
```JS
const data = await (await fetch("https://fakestoreapi.com/products")).json();
data.forEach(item => {
  document.body.innerHTML += `
    <div class="product">
      <h3>${item.title || item.name}</h3>
      <p>${item.description || ""}</p>
      <strong>$${item.price || "??"}</strong>
    </div>`;
});
```

### Cookie

- ZS:

```ZS
@cookie.set = "token=abc123; path=/"
@cookie.get token
@cookie.delete token | Thu, 01 Jan 1970 00:00:00 GMT | /
```
- Transpile → JS:
```JS
document.cookie = "token=abc123; path=/";
getCookie("token"); // or ZS.cookie.get if runtime uses namespace
document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
```
### Session Storage (direct API)

- ZS:
  
```ZS
@sessionData.setData username = khairy
@sessionData.getData username
```
- Transpile → JS:
```JS
sessionStorage.setItem("username", "khairy");
sessionStorage.getItem("username");
```
### Interval & Timeout

- ZS:
  
```ZS
@interval 1000 {
  @toast "tick"
}
@timeout 5000 {
  @toast "done"
}
```
- Transpile → JS:

```JS
setInterval(() => { ZS_TOAST("tick", "default") }, 1000);
setTimeout(() => { ZS_TOAST("done", "default") }, 5000);
```
### Debounce helper

- ZS:

```ZS
deb = @debounce 300 (search)
input.addEventListener("input", deb)
```
- Transpile → JS:

```JS
deb = debounce(search, 300);
input.addEventListener("input", deb);
```

---

## 🛡️ Safety / Linter rules (transpiler akan periksa ini)

- Transpiler ZS melakukan beberapa pengecekan untuk menjaga gaya ZS:

- Larang penggunaan function plain — pakai @function (rule ini membantu konsistensi).

- Larang console.log langsung — pakai @log(...).

- Larang localstorage.setItem langsung — pakai @save / @load.

- Larang window.location.href langsung — pakai @relocationTo / @replacePageTo.

- Jika rule ditemukan, transpiler akan melempar error yang mengandung snippet preview (pintar menampilkan potongan baris yang bermasalah).


---

## 📐 Loader behavior (apa yang dilakukan runtime)

- Mengumpulkan @import "path" -> NS dan me-hoist/await import di preamble.

- Menyuntikkan helper runtime sekali (mis. ZS_TOAST) jika belum ada.

- Men-scan dan men-replace directive ZS ke JS via banyak regex.replace(...) rules.

- Membungkus hasil menjadi async function agar await diperbolehkan.

- Mengeksekusi hasil via AsyncFunction (runtime dinamis).


> Catatan: jika error Failed to construct AsyncFunction. See transpiled JS below: muncul, artinya hasil transpile mengandung syntax tidak valid — periksa hasil transpile yang dilog oleh runtime (dan pastikan kode sudah bungkus bila perlu).


---

## ⚙️ Cara Pengembangan / Contribution

1. Fork repo ini.

2. Buat branch fitur: feature/some-directive.

3. Tambahkan rule replace (regex) dan tests.

4. Buka PR: sertakan contoh input ZS → expected JS.

---

🔎 Troubleshooting cepat

- Error: Failed to construct AsyncFunction
-> Lihat console output: runtime akan log See transpiled JS below: lalu menampilkan JS hasil transpile. Periksa:
- apakah ada @log()/@toast yang belum direplace?
- apakah ada await di luar async (bungkus hasil atau pakai loader)?
- apakah ada kurung kurawal { yang tidak seimbang pada block @if { } @else { }?

- ReferenceError: getCookie / ZS_TOAST is not defined
-> Pastikan runtime helper (ZS_TOAST, getCookie) sudah disuntikkan sebelum kode hasil transpile berjalan. Loader sudah menambahkan helper jika belum ada — tapi jika kamu mengeksekusi JS hasil transpile sendiri, sisipkan helper atau gunakan window.ZS namespace.

- Directive tidak diganti
-> Pastikan urutan js.replace(...) di transpiler benar. Contoh: process .then(@log()) sebelum mengganti .json().



---

## 🧾 License

- MIT — lihat file LICENSE.

---

## 📬 Kontak / Support

- Kalau mau fitur baru, bug report, atau minta bantu bikin directive custom (mis. @fetch.retry, @render(template)), buka issue atau PR di repo GitHub.

<footer align="center">
 2025 © OpenDN Foundation (Open Delivery Network Foundation)
 RELEASE UNDER MIT LICENSE
</footer>
