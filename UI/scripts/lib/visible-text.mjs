import { readFileSync, readdirSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

export function extractVisibleText(source) {
  return [...new Set(source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .split(/\n+/)
    .map((value) => value.replace(/\s+/g, ' ').trim())
    .filter((value) => value && !/^\{\{.*\}\}$/.test(value)))];
}

export function collectVisibleText(root, exclusions = []) {
  const excluded = new Set(exclusions);
  const phrases = new Set();

  for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.component.html')) continue;
    const filePath = join(entry.parentPath, entry.name);
    const relativePath = relative(root, filePath);
    if (excluded.has(relativePath) || excluded.has(basename(filePath))) continue;
    for (const phrase of extractVisibleText(readFileSync(filePath, 'utf8'))) phrases.add(phrase);
  }

  return [...phrases].sort((left, right) => left.localeCompare(right));
}
