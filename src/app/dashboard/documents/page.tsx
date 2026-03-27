'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDocuments } from '@/context/DocumentContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  DocumentCategory,
  DocumentStatus,
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUSES,
} from '@/types/documents';

type FilterCategory = 'all' | DocumentCategory;

const defaultForm = {
  name: '',
  category: 'essay' as DocumentCategory,
  status: 'draft' as DocumentStatus,
  notes: '',
  college: '',
};

export default function DocumentsPage() {
  const { documents, addDocument, updateDocument, removeDocument, isLoaded } = useDocuments();

  const [filter, setFilter] = useState<FilterCategory>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Loading skeleton
  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 skeleton-shimmer rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Stats
  const totalCount = documents.length;
  const completedCount = documents.filter(d => d.status === 'complete').length;
  const submittedCount = documents.filter(d => d.status === 'submitted').length;
  const inProgressCount = documents.filter(d => d.status === 'in_progress').length;

  // Filtered documents
  const filtered = filter === 'all' ? documents : documents.filter(d => d.category === filter);

  // Group by category
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, doc) => {
    const key = doc.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {});

  function handleSave() {
    if (!form.name.trim()) return;
    addDocument({
      name: form.name.trim(),
      category: form.category,
      status: form.status,
      notes: form.notes.trim(),
      college: form.college.trim() || undefined,
    });
    setForm(defaultForm);
    setShowForm(false);
  }

  function startEdit(doc: typeof documents[0]) {
    setEditingId(doc.id);
    setEditForm({
      name: doc.name,
      category: doc.category,
      status: doc.status,
      notes: doc.notes,
      college: doc.college || '',
    });
  }

  function saveEdit() {
    if (!editingId || !editForm.name.trim()) return;
    updateDocument(editingId, {
      name: editForm.name.trim(),
      category: editForm.category,
      status: editForm.status,
      notes: editForm.notes.trim(),
      college: editForm.college.trim() || undefined,
    });
    setEditingId(null);
  }

  function handleDelete(id: string) {
    removeDocument(id);
    setDeleteConfirm(null);
  }

  const categoryEntries = Object.entries(DOCUMENT_CATEGORIES) as [DocumentCategory, { label: string; emoji: string }][];

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📁</span> Document Vault
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep all your application documents organized in one place
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            &larr; Dashboard
          </Button>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="!p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Documents</p>
        </Card>
        <Card className="!p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {completedCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
        </Card>
        <Card className="!p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            {submittedCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
        </Card>
        <Card className="!p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            {inProgressCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0',
            filter === 'all'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          )}
        >
          All
        </button>
        {categoryEntries.map(([key, { label, emoji }]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0',
              filter === key
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Add Document Toggle */}
      <div>
        <Button
          variant={showForm ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Document'}
        </Button>

        {showForm && (
          <Card className="mt-4 animate-slide-down-fade">
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Common App Personal Essay"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categoryEntries.map(([key, { label, emoji }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: key }))}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        form.category === key
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-300 dark:ring-emerald-700'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      )}
                    >
                      {emoji} {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(DOCUMENT_STATUSES) as [DocumentStatus, { label: string; color: string }][]).map(([key, { label }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, status: key }))}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        form.status === key
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-300 dark:ring-emerald-700'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* College (optional) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">College (optional)</label>
                <input
                  type="text"
                  value={form.college}
                  onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                  placeholder="e.g. MIT"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="primary" size="sm" onClick={handleSave} disabled={!form.name.trim()}>
                  Save Document
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setForm(defaultForm); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Document List */}
      {filtered.length > 0 ? (
        Object.entries(grouped).map(([category, docs]) => {
          const cat = DOCUMENT_CATEGORIES[category as DocumentCategory];
          return (
            <section key={category}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {cat.emoji} {cat.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="animate-slide-up-fade"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {editingId === doc.id ? (
                      /* Inline Edit Form */
                      <Card className="space-y-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {(Object.entries(DOCUMENT_STATUSES) as [DocumentStatus, { label: string; color: string }][]).map(([key, { label }]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setEditForm(f => ({ ...f, status: key }))}
                              className={cn(
                                'px-2 py-1 rounded-md text-xs font-medium transition-colors',
                                editForm.status === key
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-300 dark:ring-emerald-700'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={editForm.college}
                          onChange={e => setEditForm(f => ({ ...f, college: e.target.value }))}
                          placeholder="College (optional)"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                        />
                        <textarea
                          value={editForm.notes}
                          onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                          placeholder="Notes..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none"
                        />
                        <div className="flex gap-2">
                          <Button variant="primary" size="sm" onClick={saveEdit} disabled={!editForm.name.trim()}>
                            Save
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      /* Document Card */
                      <Card hover>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                              {cat.emoji} {doc.name}
                            </h3>
                            <span className={cn(
                              'shrink-0 px-2 py-0.5 rounded-full text-xs font-medium',
                              DOCUMENT_STATUSES[doc.status].color
                            )}>
                              {DOCUMENT_STATUSES[doc.status].label}
                            </span>
                          </div>

                          {doc.college && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              🎓 {doc.college}
                            </p>
                          )}

                          {doc.notes && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                              {doc.notes}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Added {new Date(doc.addedAt).toLocaleDateString()}
                            </p>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => startEdit(doc)} className="!px-2 !py-1 text-xs">
                                Edit
                              </Button>
                              {deleteConfirm === doc.id ? (
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)} className="!px-2 !py-1 text-xs text-red-600 dark:text-red-400">
                                    Confirm
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)} className="!px-2 !py-1 text-xs">
                                    No
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(doc.id)} className="!px-2 !py-1 text-xs text-red-500">
                                  Delete
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })
      ) : (
        /* Empty State */
        <div className="text-center py-16 animate-fade-in">
          <div className="text-5xl mb-4">📂</div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No documents yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
            Start tracking your transcripts, essays, recommendations, and other application documents. Stay organized and never miss a deadline.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            + Add Your First Document
          </Button>
        </div>
      )}
    </div>
  );
}
