package com.windai.data.repository

import com.windai.data.api.ApiService
import com.windai.data.api.ChatRequest
import com.windai.data.api.ChatResponse
import com.windai.data.api.Coordinates

interface ChatRepository {
    suspend fun sendMessage(
        message: String,
        conversationId: String? = null,
        units: String = "imperial",
        userLocation: Coordinates? = null,
    ): Result<ChatResponse>
}

class NetworkChatRepository(private val apiService: ApiService) : ChatRepository {
    override suspend fun sendMessage(
        message: String,
        conversationId: String?,
        units: String,
        userLocation: Coordinates?,
    ): Result<ChatResponse> = runCatching {
        apiService.sendChatMessage(
            ChatRequest(
                conversationId = conversationId,
                message = message,
                userLocation = userLocation,
                units = units,
                platform = "android",
            ),
        )
    }
}
