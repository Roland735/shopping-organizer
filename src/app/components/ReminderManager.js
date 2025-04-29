"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
    FaPlus,
    FaTrash,
} from "react-icons/fa";

export default function ReminderManager() {
    const { data: session, status } = useSession();
    const [reminders, setReminders] = useState([]);
    const [newReminder, setNewReminder] = useState({ title: "", date: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect or block until authenticated
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            setError("You must be logged in to see reminders.");
            setLoading(false);
            return;
        }

        async function loadReminders() {
            try {
                const res = await fetch(
                    `/api/reminders?user=${session.user.id}`
                );
                if (!res.ok) throw new Error("Failed to fetch reminders");
                const data = await res.json();
                setReminders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadReminders();
    }, [status, session?.user?.id]);


    // Add a new reminder
    const handleAdd = async () => {
        if (!newReminder.title || !newReminder.date || status !== "authenticated")
            return;

        try {
            const res = await fetch("/api/reminders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newReminder,
                    user: session.user.id,
                }),
            });
            if (!res.ok) throw new Error("Failed to add reminder");
            const created = await res.json();
            setReminders((prev) => [...prev, created]);
            setNewReminder({ title: "", date: "" });
        } catch (err) {
            console.error(err);
        }
    };

    // Toggle completion
    const handleToggle = async (reminder) => {
        if (status !== "authenticated") return;

        try {
            const res = await fetch(`/api/reminders/${reminder._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isCompleted: !reminder.isCompleted,
                    user: session.user.id,
                }),
            });
            if (!res.ok) throw new Error("Failed to update reminder");
            const updated = await res.json();
            setReminders((prev) =>
                prev.map((r) => (r._id === updated._id ? updated : r))
            );
        } catch (err) {
            console.error(err);
        }
    };

    // Delete a reminder
    const handleDelete = async (id) => {
        if (status !== "authenticated") return;

        try {
            const res = await fetch(`/api/reminders/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: session.user.id }),
            });
            if (!res.ok) throw new Error("Failed to delete reminder");
            setReminders((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading reminders...</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) =>
                        setNewReminder({ ...newReminder, title: e.target.value })
                    }
                    placeholder="Reminder title"
                    className="p-2 border rounded-lg"
                />
                <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) =>
                        setNewReminder({ ...newReminder, date: e.target.value })
                    }
                    className="p-2 border rounded-lg"
                />
                <button
                    onClick={handleAdd}
                    className="col-span-2 bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700"
                >
                    <FaPlus /> Add Reminder
                </button>
            </div>

            <div className="space-y-4">
                {reminders.map((r) => (
                    <motion.div
                        key={r._id}
                        whileHover={{ x: 10 }}
                        className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                    >
                        <input
                            type="checkbox"
                            checked={r.isCompleted}
                            onChange={() => handleToggle(r)}
                            className="w-4 h-4 text-emerald-600"
                        />
                        <div className="flex-1">
                            <h4
                                className={`font-semibold ${r.isCompleted ? "line-through text-gray-400" : ""
                                    }`}
                            >
                                {r.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {new Date(r.date).toLocaleDateString()}
                            </p>
                        </div>
                        <button
                            onClick={() => handleDelete(r._id)}
                            className="text-gray-500 hover:text-red-600"
                        >
                            <FaTrash />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
