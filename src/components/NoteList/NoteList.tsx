import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
interface NoteListProps {
  notes: Note[];
  onNoteDeleted?: () => void;
}
export default function NoteList({ notes, onNoteDeleted }: NoteListProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      onNoteDeleted?.();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
  return (
    <>
      {deleteMutation.isError && (
        <p role="alert">Could not delete the note. Please try again.</p>
      )}
      <ul className={css.list}>
        {notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <button
                className={css.button}
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(note.id)}
              >
                {deleteMutation.isPending &&
                deleteMutation.variables === note.id
                  ? 'Deleting…'
                  : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
