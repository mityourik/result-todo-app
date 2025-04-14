import { ref, update } from 'firebase/database';
import { db } from '../firebase';

export function useToggleTodo() {
    async function toggleTodo(todo) {
        try {
            const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
            await update(ref(db, `todos/${todo.id}`), {
                isCompleted: updatedTodo.isCompleted,
            });
        } catch (error) {
            console.error(error);
        }
    }
    return { toggleTodo };
}
