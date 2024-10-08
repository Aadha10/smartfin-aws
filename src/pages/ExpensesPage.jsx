import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Table from "../components/Table";
import { deleteItem, fetchData } from "../helpers";
import useAuth from "../hooks/useAuth";

const ExpensesPage = () => {
  const userId = useAuth(); // Get the userId from the auth hook
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const fetchedExpenses = await fetchData("expenses", userId);
        setExpenses(fetchedExpenses);
      } catch (e) {
        toast.error("There was a problem fetching expenses.");
        console.error("Error fetching expenses:", e);
      }
    };

    fetchExpenses();
  }, [userId]); // Fetch expenses when userId changes

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteItem({
        key: "expenses",
        id: expenseId,
        userId,
      });
      toast.success("Expense deleted!");
      // Refetch expenses after deletion
      const updatedExpenses = await fetchData("expenses", userId);
      setExpenses(updatedExpenses);
    } catch (e) {
      toast.error("There was a problem deleting your expense.");
      console.error("Error deleting expense:", e);
    }
  };

  return (
    <div className="grid-lg">
      <h1 className="h2">Expenses</h1>
      {expenses && expenses.length > 0 ? (
        <Table expenses={expenses} showBudget={true} onDelete={handleDeleteExpense} />
      ) : (
        <p>No expenses found</p>
      )}
    </div>
  );
};

export default ExpensesPage;
