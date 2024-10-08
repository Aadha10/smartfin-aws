// src/App.jsx
import React from "react";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Dashboard from "./pages/Dashboard";
import BudgetPage from "./pages/BudgetPage";
import ExpensesPage from "./pages/ExpensesPage";
import Error from "./pages/Error";
import LandingPageApp from "./components/Intro";

// Actions
import { logoutAction } from "./actions/logout";
import { deleteBudget } from "./actions/deleteBudget";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageApp />,
    errorElement: <Error />,
  },
  {
    path: "/dashboard",
    element: (
      <Authenticator>
        {({ signOut, user }) => {
          return <Dashboard userId={user.userId} signOut={signOut} />;
        }}
      </Authenticator>
    ),
    errorElement: <Error />,
  },
  {
    path: "budget/:id",
    element: <Authenticator><BudgetPage /></Authenticator>,
    errorElement: <Error />,
    children: [
      {
        path: "budget/:id/delete",
        action: deleteBudget,
      },
    ],
  },
  {
    path: "expenses",
    element: <Authenticator><ExpensesPage /></Authenticator>,
    errorElement: <Error />,
  },
  {
    path: "logout",
    action: logoutAction,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
