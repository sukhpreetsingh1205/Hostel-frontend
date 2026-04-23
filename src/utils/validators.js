export const isEmail = (value) => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
};

export const isPhone10 = (value) => {
  if (!value) return false;
  return /^[0-9]{10}$/.test(String(value).trim());
};

export const isMinLength = (value, min) => {
  if (value === null || value === undefined) return false;
  return String(value).length >= min;
};
