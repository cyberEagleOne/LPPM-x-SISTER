import { Clock } from "lucide-react";
import { useReviewerData } from "./reviewerStore";
import { ReviewerTablePage } from "./ReviewerTablePage";

export function ReviewerPending() {
  const { pendingTableItems } = useReviewerData();
  return (
    <ReviewerTablePage
      title="Penelitian Pending"
      description="Daftar pengajuan penelitian yang menunggu keputusan review"
      status="pending"
      items={pendingTableItems}
      accentColor="#d97706"
      accentBg="#fffbeb"
      icon={<Clock size={20} className="text-amber-600" />}
    />
  );
}
