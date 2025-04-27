import { useCallback } from 'react';
import { fetchFromServer } from '../utils/api';

export function useGetTodoById() {
    const getTodoById = useCallback(async (id) => {
        try {
            return await fetchFromServer(`/${id}`);
        } catch {
            return null;
        }
    }, []);

    return { getTodoById };
}
