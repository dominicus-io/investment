import { FC, Suspense } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import {
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

import { Investments, InvestmentEdit, InvestmentCreate } from "./pages";
import { Layout } from "./components";

const theme = createTheme({});

const App: FC = () => {

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Suspense fallback={"Loading..."}>
            <Routes>
              <Route path="/" element={<Navigate to="/investments" />} />
              <Route
                path="investments"
                element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route path="" element={<Investments />} />
                <Route path="create" element={<InvestmentCreate />} />
                <Route path=":investmentId/edit" element={<InvestmentEdit />} />
              </Route>
            </Routes>
        </Suspense>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
