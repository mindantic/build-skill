#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const urls = args.filter((arg, index) => !arg.startsWith("--") && !args[index - 1]?.startsWith("--"));
if (!urls.length) {
  console.error(
    "Usage: node measure.mjs <url> [url...] [--config docs/measure.json] [--out docs/evidence/task-NNN] [--widths 375,768,1024,1440] [--themes light,dark]",
  );
  process.exit(2);
}

const configPath = resolve(flag("config", "docs/measure.json"));
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, "utf8")) : {};
const widths = flag("widths", (config.widths ?? [375, 768, 1024, 1440]).join(",")).split(",").map(Number);
const themes = flag("themes", (config.themes ?? ["light", "dark"]).join(",")).split(",");
const out = flag("out", null);
const lineLimits = config.lines ?? {};
const ignoreConsole = (config.ignoreConsole ?? []).map((pattern) => new RegExp(pattern));
const idleMs = config.idleMs ?? 9000;
const tabStops = config.tabStops ?? 80;
const minTarget = config.minTarget ?? 44;

const require = createRequire(join(process.cwd(), "package.json"));
let playwright;
for (const name of ["playwright", "@playwright/test"]) {
  try {
    playwright = require(name);
    break;
  } catch {}
}
if (!playwright) {
  console.error("Playwright not found in this project. Install playwright or @playwright/test.");
  process.exit(2);
}

const failures = [];
const fail = (where, check, detail) => failures.push({ where, check, detail });

async function inspect(page, width) {
  return page.evaluate(
    ({ lineLimits, minTarget, width }) => {
      const visible = (node) => {
        if (node.closest("[inert],[aria-hidden='true']")) return false;
        const style = getComputedStyle(node);
        if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) return false;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      };
      const label = (node) =>
        `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""} "${(node.getAttribute("aria-label") || node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40)}"`;
      const result = {};

      result.scrollWidth = document.documentElement.scrollWidth;
      result.wide = [...document.querySelectorAll("body *")]
        .filter((node) => visible(node) && node.getBoundingClientRect().right > window.innerWidth + 1)
        .filter((node) => !node.parentElement || node.parentElement.getBoundingClientRect().right <= window.innerWidth + 1)
        .filter((node) => {
          for (let up = node.parentElement; up; up = up.parentElement) {
            const style = getComputedStyle(up);
            if (/(hidden|clip|auto|scroll)/.test(style.overflowX)) return false;
          }
          return true;
        })
        .slice(0, 10)
        .map(label);

      result.lines = Object.entries(lineLimits).flatMap(([selector, limit]) => {
        const max =
          typeof limit === "number"
            ? limit
            : (Object.entries(limit)
                .filter(([key]) => key !== "default" && width <= Number(key))
                .sort((a, b) => Number(a[0]) - Number(b[0]))[0]?.[1] ?? limit.default ?? Number.POSITIVE_INFINITY);
        return [...document.querySelectorAll(selector)].filter(visible).map((node) => {
          const style = getComputedStyle(node);
          const lineHeight = style.lineHeight === "normal" ? parseFloat(style.fontSize) * 1.2 : parseFloat(style.lineHeight);
          const box = node.getBoundingClientRect();
          const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
          return { selector, max, text: node.textContent.trim().replace(/\s+/g, " ").slice(0, 50), lines: Math.round((box.height - padding) / lineHeight) };
        });
      });

      result.smallTargets =
        width > 480
          ? []
          : [...document.querySelectorAll("a[href], button, [role='button'], [role='tab'], input, select, textarea, summary")]
              .filter(visible)
              .filter((node) => {
                const rect = node.getBoundingClientRect();
                const inline = getComputedStyle(node).display === "inline" && node.closest("p, li, dd, td");
                return !inline && (rect.height < minTarget - 0.5 || rect.width < minTarget - 0.5);
              })
              .slice(0, 20)
              .map((node) => `${label(node)} ${Math.round(node.getBoundingClientRect().width)}x${Math.round(node.getBoundingClientRect().height)}`);

      result.clipped = [...document.querySelectorAll("body *")]
        .filter(visible)
        .filter((node) => {
          const style = getComputedStyle(node);
          const box = node.getBoundingClientRect();
          if (box.width <= 2 || box.height <= 2 || style.clip !== "auto" || style.clipPath !== "none") return false;
          if (style.textOverflow === "ellipsis" || style.webkitLineClamp !== "none") return false;
          if (!/(hidden|clip)/.test(style.overflowX + style.overflowY)) return false;
          const text = [...node.childNodes].some((child) => child.nodeType === 3 && child.textContent.trim());
          return text && (node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1);
        })
        .slice(0, 10)
        .map(label);

      result.noAlt = [...document.querySelectorAll("img:not([alt])")].filter(visible).slice(0, 10).map((node) => node.src.split("/").pop());
      result.noName = [...document.querySelectorAll("button, a[href], [role='button']")]
        .filter(visible)
        .filter((node) => !(node.getAttribute("aria-label") || node.getAttribute("aria-labelledby") || node.textContent.trim() || node.querySelector("img[alt]:not([alt=''])") || node.title))
        .slice(0, 10)
        .map(label);

      const parse = (value) => {
        const match = value.match(/rgba?\(([^)]+)\)/);
        if (!match) return null;
        const [r, g, b, a = 1] = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
        return { r, g, b, a };
      };
      const luminance = ({ r, g, b }) => {
        const channel = (value) => {
          const v = value / 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      };
      const background = (node) => {
        for (let up = node; up; up = up.parentElement) {
          const style = getComputedStyle(up);
          if (style.backgroundImage !== "none") return null;
          const color = parse(style.backgroundColor);
          if (color && color.a >= 0.95) return color;
          if (color && color.a > 0.05) return null;
        }
        return parse(getComputedStyle(document.body).backgroundColor);
      };
      result.contrast = [...document.querySelectorAll("body *")]
        .filter(visible)
        .filter((node) => [...node.childNodes].some((child) => child.nodeType === 3 && child.textContent.trim().length > 1))
        .map((node) => {
          const style = getComputedStyle(node);
          const box = node.getBoundingClientRect();
          if (box.width <= 2 || box.height <= 2) return null;
          let scope = node;
          for (let level = 0; level < 6 && scope.parentElement; level++) scope = scope.parentElement;
          const overMedia = [...scope.querySelectorAll("img, canvas, video")].some((media) => {
            if (node.contains(media)) return false;
            const m = media.getBoundingClientRect();
            return m.left < box.right && m.right > box.left && m.top < box.bottom && m.bottom > box.top;
          });
          if (overMedia) return null;
          const fg = parse(style.color);
          const bg = background(node);
          if (!fg || !bg || fg.a < 0.95 || Number(style.opacity) < 0.95) return null;
          const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
          const ratio = (hi + 0.05) / (lo + 0.05);
          const size = parseFloat(style.fontSize);
          const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
          return ratio < (large ? 3 : 4.5) ? `${label(node)} ${ratio.toFixed(2)}:1` : null;
        })
        .filter(Boolean)
        .slice(0, 15);

      return result;
    },
    { lineLimits, minTarget, width },
  );
}

const browser = await playwright.chromium.launch();
const report = [];
for (const url of urls) {
  for (const theme of themes) {
    for (const width of widths) {
      const where = `${url} ${width} ${theme}`;
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, ignoreHTTPSErrors: true });
      const page = await context.newPage();
      const errors = [];
      page.on("console", (message) => {
        if (message.type() === "error" && !ignoreConsole.some((pattern) => pattern.test(message.text()))) errors.push(message.text().slice(0, 200));
      });
      page.on("pageerror", (error) => errors.push(`pageerror ${error.message.slice(0, 200)}`));
      await page.addInitScript(() => {
        window.__cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
        }).observe({ type: "layout-shift", buffered: false });
      });
      await page.goto(url, { waitUntil: "load", timeout: 120000 });
      await page.waitForTimeout(1500);

      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 600) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(250);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        window.__cls = 0;
      });
      await page.waitForTimeout(idleMs);
      const idleShift = await page.evaluate(() => window.__cls);

      const found = await inspect(page, width);
      if (found.scrollWidth > width) fail(where, "horizontal scroll", `scrollWidth ${found.scrollWidth}; widest: ${found.wide.join(", ") || "unknown"}`);
      for (const item of found.lines) if (item.lines > item.max) fail(where, "line limit", `"${item.text}" (${item.selector}) is ${item.lines} lines, max ${item.max}`);
      if (found.smallTargets.length) fail(where, `targets under ${minTarget}px`, found.smallTargets.join("; "));
      if (found.clipped.length) fail(where, "clipped text", found.clipped.join("; "));
      if (found.noAlt.length) fail(where, "img without alt", found.noAlt.join(", "));
      if (found.noName.length) fail(where, "control without name", found.noName.join("; "));
      if (found.contrast.length) fail(where, "contrast below AA", found.contrast.join("; "));
      if (idleShift > 0.01) fail(where, "layout shift while idle", `CLS ${idleShift.toFixed(3)} over ${idleMs}ms with no input (autoplay or late content changing height)`);

      if (width === widths[0] || width === widths[widths.length - 1]) {
        const noRing = [];
        await page.evaluate(() => document.activeElement?.blur());
        for (let stop = 0; stop < tabStops; stop++) {
          await page.keyboard.press("Tab");
          const state = await page.evaluate(() => {
            const node = document.activeElement;
            if (!node || node === document.body || /^(NEXTJS-PORTAL|VITE-ERROR-OVERLAY)$/.test(node.tagName)) return null;
            const style = getComputedStyle(node);
            const ring = (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== "none";
            return { ring, name: `${node.tagName.toLowerCase()} "${(node.getAttribute("aria-label") || node.textContent || "").trim().slice(0, 30)}"` };
          });
          if (state && !state.ring) noRing.push(state.name);
        }
        if (noRing.length) fail(where, "focus without visible ring", [...new Set(noRing)].slice(0, 10).join("; "));
      }

      if (out) {
        mkdirSync(out, { recursive: true });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page
          .screenshot({ path: join(out, `measure-${new URL(url).pathname.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home"}-${width}-${theme}.png`), fullPage: true, timeout: 60000 })
          .catch((error) => console.error(`screenshot skipped for ${where}: ${error.message.split("\n")[0]}`));
      }
      if (errors.length) fail(where, "console errors", [...new Set(errors)].join(" | "));
      report.push({ where, idleShift, ...found });
      await context.close();
    }
  }

  const reduced = await browser.newContext({ viewport: { width: widths[widths.length - 1], height: 900 }, reducedMotion: "reduce", ignoreHTTPSErrors: true });
  const page = await reduced.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 200)));
  page.on("console", (message) => {
    if (message.type() === "error" && !ignoreConsole.some((pattern) => pattern.test(message.text()))) errors.push(message.text().slice(0, 200));
  });
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(1500);
  const animating = await page.evaluate(() =>
    document.getAnimations().filter((animation) => animation.playState === "running" && animation.effect?.getTiming().iterations === Number.POSITIVE_INFINITY).length,
  );
  if (errors.length) fail(`${url} reduced motion`, "console errors", [...new Set(errors)].join(" | "));
  if (animating) fail(`${url} reduced motion`, "infinite animation running", `${animating} looping animations under prefers-reduced-motion`);
  await reduced.close();
}
await browser.close();

if (out) writeFileSync(join(out, "measure.json"), JSON.stringify({ failures, report }, null, 2));
if (!failures.length) {
  console.log(`measure: pass (${urls.length} url, ${widths.length} widths, ${themes.length} themes)`);
} else {
  console.log(`measure: ${failures.length} failures`);
  for (const item of failures) console.log(`- [${item.check}] ${item.where}: ${item.detail}`);
}
process.exit(failures.length ? 1 : 0);
