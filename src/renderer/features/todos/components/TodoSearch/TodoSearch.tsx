type Props = {
  query: string;
  onSearch: (q: string) => void;
};

export function TodoSearch({ query, onSearch }: Props) {
  return (
    <input
      type="search"
      value={query}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Filter todos…"
      aria-label="Filter todos"
      style={{ width: '100%', marginBottom: 8, padding: '4px 8px' }}
    />
  );
}
