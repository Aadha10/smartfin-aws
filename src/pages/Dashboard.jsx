import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@aws-amplify/ui-react";
import { toast } from "react-toastify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import {
  createBudget,
  createExpense,
  deleteItem,
  fetchData,
  waait,
} from "../helpers";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const userId = useAuth(); // Get userId from the useAuth hook
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Fetch budgets and expenses function
  const fetchBudgetsAndExpenses = () => {
    const userBudgets = fetchData("budgets", userId) || [];
    const userExpenses = fetchData("expenses", userId) || [];
    setBudgets(userBudgets);
    setExpenses(userExpenses);
  };

  useEffect(() => {
    fetchBudgetsAndExpenses(); // Fetch when component mounts or userId changes
  }, [userId]); // Fetch when userId changes

  const handleAction = async (actionType, values, userId) => {
    try {
      await waait(); // Simulate delay
      if (!userId) {
        throw new Error("User not authenticated. Please log in.");
      }

      if (actionType === "createBudget") {
        if (!values.newBudget || !values.newBudgetAmount) {
          throw new Error("Invalid budget data");
        }
        await createBudget({
          name: values.newBudget,
          amount: values.newBudgetAmount,
          userId,
        });
        toast.success("Budget created!");
        fetchBudgetsAndExpenses(); // Refresh budgets
      }

      if (actionType === "createExpense") {
        if (
          !values.newExpense ||
          !values.newExpenseAmount ||
          !values.newExpenseBudget
        ) {
          throw new Error("Invalid expense data");
        }
        await createExpense({
          name: values.newExpense,
          amount: values.newExpenseAmount,
          budgetId: values.newExpenseBudget,
          userId,
        });
        toast.success(`Expense ${values.newExpense} created!`);
        fetchBudgetsAndExpenses(); // Refresh expenses
      }

      if (actionType === "deleteExpense") {
        if (!values.expenseId) {
          throw new Error("Invalid expense ID");
        }
        await deleteItem({
          key: "expenses",
          id: values.expenseId,
          userId,
        });
        toast.success("Expense deleted!");
        fetchBudgetsAndExpenses(); // Refresh expenses
      }
    } catch (e) {
      toast.error(e.message || "There was a problem processing your request.");
      console.error("Error in handleAction:", e);
    }
  };

  const { signOut } = useAuthenticator();
  const { user } = useAuthenticator();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <div className="dashboard">
      <h1>
        Welcome back, <span className="accent">{user.username}</span>
      </h1>
      <Button onClick={handleSignOut}>Sign Out</Button>
      <div className="grid-sm">
        {budgets && budgets.length > 0 ? (
          <div className="grid-lg">
            <div className="flex-lg">
              <AddBudgetForm
                onAction={(values) =>
                  handleAction("createBudget", values, userId)
                }
              />
              <AddExpenseForm
                budgets={budgets}
                onAction={(values) =>
                  handleAction("createExpense", values, userId)
                }
              />
            </div>
            <h2>Existing Budgets</h2>
            <div className="budgets">
              {budgets.map((budget) => (
                <BudgetItem
                  key={budget.id}
                  budget={budget}
                  onDelete={(expenseId) =>
                    handleAction("deleteExpense", { expenseId }, userId)
                  }
                />
              ))}
            </div>
            {expenses && expenses.length > 0 && (
              <div className="grid-md">
                <h2>Recent Expenses</h2>
                <Table
                  expenses={expenses
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .slice(0, 8)}
                />
                {expenses.length > 8 && (
                  <Link to="expenses" className="btn btn--dark">
                    View all expenses
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid-sm">
            <p>Personal budgeting is the secret to financial freedom.</p>
            <p>Create a budget to get started!</p>
            <AddBudgetForm
              onAction={(values) =>
                handleAction("createBudget", values, userId)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
