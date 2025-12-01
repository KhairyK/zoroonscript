# ZoroonScript (ZS)

ZoroonScript adalah bahasa scripting ringan berbasis JavaScript yang menyediakan sintaks ringkas untuk DOM, event, impor/ekspor modul, dan operasi dasar pemrograman. ZS dapat berjalan langsung di browser menggunakan `<script type="application/x-opendnf-zs">`.

---

## ✨ Fitur Utama
| Fitur | Contoh | Hasil |
|-------|--------|--------|
| Fungsi | `@function test { ... }` | `function test() { ... }` |
| Variabel | `@set a = 10` | `const a = 10` |
| Variabel (mutable) | `@var a = 10` | `let a = 10` |
| DOM Text | `@element #title { text "Hello" }` | `document.querySelector("#title").textContent = "Hello"` |
| DOM HTML | `@element #box { html "<b>Hi</b>" }` | `document.querySelector("#box").innerHTML = "<b>Hi</b>"` |
| Events | `@on click #btn { log "Clicked!" }` | `document.querySelector("#btn").addEventListener("click", () => { console.log("Clicked!") })` |
| Logging | `@log("x")` | `console.log(x)` |
| Logging string | `@log "Hello"` | `console.log("Hello")` |
| Import | `@import "mod.zs" -> app` | `const app = await __ZS_IMPORT__("mod.zs", "app");` |
| Export | `@export myFn` | `exports["myFn"] = myFn` |
| LocalStorage Save | `@save token = "abc123"` | `localStorage.setItem("token", "abc123")` |
| LocalStorage Load | `@load token` | `localStorage.getItem("token")` |
| Timer Interval | `@interval 1000 { log "tick" }` | `setInterval(() => { console.log("tick") }, 1000)` |
| Timer Timeout | `@timeout 2000 { log "done" }` | `setTimeout(() => { console.log("done") }, 2000)` |
| Class Toggle | `@toggle #btn "active"` | `document.querySelector("#btn").classList.toggle("active")` |
| Class Add | `@addClass #box "shown"` | `document.querySelector("#box").classList.add("shown")` |
| Class Remove | `@removeClass #box "hide"` | `document.querySelector("#box").classList.remove("hide")` |
| Repeat | `@repeat 5 { log "Hello" }` | `for (let i = 0; i < 5; i++) { console.log("Hello") }` |






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
