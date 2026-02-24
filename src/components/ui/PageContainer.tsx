import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

export default function PageContainer({ children, sx, ...rest }: BoxProps) {
  return (
    <Box
      {...rest}
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
        flex: 1,
        minHeight: "calc(100vh - 64px)",
        minWidth: 0,
        width: "100%",
        maxWidth: "none",
        px: { xs: "16px", sm: "24px", md: "32px", lg: "48px", xl: "80px" },
        pt: { xs: 2, sm: 3, lg: 4 },
        pb: { xs: 4, md: 5, lg: 6 },
        overflowX: "clip",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
