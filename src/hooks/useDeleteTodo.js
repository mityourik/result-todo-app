import { fetchFromServer } from '../utils/api';

export function useDeleteTodo() {
    async function deleteTodo(id) {
        await fetchFromServer(`/${id}`, {
            method: 'DELETE',
        });
    }

    return { deleteTodo };
}
