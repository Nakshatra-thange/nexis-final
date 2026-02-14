import api from './api'

export async function getBalance() {
  return api.get('/api/wallet/balance')
}

export async function fetchBalance() {
  const res = await api.get("/api/wallet/balance");
  return res.data;
}

export async function getWalletHistory(
  limit = 20,
  offset = 0
) {
  return api.get(
    `/api/wallet/history?limit=${limit}&offset=${offset}`
  )
}
