"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Editing state
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">("medium");

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Expanded task descriptions
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<number, boolean>>({});

  async function loadTasks() {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.post("/tasks", {
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        priority: priority,
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      loadTasks();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  }

  async function toggleComplete(task: Task) {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
        priority: task.priority,
      });
      loadTasks();
    } catch (err) {
      console.error("Error toggling completion:", err);
    }
  }

  async function startEdit(task: Task) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority || "medium");
  }

  async function saveEdit(id: number, currentCompleted: boolean) {
    if (!editTitle.trim()) return;
    try {
      await api.put(`/tasks/${id}`, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        completed: currentCompleted,
        priority: editPriority,
      });
      setEditingTaskId(null);
      loadTasks();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  }

  async function deleteTask(id: number) {
    try {
      await api.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

  function toggleExpand(id: number) {
    setExpandedTaskIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Filter and Search logic
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesPriority && matchesSearch;
  });

  // Task statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const highPriorityCount = tasks.filter((t) => !t.completed && t.priority === "high").length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none -z-10" />

      {/* Sidebar Shell */}
      <aside className="w-full md:w-80 bg-slate-900/40 border-b md:border-b-0 md:border-r border-slate-800/60 backdrop-blur-xl p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 border border-indigo-500/30">
              <svg className="w-5 h-5 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-100">FlowTask</span>
              <span className="block text-[10px] text-indigo-400 font-mono tracking-wider uppercase font-semibold">Focused Console v1.1</span>
            </div>
          </div>

          {/* Quick Metrics Progress Donut */}
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-slate-800" strokeWidth="4" fill="transparent" />
                <circle cx="32" cy="32" r="28" className="stroke-indigo-500 transition-all duration-700 ease-out" strokeWidth="4" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * percentComplete) / 100} strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold text-slate-200">{percentComplete}%</span>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 block">Performance</span>
              <span className="text-base font-bold text-slate-100 mt-0.5 block">{completedCount} of {totalCount} Done</span>
              {highPriorityCount > 0 && (
                <span className="text-[10px] text-amber-500 font-semibold mt-0.5 block flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                  {highPriorityCount} urgent items left
                </span>
              )}
            </div>
          </div>

          {/* Navigation Filter Lists */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block px-3 mb-2">Filters</span>
            {[
              { id: "all", label: "All Tasks", count: totalCount, icon: "M4 6h16M4 12h16M4 18h7" },
              { id: "active", label: "In Progress", count: activeCount, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { id: "completed", label: "Completed", count: completedCount, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer ${filter === item.id
                    ? "bg-slate-800/80 text-indigo-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 transition-colors ${filter === item.id ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-355"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${filter === item.id ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-900/60 text-slate-500"}`}>
                  {item.count}
                </span>
              </button>
            ))}
          </nav>

          {/* Priority Filters */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block px-3 mb-2">Priority levels</span>
            {[
              { id: "all", label: "All Priorities", color: "bg-slate-500" },
              { id: "high", label: "High Priority", color: "bg-rose-500" },
              { id: "medium", label: "Medium Priority", color: "bg-amber-500" },
              { id: "low", label: "Low Priority", color: "bg-emerald-500" }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPriorityFilter(p.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${priorityFilter === p.id
                    ? "bg-slate-800/80 text-indigo-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${p.color} shrink-0`} />
                  <span>{p.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-800/60 text-[11px] text-slate-500 flex flex-col gap-1">
          <p>© 2026 FlowTask Workspace</p>
          <p className="font-mono">Press Esc to discard edits</p>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Search / Filter Navbar */}
        <header className="h-16 border-b border-slate-850 px-6 flex items-center justify-between gap-4 backdrop-blur-md bg-slate-950/60 shrink-0">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4.5 w-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Quick search console..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 bg-slate-900/40 border border-slate-800/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-200 placeholder-slate-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="font-mono text-[10px]">CONSOLE ONLINE</span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-4xl w-full mx-auto">
          {/* Quick Create Task Command Bar */}
          <section className="bg-slate-900/40 border border-slate-850 rounded-2xl p-4 md:p-5 backdrop-blur-md shadow-xl shadow-black/20">
            <form onSubmit={createTask} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-200 placeholder-slate-500 text-sm transition-all"
                    required
                  />
                </div>
                <div className="w-full md:w-48 shrink-0">
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-300 appearance-none cursor-pointer"
                    >
                      <option value="low">Priority: Low</option>
                      <option value="medium">Priority: Medium</option>
                      <option value="high">Priority: High</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Add details / description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-transparent border-b border-transparent hover:border-slate-800 focus:border-slate-700 focus:outline-none text-xs text-slate-400 placeholder-slate-600 transition-all"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono hidden md:inline-flex items-center gap-1">
                    Press <kbd className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-slate-400">Enter</kbd> to save
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 active:scale-[0.98] text-slate-100 text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-900/10 cursor-pointer flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Task
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Task Feed */}
          <section className="space-y-4">
            {isLoading ? (
              /* Shimmering Pulse Loader */
              <div className="grid grid-cols-1 gap-3 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-slate-900/30 border border-slate-850 rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-6 h-6 bg-slate-800 rounded-full flex-shrink-0" />
                    <div className="flex-grow space-y-3">
                      <div className="h-4.5 bg-slate-800 rounded w-1/3" />
                      <div className="h-3 bg-slate-800 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              /* Premium Vector Empty State */
              <div className="bg-slate-900/20 border border-dashed border-slate-800/80 rounded-2xl py-16 px-4 text-center">
                <svg className="w-20 h-20 text-slate-700/60 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="text-slate-350 font-bold text-base">No tasks match selected view</p>
                <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">Create a task with the console bar above or update your filter query.</p>
              </div>
            ) : (
              /* Task List Grid */
              <div className="grid grid-cols-1 gap-3">
                {filteredTasks.map((task) => {
                  const isEditing = editingTaskId === task.id;
                  const isExpanded = !!expandedTaskIds[task.id];

                  // Color mapping for priority indicators
                  const priorityColors = {
                    high: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
                    medium: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
                    low: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
                  }[task.priority || "medium"];

                  return (
                    <div
                      key={task.id}
                      className={`group bg-slate-900/40 border rounded-2xl p-4 md:p-5 backdrop-blur-sm transition-all duration-300 flex flex-col gap-3 ${task.completed
                          ? "border-slate-950 opacity-60 hover:opacity-80"
                          : "border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/50 hover:shadow-lg hover:shadow-black/20"
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox Toggle Button */}
                        <button
                          onClick={() => toggleComplete(task)}
                          className="mt-0.5 flex-shrink-0 focus:outline-none cursor-pointer"
                        >
                          {task.completed ? (
                            <div className="w-5.5 h-5.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-90 shadow-md shadow-indigo-500/20">
                              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-5.5 h-5.5 border border-slate-700 hover:border-indigo-400 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-90 bg-slate-950" />
                          )}
                        </button>

                        {/* Middle Content Section */}
                        <div className="flex-grow min-w-0">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 text-sm"
                                  required
                                  autoFocus
                                />
                                <select
                                  value={editPriority}
                                  onChange={(e) => setEditPriority(e.target.value as any)}
                                  className="px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs text-slate-350"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>
                              </div>
                              <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-300 text-xs"
                                placeholder="Edit description..."
                              />
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => saveEdit(task.id, task.completed)}
                                  className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-600 active:scale-95 text-slate-100 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingTaskId(null)}
                                  className="px-3.5 py-1.5 bg-slate-850 hover:bg-slate-800 active:scale-95 text-slate-300 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <h3 className={`text-base font-bold tracking-tight truncate ${task.completed ? "text-slate-500 line-through decoration-slate-600" : "text-slate-150"}`}>
                                  {task.title}
                                </h3>

                                {/* Priority indicator pill */}
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border}`}>
                                  {task.priority || "medium"}
                                </span>
                              </div>

                              {/* Toggle descriptions arrow */}
                              {task.description && (
                                <button
                                  onClick={() => toggleExpand(task.id)}
                                  className="mt-2 text-xs text-slate-500 hover:text-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <svg className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                  {isExpanded ? "Collapse details" : "Expand details"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Hover Action controls */}
                        {!isEditing && (
                          <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => startEdit(task)}
                              className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-slate-800/40 rounded-lg transition-all cursor-pointer"
                              title="Edit Task"
                            >
                              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800/40 rounded-lg transition-all cursor-pointer"
                              title="Delete Task"
                            >
                              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Expandable description body */}
                      {isExpanded && !isEditing && task.description && (
                        <div className="pl-9.5 pr-2 pt-1 pb-2 border-t border-slate-850/60 mt-1 transition-all duration-200">
                          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${task.completed ? "text-slate-600 line-through" : "text-slate-400"}`}>
                            {task.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}