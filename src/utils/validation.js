// src/utils/validation.js
export function validateApiKey(key) {
    return /^sk-[A-Za-z0-9]{32,}$/.test(key);
  }