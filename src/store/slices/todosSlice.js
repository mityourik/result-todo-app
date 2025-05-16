import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addTodo as addTodoApi, deleteTodo as deleteTodoApi, fetchTodos as fetchTodosApi, getTodoById as getTodoByIdApi, updateTodo as updateTodoApi } from '../../utils/api';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await fetchTodosApi();
    return response;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (todoData) => {
    const response = await addTodoApi(todoData);
    return response;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
    await deleteTodoApi(id);
    return id;
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, updates }) => {
    const response = await updateTodoApi(id, updates);
    return response;
});

export const getTodoById = createAsyncThunk('todos/getTodoById', async (id) => {
    const response = await getTodoByIdApi(id);
    return response;
});

const initialState = {
    items: [],
    currentTodo: null,
    status: 'idle',
    error: null,
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(addTodo.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.items = state.items.filter((todo) => todo.id !== action.payload);
            })

            .addCase(updateTodo.fulfilled, (state, action) => {
                const index = state.items.findIndex((todo) => todo.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.currentTodo && state.currentTodo.id === action.payload.id) {
                    state.currentTodo = action.payload;
                }
            })

            .addCase(getTodoById.fulfilled, (state, action) => {
                state.currentTodo = action.payload;
            });
    },
});

export default todosSlice.reducer;
