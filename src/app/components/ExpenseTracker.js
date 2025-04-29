"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function ExpenseTracker() {
    const { data: session, status } = useSession();
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ itemName: "", amount: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load expenses once session is ready
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            setError("Please log in to view your expenses.");
            setLoading(false);
            return;
        }

        async function load() {
            try {
                const res = await fetch(`/api/expenses?user=${session.user.id}`);
                if (!res.ok) throw new Error("Failed to fetch expenses");
                const data = await res.json();
                setExpenses(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [status, session?.user?.id]);

    // Add a new expense
    const handleAdd = async () => {
        if (
            !newExpense.itemName ||
            !newExpense.amount ||
            status !== "authenticated"
        )
            return;

        try {
            const payload = {
                user: session.user.id,
                itemName: newExpense.itemName,
                amount: parseFloat(newExpense.amount),
                date: new Date().toISOString(),
            };

            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to add expense");
            const created = await res.json();
            setExpenses((prev) => [...prev, created]);
            setNewExpense({ itemName: "", amount: "" });
        } catch (err) {
            console.error(err);
        }
    };

    // Delete an expense
    const handleDelete = async (id) => {
        if (status !== "authenticated") return;

        try {
            const res = await fetch(`/api/expenses/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: session.user.id }),
            });
            if (!res.ok) throw new Error("Failed to delete expense");
            setExpenses((prev) => prev.filter((e) => e._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading expenses...</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6">
            {/* Add Expense Form */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <input
                    type="text"
                    value={newExpense.itemName}
                    onChange={(e) =>
                        setNewExpense({ ...newExpense, itemName: e.target.value })
                    }
                    placeholder="Expense item"
                    className="p-2 border rounded-lg"
                />
                <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    placeholder="Amount"
                    className="p-2 border rounded-lg"
                />
                <button
                    onClick={handleAdd}
                    className="col-span-2 bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700"
                >
                    <FaPlus /> Add Expense
                </button>
            </div>

            {/* Expense Breakdown Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-6">Expense Breakdown</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={expenses}
                                dataKey="amount"
                                nameKey="itemName"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                            >
                                {expenses.map((entry, idx) => (
                                    <Cell key={idx} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Expense List */}
                <div className="space-y-4 mt-6">
                    {expenses.map((e) => (
                        <motion.div
                            key={e._id}
                            whileHover={{ x: 10 }}
                            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                        >
                            <div className="flex-1">
                                <p className="font-semibold">{e.itemName}</p>
                                <p className="text-gray-500">
                                    {new Date(e.date).toLocaleDateString()} — ${e.amount}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(e._id)}
                                className="text-gray-500 hover:text-red-600"
                            >
                                <FaTrash />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
