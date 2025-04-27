import { useCallback } from 'react';
import { fetchFromServer } from '../utils/api';

export function useFetchTodos() {
    const fetchTodos = useCallback(async () => {
        return await fetchFromServer('');
    }, []);

    return { fetchTodos };
}
