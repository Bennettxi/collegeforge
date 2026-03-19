'use client';

import { useState, useMemo } from 'react';
import { TimelineProvider, useTimeline } from '@/context/TimelineContext';
import { TimelineEvent, CATEGORY_CONFIG } from '@/types/timeline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(event: TimelineEvent): boolean {
  if (event.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date + 'T00:00:00');
  return eventDate < today;
}

const CATEGORY_OPTIONS = [
  { value: 'deadline', label: 'Deadline' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'task', label: 'Task' },
];

function AddEventForm({ onClose }: { onClose: () => void }) {
  const { addEvent } = useTimeline();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<TimelineEvent['category']>('deadline');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }
    setError('');
    addEvent({
      title: title.trim(),
      date,
      category,
      completed: false,
      notes: notes.trim() || undefined,
    });
    onClose();
  }

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">New Event</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Title"
            placeholder="e.g. Common App submission"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={e => setCategory(e.target.value as TimelineEvent['category'])}
          />
          <Input
            label="Notes (optional)"
            placeholder="Any extra details..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" size="sm">Add Event</Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

function TimelineEventItem({ event }: { event: TimelineEvent }) {
  const { toggleComplete, removeEvent } = useTimeline();
  const config = CATEGORY_CONFIG[event.category];
  const overdue = isOverdue(event);

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0 group">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200 group-last:hidden" />

      {/* Dot indicator */}
      <div
        className={cn(
          'relative z-10 mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
          event.completed
            ? 'bg-emerald-500 border-emerald-500'
            : overdue
              ? 'bg-white border-red-400'
              : 'bg-white border-gray-300'
        )}
      >
        {event.completed && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex-1 rounded-xl border p-4 transition-colors',
          event.completed
            ? 'bg-gray-50 border-gray-100'
            : overdue
              ? 'bg-red-50 border-red-200'
              : 'bg-white border-gray-200'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-medium text-gray-500">
                {formatDate(event.date)}
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                  event.category === 'deadline' && 'bg-red-100 text-red-700',
                  event.category === 'milestone' && 'bg-emerald-100 text-emerald-700',
                  event.category === 'task' && 'bg-blue-100 text-blue-700'
                )}
              >
                {config.emoji} {config.label}
              </span>
              {overdue && (
                <span className="text-xs font-semibold text-red-600">Overdue</span>
              )}
            </div>
            <p
              className={cn(
                'text-sm font-medium',
                event.completed
                  ? 'text-gray-400 line-through'
                  : overdue
                    ? 'text-red-800'
                    : 'text-gray-900'
              )}
            >
              {event.title}
            </p>
            {event.notes && (
              <p className={cn(
                'text-xs mt-1',
                event.completed ? 'text-gray-400' : 'text-gray-500'
              )}>
                {event.notes}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => toggleComplete(event.id)}
              className={cn(
                'text-xs font-medium px-2 py-1 rounded-lg transition-colors',
                event.completed
                  ? 'text-gray-500 hover:bg-gray-200'
                  : 'text-emerald-600 hover:bg-emerald-50'
              )}
              title={event.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {event.completed ? 'Undo' : 'Done'}
            </button>
            <button
              onClick={() => removeEvent(event.id)}
              className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
              title="Remove event"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineContent() {
  const { events } = useTimeline();
  const [showForm, setShowForm] = useState(false);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      // Sort by date ascending (nearest first)
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      // Tie-break: incomplete before completed
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return 0;
    });
  }, [events]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Timeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your deadlines, milestones, and tasks
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(prev => !prev)}
        >
          {showForm ? 'Close' : 'Add Event'}
        </Button>
      </div>

      {/* Add Event Form */}
      {showForm && <AddEventForm onClose={() => setShowForm(false)} />}

      {/* Event List */}
      {sortedEvents.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-gray-500 text-sm">
            No events yet &mdash; add your first deadline!
          </p>
        </Card>
      ) : (
        <div className="pl-1">
          {sortedEvents.map(event => (
            <TimelineEventItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TimelinePage() {
  return (
    <TimelineProvider>
      <TimelineContent />
    </TimelineProvider>
  );
}
