import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import { createExpense, deleteItem, getAllMatchingItems } from "../helpers";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import { deleteBudget } from "../actions/deleteBudget";

const BudgetPage = () => {
  const { id } = useParams();
  const userId = useAuth(); // Get the userId from the auth hook
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchBudgetAndExpenses = async () => {
      const fetchedBudget = await getAllMatchingItems({
        category: "budgets",
        key: "id",
        value: id,
        userId,
      });

      const fetchedExpenses = await getAllMatchingItems({
        category: "expenses",
        key: "budgetId",
        value: id,
        userId,
      });

      if (fetchedBudget.length > 0) {
        setBudget(fetchedBudget[0]);
      } else {
        toast.error("The budget you’re trying to find doesn’t exist");
      }

      setExpenses(fetchedExpenses);
    };

    fetchBudgetAndExpenses();
  }, [id, userId]);

  const handleCreateExpense = async (values) => {
    try {
      await createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: id, // Use the current budget id
        userId,
      });
      toast.success(`Expense ${values.newExpense} created!`);
      // Refetch expenses after creation
      const updatedExpenses = await getAllMatchingItems({
        category: "expenses",
        key: "budgetId",
        value: id,
        userId,
      });
      setExpenses(updatedExpenses);
    } catch (e) {
      toast.error("There was a problem creating your expense.");
      console.error("Error creating expense:", e);
    }
  };

  const handleDeleteBudget = async () => {
    await deleteBudget({ params: { id } }, userId);
  };
  
  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteItem({
        key: "expenses",
        id: expenseId,
        userId,
      });
      toast.success("Expense deleted!");
      // Refetch expenses after deletion
      const updatedExpenses = await getAllMatchingItems({
        category: "expenses",
        key: "budgetId",
        value: id,
        userId,
      });
      setExpenses(updatedExpenses);
    } catch (e) {
      toast.error("There was a problem deleting your expense.");
      console.error("Error deleting expense:", e);
    }
  };

  if (!budget) {
    return <p>Loading...</p>; // Optionally show a loading state
  }
  console.log("onDelete function in BudgetPage:", handleDeleteExpense);


  return (
    <div
      className="grid-lg"
      style={{
        "--accent": budget.color,
      }}
    >
      <h1 className="h2">
        <span className="accent">{budget.name}</span> Overview
      </h1>
      <div className="flex-lg">
        <BudgetItem budget={budget} showDelete={true} onDelete={handleDeleteBudget} />
        <AddExpenseForm budgets={[budget]} onAction={handleCreateExpense} />
      </div>
      {expenses && expenses.length > 0 && (
        <div className="grid-md">
          <h2>
            <span className="accent">{budget.name}</span> Expenses
          </h2>
          <Table
            expenses={expenses}
            showBudget={false}
            onDelete={handleDeleteExpense}
          />
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
