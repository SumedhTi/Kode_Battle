import { promises as fs } from 'fs';
import path from 'path';

let cachedProblems = null;

export async function loadProblems() {
  if (cachedProblems) return cachedProblems;

  const filePath = path.resolve(new URL('.', import.meta.url).pathname, '../data/problems.json');
  const data = await fs.readFile(filePath, 'utf-8');
  cachedProblems = JSON.parse(data);
  return cachedProblems;
}

export async function getProblemById(problemId) {
  const problems = await loadProblems();
  return problems.find((p) => p.id === problemId);
}

export async function getRandomProblemId() {
  const problems = await loadProblems();
  if (!problems || problems.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * problems.length);
  return problems[randomIndex].id;
}
