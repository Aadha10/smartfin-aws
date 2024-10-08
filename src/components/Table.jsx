// component import
import React from "react";
import ExpenseItem from "./ExpenseItem";

const Table = ({ expenses, showBudget, onDelete }) => {
  console.log("Table onDelete prop:", onDelete);
  console.log("Is onDelete a function?", typeof onDelete === 'function');
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            {["Name", "Amount", "Date", showBudget ? "Budget" : "", ""].map(
              (i, index) => (
                <th key={index}>{i}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <ExpenseItem expense={expense} showBudget={showBudget} onDelete={onDelete} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
