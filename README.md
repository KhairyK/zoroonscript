# ZoroonScript (ZS)

ZoroonScript adalah bahasa scripting ringan berbasis JavaScript yang menyediakan sintaks ringkas untuk DOM, event, impor/ekspor modul, dan operasi dasar pemrograman. ZS dapat berjalan langsung di browser menggunakan `<script type="application/x-opendnf-zs">`.

---

## ✨ Fitur Utama
| Fitur | Contoh | Hasil |
|-------|--------|--------|
| Fungsi | `@function test { ... }` | `function test() { ... }` |
| Variabel | `@set a = 10` | `const a = 10` |
| DOM Text | `@element #title { text "Hello" }` | `document.querySelector("#title").textContent = "Hello"` |
| Events | `@on click #btn { log "Clicked!" }` | `document.querySelector("#btn").addEventListener("click", () => console.log("Clicked!"))` |
| Logging | `@log("x")` | `console.log(x)` |
| Import | `@import "mod.zs" -> app` | fetch + run modul |

---

## 🚀 Cara Pakai di HTML

```html
<script src="https://cdn.kyrt.my.id/libs/js/zs/1.0.0/zs.min.js"></script>

<script type="application/x-opendnf-zs">
@set name = "Zoroon"
@on click #btn {
  log "Button clicked!"
  @element #title { text "Hello " + name }
}
</script>
```

---

📦 Import Modul ZS

File utils.zs:
```ZS
@export hello
@function hello { @log("Hello from module!") }
```
File utama:
```ZS
@import "utils.zs" -> utils
@call utils.hello
```

---

🧪 API JavaScript
```JS
runZS('@log("Hello World"');
```
---

🔗 License

MIT License © 2025 Zoroon / OpenDN Foundation
