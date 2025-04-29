// ListManager.js
'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
    FaPlusCircle,
    FaEdit,
    FaTrash,
    FaCheck,
    FaCheckCircle,
    FaShareAlt
} from 'react-icons/fa';

const ListManager = () => {
    const { data: session, status } = useSession();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);

    // New‐list form
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');

    // List‐level edit state
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // Item‐level state
    const [addingItemFor, setAddingItemFor] = useState(null);
    const [itemForm, setItemForm] = useState({
        name: '',
        quantity: '',
        unit: '',
        category: '',
        priority: '',
        notes: ''
    });
    const [editingItem, setEditingItem] = useState({ listId: null, itemId: null });
    const [editItemForm, setEditItemForm] = useState({
        name: '',
        quantity: '',
        unit: '',
        category: '',
        priority: '',
        notes: ''
    });

    // Fetch lists on load
    useEffect(() => {
        if (status !== 'authenticated') return;
        (async () => {
            try {
                const res = await fetch('/api/lists');
                const data = await res.json();
                setLists(data.map(l => ({ ...l, id: l._id })));
            } catch (err) {
                console.error('Failed to fetch lists', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [status]);

    // ————— List CRUD —————

    const handleAddList = async () => {
        if (!newTitle.trim()) return;
        const payload = {
            user: session.user.id,
            title: newTitle,
            description: newDescription,
            items: [],
            isShared: false,
            sharedWith: [],
            isCompleted: false
        };
        try {
            const res = await fetch('/api/lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const newList = await res.json();
            setLists([{ ...newList, id: newList._id }, ...lists]);
            setNewTitle('');
            setNewDescription('');
        } catch (err) {
            console.error('Failed to add list', err);
        }
    };

    const handleEdit = list => {
        setEditingId(list.id);
        setEditTitle(list.title);
        setEditDescription(list.description);
    };

    const saveEdit = async id => {
        try {
            const res = await fetch(`/api/lists/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            });
            const updated = await res.json();
            setLists(lists.map(l => (l.id === id ? { ...updated, id: updated._id } : l)));
            setEditingId(null);
        } catch (err) {
            console.error('Failed to save edit', err);
        }
    };

    const handleDelete = async id => {
        try {
            await fetch(`/api/lists/${id}`, { method: 'DELETE' });
            setLists(lists.filter(l => l.id !== id));
        } catch (err) {
            console.error('Failed to delete list', err);
        }
    };

    const handleToggleComplete = async id => {
        const list = lists.find(l => l.id === id);
        if (!list) return;
        try {
            const res = await fetch(`/api/lists/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCompleted: !list.isCompleted })
            });
            const updated = await res.json();
            setLists(lists.map(l => (l.id === id ? { ...updated, id: updated._id } : l)));
        } catch (err) {
            console.error('Failed to toggle complete', err);
        }
    };

    const handleToggleShare = async id => {
        const list = lists.find(l => l.id === id);
        if (!list) return;
        try {
            const res = await fetch(`/api/lists/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isShared: !list.isShared })
            });
            const updated = await res.json();
            setLists(lists.map(l => (l.id === id ? { ...updated, id: updated._id } : l)));
        } catch (err) {
            console.error('Failed to toggle share', err);
        }
    };

    // ————— Item CRUD —————

    const startAddingItem = listId => {
        setAddingItemFor(listId);
        setItemForm({ name: '', quantity: '', unit: '', category: '', priority: '', notes: '' });
    };

    const handleAddItem = async listId => {
        const payload = { ...itemForm };
        try {
            const res = await fetch(`/api/items/${listId}/${session.user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const newItem = await res.json();
            setLists(
                lists.map(l =>
                    l.id === listId
                        ? { ...l, items: [...l.items, { ...newItem, id: newItem._id }] }
                        : l
                )
            );
            setAddingItemFor(null);
        } catch (err) {
            console.error('Failed to add item', err);
        }
    };

    const startEditItem = (listId, item) => {
        setEditingItem({ listId, itemId: item._id });
        setEditItemForm({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category,
            priority: item.priority,
            notes: item.notes
        });
    };

    const saveEditItem = async () => {
        const { listId, itemId } = editingItem;
        try {
            const res = await fetch(`/api/mylists/${listId}/items/${itemId}/${session.user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editItemForm)
            });
            const updated = await res.json();
            setLists(
                lists.map(l =>
                    l.id === listId
                        ? {
                            ...l,
                            items: l.items.map(i =>
                                i._id === updated._id ? { ...updated, id: updated._id } : i
                            )
                        }
                        : l
                )
            );
            setEditingItem({ listId: null, itemId: null });
        } catch (err) {
            console.error('Failed to edit item', err);
        }
    };

    const handleDeleteItem = async (listId, itemId) => {
        try {
            await fetch(`/api/nylists/${listId}/items/${itemId}`, { method: 'DELETE' });
            setLists(
                lists.map(l =>
                    l.id === listId
                        ? { ...l, items: l.items.filter(i => i._id !== itemId) }
                        : l
                )
            );
        } catch (err) {
            console.error('Failed to delete item', err);
        }
    };

    const togglePurchased = async (listId, item) => {
        try {
            const res = await fetch(`/api/items/${listId}/items/${item._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ purchased: !item.purchased })
            });
            const updated = await res.json();
            setLists(
                lists.map(l =>
                    l.id === listId
                        ? {
                            ...l,
                            items: l.items.map(i =>
                                i._id === updated._id ? { ...updated, id: updated._id } : i
                            )
                        }
                        : l
                )
            );
        } catch (err) {
            console.error('Failed to toggle purchased', err);
        }
    };

    // ————— Render —————

    if (status === 'loading' || loading) return <p>Loading lists...</p>;
    if (status !== 'authenticated') return <p>Please log in to manage your lists.</p>;

    return (
        <div className="space-y-6">
            {/* Add new list */}
            <div className="flex flex-col  gap-4 mb-6">
                <div className='flex flex-col md:flex-row gap-4 mb-6"'>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="List Title"
                    />
                    <input
                        type="text"
                        value={newDescription}
                        onChange={e => setNewDescription(e.target.value)}
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="Description"
                    />
                </div>
                <button
                    onClick={handleAddList}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700"
                >
                    <FaPlusCircle /> Add List
                </button>
            </div>

            {/* Lists & their items */}
            <div className="space-y-4">
                {lists.map(list => (
                    <motion.div
                        key={list.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 bg-white rounded-lg shadow-sm border-l-4 ${list.isCompleted ? 'border-emerald-600' : 'border-transparent'
                            }`}
                    >
                        {/* List header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="flex-1">
                                {editingId === list.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={e => setEditTitle(e.target.value)}
                                            className="w-full p-1 border-b mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={editDescription}
                                            onChange={e => setEditDescription(e.target.value)}
                                            className="w-full p-1 border-b"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h3
                                            className={`text-xl font-semibold ${list.isCompleted ? 'line-through text-gray-400' : ''
                                                }`}
                                        >
                                            {list.title}
                                        </h3>
                                        <p className="text-gray-600">{list.description}</p>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <button
                                    onClick={() => handleToggleComplete(list.id)}
                                    className="text-gray-500 hover:text-emerald-600"
                                >
                                    <FaCheckCircle
                                        className={list.isCompleted ? 'text-emerald-600' : ''}
                                    />
                                </button>
                                <button
                                    onClick={() => handleToggleShare(list.id)}
                                    className="text-gray-500 hover:text-emerald-600"
                                >
                                    <FaShareAlt
                                        className={list.isShared ? 'text-emerald-600' : ''}
                                    />
                                </button>
                                {editingId === list.id ? (
                                    <button onClick={() => saveEdit(list.id)}>
                                        <FaCheck className="text-emerald-600" />
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(list)}>
                                            <FaEdit className="text-gray-500 hover:text-emerald-600" />
                                        </button>
                                        <button onClick={() => handleDelete(list.id)}>
                                            <FaTrash className="text-gray-500 hover:text-red-600" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Items section */}
                        <div className="mt-4 space-y-2">
                            <h5 className="font-semibold">Items</h5>

                            {list.items.map(item => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between"
                                >
                                    {editingItem.itemId === item._id ? (
                                        // Inline edit form
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {['name', 'quantity', 'unit', 'category', 'priority', 'notes'].map(
                                                field => (
                                                    <input
                                                        key={field}
                                                        className="border-b p-1"
                                                        value={editItemForm[field]}
                                                        onChange={e =>
                                                            setEditItemForm(f => ({
                                                                ...f,
                                                                [field]: e.target.value
                                                            }))
                                                        }
                                                        placeholder={field}
                                                    />
                                                )
                                            )}
                                            <button onClick={saveEditItem}>
                                                <FaCheck className="text-emerald-600" />
                                            </button>
                                        </div>
                                    ) : (
                                        // Display item
                                        <div className="flex items-center gap-3">
                                            <FaCheckCircle
                                                className={
                                                    item.purchased ? 'text-emerald-600' : 'text-gray-300'
                                                }
                                                onClick={() => togglePurchased(list.id, item)}
                                            />
                                            <span
                                                className={item.purchased ? 'line-through' : ''}
                                            >
                                                {item.name} ({item.quantity}
                                                {item.unit}) — {item.category},{' '}
                                                {item.priority}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button onClick={() => startEditItem(list.id, item)}>
                                            <FaEdit className="text-gray-500 hover:text-emerald-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(list.id, item._id)}
                                        >
                                            <FaTrash className="text-gray-500 hover:text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Add‐item form toggle */}
                            {addingItemFor === list.id ? (
                                <div className="mt-2 flex flex-wrap gap-2 items-center">
                                    {['name', 'quantity', 'unit', 'category', 'priority', 'notes'].map(
                                        field => (
                                            <input
                                                key={field}
                                                className="border p-1"
                                                value={itemForm[field]}
                                                onChange={e =>
                                                    setItemForm(f => ({
                                                        ...f,
                                                        [field]: e.target.value
                                                    }))
                                                }
                                                placeholder={field}
                                            />
                                        )
                                    )}
                                    <button onClick={() => handleAddItem(list.id)}>
                                        <FaPlusCircle className="text-emerald-600" />
                                    </button>
                                    <button onClick={() => setAddingItemFor(null)}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => startAddingItem(list.id)}
                                    className="mt-2 text-emerald-600 hover:underline flex items-center gap-1"
                                >
                                    <FaPlusCircle /> Add Item
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ListManager;
