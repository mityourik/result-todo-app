import React, { createContext, useEffect, useState } from 'react';
import useAddTodo from '../hooks/useAddTodo';
import useDeleteTodo from '../hooks/useDeleteTodo';
import useFetchTodos from '../hooks/useFetchTodos';
import useToggleTodo from '../hooks/useToggleTodo';
import useUpdateTodo from '../hooks/useUpdateTodo';

export const TodosContext = createContext(null);

export const TodosProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);

    const { fetchTodos } = useFetchTodos();
    const { addTodo } = useAddTodo();
    const { deleteTodo } = useDeleteTodo();
    const { toggleTodo } = useToggleTodo();
    const { updateTodo } = useUpdateTodo();

    useEffect(() => {
        fetchTodos().then(setTodos);
    }, [fetchTodos]);

    const handleAddTodo = async (newTodo) => {
        const addedTodo = await addTodo(newTodo);
        setTodos((prev) => [...prev, addedTodo]);
    };

    const handleDeleteTodo = async (id) => {
        await deleteTodo(id);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const handleToggleTodo = async (id) => {
        const updatedTodo = await toggleTodo(id);
        setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
    };

    const handleUpdateTodo = async (id, updatedData) => {
        const updatedTodo = await updateTodo(id, updatedData);
        setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
    };

    return (
        <TodosContext.Provider
            value={{
                todos,
                handleAddTodo,
                handleDeleteTodo,
                handleToggleTodo,
                handleUpdateTodo,
            }}
        >
            {children}
        </TodosContext.Provider>
    );
};
