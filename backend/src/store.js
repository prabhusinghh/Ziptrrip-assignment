import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '..', 'data', 'todos.json');

async function ensureFile() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, '[]', 'utf8');
  }
}

export async function readTodos() {
  await ensureFile();
  const raw = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(raw || '[]');
}

export async function writeTodos(todos) {
  await ensureFile();
  const temp = `${dataFile}.tmp`;
  await fs.writeFile(temp, JSON.stringify(todos, null, 2), 'utf8');
  await fs.rename(temp, dataFile);
}
