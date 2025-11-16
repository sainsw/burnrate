"use client";

import { useEffect, useMemo, useState } from "react";
import { SessionIntakeForm } from "@/components/session-intake-form";
import { useCostTicker } from "@/hooks/use-cost-ticker";
import { useSessionStore } from "@/state/session-store";
import { useTimerStore } from "@/state/timer-store";
import { formatDuration } from "@/lib/timer-utils";
import { formatCurrency, getCurrencySymbol, splitCost } from "@/lib/currency";
import { SITE_NAME, SITE_URL } from "@/lib/site-metadata";

export default function Home() {
  const session = useSessionStore((state) => state.session);
  const clearSession = useSessionStore((state) => state.clearSession);
  const status = useTimerStore((state) => state.status);
  const elapsedSeconds = useTimerStore((state) => state.elapsedSeconds);
  const totalCost = useTimerStore((state) => state.totalCost);
  const costPerMinute = useTimerStore((state) => state.costPerMinute);
  const costPerMinuteFormatted = formatCurrency(
    costPerMinute,
    session?.currency ?? "USD",
    2,
  );
  const startTimer = useTimerStore((state) => state.start);
  const pauseTimer = useTimerStore((state) => state.pause);
  const resumeTimer = useTimerStore((state) => state.resume);
  const stopTimer = useTimerStore((state) => state.stop);
  const resetTimer = useTimerStore((state) => state.reset);
  const snapshot = useTimerStore((state) => state.finalSnapshot);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useCostTicker();

  useEffect(() => {
    if (session && status === "idle") {
      startTimer(session);
    }
  }, [session, status, startTimer]);

  const symbol = session ? getCurrencySymbol(session.currency) : "$";
  const costParts = splitCost(totalCost);
  const elapsed = formatDuration(elapsedSeconds);

  const isPaused = status === "paused";
  const canToggle = status === "running" || status === "paused";

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const frame = requestAnimationFrame(() => {
      setCanNativeShare(typeof navigator.share === "function");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const sharePayload = useMemo(() => {
    if (!snapshot) return "";
    const duration = formatDuration(snapshot.elapsedSeconds);
    const total = formatCurrency(snapshot.totalCost, snapshot.currency, 2);
    const perAttendee = formatCurrency(
      snapshot.totalCost / snapshot.participants,
      snapshot.currency,
      2,
    );
    return `Meeting burned ${total} in ${duration} with ${snapshot.participants} attendees (${perAttendee} each). Track your next meeting with BurnRate: ${SITE_URL}`;
  }, [snapshot]);
  const shareTitle = `${SITE_NAME} meeting summary`;

  const handleToggle = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const handleShare = async () => {
    if (!sharePayload) return;
    try {
      await navigator.clipboard.writeText(sharePayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  const handleNativeShare = async () => {
    if (!sharePayload || !canNativeShare || typeof navigator.share !== "function") {
      return;
    }
    try {
      await navigator.share({
        title: shareTitle,
        text: sharePayload,
        url: SITE_URL,
      });
    } catch (error) {
      if ((error as DOMException)?.name === "AbortError") {
        return;
      }
      console.error("Native share failed", error);
    }
  };

  const handleStartNew = () => {
    resetTimer();
    clearSession();
  };

  const stage =
    status === "idle" ? "form" : status === "stopped" ? "summary" : "timer";

  return (
    <div className="space-y-10">
      <header className="max-w-3xl space-y-4">
        <h1 className="brand-hue text-4xl font-semibold sm:text-5xl">
          BurnRate 💸
        </h1>
        <p className="text-lg text-slate-600 sm:text-xl dark:text-white/70">
          Track what every second of your meeting costs so you can pause or
          stop before it spirals out of control.
        </p>
      </header>

      <div className="glass-slate mx-auto max-w-4xl p-6">
        {stage === "form" && (
          <>
            <SessionIntakeForm disabled={status !== "idle"} />
            <p className="mt-4 text-xs text-slate-500 dark:text-white/50">
              Participants, salary, and currency exist only in-memory and are
              cleared when you start new sessions.
            </p>
          </>
        )}

        {stage === "timer" && (
          <>
            <div className="space-y-3 p-2 sm:p-4">
              <p className="text-xs text-slate-600 dark:text-white/60">
                Elapsed time
              </p>
              <p className="font-mono text-5xl tabular-nums text-slate-900 sm:text-6xl dark:text-white">
                {elapsed}
              </p>
            </div>

            <div className="mt-8 space-y-2 p-2 sm:p-4">
              <p className="text-xs text-slate-600 dark:text-white/60">
                Total cost
              </p>
              <div className="flex items-end gap-3 text-slate-900 dark:text-white">
                <span className="text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
                  {symbol}
                  {costParts.major}
                  <span className="text-3xl font-medium opacity-70">
                    {costParts.minor}
                  </span>
                </span>
                <span className="flex-1 text-right text-sm text-slate-600 dark:text-white/60">
                  per minute {costPerMinuteFormatted}
                </span>
              </div>
            </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleToggle}
              disabled={!canToggle}
              className="flex-1 min-w-[140px] rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 dark:border-white/30 dark:text-white dark:hover:border-white dark:hover:text-white dark:disabled:border-white/10 dark:disabled:text-white/40"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={() => stopTimer()}
              disabled={status === "idle" || status === "stopped"}
              className="flex-1 min-w-[160px] rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:bg-white dark:text-black dark:hover:bg-white/90 dark:disabled:bg-white/30 dark:disabled:text-black/30"
            >
              Stop & Recap
            </button>
          </div>
          </>
        )}

        {stage === "summary" && snapshot && (
          <div className="space-y-6 p-4 sm:p-6">
            <div className="space-y-2">
              <p className="text-xs text-slate-600 dark:text-white/60">
                Recap
              </p>
              <h2 className="text-2xl font-semibold tracking-[0.2em] text-slate-900 dark:text-white">
                {snapshot.participants} attendees · {snapshot.currency}
              </h2>
              <p className="text-sm text-slate-600 dark:text-white/60">
                All calculations stayed locally on this device. Share the
                summary, then tap “start new session” to erase the data.
              </p>
            </div>

            <div className="grid gap-4 text-slate-900 sm:grid-cols-2 dark:text-white">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-black/40 dark:shadow-none">
                <p className="text-xs text-slate-500 dark:text-white/50">
                  Total cost
                </p>
                <p className="text-3xl font-semibold tabular-nums">
                  {symbol}
                  {costParts.major}
                  <span className="text-base font-normal opacity-70">
                    {costParts.minor}
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-white/40">
                  {costPerMinuteFormatted} / minute
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-black/40 dark:shadow-none">
                <p className="text-xs text-slate-500 dark:text-white/50">
                  Duration
                </p>
                <p className="text-3xl font-semibold tabular-nums">
                  {formatDuration(snapshot.elapsedSeconds)}
                </p>
                <p className="text-xs text-slate-500 dark:text-white/40">
                  {snapshot.participants} attendees
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-900 dark:border-white/15 dark:bg-black/30 dark:text-white">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-white/60">
                <div className="flex-1">
                  Shareable summary
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex h-8 min-w-[96px] items-center justify-center rounded-full border border-slate-300 px-3 py-1 text-slate-800 transition hover:border-slate-500 hover:text-slate-900 dark:border-white/30 dark:text-white dark:hover:border-white"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                  {canNativeShare && (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="flex h-8 min-w-[110px] items-center justify-center rounded-full border border-slate-300 px-3 py-1 text-slate-800 transition hover:border-slate-500 hover:text-slate-900 dark:border-white/30 dark:text-white dark:hover:border-white"
                    >
                      Share
                    </button>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-mono text-slate-700 dark:border-white/10 dark:bg-black/70 dark:text-white/80">
                {sharePayload}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartNew}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Start new session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
