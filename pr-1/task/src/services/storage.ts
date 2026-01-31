import fs from 'fs/promises';
import path from 'path';
const DATA_FILE = path.join(__dirname, '..', 'data', 'students.json');

export async function saveToJSON(data: any[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function loadJSON(): Promise<any[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err: any) {
    console.log('Error reading JSON:', err.message);
    return [];
  }
}
