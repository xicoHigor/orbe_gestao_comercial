export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    ...options,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
  });
  const type = response.headers.get('content-type') || '';
  if (!response.ok) {
    const error = type.includes('json') ? await response.json() : { error: 'Não foi possível concluir a operação.' };
    throw new Error(error.error || 'Não foi possível concluir a operação.');
  }
  return type.includes('json') ? response.json() : response;
}

export const brl = (value = 0) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const dateBr = (value) => value ? (String(value).includes('T') ? new Date(value).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR')) : '—';
export const dateTimeBr = (value) => value ? new Date(value).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }) : '—';
export const monthNow = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit' }).format(new Date());
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
