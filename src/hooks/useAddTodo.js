import { push, ref } from 'firebase/database';
import { db } from '../firebase';

export function useAddTodo() {
    const todoDbRef = ref(db, 'todos');

    async function addTodo(newTodoText) {
        if (!newTodoText.trim()) return;
        const todo = { text: newTodoText.trim(), isCompleted: false };
        try {
            await push(todoDbRef, todo);
        } catch (error) {
            console.error(error);
        }
    }

    return { addTodo };
}
