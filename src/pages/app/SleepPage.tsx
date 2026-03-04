import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";
import WeekDayViewContent from "@/pages/app/WeekDayViewContent";

export default function SleepPage() {
  return (
    <PageContainer>
      <SoftCard sx={{ minWidth: 0 }}>
        <WeekDayViewContent />
      </SoftCard>
    </PageContainer>
  );
}
