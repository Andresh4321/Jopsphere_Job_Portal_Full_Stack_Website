'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { offerAction } from '../../../../lib/actions/offer.action';
import { authAction } from '../../../../lib/actions/auth.action';
import { getSocket, disconnectSocket } from '../../../../lib/utils/socket';
import { Offer, OfferMessage } from '../../../../lib/types/offer.types';
import AppHeader from '../../../components/appheader';

export default function OfferNegotiationPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.offerId as string;

  const role = authAction.getStoredRole(); // 'job_seeker' | 'employer'
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [offer, setOffer] = useState<Offer | null>(null);
  const [messages, setMessages] = useState<OfferMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState('');
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

  // Real-time updates
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSendingMessage(true);
    const result = await offerAction.sendMessage(offerId, newMessage.trim());
    setSendingMessage(false);
    if (result.success) setNewMessage('');
  };

  const handleProposeSalary = async () => {
    const salary = Number(proposedSalary);
    if (Number.isNaN(salary) || salary <= 0) {
      setError('Please enter a valid salary.');
      return;
    }
    setProposingSalary(true);
    const result = await offerAction.proposeSalary(offerId, salary);
    setProposingSalary(false);
    if (!result.success) setError(result.message);
  };

  const handleAgree = async () => {
    setAgreeing(true);
    const result = await offerAction.agree(offerId);
    setAgreeing(false);
    if (!result.success) setError(result.message);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-sm text-neutral-500">Loading offer...</p>
      </main>
    );
  }

  if (error && !offer) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4">
        <p className="font-bold text-neutral-900">{error}</p>
        <button onClick={() => router.back()} className="text-sm font-bold text-[#6D4AFF]">← Go back</button>
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

      <section className="max-w-[1000px] mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="text-sm font-bold text-neutral-500 hover:text-neutral-900">
          ← Back
        </button>

        {(isHired || justHired) && (
          <div className="mt-6 rounded-lg bg-[#EAF8F0] border border-emerald-200 px-6 py-5 text-center">
            <p className="text-2xl font-bold text-[#148A50]">🎉 Hired!</p>
            <p className="mt-1 text-sm text-[#148A50]">
              Both parties agreed on NPR {offer.agreedSalary?.toLocaleString('en-IN')}/mo. This has been recorded across the platform.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Chat */}
          <div className="bg-white border border-neutral-200 rounded-lg flex flex-col h-[520px]">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="font-bold text-neutral-900">Negotiation chat</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center mt-10">
                  No messages yet — say hello and discuss the offer.
                </p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderRole === role;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                          isMe ? 'bg-[#6D4AFF] text-white' : 'bg-neutral-100 text-neutral-900'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {!isHired && (
              <div className="p-4 border-t border-neutral-200 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 h-10 px-4 rounded border border-neutral-200 text-sm outline-none focus:border-[#6D4AFF]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage}
                  className="h-10 px-5 rounded bg-[#6D4AFF] text-white text-sm font-bold disabled:opacity-60"
                >
                  Send
                </button>
              </div>
            )}
          </div>

          {/* Offer details + agreement */}
          <aside className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <h3 className="font-bold text-neutral-900">Offer letter</h3>
              <a
                href={offer.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center h-10 rounded border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
              >
                📄 View PDF
              </a>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Start date</span>
                  <span className="font-bold">{new Date(offer.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Response window</span>
                  <span className="font-bold">{offer.responseWindowDays} days</span>
                </div>
              </div>
            </div>

            {!isHired && (
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <h3 className="font-bold text-neutral-900">Salary</h3>
                <div className="mt-4 flex gap-2">
                  <input
                    type="number"
                    value={proposedSalary}
                    onChange={(e) => setProposedSalary(e.target.value)}
                    className="flex-1 h-10 px-3 rounded border border-neutral-200 text-sm outline-none focus:border-[#6D4AFF]"
                  />
                  <button
                    onClick={handleProposeSalary}
                    disabled={proposingSalary || Number(proposedSalary) === offer.salary}
                    className="h-10 px-4 rounded border border-neutral-200 text-sm font-medium disabled:opacity-50"
                  >
                    Propose
                  </button>
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Current: NPR {offer.salary.toLocaleString('en-IN')}/mo
                </p>

                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">You</span>
                    <span className={myAgreed ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>
                      {myAgreed ? '✓ Agreed' : 'Not yet'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">{role === 'employer' ? 'Candidate' : 'Employer'}</span>
                    <span className={theirAgreed ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>
                      {theirAgreed ? '✓ Agreed' : 'Not yet'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAgree}
                  disabled={agreeing || myAgreed}
                  className="mt-5 h-10 w-full rounded bg-[#6D4AFF] text-white text-sm font-bold disabled:opacity-60"
                >
                  {myAgreed ? 'Waiting for the other side...' : `Agree to NPR ${offer.salary.toLocaleString('en-IN')}/mo`}
                </button>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}