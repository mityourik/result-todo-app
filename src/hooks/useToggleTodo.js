import { fetchFromServer } from '../utils/api';

export function useToggleTodo() {
    async function toggleTodo(id) {
        const todo = await fetchFromServer(`/${id}`);
        const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
        return await fetchFromServer(`/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo),
        });
    }

    return { toggleTodo };
}
