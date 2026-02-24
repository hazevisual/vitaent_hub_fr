import { Box } from "@mui/material";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";
import WeekDayViewContent from "@/pages/app/WeekDayViewContent";

const WEEK_DAY_PAGE_MAX_WIDTH = 1560;

export default function WeekDayPage() {
  return (
    <PageContainer>
      <Box
        sx={{
          width: "100%",
          maxWidth: WEEK_DAY_PAGE_MAX_WIDTH,
          mx: "auto",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        <SoftCard
          sx={{
            p: 3,
            "@media (min-width:2000px)": {
              p: 3.75,
            },
          }}
        >
          <WeekDayViewContent />
        </SoftCard>
      </Box>
    </PageContainer>
  );
}
