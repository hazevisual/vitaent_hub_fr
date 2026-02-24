import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

export default function PageContainer({ children, sx, ...rest }: BoxProps) {
  return (
    <Box
      {...rest}
      sx={{
        width: "100%",
        maxWidth: 1360,
        mx: "auto",
        px: { xs: 1, sm: 1.5, md: 2.5, lg: 3 },
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
