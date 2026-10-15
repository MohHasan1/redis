const fs = require('node:fs');
const path = require('node:path');

const assetsDirectory = path.join(
  __dirname,
  '..',
  'node_modules',
  'rbook',
  'dist',
  'client',
  '_app',
  'assets'
);

const markerStart = '/* rbook-dark-theme:start */';
const markerEnd = '/* rbook-dark-theme:end */';

const darkTheme = `
${markerStart}
:root {
  color-scheme: dark;
}

html,
body,
#svelte {
  min-height: 100%;
  background: #0b1120 !important;
  color: #e5e7eb !important;
}

.bg-slate-100,
.bg-gray-50 {
  background-color: #111827 !important;
}

.bg-slate-200,
.bg-gray-100,
.bg-white {
  background-color: #1f2937 !important;
}

.bg-slate-300,
.bg-gray-200,
.bg-gray-400 {
  background-color: #374151 !important;
}

.text-gray-900,
.text-gray-800,
.text-gray-700 {
  color: #e5e7eb !important;
}

.text-gray-400 {
  color: #9ca3af !important;
}

.text-indigo-600,
.text-indigo-400 {
  color: #a5b4fc !important;
}

.hover\\:text-indigo-900:hover {
  color: #c7d2fe !important;
}

.border-gray-200,
.border-gray-300,
.border-gray-400,
.border-gray-500,
.border-slate-700 {
  border-color: #4b5563 !important;
}

.border-gray-900 {
  border-color: #9ca3af !important;
}

.hover\\:bg-gray-200:hover {
  background-color: #374151 !important;
}

input,
textarea,
select {
  background-color: #111827 !important;
  border-color: #4b5563 !important;
  color: #f3f4f6 !important;
}

input::placeholder,
textarea::placeholder {
  color: #9ca3af !important;
}

hr {
  border-color: #374151 !important;
}

.prose {
  --tw-prose-body: #d1d5db;
  --tw-prose-headings: #f9fafb;
  --tw-prose-lead: #d1d5db;
  --tw-prose-links: #a5b4fc;
  --tw-prose-bold: #f9fafb;
  --tw-prose-counters: #9ca3af;
  --tw-prose-bullets: #6b7280;
  --tw-prose-hr: #374151;
  --tw-prose-quotes: #f3f4f6;
  --tw-prose-quote-borders: #4b5563;
  --tw-prose-captions: #9ca3af;
  --tw-prose-code: #f9fafb;
  --tw-prose-pre-code: #e5e7eb;
  --tw-prose-pre-bg: #111827;
  --tw-prose-th-borders: #4b5563;
  --tw-prose-td-borders: #374151;
  color: #d1d5db !important;
}
${markerEnd}
`;

if (!fs.existsSync(assetsDirectory)) {
  throw new Error(
    'RBook is not installed. Run "pnpm install" or "npm install" first.'
  );
}

const globalStylesheets = fs
  .readdirSync(assetsDirectory)
  .filter((fileName) => /^vendor-.*\.css$/.test(fileName));

if (globalStylesheets.length !== 1) {
  throw new Error(
    `Expected one RBook global stylesheet, found ${globalStylesheets.length}.`
  );
}

const existingThemePattern = new RegExp(
  `${escapeRegExp(markerStart)}[\\s\\S]*?${escapeRegExp(markerEnd)}\\s*`,
  'g'
);

// Older versions of this patch wrote to the route-level layout stylesheet.
// Remove that copy so there is one authoritative global override.
const pagesDirectory = path.join(assetsDirectory, 'pages');
if (fs.existsSync(pagesDirectory)) {
  for (const fileName of fs.readdirSync(pagesDirectory)) {
    if (!/^__layout\.svelte-.*\.css$/.test(fileName)) continue;

    const layoutPath = path.join(pagesDirectory, fileName);
    const layoutCss = fs.readFileSync(layoutPath, 'utf8');
    const cleanedLayoutCss = layoutCss.replace(existingThemePattern, '').trimEnd();

    if (cleanedLayoutCss !== layoutCss) {
      fs.writeFileSync(layoutPath, `${cleanedLayoutCss}\n`, 'utf8');
    }
  }
}

// vendor CSS is linked directly by the initial HTML, so the theme is present
// even if RBook does not load its route-level stylesheet correctly.
const stylesheetPath = path.join(assetsDirectory, globalStylesheets[0]);
let stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
stylesheet = stylesheet.replace(existingThemePattern, '').trimEnd();
fs.writeFileSync(stylesheetPath, `${stylesheet}${darkTheme}`, 'utf8');

console.log(`RBook dark theme applied: ${stylesheetPath}`);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
