import { useEffect, useMemo, useState } from "react";
import { submissions as baseSubmissions, type ResearchItem, type DecidedItem, allResearchHistory } from "./reviewerData";

export type ReviewStatus = "pending" | "approved" | "rejected";

type StoredDecision = {
  status: Exclude<ReviewStatus, "pending">;
  decidedAt: string;
  reviewerNote: string;
};

type StoredState = Record<number, StoredDecision>;

const STORAGE_KEY = "lppm.reviewer.decisions.v1";

function readStored(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as StoredState;
  } catch {
    return {};
  }
}

function writeStored(next: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function formatDateShort(d: Date) {
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function matchScoreFromSubmission(item: ResearchItem) {
  const total = item.fields.length || 1;
  const match = item.fields.filter((f) => f.match === "match").length;
  return Math.round((match / total) * 100);
}

function toDecidedItem(item: ResearchItem, status: ReviewStatus, decidedAt: string, reviewerNote: string): DecidedItem {
  return {
    id: item.id,
    title: item.title,
    dosenName: item.dosenName,
    prodi: item.prodi,
    schema: item.schema,
    submittedAt: item.submittedAt,
    decidedAt,
    status,
    matchScore: matchScoreFromSubmission(item),
    reviewerNote,
  };
}

export function useReviewerData() {
  const [stored, setStored] = useState<StoredState>(() => readStored());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStored(readStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const submissions = baseSubmissions;

  const pending = useMemo(() => {
    return submissions.filter((s) => !stored[s.id]);
  }, [stored, submissions]);

  const approved = useMemo(() => {
    return submissions
      .filter((s) => stored[s.id]?.status === "approved")
      .map((s) => toDecidedItem(s, "approved", stored[s.id]!.decidedAt, stored[s.id]!.reviewerNote));
  }, [stored, submissions]);

  const rejected = useMemo(() => {
    return submissions
      .filter((s) => stored[s.id]?.status === "rejected")
      .map((s) => toDecidedItem(s, "rejected", stored[s.id]!.decidedAt, stored[s.id]!.reviewerNote));
  }, [stored, submissions]);

  const pendingTableItems = useMemo(() => {
    return pending.map((s) => toDecidedItem(s, "pending", "-", ""));
  }, [pending]);

  const history = useMemo(() => {
    const dynamic = [...approved, ...rejected];
    const byId = new Map<number, DecidedItem>();
    for (const h of allResearchHistory) byId.set(h.id, h);
    for (const h of dynamic) byId.set(h.id, h);
    return Array.from(byId.values()).sort((a, b) => (a.decidedAt < b.decidedAt ? 1 : -1));
  }, [approved, rejected]);

  const counts = useMemo(() => {
    return {
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      total: submissions.length,
    };
  }, [pending.length, approved.length, rejected.length, submissions.length]);

  const decideOnce = (id: number, status: Exclude<ReviewStatus, "pending">, reviewerNote: string) => {
    if (stored[id]) return false; // one-time
    const next: StoredState = { ...stored, [id]: { status, decidedAt: formatDateShort(new Date()), reviewerNote } };
    setStored(next);
    writeStored(next);
    return true;
  };

  const getDecision = (id: number): ReviewStatus => {
    const d = stored[id]?.status;
    return d ?? "pending";
  };

  return {
    submissions,
    pendingSubmissions: pending,
    pendingTableItems,
    approvedTableItems: approved,
    rejectedTableItems: rejected,
    historyItems: history,
    counts,
    decideOnce,
    getDecision,
  };
}

