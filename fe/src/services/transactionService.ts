import api from './api'

export async function getTransaction(id: string) {
  return api.get(`/api/transactions/${id}`)
}

export async function getTransactions(
  params: {
    status?: string
    limit?: number
    offset?: number
  } = {}
) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value))
    }
  })
  const queryString = query.toString()
  const url = queryString
    ? `/api/transactions?${queryString}`
    : '/api/transactions'
  return api.get(url)
}

export async function submitTransaction(
  id: string,
  signedTransaction: string
) {
  return api.post(`/api/transactions/${id}/submit`, {
    signedTransaction
  })
}

export async function cancelTransaction(id: string) {
  return api.post(`/api/transactions/${id}/cancel`)
}
