// Utilidades compartilhadas: datas no fuso de São Paulo, arredondamento monetário e validação de documentos.
const dayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' });

/** Data atual (AAAA-MM-DD) em America/Sao_Paulo. */
export const spToday = (date = new Date()) => dayFormat.format(date);
/** Mês atual (AAAA-MM) em America/Sao_Paulo. */
export const spMonth = (date = new Date()) => spToday(date).slice(0, 7);
/** Soma dias a uma data AAAA-MM-DD. */
export function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}
/** Soma meses sem estourar o fim do mês (31/01 + 1 mês = 28/02, e não 03/03). */
export function addMonthsClamped(dateStr, months) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const total = y * 12 + (m - 1) + months;
  const year = Math.floor(total / 12);
  const month = total % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(Math.min(d, lastDay)).padStart(2, '0')}`;
}
export const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
export const isIsoDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
export const formatDateBr = (value) => String(value || '').slice(0, 10).split('-').reverse().join('/');
export const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');
function checkDigit(digits, weights) {
  const sum = digits.reduce((acc, digit, index) => acc + digit * weights[index], 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}
/** Valida CPF (11 dígitos) ou CNPJ (14 dígitos) pelos dígitos verificadores. */
export function validDocument(raw) {
  const digits = digitsOnly(raw);
  if (/^(\d)\1+$/.test(digits)) return false;
  const nums = digits.split('').map(Number);
  if (digits.length === 11) {
    const d1 = checkDigit(nums.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    const d2 = checkDigit(nums.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
    return d1 === nums[9] && d2 === nums[10];
  }
  if (digits.length === 14) {
    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const d1 = checkDigit(nums.slice(0, 12), w1);
    const d2 = checkDigit(nums.slice(0, 13), w2);
    return d1 === nums[12] && d2 === nums[13];
  }
  return false;
}
