"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaShoppingCart,
  FaDollarSign,
  FaBell,
  FaList,
  FaWallet,
  FaCalendarCheck,
  FaPlusCircle,
} from "react-icons/fa";

import ListManager from "../components/ListManager";
import ExpenseTracker from "../components/ExpenseTracker";
import ReminderManager from "../components/ReminderManager";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [lists, setLists] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consolidated dashboard data
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setError("Please log in to view your dashboard.");
      setLoading(false);
      return;
    }

    async function loadDashboard() {
      try {
        const res = await fetch(`/api/dashboard?user=${session.user.id}`);
        if (!res.ok) throw new Error("Failed to load dashboard data");
        const { lists: L, expenses: E, reminders: R } = await res.json();
        setLists(L);
        setExpenses(E);
        setReminders(R);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [status, session?.user?.id]);

  if (loading) return <div className="p-6">Loading dashboard…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  // Compute overview stats
  const stats = [
    {
      title: "Active Lists",
      value: lists.length,
      icon: <FaList />,
      change: "+0",
    },
    {
      title: "Total Expenses",
      value: `$${expenses.reduce((sum, e) => sum + e.amount, 0)}`,
      icon: <FaWallet />,
      change: "+0%",
    },
    {
      title: "Pending Reminders",
      value: reminders.filter((r) => !r.isCompleted).length,
      icon: <FaBell />,
      change: "+0",
    },
    {
      title: "Completed Reminders",
      value: reminders.filter((r) => r.isCompleted).length,
      icon: <FaCalendarCheck />,
      change: "+0",
    },
  ];

  // Example monthly expense chart data (could be derived)
  const expenseData = [
    { name: "Jan", amount: 65 },
    { name: "Feb", amount: 130 },
    { name: "Mar", amount: 190 },
    { name: "Apr", amount: 210 },
    { name: "May", amount: 150 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
        animate={{ width: isSidebarOpen ? 256 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <FaShoppingCart className="text-emerald-600 text-xl" />
            <h2 className="text-xl font-bold text-emerald-600">
              ShopDashboard
            </h2>
          </div>
          <nav className="space-y-2">
            {["overview", "lists", "expenses", "reminders"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-emerald-100 text-emerald-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      <div className={`transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
                      {stat.icon}
                    </div>
                    <span className="text-gray-500">{stat.change}</span>
                  </div>
                  <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
                  <p className="text-gray-500">{stat.title}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts & Recent Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Expense Chart */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-xl font-bold mb-6">Monthly Expenses</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="amount"
                        fill="#059669"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recent Lists & Reminders */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-6">
                    Recent Shopping Lists
                  </h3>
                  <ListManager lists={lists.slice(0, 3)} readOnly />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-6">Upcoming Reminders</h3>

                  <ReminderManager
                    reminders={reminders.slice(0, 3)}
                    setReminders={() => {}}
                    readOnly
                  />
                </motion.div>
              </div>
            </div>
          </>
        )}

        {activeTab === "lists" && (
          <div className="p-6">
            <ListManager lists={lists} setLists={setLists} />
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="p-6">
            <ExpenseTracker expenses={expenses} setExpenses={setExpenses} />
          </div>
        )}

        {activeTab === "reminders" && (
          <div className="p-6">
            <ReminderManager
              reminders={reminders}
              setReminders={setReminders}
            />
          </div>
        )}

        {/* Quick Add FAB */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 bg-emerald-600 text-white p-4 rounded-full shadow-lg"
          onClick={() => setActiveTab("lists")}
        >
          <FaPlusCircle className="text-2xl" />
        </motion.button>
      </div>
    </div>
  );
}
