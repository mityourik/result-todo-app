import { ref, remove } from 'firebase/database';
import { db } from '../firebase';

export function useDeleteTodo() {
    async function deleteTodo(id) {
        try {
            await remove(ref(db, `todos/${id}`));
        } catch (error) {
            console.error(error);
        }
    }
    return { deleteTodo };
}
