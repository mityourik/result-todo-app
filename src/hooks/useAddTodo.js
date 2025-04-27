import { fetchFromServer } from '../utils/api';

export function useAddTodo() {
    async function addTodo(newTodoText) {
        if (!newTodoText.trim()) return;
        const todo = { text: newTodoText.trim(), isCompleted: false };
        return await fetchFromServer('', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });
    }

    return { addTodo };
}
