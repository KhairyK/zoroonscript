// MIT LICENSE
(() => {
  "use strict";

  function transpileZS(code) {
    let js = String(code);

    /* ────── NORMALIZE LINE ENDINGS ────── */
    js = js.replace(/\r/g, '');

    /* ────── FUNCTION SUPPORT ────── */
    js = js.replace(/@function\s+(\w+)\s*\(([^)]*)\)\s*{\s*([^}]*)\s*}/g, 'function $1($2) { $3 }');
    js = js.replace(/@function\s+(\w+)\s*{\s*([^}]*)\s*}/g, 'function $1() { $2 }');

    /* ────── CALL (support dot-notation like obj.fn) ────── */
    js = js.replace(/@call\s+([^\s(]+)\s*\(([^)]*)\)/g, '$1($2)');
    js = js.replace(/@call\s+([^\s(]+)/g, '$1()');

    /* ────── VARIABLE ────── */
    js = js.replace(/@set\s+(\w+)\s*=\s*(.+)/g, 'const $1 = $2');
    js = js.replace(/@var\s+(\w+)\s*=\s*(.+)/g, 'let $1 = $2');

    /* ────── DOM ────── */
    js = js.replace(/@element\s+([#.\w-]+)\s*{\s*text\s+"([^"]+)"\s*}/g, 'document.querySelector("$1").textContent = "$2"');
    js = js.replace(/@element\s+([#.\w-]+)\s*{\s*html\s+"([^"]+)"\s*}/g, 'document.querySelector("$1").innerHTML = "$2"');
    js = js.replace(/@id\s+#([\w-]+)/g, 'document.getElementById("$1")');
    js = js.replace(/@select\s+([#.][\w-]+)/g, 'document.querySelector("$1")');
    js = js.replace(/@all\s+([#.][\w-]+)/g, 'document.querySelectorAll("$1")');
    js = js.replace(/append\s+"([^"]+)"/g, 'insertAdjacentHTML("beforeend", "$1")');

    /* ────── EVENTS ────── */
    js = js.replace(/@on\s+(\w+)\s+([#.\w-]+)\s*{\s*log\s+"([^"]+)"\s*}/g, 'document.querySelector("$2").addEventListener("$1", () => console.log("$3"))');
    js = js.replace(/@on\s+(\w+)\s+([#.\w-]+)\s*{\s*([^}]*)\s*}/g, 'document.querySelector("$2").addEventListener("$1", () => { $3 })');

    /* ────── LOG / WARN / INFO / ERROR ————— */
    js = js.replace(/@log\s+"([^"]+)"/g, 'console.log("$1")');
    js = js.replace(/@warn\s+"([^"]+)"/g, 'console.warn("$1")');
    js = js.replace(/@info\s+"([^"]+)"/g, 'console.info("$1")');
    js = js.replace(/@error\s+"([^"]+)"/g, 'console.error("$1")');

    js = js.replace(/@log\s*\(\s*([^)]+)\s*\)/g, 'console.log($1)');
    js = js.replace(/@warn\s*\(\s*([^)]+)\s*\)/g, 'console.warn($1)');
    js = js.replace(/@info\s*\(\s*([^)]+)\s*\)/g, 'console.info($1)');
    js = js.replace(/@error\s*\(\s*([^)]+)\s*\)/g, 'console.error($1)');

    /* ────── INLINE text/html ────── */
    js = js.replace(/text\s+"([^"]+)"/g, '"$1"');
    js = js.replace(/html\s+"([^"]+)"/g, '"$1"');

    /* ────── EXPORT / IMPORT ────── */
    js = js.replace(/@import\s+"([^"]+)"\s*->\s*(\w+)/g, 'const $2 = await __ZS_IMPORT__("$1", "$2");');
    js = js.replace(/@export\s+(\w+)/g, 'exports["$1"] = $1');
    
    /* ————— MAIN ———— */
    js = js.replace(/@if\s*\((.+?)\)\s*{/g, 'if ($1) {');
    js = js.replace(/@else\s*{/g, 'else {');
    js = js.replace(/@for\s+(\w+)\s+in\s+(\w+)\s*{/g, 'for (const $1 of $2) {');
    js = js.replace(/@while\s*\((.+?)\)\s*{/g, 'while ($1) {');
    js = js.replace(/@on\s+(\w+)\s+([#.\w-]+)\s*{/g,
    'document.querySelector("$2").addEventListener("$1", () => {');
    
    /* ────── CLEANUP ────── */
    js = js.replace(/\n\s*\n/g, '\n');

    return js;
  }

  const __ZS_MODULES__ = {};
  const __ZS_EXPORTS__ = [];

  async function runZS(code) {
    try {
      __ZS_EXPORTS__.length = 0;
      const js = transpileZS(code);
      const AsyncFn = Object.getPrototypeOf(async function () { }).constructor;
      let fn;
      try {
        fn = new AsyncFn(
          "exports",
          "imported",
          "__ZS_IMPORT__",
          "__ZS_MODULES__",
          "__ZS_EXPORTS__",
          js
        );
      } catch (e) {
        console.error("[ZoroonScript] Failed to construct AsyncFunction. See transpiled JS above.");
        throw e;
      }

      const exports = {};
      await fn(exports, __ZS_MODULES__, __ZS_IMPORT__, __ZS_MODULES__, __ZS_EXPORTS__);
      return exports;
    } catch (err) {
      console.error("[ZoroonScript Runtime Error]:", err);
      throw err;
    }
  }

  async function __ZS_IMPORT__(path, ns) {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to fetch module '${path}' (status: ${res.status})`);
    }
    const text = await res.text();
    const exports = await runZS(text);
    __ZS_MODULES__[ns] = exports;
    window.ZS = window.ZS || {};
    window.ZS[ns] = exports;
    return exports;
  }

  Object.defineProperty(window, "runZS", {
    value: runZS,
    writable: false,
    configurable: false
  });

  /* ────── AUTO-EXECUTE ZS SCRIPT TAGS ────── */
  document.querySelectorAll('script[type="application/x-opendnf-zs"]').forEach(async s => {
    try {
      if (s.src) {
        const res = await fetch(s.src);
        const text = await res.text();
        await runZS(text);
      } else {
        await runZS(s.textContent);
      }
    } catch (err) {
      console.error("[ZoroonScript] Error executing ZS script tag:", err);
    }
  });

})();
