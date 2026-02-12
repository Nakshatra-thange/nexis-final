import api from './api'

export async function sendMessage(
  message: string,
  conversationId: string | null = null
) {
  return api.post('/api/chat', {
    message,
    conversationId
  })
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
