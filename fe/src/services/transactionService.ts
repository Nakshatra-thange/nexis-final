import api from "./api";

/**
 * Get single transaction
 */
export async function getTransaction(id: string) {
  return api.get(`/api/transactions/${id}`);
}

/**
 * Fetch all transactions (simple)
 */
export async function fetchTransactions() {
  return api.get("/api/transactions");
}

/**
 * Fetch with filters
 */
export async function getTransactions(
  params: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });

  const url = query.toString()
    ? `/api/transactions?${query.toString()}`
    : "/api/transactions";

  return api.get(url);
}

/**
 * Submit signed tx
 */
export async function submitTransaction(
  id: string,
  signedTransaction: string
) {
  return api.post(`/api/transactions/${id}/submit`, {
    signedTransaction,
  });
}

/**
 * Cancel tx
 */
export async function cancelTransaction(id: string) {
  return api.post(`/api/transactions/${id}/cancel`);
}
