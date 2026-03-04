import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

const contentMaxWidth = 1592;

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
        px: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 2.5, md: 3 },
        pb: { xs: 3, md: 4 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
