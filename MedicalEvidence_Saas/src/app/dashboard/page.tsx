"use client";

import { useState } from 'react'
import Link from 'next/link'
import { PlusCircle, FileText, Image as ImageIcon, LayoutTemplate, MessageSquare, Search, Bell, User, ArrowRight, Sparkles, X } from 'lucide-react'

export default function Dashboard() {
    const [evidenceItems, setEvidenceItems] = useState<any[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newId, setNewId] = useState('')
    const [language, setLanguage] = useState('ko')
    const [importing, setImporting] = useState(false)

    const handleImport = async () => {
        if (!newId) return;
        setImporting(true);

        const targetId = language === 'ko' && !newId.startsWith('ev_ko_') ? `ev_ko_${newId}` : newId;

        try {
            // Simulate API Call to our mock endpoint
            const response = await fetch('/api/evidence/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ evidence_id: targetId, lang: language })
            });
            const data = await response.json();

            // Add the new item to the local state
            setEvidenceItems(prev => [
                {
                    id: targetId, // Use the language-prepended ID so Studio sets default correctly
                    title: data.title,
                    type: targetId.startsWith('ev_ko') ? 'PMID (KO)' : 'PMID (EN)',
                    source: targetId,
                    date: new Date().toISOString().split('T')[0],
                    status: 'Complete'
                },
                ...prev
            ]);
            setIsModalOpen(false);
            setNewId('');
        } catch (error) {
            console.error(error);
            alert('Failed to import evidence. Please check the ID.');
        } finally {
            setImporting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight">Evidence<span className="text-blue-600">Flow</span></span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold transition-all">
                        <LayoutTemplate size={20} />
                        Overview
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                        <FileText size={20} />
                        My Library
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                        <ImageIcon size={20} />
                        Assets
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full w-full max-w-md">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="Search my research..." className="bg-transparent border-none focus:outline-none text-sm w-full font-sans" />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-slate-400 hover:text-slate-600 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                            <User size={18} />
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-6xl w-full mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Workspace</h1>
                            <p className="text-slate-500 font-sans mt-1">Manage and convert your medical evidence efficiently.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
                        >
                            <PlusCircle size={20} />
                            New Evidence
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="col-span-2 space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">Recent Library</h2>
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                                {evidenceItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
                                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                                            <FileText size={40} className="text-slate-300" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-lg">No evidence registered yet</h3>
                                        <p className="text-slate-400 font-sans mt-1 max-w-sm">Click the "New Evidence" button to start importing medical papers or PDFs.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
                                                <th className="px-6 py-4">Title & Type</th>
                                                <th className="px-6 py-4">Source</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {evidenceItems.map(item => (
                                                <tr key={item.id} className="hover:bg-slate-50/50 group transition-all">
                                                    <td className="px-6 py-5">
                                                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-all line-clamp-1">{item.title}</div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.type === 'PMID' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                                                {item.type}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400 font-sans">{item.date}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{item.source}</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <Link href={`/studio/${item.id}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all">
                                                            Studio
                                                            <ArrowRight size={14} />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">Information</h2>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Sparkles size={18} className="text-blue-600" />
                                    How to import
                                </h3>
                                <div className="space-y-4 text-sm text-slate-600 font-sans leading-relaxed">
                                    <p>1. Click <b>New Evidence</b> button.</p>
                                    <p>2. Enter a <b>PMID</b> or a <b>custom ID</b> starting with <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-600 font-bold tracking-tight">ev_ko</code> for Korean data.</p>
                                    <p>3. AI will instantly analyze and add it to your library.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Import Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Register New Evidence</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">출력 언어 (Output Language)</label>
                                <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                                    <button
                                        onClick={() => setLanguage('ko')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${language === 'ko' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >Korean (한국어)</button>
                                    <button
                                        onClick={() => setLanguage('en')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${language === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >English (영어)</button>
                                </div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Paper ID / PMID</label>
                                <input
                                    type="text"
                                    value={newId}
                                    onChange={(e) => setNewId(e.target.value)}
                                    placeholder="e.g., 40123456"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-sans"
                                />
                                <p className="mt-2 text-[11px] text-slate-400 font-sans italic">The content will be translated into {language === 'ko' ? 'Korean' : 'English'}.</p>
                            </div>
                            <button
                                onClick={handleImport}
                                disabled={importing || !newId}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {importing ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Analyzing...
                                    </span>
                                ) : (
                                    <>Import Evidence</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
