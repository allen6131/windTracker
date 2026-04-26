package com.windai.data.repository

import com.windai.data.api.ApiService
import com.windai.data.api.ChatRequest
import com.windai.data.api.ChatResponse

class ChatRepository(private val apiService: ApiService) {
    suspend fun send(request: ChatRequest): ChatResponse = apiService.sendChat(request)
}
