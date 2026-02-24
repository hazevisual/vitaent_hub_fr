import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

export default function PageContainer({ children, sx, ...rest }: BoxProps) {
  return (
    <Box
      {...rest}
      sx={{
        width: "100%",
        maxWidth: "none",
        px: { xs: "16px", sm: "24px", md: "32px", lg: "48px", xl: "72px" },
        pt: { xs: 0.75, sm: 1, md: 1.5 },
        pb: { xs: 2, md: 3 },
        overflowX: "clip",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
