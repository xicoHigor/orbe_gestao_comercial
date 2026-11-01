import React from 'react';
import { X, LoaderCircle, Search, Plus, ArrowUpRight } from 'lucide-react';

export function Button({ children, icon: Icon, variant = 'primary', size = '', onClick, type = 'button', disabled, className = '' }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`button ${variant} ${size} ${className}`}>
    {Icon && <Icon size={16} strokeWidth={1.9} />}{children}
  </button>;
}
export function IconButton({ icon: Icon, label, onClick, className = '' }) {
  return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick}><Icon size={17} /></button>;
}
export function Modal({ title, subtitle, onClose, children, wide = false }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
    <section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <header className="modal-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><IconButton icon={X} label="Fechar" onClick={onClose} /></header>
      <div className="modal-content">{children}</div>
    </section>
  </div>;
}
export function Field({ label, children, className = '', hint }) {
  return <label className={`field ${className}`}><span className="field-label">{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
export function Input(props) { return <input className="input" {...props} />; }
export function Select(props) { return <select className="input select" {...props} />; }
export function Textarea(props) { return <textarea className="input textarea" {...props} />; }
export function SearchBox({ value, onChange, placeholder = 'Buscar...' }) {
  return <label className="search-box"><Search size={16} /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} /></label>;
}
export function StatusBadge({ children, tone = 'neutral' }) { return <span className={`status-badge ${tone}`}>{children}</span>; }
export function Table({ headers, children, empty = 'Nada para mostrar por aqui.' }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{children || <tr><td colSpan={headers.length}><div className="empty-state compact">{empty}</div></td></tr>}</tbody></table></div>;
}
export function PageHeading({ eyebrow, title, description, action, children }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><div className="heading-actions">{children}{action}</div></div>;
}
export function Toolbar({ children }) { return <div className="toolbar">{children}</div>; }
export function Loading({ label = 'Carregando...' }) { return <div className="loading"><LoaderCircle size={19} className="spin" />{label}</div>; }
export function ErrorBox({ children }) { return children ? <div className="error-box" role="alert">{children}</div> : null; }
export function Toast({ toast, onClose }) {
  React.useEffect(() => { if (!toast) return; const timer = setTimeout(onClose, 4200); return () => clearTimeout(timer); }, [toast, onClose]);
  return toast ? <div className={`toast ${toast.type || 'success'}`} role="status"><span className="toast-mark">{toast.type === 'error' ? '!' : '✓'}</span>{toast.message}<button onClick={onClose} aria-label="Fechar aviso"><X size={15} /></button></div> : null;
}
export function Empty({ icon: Icon, title, text, action }) {
  return <div className="empty-state">{Icon && <div className="empty-icon"><Icon size={22} /></div>}<strong>{title}</strong><p>{text}</p>{action && <Button icon={Plus} onClick={action.onClick}>{action.label}</Button>}</div>;
}
export function StatCard({ label, value, note, icon: Icon, color = 'blue', trend }) {
  return <article className="stat-card"><div className={`stat-icon ${color}`}><Icon size={18} /></div><div className="stat-top"><span>{label}</span>{trend && <span className="stat-trend"><ArrowUpRight size={14} />{trend}</span>}</div><strong>{value}</strong><p>{note}</p></article>;
}
export function FormActions({ onCancel, submit = 'Salvar', loading = false }) {
  return <div className="form-actions"><Button variant="outline" onClick={onCancel}>Cancelar</Button><Button type="submit" disabled={loading}>{loading && <LoaderCircle size={15} className="spin" />}{submit}</Button></div>;
}
