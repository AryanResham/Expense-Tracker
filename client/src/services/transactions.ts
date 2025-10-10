import { backend } from "./api";

export const getTransactions = async () => {
  const response = await backend.get("/transactions");
  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to fetch transactions");
  }
  return response.data;
};

export const createTransaction = async (transaction: any) => {
  const response = await backend.post("/transactions", transaction);
  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to create transaction");
  }
  return response.data;
};

export const updateTransaction = async (id: string, transaction: any) => {
  const response = await backend.put(`/transactions/${id}`, transaction);
  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to update transaction");
  }
  return response.data;
};

export const deleteTransaction = async (id: string) => {
  const response = await backend.delete(`/transactions/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to delete transaction");
  }
  return response.data;
};
