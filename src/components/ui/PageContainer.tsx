import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

const contentMaxWidth = 1920;

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
        minWidth: 0,
        width: "100%",
        maxWidth: contentMaxWidth,
        mx: "auto",
        px: { xs: "16px", sm: "24px", md: "32px", lg: "48px", xl: "48px" },
        pt: { xs: 2, sm: 3, lg: 4 },
        pb: { xs: 4, md: 5, lg: 6 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
