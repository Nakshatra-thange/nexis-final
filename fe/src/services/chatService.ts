import api from './api'

export async function sendMessage(
  message: string,
  conversationId?: string
) {
  const payload: any = { message }

  if (conversationId) {
    payload.conversationId = conversationId
  }

  return api.post('/api/chat', payload)
}



export async function getConversations() {
  return api.get('/api/conversations')
}

export async function getConversation(id: string) {
  return api.get(`/api/conversations/${id}`)
}

export async function deleteConversation(id: string) {
  return api.delete(`/api/conversations/${id}`)
}
