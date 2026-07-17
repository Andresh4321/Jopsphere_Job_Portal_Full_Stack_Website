'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { offerAction } from '../../../lib/actions/offer.action';
import { authAction } from '../../../lib/actions/auth.action';
import { Conversation } from '../../../lib/types/offer.types';
import AppHeader from '../../components/appheader';
import { ROUTES } from '../../../lib/route';

const formatTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-neutral-100 text-neutral-600',
  negotiating: 'bg-amber-100 text-amber-800',
  accepted: 'bg-emerald-100 text-emerald-700',
  declined: 'bg-red-100 text-red-700',
};

export default function MessagesListPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'job_seeker' | 'employer' | null>(null);

  useEffect(() => {
    setRole(authAction.getStoredRole());
    (async () => {
      const result = await offerAction.getMyConversations();
      if (result.success) setConversations(result.data);
      else setError(result.message);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <AppHeader portal={role === 'employer' ? 'employer' : 'seeker'} />

      <section className="max-w-[800px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-neutral-900">Messages</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Conversations start once an offer has been made — negotiate salary and start date here.
        </p>

        {error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-lg border border-neutral-200 bg-white animate-pulse" />
            ))
          ) : conversations.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-white px-8 py-16 text-center">
              <p className="text-base font-bold text-neutral-900">No conversations yet</p>
              <p className="mt-2 text-sm text-neutral-500">
                {role === 'employer'
                  ? 'Send an offer to a candidate to start a conversation.'
                  : "Once an employer sends you an offer, you'll be able to chat with them here."}
              </p>
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.offerId}
                onClick={() => router.push(ROUTES.offerNegotiation(c.offerId))}
                className="w-full text-left flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-5 hover:border-[#6D4AFF] transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-[#F0ECFF] flex items-center justify-center text-[#6D4AFF] font-bold flex-shrink-0">
                  {c.counterpartName[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-neutral-900 truncate">{c.counterpartName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLES[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">{c.jobTitle}</p>
                  {c.lastMessage && (
                    <p className="text-sm text-neutral-600 mt-1 truncate">
                      {c.lastMessage.hasAttachment && '📎 '}
                      {c.lastMessage.text || 'Attachment'}
                    </p>
                  )}
                </div>
                {c.lastMessage && (
                  <span className="text-xs text-neutral-400 flex-shrink-0">
                    {formatTime(c.lastMessage.createdAt)}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </section>
    </main>
  );
}