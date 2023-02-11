// import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // Ajax запрос к API
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); // сработает тот код, который загрузится быстрее
    const data = await res.json();

    // if ok: false
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch {
    throw err;
  }
};
