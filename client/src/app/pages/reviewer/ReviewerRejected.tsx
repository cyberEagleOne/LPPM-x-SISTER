import { XCircle } from "lucide-react";
import { useReviewerData } from "./reviewerStore";
import { ReviewerTablePage } from "./ReviewerTablePage";

export function ReviewerRejected() {
  const { rejectedTableItems } = useReviewerData();
  return (
    <ReviewerTablePage
      title="Penelitian Ditolak"
      description="Daftar pengajuan penelitian yang telah ditolak"
      status="rejected"
      items={rejectedTableItems}
      accentColor="#dc2626"
      accentBg="#fef2f2"
      icon={<XCircle size={20} className="text-red-500" />}
    />
  );
}
