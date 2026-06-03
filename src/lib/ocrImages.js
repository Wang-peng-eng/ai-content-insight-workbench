import { createWorker } from 'tesseract.js';

let _worker = null;

async function getWorker() {
  if (_worker) return _worker;
  _worker = await createWorker('chi_sim');
  return _worker;
}

export async function ocrImages(files, onProgress) {
  const worker = await getWorker();
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({ current: i + 1, total: files.length, file: file.name, status: 'processing' });

    try {
      const url = URL.createObjectURL(file);
      const { data } = await worker.recognize(url);
      URL.revokeObjectURL(url);

      const text = data.text.trim();
      if (text) {
        results.push({ file: file.name, text });
      }
      onProgress?.({ current: i + 1, total: files.length, file: file.name, status: 'done', text: text.slice(0, 50) });
    } catch (e) {
      onProgress?.({ current: i + 1, total: files.length, file: file.name, status: 'error', error: e.message });
    }
  }

  return results;
}

export async function terminateWorker() {
  if (_worker) {
    await _worker.terminate();
    _worker = null;
  }
}
