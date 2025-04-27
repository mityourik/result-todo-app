import { fetchFromServer } from '../utils/api';

export function useFetchTodos() {
    async function fetchTodos() {
        return await fetchFromServer('');
    }

    return { fetchTodos };
}
