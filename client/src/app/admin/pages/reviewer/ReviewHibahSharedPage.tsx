import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { PageWrapper } from "../../components/PageWrapper";
import { useToast } from "../../components/Toast";
import { InvitationBanner } from "../../components/reviewer/InvitationBanner";
import { RubrikScoringForm } from "../../components/reviewer/RubrikScoringForm";
import { LuaranTable, MitraTable, RABTable } from "../../components/reviewer/ReviewTables";
import {
  getReviewerRubrics,
  type ReviewerAssignment,
} from "../../config/reviewerRoleConfig";
import {
  findReviewerAssignmentById,
  saveReviewerAssignmentDraftReview,
  updateReviewerAssignmentApprovalStatus,
} from "../../data/reviewerStore";

function buildRubrikItems(type: ReviewerAssignment["type"]) {
  return getReviewerRubrics(type).map((rubric) => ({
    id: rubric.id,
    pertanyaan: rubric.question,
    pilihans: rubric.options.map((option, index) => ({
      id: `${rubric.id}-${index}`,
      label: option.label,
      bobot: option.score,
    })),
  }));
}

function mapStoredAnswersToChoiceIds(type: ReviewerAssignment["type"], answers: Record<string, number>) {
  const rubrics = buildRubrikItems(type);
  return rubrics.reduce<Record<string, string>>((accumulator, rubric) => {
    const storedScore = answers[rubric.id];
    const selected = rubric.pilihans.find((pilihan) => pilihan.bobot === storedScore);
    if (selected) {
      accumulator[rubric.id] = selected.id;
    }
    return accumulator;
  }, {});
}

function calculateStoredScore(type: ReviewerAssignment["type"], answerIds: Record<string, string>) {
  const rubrics = buildRubrikItems(type);
  return Object.entries(answerIds).reduce((total, [rubrikId, pilihanId]) => {
    const rubrik = rubrics.find((item) => item.id === rubrikId);
    const pilihan = rubrik?.pilihans.find((item) => item.id === pilihanId);
    return total + (pilihan?.bobot ?? 0);
  }, 0);
}

function mapChoiceIdsToStoredAnswers(type: ReviewerAssignment["type"], answerIds: Record<string, string>) {
  const rubrics = buildRubrikItems(type);
  return Object.entries(answerIds).reduce<Record<string, number>>((accumulator, [rubrikId, pilihanId]) => {
    const rubrik = rubrics.find((item) => item.id === rubrikId);
    const pilihan = rubrik?.pilihans.find((item) => item.id === pilihanId);
    if (pilihan) {
      accumulator[rubrikId] = pilihan.bobot;
    }
    return accumulator;
  }, {});
}

export function ReviewHibahSharedPage({ type }: { type: ReviewerAssignment["type"] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [assignment, setAssignment] = useState<ReviewerAssignment | null>(() => {
    const currentAssignment = findReviewerAssignmentById(id);
    return currentAssignment && currentAssignment.type === type ? currentAssignment : null;
  });
  const [submitVersion, setSubmitVersion] = useState(0);
  const [activeTab, setActiveTab] = useState<"informasi" | "substansi">("informasi");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const currentAssignment = findReviewerAssignmentById(id);
    setAssignment(currentAssignment && currentAssignment.type === type ? currentAssignment : null);
    setActiveTab("informasi");
    setInviteLoading(false);
    setSubmitLoading(false);
  }, [id, type]);

  const approvalStatus = assignment?.approvalStatus ?? "pending";
  const reviewed = assignment?.reviewed ?? false;
  const savedNotes = assignment?.draftReview.notes ?? "";
  const savedAnswers = useMemo(
    () => (assignment ? mapStoredAnswersToChoiceIds(assignment.type, assignment.draftReview.answers) : {}),
    [assignment],
  );

  const rubrikItems = useMemo(() => buildRubrikItems(type), [type]);
  const existingScore = useMemo(
    () => calculateStoredScore(type, savedAnswers),
    [savedAnswers, type],
  );

  if (!assignment) {
    return (
      <PageWrapper
        title={type === "penelitian" ? "Review Hibah Penelitian" : "Review Hibah PKM"}
        breadcrumbs={[{ label: "Reviewer" }, { label: "Review Hibah", path: "/reviewer/hibah" }]}
      >
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500">
          Data review tidak ditemukan.
        </div>
      </PageWrapper>
    );
  }

  const tabs = [
    { key: "informasi" as const, label: "Informasi" },
    ...(approvalStatus === "terima"
      ? [
          {
            key: "substansi" as const,
            label: type === "penelitian" ? "Review Substansi Penelitian" : "Review Substansi",
          },
        ]
      : []),
  ];

  const summaryFields = [
    { label: "Kelompok Skema", value: assignment.hibahSummary.kelompokSkema },
    { label: "Tahun Usulan", value: assignment.hibahSummary.tahunUsulan },
    { label: "Tema Hibah", value: assignment.hibahSummary.temaHibah },
    { label: "Semester", value: assignment.hibahSummary.semester },
    { label: "Lama Kegiatan", value: assignment.hibahSummary.lamaKegiatan },
    { label: "Roadmap Universitas", value: assignment.hibahSummary.roadmapUniversitas },
    { label: "Fokus Riset Fakultas", value: assignment.hibahSummary.risetFakultas },
    { label: "Tema Riset Fakultas", value: assignment.hibahSummary.risetTema },
    { label: "Tema Prodi", value: assignment.hibahSummary.temaProdi },
    { label: "Subtema Prodi", value: assignment.hibahSummary.subtemaProdi },
    { label: "Target TKT", value: assignment.hibahSummary.targetTkt || "-" },
  ];

  const handleInvitationStatus = (nextStatus: ReviewerAssignment["approvalStatus"]) => {
    setInviteLoading(true);
    window.setTimeout(() => {
      const updatedAssignment = updateReviewerAssignmentApprovalStatus(assignment.assignmentId, nextStatus);
      if (updatedAssignment) {
        setAssignment(updatedAssignment);
      }
      if (nextStatus !== "terima") {
        setActiveTab("informasi");
      }
      setInviteLoading(false);
      if (nextStatus === "terima") {
        showToast("Status reviewer berhasil diubah menjadi terima.");
      } else {
        showToast("Status reviewer berhasil diubah menjadi tolak.", "warning");
      }
    }, 500);
  };

  const handleSubmit = (answers: Record<string, string>, catatan: string) => {
    setSubmitLoading(true);
    window.setTimeout(() => {
      const updatedAssignment = saveReviewerAssignmentDraftReview(assignment.assignmentId, {
        answers: mapChoiceIdsToStoredAnswers(assignment.type, answers),
        notes: catatan,
        submitted: true,
      });
      if (updatedAssignment) {
        setAssignment(updatedAssignment);
      }
      setSubmitLoading(false);
      setSubmitVersion((current) => current + 1);
      showToast("Review berhasil disimpan.");
    }, 500);
  };

  return (
    <PageWrapper
      title={type === "penelitian" ? "Review Hibah Penelitian" : "Review Hibah PKM"}
      subtitle={assignment.reviewYearLabel}
      breadcrumbs={[
        { label: "Reviewer" },
        { label: "Review Hibah", path: "/reviewer/hibah" },
        { label: assignment.hibahId },
      ]}
      actions={
        <button
          type="button"
          onClick={() => navigate("/reviewer/hibah")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali
        </button>
      }
    >
      <InvitationBanner
        status={approvalStatus}
        onTerima={() => handleInvitationStatus("terima")}
        onTolak={() => handleInvitationStatus("tolak")}
        loading={inviteLoading}
      />

      <div className="mb-6 flex gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`-mb-px border-b-2 px-5 py-2.5 text-sm transition-all ${
              activeTab === tab.key
                ? "border-[#E30613] text-[#E30613]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
            style={{ fontWeight: activeTab === tab.key ? 600 : 500 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "informasi" ? (
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm text-slate-800" style={{ fontWeight: 600 }}>
              Profil Pengusul
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-400">Nama</p>
                <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>
                  {assignment.applicant.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Pangkat</p>
                <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>
                  {assignment.applicant.rank}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Profil Sinta</p>
                <a
                  href={assignment.applicant.sintaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  Sinta ID {assignment.applicant.sintaId} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div>
                <p className="text-xs text-slate-400">Profil Google Scholar</p>
                <a
                  href={assignment.applicant.googleScholarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  {assignment.applicant.googleScholarLabel} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div>
                <p className="text-xs text-slate-400">Fokus Bidang Penelitian</p>
                <p className="text-sm text-slate-800">{assignment.applicant.researchFocus.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Fokus Bidang PKM</p>
                <p className="text-sm text-slate-800">{assignment.applicant.pkmFocus.join(", ")}</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm text-slate-800" style={{ fontWeight: 600 }}>
              Ringkasan Hibah
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {summaryFields.map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-slate-400">{field.label}</p>
                  <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {approvalStatus === "terima" ? (
            <>
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-sm text-slate-800" style={{ fontWeight: 600 }}>
                  Informasi Proposal Blind
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <p className="text-xs text-slate-400">Judul</p>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>
                      {assignment.proposal.title}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-slate-400">Abstrak</p>
                    <p className="text-sm leading-relaxed text-slate-700">
                      {assignment.proposal.abstract}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Proposal Blind</p>
                    <a
                      href={assignment.proposal.blindProposalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      Buka Proposal <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Dokumen Blind</p>
                    <a
                      href={assignment.proposal.blindDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      Buka Dokumen <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </section>

              {assignment.outputs.length ? (
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-4 text-sm text-slate-800" style={{ fontWeight: 600 }}>
                    Luaran
                  </h3>
                  <LuaranTable
                    items={assignment.outputs.map((item) => ({
                      namaJurnal: item.journalName,
                      url: item.url,
                    }))}
                  />
                </section>
              ) : null}

              {assignment.budgets.length ? (
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-4 text-sm text-slate-800" style={{ fontWeight: 600 }}>
                    Rancangan Anggaran Biaya
                  </h3>
                  <RABTable
                    items={assignment.budgets.map((item) => ({
                      kelompok: item.group,
                      komponen: item.component,
                      item: item.item,
                      satuan: item.unit,
                      hargaSatuan: item.price,
                      volume: item.volume,
                    }))}
                  />
                </section>
              ) : null}

              {assignment.partners.length ? (
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-4 text-sm text-slate-800" style={{ fontWeight: 600 }}>
                    Mitra
                  </h3>
                  <MitraTable
                    items={assignment.partners.map((item) => ({
                      nama: item.picName,
                      institusi: item.institution,
                      alamat: item.address,
                      surel: item.email,
                      negara: item.country,
                      suratUrl:
                        item.supportLetter &&
                        item.supportLetter !== "#" &&
                        item.supportLetter.toLowerCase() !== "ada"
                          ? item.supportLetter
                          : undefined,
                      dana: item.fund,
                    }))}
                  />
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      ) : (
        <section className="space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Hidden field legacy seperti `hibah_id` dan `sudahreview` sekarang dimodelkan di store mock React reviewer.
          </div>

          <RubrikScoringForm
            key={`${assignment.assignmentId}-${submitVersion}`}
            rubrikItems={rubrikItems}
            existingAnswers={savedAnswers}
            existingCatatan={savedNotes}
            existingSkor={reviewed ? existingScore : undefined}
            bolehReview={assignment.canReview}
            onSubmit={handleSubmit}
            loading={submitLoading}
          />
        </section>
      )}
    </PageWrapper>
  );
}
