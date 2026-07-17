'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { offerAction } from '../../../../../lib/actions/offer.action';
import { authAction } from '../../../../../lib/actions/auth.action';
import { getSocket, disconnectSocket } from '../../../../../lib/utils/socket';
import { getBackendImageUrl } from '../../../../../lib/utils/image-url';
import { Offer, OfferMessage } from '../../../../../lib/types/offer.types';
import AppHeader from '../../../../components/appheader';
import { ROUTES } from '../../../../../lib/route';

export default function OfferNegotiationPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.offerId as string;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<'job_seeker' | 'employer' | null>(null);
  useEffect(() => {
    setRole(authAction.getStoredRole());
  }, []);

  const [offer, setOffer] = useState<Offer | null>(null);
  const [messages, setMessages] = useState<OfferMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [proposedSalary, setProposedSalary] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [proposingSalary, setProposingSalary] = useState(false);
  const [agreeing, setAgreeing] = useState(false);
  const [justHired, setJustHired] = useState(false);

  // Initial load
  useEffect(() => {
    if (!offerId) return;
    (async () => {
      const [offerResult, messagesResult] = await Promise.all([
        offerAction.getOfferById(offerId),
        offerAction.getMessages(offerId),
      ]);

      if (offerResult.success) {
        setOffer(offerResult.data);
        setProposedSalary(String(offerResult.data.salary));
      } else {
        setError(offerResult.message);
      }
      if (messagesResult.success) setMessages(messagesResult.data);

      setLoading(false);
    })();
  }, [offerId]);

  // Real-time updates via socket.io
  useEffect(() => {
    if (!offerId) return;
    const socket = getSocket();
    socket.emit('join_offer', offerId);

    socket.on('message:new', (msg: OfferMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('offer:updated', (updated: Offer) => {
      setOffer(updated);
      setProposedSalary(String(updated.salary));
    });

    socket.on('agreement:updated', (updated: Offer & { justHired: boolean }) => {
      setOffer(updated);
      if (updated.justHired) setJustHired(true);
    });

    return () => {
      socket.emit('leave_offer', offerId);
      socket.off('message:new');
      socket.off('offer:updated');
      socket.off('agreement:updated');
    };
  }, [offerId]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => { disconnectSocket(); };
  }, []);

  // Send message handler
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachment) return;
    setSendingMessage(true);
    setError(null);
    const result = await offerAction.sendMessage(offerId, newMessage.trim(), attachment ?? undefined);
    setSendingMessage(false);
    if (result.success) {
      // If socket delivers it, great. If not (no socket), add it locally.
      setMessages((prev) => {
        const exists = prev.find((m) => m.id === result.data.id);
        if (exists) return prev;
        return [...prev, result.data];
      });
      setNewMessage('');
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setError(result.message);
    }
  };

  // Propose salary handler
  const handleProposeSalary = async () => {
    const salary = Number(proposedSalary);
    if (Number.isNaN(salary) || salary <= 0) {
      setError('Please enter a valid salary.');
      return;
    }
    setProposingSalary(true);
    setError(null);
    const result = await offerAction.proposeSalary(offerId, salary);
    setProposingSalary(false);
    if (result.success) {
      setOffer(result.data);
    } else {
      setError(result.message);
    }
  };

  // Agree handler
  const handleAgree = async () => {
    setAgreeing(true);
    setError(null);
    const result = await offerAction.agree(offerId);
    setAgreeing(false);
    if (result.success) {
      setOffer(result.data);
      if (result.data.justHired) {
        setJustHired(true);
      }
    } else {
      setError(result.message);
    }
  };

  // Redirect to dashboard after hired
  const handleGoToDashboard = () => {
    if (role === 'employer') {
      router.push(ROUTES.employerDashboard);
    } else {
      router.push(ROUTES.seekerDashboard);
    }
  };

  // Resolve attachment URL (backend path → full URL)
  const resolveUrl = (path?: string) => {
    if (!path) return '';
    return getBackendImageUrl(path);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <AppHeader portal={role === 'employer' ? 'employer' : 'seeker'} />
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#6D4AFF] border-t-transparent animate-spin" />
            <p className="text-sm text-neutral-500">Loading offer...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !offer) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <AppHeader portal={role === 'employer' ? 'employer' : 'seeker'} />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="font-bold text-neutral-900">{error}</p>
          <button onClick={() => router.back()} className="text-sm font-bold text-[#6D4AFF]">← Go back</button>
        </div>
      </main>
    );
  }

  if (!offer) return null;

  const myAgreed = role === 'employer' ? offer.employerAgreed : offer.seekerAgreed;
  const theirAgreed = role === 'employer' ? offer.seekerAgreed : offer.employerAgreed;
  const isHired = offer.status === 'accepted';

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-neutral-900">
      <AppHeader portal={role === 'employer' ? 'employer' : 'seeker'} />

      <section className="max-w-[1060px] mx-auto px-6 py-8 lg:px-10">
        <button
          onClick={() => router.back()}
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          ← Back
        </button>

        {/* Hired celebration banner */}
        {(isHired || justHired) && (
          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 px-6 py-6 text-center">
            <p className="text-2xl font-bold text-emerald-700">Hired!</p>
            <p className="mt-2 text-sm text-emerald-600">
              Both parties agreed on NPR {offer.agreedSalary?.toLocaleString('en-IN')}/mo. This has been recorded across the platform.
            </p>
            <button
              onClick={handleGoToDashboard}
              className="mt-4 h-10 px-6 rounded-xl bg-[#6D4AFF] text-sm font-bold text-white hover:brightness-95 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Chat panel */}
          <div className="rounded-2xl border border-neutral-200 bg-white flex flex-col h-[540px]">
            <div className="px-6 py-4 border-b border-neutral-100">
              <h2 className="text-base font-bold text-neutral-900">Negotiation Chat</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Discuss terms, share documents, and finalize the offer.</p>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-sm text-neutral-400">No messages yet — say hello and discuss the offer.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderRole === role;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          isMe
                            ? 'bg-[#6D4AFF] text-white rounded-br-md'
                            : 'bg-neutral-100 text-neutral-900 rounded-bl-md'
                        }`}
                      >
                        {/* Attachment rendering */}
                        {msg.attachmentPath && msg.attachmentType === 'image' && (
                          <a href={resolveUrl(msg.attachmentPath)} target="_blank" rel="noopener noreferrer">
                            <img
                              src={resolveUrl(msg.attachmentPath)}
                              alt={msg.attachmentName || 'Attachment'}
                              className="max-w-[220px] rounded-lg mb-1.5 cursor-pointer hover:opacity-90"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </a>
                        )}
                        {msg.attachmentPath && msg.attachmentType !== 'image' && (
                          <a
                            href={resolveUrl(msg.attachmentPath)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 mb-1.5 text-sm underline ${
                              isMe ? 'text-white/90' : 'text-[#6D4AFF]'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            {msg.attachmentName || 'Attachment'}
                          </a>
                        )}
                        {msg.message && <p>{msg.message}</p>}
                        <p className={`text-[10px] mt-1 ${isMe ? 'text-white/50' : 'text-neutral-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            {!isHired && (
              <div className="p-4 border-t border-neutral-100">
                {attachment && (
                  <div className="mb-2 flex items-center justify-between rounded-lg bg-neutral-50 border border-neutral-200 px-3 py-2 text-xs text-neutral-700">
                    <span className="truncate">
                      <svg className="w-3.5 h-3.5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      {attachment.name}
                    </span>
                    <button
                      onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="ml-2 text-neutral-400 hover:text-neutral-900 text-base leading-none"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                    className="h-10 w-10 flex-shrink-0 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    placeholder="Type a message..."
                    className="flex-1 h-10 px-4 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || (!newMessage.trim() && !attachment)}
                    className="h-10 px-5 rounded-xl bg-[#6D4AFF] text-white text-sm font-bold hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMessage ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Offer details + agreement */}
          <aside className="space-y-5">
            {/* Offer letter card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-sm font-bold text-neutral-900">Offer Letter</h3>
              <a
                href={resolveUrl(offer.pdfPath)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 h-10 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
                View PDF
              </a>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Start date</span>
                  <span className="font-medium text-neutral-900">{new Date(offer.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Response window</span>
                  <span className="font-medium text-neutral-900">{offer.responseWindowDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status</span>
                  <span className={`font-medium capitalize ${
                    offer.status === 'accepted' ? 'text-emerald-600' :
                    offer.status === 'declined' ? 'text-red-600' : 'text-[#6D4AFF]'
                  }`}>{offer.status}</span>
                </div>
              </div>
            </div>

            {/* Salary negotiation card */}
            {!isHired && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <h3 className="text-sm font-bold text-neutral-900">Salary Negotiation</h3>
                <p className="mt-1 text-xs text-neutral-400">
                  Current: NPR {offer.salary.toLocaleString('en-IN')}/mo
                </p>

                <div className="mt-4 flex gap-2">
                  <input
                    type="number"
                    value={proposedSalary}
                    onChange={(e) => setProposedSalary(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                  <button
                    onClick={handleProposeSalary}
                    disabled={proposingSalary || Number(proposedSalary) === offer.salary}
                    className="h-10 px-4 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {proposingSalary ? '...' : 'Propose'}
                  </button>
                </div>

                {/* Agreement status */}
                <div className="mt-5 space-y-2.5">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Agreement Status</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">You</span>
                    <span className={myAgreed ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>
                      {myAgreed ? '✓ Agreed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">{role === 'employer' ? 'Candidate' : 'Employer'}</span>
                    <span className={theirAgreed ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>
                      {theirAgreed ? '✓ Agreed' : 'Pending'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAgree}
                  disabled={agreeing || myAgreed}
                  className="mt-5 h-10 w-full rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] text-white text-sm font-bold shadow-[0_4px_12px_rgba(109,74,255,0.25)] hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {agreeing
                    ? 'Processing...'
                    : myAgreed
                    ? 'Waiting for the other side...'
                    : `Agree to NPR ${offer.salary.toLocaleString('en-IN')}/mo`}
                </button>
              </div>
            )}

            {/* After hired — show dashboard link */}
            {isHired && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <p className="text-sm font-bold text-emerald-700">Deal finalized</p>
                <p className="mt-1 text-xs text-emerald-600">
                  Agreed salary: NPR {offer.agreedSalary?.toLocaleString('en-IN')}/mo
                </p>
                <button
                  onClick={handleGoToDashboard}
                  className="mt-4 h-9 w-full rounded-xl border border-emerald-200 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
