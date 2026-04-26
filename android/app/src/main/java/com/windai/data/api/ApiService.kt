package com.windai.data.api

import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("/api/chat")
    suspend fun sendChatMessage(@Body request: ChatRequest): ChatResponse
}
