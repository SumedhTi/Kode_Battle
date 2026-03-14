import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const SUBMISSIONS_DIR = path.resolve(new URL('.', import.meta.url).pathname, '../submissions');

const languageExtensions = {
  javascript: 'js',
  python: 'py',
  java: 'java',
  cpp: 'cpp',
  cplusplus: 'cpp',
  'c++': 'cpp',
  'c#': 'cs',
};

function getExtension(language) {
  return languageExtensions[language?.toLowerCase()] || 'txt';
}

export async function ensureSubmissionsDir() {
  await fs.mkdir(SUBMISSIONS_DIR, { recursive: true });
  return SUBMISSIONS_DIR;
}

export async function saveSubmissionFile({ matchId, playerId, language, code }) {
  await ensureSubmissionsDir();
  const timestamp = Date.now();
  const ext = getExtension(language);
  const fileName = `${matchId}_${playerId}_${timestamp}.${ext}`;
  const filePath = path.join(SUBMISSIONS_DIR, fileName);
  await fs.writeFile(filePath, code, 'utf-8');
  return filePath;
}

export function buildSubmissionRecord({ matchId, playerId, language, filePath }) {
  return {
    submissionId: uuidv4(),
    matchId,
    player: playerId,
    language,
    filePath,
    status: 'PENDING',
    timestamp: new Date(),
  };
}
