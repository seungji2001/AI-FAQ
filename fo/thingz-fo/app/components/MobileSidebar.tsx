"use client";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const NAV_ITEMS = [
  { label: "피드", active: true },
  { label: "탐색", active: false },
  { label: "발행", active: false },
  { label: "마이페이지", active: false },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 240, pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "18px" }}>THINGZ</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={onClose}>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: item.active ? 700 : 400,
                        color: item.active ? "#FBA96E" : "text.primary",
                        fontSize: "15px",
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
