import React from 'react';
import ListSidebar from '../ListSidebar/ListSidebar';
import TodoList from '../TodoList/TodoList';
import TodoListHeader from '../TodoListHeader/TodoListHeader';
import { TodoSearch } from '../TodoSearch/TodoSearch';
import { useSearchFilter } from '../../hooks/useSearchFilter';
import type { AppSettings } from '../../types';
import { useSelectedTodos } from '../../store/useTodosStore';
import useTodoFocus, { useTodoFocusEffect } from '../../hooks/useTodoFocus';
import useListEditing from '../../hooks/useListEditing';
import useListDuplication from '../../hooks/useListDuplication';
import useListsIndex from '../../hooks/useListsIndex';
import useTodosPersistence from '../../hooks/useTodosPersistence';
import { loadAppSettings, saveAppSettings } from '../../api/storage';
import { debugLogger } from '../../../../utils/debug';

const styles = require('./TodoApp.module.css');

export default function TodoApp(): React.ReactElement {
  // Initialize lists from storage and persistence
  useListsIndex();
  useTodosPersistence();
  const [appSettings, setAppSettings] = React.useState<AppSettings>({
    hideCompletedItems: true,
  });
  const { statusMessage } = useListDuplication();

  React.useEffect(() => {
    loadAppSettings()
      .then(setAppSettings)
      .catch((error) => {
        // Handle load failure gracefully - keep default settings
        debugLogger.log(
          'warn',
          'Failed to load app settings, using defaults',
          error,
        );
      });
  }, []);
  const updateAppSettings = React.useCallback(
    async (newSettings: AppSettings) => {
      setAppSettings(newSettings);
      await saveAppSettings(newSettings);
    },
    [],
  );

  const allTodos = useSelectedTodos();
  const { query, handleSearch } = useSearchFilter(allTodos);

  const { inputByIdRef, focusNextIdRef, setInputRef, focusTodo } =
    useTodoFocus();

  const { isEditingRef } = useListEditing();

  useTodoFocusEffect(allTodos, focusNextIdRef, inputByIdRef, isEditingRef);

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <ListSidebar />

      {/* Main content */}
      <div className={styles.container}>
        <div className={styles.content}>
          <TodoListHeader
            appSettings={appSettings}
            onUpdateAppSettings={updateAppSettings}
          />

          <TodoSearch query={query} onSearch={handleSearch} />

          <TodoList
            appSettings={appSettings}
            setInputRef={setInputRef}
            focusTodo={focusTodo}
            searchQuery={query}
          />
        </div>

        {/* ARIA live region for status messages */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(1px, 1px, 1px, 1px)',
          }}
        >
          {statusMessage}
        </div>
      </div>
    </div>
  );
}
