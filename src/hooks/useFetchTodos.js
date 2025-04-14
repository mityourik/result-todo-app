import { get, onValue, orderByChild, query, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { db } from '../firebase';

export function useFetchTodos(sortAlphabet) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const todoDbRef = ref(db, 'todos');
        let unsubscribe;

        if (sortAlphabet) {
            const sortedQuery = query(todoDbRef, orderByChild('text'));
            get(sortedQuery)
                .then((snapshot) => {
                    const todosArray = [];
                    snapshot.forEach((childSnap) => {
                        todosArray.push({ id: childSnap.key, ...childSnap.val() });
                    });
                    setTodos(todosArray);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        } else {
            unsubscribe = onValue(todoDbRef, (snapshot) => {
                const todosArray = [];
                snapshot.forEach((childSnap) => {
                    todosArray.push({ id: childSnap.key, ...childSnap.val() });
                });
                setTodos(todosArray);
                setLoading(false);
            });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [sortAlphabet]);

    return { todos, loading };
}
