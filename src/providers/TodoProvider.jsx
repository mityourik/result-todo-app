import React, { useEffect, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { useAddTodo } from '../hooks/useAddTodo';
import { useDeleteTodo } from '../hooks/useDeleteTodo';
import { useFetchTodos } from '../hooks/useFetchTodos';
import { useToggleTodo } from '../hooks/useToggleTodo';
import { useUpdateTodo } from '../hooks/useUpdateTodo';

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);

    const { fetchTodos } = useFetchTodos();
    const { addTodo } = useAddTodo();
    const { deleteTodo } = useDeleteTodo();
    const { toggleTodo } = useToggleTodo();
    const { updateTodo } = useUpdateTodo();

    useEffect(() => {
        fetchTodos().then(setTodos);
    }, [fetchTodos]);

    const handleAddTodo = async (newTaskText) => {
        if (!newTaskText) return;
        const addedTodo = await addTodo(newTaskText);
        if (addedTodo) {
            setTodos((prev) => [...prev, addedTodo]);
        }
    };

    const handleDeleteTodo = async (id) => {
        await deleteTodo(id);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const handleToggleTodo = async (id) => {
        const updatedTodo = await toggleTodo(id);
        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
        return updatedTodo;
    };

    const handleUpdateTodo = async (id, updatedData) => {
        const updatedTodo = await updateTodo(id, updatedData);
        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
    };

    return (
        <TodoContext.Provider
            value={{
                todos,
                handleAddTodo,
                handleDeleteTodo,
                handleToggleTodo,
                handleUpdateTodo,
            }}
        >
            {children}
        </TodoContext.Provider>
    );
};
