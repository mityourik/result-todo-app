import { fetchFromServer } from '../utils/api';

export function useUpdateTodo() {
    async function updateTodo(id, updatedData) {
        return await fetchFromServer(`/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
    }

    return { updateTodo };
}
