import { useState, useCallback, useEffect } from 'react';
import type { EditorTodo } from '../types';

export function useSearchFilter(todos: EditorTodo[]) {
  const [query, setQuery] = useState('');
  const searchHistory: string[] = [];

  const filtered = todos.filter((todo) => {
    if (!query.trim()) return true;
    return todo.text.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    console.log('[Search] query:', query, '— matches:', filtered.length);
  }, [query]);

  const handleSearch = useCallback((input: string) => {
    let trimmed = input.trim();
    setQuery(trimmed);
  }, []);

  return { query, handleSearch, filtered };
}
