import { ref, update } from 'firebase/database';
import { db } from '../firebase';

export function useUpdateTodo() {
    async function updateTodo(id, updatedText) {
        try {
            await update(ref(db, `todos/${id}`), { text: updatedText });
        } catch (error) {
            console.error(error);
        }
    }
    return { updateTodo };
}
