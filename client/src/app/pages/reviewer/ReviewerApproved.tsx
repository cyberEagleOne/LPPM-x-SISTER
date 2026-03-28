import { CheckCircle } from "lucide-react";
import { useReviewerData } from "./reviewerStore";
import { ReviewerTablePage } from "./ReviewerTablePage";

export function ReviewerApproved() {
  const { approvedTableItems } = useReviewerData();
  return (
    <ReviewerTablePage
      title="Penelitian Disetujui"
      description="Daftar pengajuan penelitian yang telah disetujui"
      status="approved"
      items={approvedTableItems}
      accentColor="#059669"
      accentBg="#ecfdf5"
      icon={<CheckCircle size={20} className="text-green-600" />}
    />
  );
}
