import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search…', className }) {
  return (
    <div className={`relative ${className || ''}`}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-line bg-white py-2 pl-9 pr-3 text-sm placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass"
      />
    </div>
  );
}
