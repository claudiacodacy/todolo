import { useState, useCallback } from 'react';
import type { EditorTodo } from '../types';

export function useSearchFilter(todos: EditorTodo[]) {
  const [query, setQuery] = useState('');

  const filtered = todos.filter((todo) => {
    if (!query.trim()) return true;
    return todo.text.toLowerCase().includes(query.toLowerCase());
  });

  const handleSearch = useCallback((input: string) => {
    const trimmed = input.trim();
    setQuery(trimmed);
  }, []);

  return { query, handleSearch, filtered };
}
