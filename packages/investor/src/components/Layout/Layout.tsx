import { FC, PropsWithChildren, useState } from "react";
import {
  Box,
  AppBar as MuiAppBar,
  AppBarProps,
  Toolbar,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  styled,
} from "@mui/material";
import { ExpandLess, ExpandMore, Add } from "@mui/icons-material";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps & { open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type LayoutProps = PropsWithChildren<{}>;

const Layout: FC<LayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <Box height="100vh" width="100vw" display="flex">
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="left"
        open
      >
        <DrawerHeader />
        <Divider />
        <List component="nav">
          <ListItemButton component={Link} to="/investments">
            <ListItemText primary="Investimenti" />
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
            >
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} to="/investments/create">
                <ListItemIcon>
                  <Add />
                </ListItemIcon>
                <ListItemText primary="Crea" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
      <AppBar position="fixed" open>
        <Toolbar>Investment</Toolbar>
      </AppBar>
      <Main open>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default Layout;
