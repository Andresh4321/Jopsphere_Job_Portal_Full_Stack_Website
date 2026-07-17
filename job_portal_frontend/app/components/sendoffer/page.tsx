'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { offerAction } from '../../../lib/actions/offer.action';

interface Props {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  suggestedSalary?: number;
  onClose: () => void;
}

export default function SendOfferModal({ applicationId, candidateName, jobTitle, suggestedSalary, onClose }: Props) {
  const router = useRouter();

  const [salary, setSalary] = useState(suggestedSalary ? String(suggestedSalary) : '');
  const [startDate, setStartDate] = useState('');
  const [responseWindowDays, setResponseWindowDays] = useState('5');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const salaryNum = Number(salary);
    const windowNum = Number(responseWindowDays);

    if (Number.isNaN(salaryNum) || salaryNum <= 0) {
      setError('Please enter a valid monthly salary.');
      return;
    }
    if (!startDate) {
      setError('Please choose a start date.');
      return;
    }
    if (Number.isNaN(windowNum) || windowNum < 1) {
      setError('Response window must be at least 1 day.');
      return;
    }

    setSending(true);
    setError(null);

    const result = await offerAction.createOffer(applicationId, {
      salary: salaryNum,
      startDate,
      responseWindowDays: windowNum,
      message,
    });

    setSending(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push(`/Features/offer/offernegotiation/${result.data.id}`);
  };

  const deadlineText = (() => {
    if (!responseWindowDays || Number.isNaN(Number(responseWindowDays))) return null;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Number(responseWindowDays));
    return deadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  })();

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 text-xl"
        >
          ×
        </button>

        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded bg-[#F0ECFF] flex items-center justify-center text-[#6D4AFF] text-lg">✎</span>
          <h2 className="text-2xl font-bold text-neutral-900">Send offer</h2>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm">
          <span className="font-bold text-neutral-900">{candidateName}</span>
          <span className="text-neutral-400">·</span>
          <span className="font-bold text-neutral-900">{jobTitle}</span>
        </div>

        {error && (
          <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-5">
          <label className="block">
            <p className="text-sm font-bold text-neutral-900">Monthly salary (NPR)</p>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="130000"
              className="mt-2 h-10 w-full rounded border border-neutral-300 px-3 text-sm outline-none focus:border-[#6D4AFF]"
            />
          </label>
          <label className="block">
            <p className="text-sm font-bold text-neutral-900">Start date</p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2 h-10 w-full rounded border border-neutral-300 px-3 text-sm outline-none focus:border-[#6D4AFF]"
            />
          </label>
        </div>

        <label className="block mt-5">
          <p className="text-sm font-bold text-neutral-900">Response window (days)</p>
          <input
            type="number"
            min={1}
            value={responseWindowDays}
            onChange={(e) => setResponseWindowDays(e.target.value)}
            className="mt-2 h-10 w-full rounded border border-neutral-300 px-3 text-sm outline-none focus:border-[#6D4AFF]"
          />
          {deadlineText && (
            <p className="mt-2 text-xs text-neutral-500">Candidate must respond by {deadlineText}.</p>
          )}
        </label>

        <label className="block mt-5">
          <p className="text-sm font-bold text-neutral-900">Message to candidate</p>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="We're excited to have you join the team..."
            className="mt-2 w-full rounded border border-neutral-300 p-3 text-sm outline-none resize-none focus:border-[#6D4AFF]"
          />
        </label>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-6 rounded border border-neutral-300 text-sm font-bold text-neutral-900 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="h-10 px-6 rounded bg-[#6D4AFF] text-sm font-bold text-white hover:bg-[#5F3CF0] disabled:opacity-60"
          >
            {sending ? 'Sending...' : '✉ Send offer'}
          </button>
        </div>
      </div>
    </div>
  );
}