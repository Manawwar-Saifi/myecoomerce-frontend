import React from "react";
import { Box, Toolbar, Typography } from "@mui/material";

const drawerWidth = 240;

function MainContent({ selectedPage }) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: "background.default",
        p: 3,
        marginLeft: `${drawerWidth}px`,
      }}
    >
      <Toolbar />
      <Typography variant="h4" gutterBottom>
        {selectedPage}
      </Typography>

      {/* Dynamic Content */}
      {selectedPage === "Dashboard" && <Typography>Welcome to the Dashboard!</Typography>}
      {selectedPage === "Orders" && <Typography>Here are your Orders.</Typography>}
      {selectedPage === "Products" && <Typography>Manage your Products here.</Typography>}
      {selectedPage === "Customers" && <Typography>Customer data appears here.</Typography>}
      {selectedPage === "Reports" && <Typography>View Reports and analytics.</Typography>}
    </Box>
  );
}

export default MainContent;
