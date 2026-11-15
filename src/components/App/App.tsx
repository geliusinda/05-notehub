import { useCallback, useState, type ChangeEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, deleteNote, hasToken } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const client = useQueryClient();
  const closeModal = useCallback(() => setIsOpen(false), []);
  const updateSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 300);
  const query = useQuery({
    queryKey: ['notes', page, search],
    queryFn: ({ signal }) => fetchNotes({ page, search, signal }),
    enabled: hasToken,
  });
  const deletion = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      if (query.data?.notes.length === 1 && page > 1) setPage(page - 1);
      await client.invalidateQueries({ queryKey: ['notes'] });
    },
  });
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    updateSearch(event.target.value);
  };
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={input} onChange={handleSearch} />
        {query.data && query.data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={query.data.totalPages}
            onPageChange={setPage}
          />
        )}
        <button
          className={css.button}
          onClick={() => setIsOpen(true)}
          disabled={!hasToken}
        >
          Create note +
        </button>
      </header>
      {!hasToken && (
        <p role="status">
          Add VITE_NOTEHUB_TOKEN to .env.local and restart the app to load your
          notes.
        </p>
      )}
      {hasToken && query.isPending && <p role="status">Loading notes…</p>}
      {query.isError && (
        <div role="alert">
          <p>Could not load notes. Check your token and connection.</p>
          <button onClick={() => void query.refetch()}>Try again</button>
        </div>
      )}
      {deletion.isError && (
        <p role="alert">Could not delete the note. Please try again.</p>
      )}
      {query.isSuccess && query.data.notes.length === 0 && (
        <p role="status">
          {search
            ? 'No notes match your search.'
            : 'No notes yet. Create your first note!'}
        </p>
      )}
      {!!query.data?.notes.length && (
        <NoteList
          notes={query.data.notes}
          onDelete={(id: string) => deletion.mutate(id)}
          deletingId={deletion.isPending ? deletion.variables : undefined}
        />
      )}
      {isOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            onCancel={closeModal}
            onSuccess={() => {
              updateSearch.cancel();
              setInput('');
              setSearch('');
              setPage(1);
              closeModal();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
