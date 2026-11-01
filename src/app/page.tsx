"use client";

import { useEffect, useMemo, useState } from "react";
import { formatMinutes, Fuse } from "@/components/fuse";
import { SessionIntakeForm } from "@/components/session-intake-form";
import { useCostTicker } from "@/hooks/use-cost-ticker";
import { formatCurrency, getCurrencySymbol, splitCost } from "@/lib/currency";
import { SITE_NAME, SITE_URL } from "@/lib/site-metadata";
import { formatDuration } from "@/lib/timer-utils";
import { useSessionStore } from "@/state/session-store";
import { useTimerStore } from "@/state/timer-store";

const secondaryButton =
  "h-10 rounded-md bg-active px-4 text-[14px] font-medium text-ink transition-colors hover:bg-control active:bg-control";
const primaryButton =
  "h-10 rounded-md bg-primary px-4 text-[14px] font-medium text-on-primary transition-opacity hover:opacity-85 active:opacity-75";

function clockTime(timestamp: number | null) {
  if (timestamp === null) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function TitleRow({
  title,
  subline,
  children,
}: {
  title: string;
  subline: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[24px] font-bold leading-8 tracking-[-0.01em]">
          {title}
        </h1>
        <p className="mt-1 text-[14px] text-muted sm:text-[15px]">{subline}</p>
      </div>
      {children && <div className="flex w-full gap-2 sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-none">{children}</div>}
    </div>
  );
}

function Strip({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid grid-cols-2 border-y border-border sm:grid-cols-4">
      {items.map(([label, value], index) => (
        <div
          key={label}
          className={`py-4 sm:px-5 sm:first:pl-0 ${index % 2 === 1 ? "pl-4 border-l border-border" : ""} ${index >= 2 ? "border-t border-border sm:border-t-0" : ""} ${index === 2 ? "sm:border-l sm:pl-5" : ""}`}
        >
          <dt className="text-[13px] text-muted">{label}</dt>
          <dd className="mt-1 text-[22px] font-medium leading-7 tabular-nums sm:text-[24px]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function Home() {
  const session = useSessionStore((state) => state.session);
  const clearSession = useSessionStore((state) => state.clearSession);
  const status = useTimerStore((state) => state.status);
  const elapsedSeconds = useTimerStore((state) => state.elapsedSeconds);
  const totalCost = useTimerStore((state) => state.totalCost);
  const costPerMinute = useTimerStore((state) => state.costPerMinute);
  const ratePerSecond = useTimerStore((state) => state.ratePerSecond);
  const startedAt = useTimerStore((state) => state.startedAt);
  const stoppedAt = useTimerStore((state) => state.stoppedAt);
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

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const frame = requestAnimationFrame(() => {
      setCanNativeShare(typeof navigator.share === "function");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const currency = session?.currency ?? "USD";
  const money = (value: number) => formatCurrency(value, currency, 2);
  const isPaused = status === "paused";

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
    if (!sharePayload || typeof navigator.share !== "function") return;
    try {
      await navigator.share({
        title: `${SITE_NAME} meeting summary`,
        text: sharePayload,
        url: SITE_URL,
      });
    } catch (error) {
      if ((error as DOMException)?.name === "AbortError") return;
      console.error("Native share failed", error);
    }
  };

  const handleStartNew = () => {
    resetTimer();
    clearSession();
  };

  if (status === "idle" || !session) {
    return (
      <>
        <TitleRow
          title="New meeting"
          subline="Set who is in the room, then start the meter when the meeting starts."
        />
        <SessionIntakeForm />
      </>
    );
  }

  const people = `${session.participants} ${session.participants === 1 ? "person" : "people"}`;
  const pay = `${formatCurrency(session.salaryInput, currency, 0)} ${session.salaryUnit === "annual" ? "a year" : "an hour"}`;
  const spanHours = Math.max(1, Math.ceil(elapsedSeconds / 3600));
  const fuseTitle =
    spanHours === 1 ? "Against the first hour" : `Against ${formatMinutes(spanHours * 60)}`;

  if (status === "stopped" && snapshot) {
    return (
      <>
        <TitleRow
          title="Meeting recap"
          subline={`${clockTime(startedAt)} to ${clockTime(stoppedAt)} · ${people} at ${pay} · nothing was saved`}
        >
          <button type="button" className={primaryButton} onClick={handleStartNew}>
            Start new meeting
          </button>
        </TitleRow>
        <section
          aria-labelledby="total-heading"
          className="rounded-lg border border-border bg-surface p-5 sm:p-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <div>
              <h2 id="total-heading" className="text-[16px] font-medium">
                This meeting cost
              </h2>
              <p className="mt-3 whitespace-nowrap text-[clamp(48px,11vw,128px)] font-bold leading-none tracking-[-0.04em] tabular-nums">
                {money(snapshot.totalCost)}
              </p>
            </div>
            <div className="w-full lg:max-w-[440px]">
              <h3 className="text-[14px] font-medium">Share the result</h3>
              <p className="mt-2 rounded-md bg-raised p-4 text-[15px] leading-6">
                {sharePayload}
              </p>
              <div className="mt-3 flex gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">
                <button type="button" onClick={handleShare} className={secondaryButton}>
                  {copied ? "Copied" : "Copy text"}
                </button>
                {canNativeShare && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className={secondaryButton}
                  >
                    Share
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Strip
              items={[
                ["Time", formatDuration(snapshot.elapsedSeconds)],
                ["A minute", money(costPerMinute)],
                ["Each person", money(snapshot.totalCost / snapshot.participants)],
                ["People", String(snapshot.participants)],
              ]}
            />
          </div>
          <h3 className="mt-8 text-[14px] font-medium">{fuseTitle}</h3>
          <div className="mt-3">
            <Fuse
              elapsedSeconds={snapshot.elapsedSeconds}
              ratePerSecond={ratePerSecond}
              currency={currency}
            />
          </div>
        </section>
      </>
    );
  }

  const live = splitCost(totalCost);
  const markStep = spanHours === 1 ? 15 : spanHours === 2 ? 30 : 60;
  const nextMarkMinutes = (Math.floor(elapsedSeconds / 60 / markStep) + 1) * markStep;
  const secondsToMark = Math.max(0, nextMarkMinutes * 60 - elapsedSeconds);

  return (
    <>
      <TitleRow
        title={isPaused ? "Meeting paused" : "Meeting in progress"}
        subline={`${people} at ${pay} · started ${clockTime(startedAt)}`}
      >
        <button
          type="button"
          className={secondaryButton}
          onClick={() => (isPaused ? resumeTimer() : pauseTimer())}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button type="button" className={primaryButton} onClick={() => stopTimer()}>
          Stop & recap
        </button>
      </TitleRow>

      <section
        aria-labelledby="meter-heading"
        className="rounded-lg border border-border bg-surface p-5 sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="meter-heading" className="text-[16px] font-medium">
            Cost so far
          </h2>
          <span className="flex items-center gap-2 text-[13px] text-muted">
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${isPaused ? "bg-control" : "bg-ember"}`}
            />
            {isPaused ? "Paused, not counting" : "Counting"}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <p
            className="whitespace-nowrap text-[clamp(48px,11vw,128px)] font-bold leading-none tracking-[-0.04em] tabular-nums"
            aria-live="off"
          >
            {getCurrencySymbol(currency)}
            {live.major}
            <span className="text-[0.55em] font-medium tracking-[-0.02em] text-muted">
              {live.minor}
            </span>
          </p>
          <p className="pb-2 text-[14px] text-muted tabular-nums sm:text-right">
            At {formatMinutes(nextMarkMinutes)} it reaches
            <span className="mt-1 block text-[24px] font-medium leading-7 text-ink">
              {money(nextMarkMinutes * 60 * ratePerSecond)}
            </span>
            <span className="mt-1 block">
              {isPaused ? "Paused" : `in ${formatDuration(secondsToMark).replace(/^00:/, "")}`}
            </span>
          </p>
        </div>
        <div className="mt-8">
          <Strip
            items={[
              ["Time", formatDuration(elapsedSeconds)],
              ["A minute", money(costPerMinute)],
              ["Each person", money(totalCost / session.participants)],
              ["People", String(session.participants)],
            ]}
          />
        </div>
        <h3 className="mt-8 text-[14px] font-medium">{fuseTitle}</h3>
        <div className="mt-3">
          <Fuse elapsedSeconds={elapsedSeconds} ratePerSecond={ratePerSecond} currency={currency} />
        </div>
      </section>
    </>
  );
}
