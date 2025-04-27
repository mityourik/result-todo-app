export const API_URL = 'http://localhost:3001/tasks';

export async function fetchFromServer(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`Ошибка на сервере: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
}
