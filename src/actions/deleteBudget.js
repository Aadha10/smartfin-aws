// rrd import
import { redirect } from "react-router-dom";

// library
import { toast } from "react-toastify";

// helpers
import { deleteItem, getAllMatchingItems } from "../helpers";

export async function deleteBudget({ params }, userId) {
  try {
    // Delete the budget
    await deleteItem({
      key: "budgets",
      id: params.id,
      userId,
    });

    // Fetch and delete associated expenses
    const associatedExpenses = await getAllMatchingItems({
      category: "expenses",
      key: "budgetId",
      value: params.id,
      userId,
    });

    await Promise.all(
      associatedExpenses.map((expense) =>
        deleteItem({
          key: "expenses",
          id: expense.id,
          userId,
        })
      )
    );

    toast.success("Budget deleted successfully!");
    window.location.href = "/dashboard";
  } catch (e) {
    console.error(e);
    toast.error("There was a problem deleting your budget.");
  }
}
