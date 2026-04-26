package com.windai.ui.chat

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.windai.data.api.ChatResponse
import com.windai.data.api.Clarification
import com.windai.data.api.Coordinates
import com.windai.data.api.ForecastCard
import com.windai.data.api.SourceAttribution
import com.windai.data.repository.ChatRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class ChatMessage(val text: String, val isUser: Boolean)

data class ChatUiState(
    val messages: List<ChatMessage> = listOf(ChatMessage("Ask about wind, waves, tides, or the best activity window.", false)),
    val cards: List<ForecastCard> = emptyList(),
    val clarification: Clarification = Clarification(needed = false),
    val sources: List<SourceAttribution> = emptyList(),
    val warnings: List<String> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val conversationId: String? = null,
    val lastMessage: String? = null,
)

class ChatViewModel(private val repository: ChatRepository) : ViewModel() {
    private val _state = MutableStateFlow(ChatUiState())
    val state: StateFlow<ChatUiState> = _state.asStateFlow()

    fun send(message: String, units: String = "imperial", userLocation: Coordinates? = null) {
        if (message.isBlank()) return
        _state.update {
            it.copy(
                isLoading = true,
                error = null,
                lastMessage = message,
                messages = it.messages + ChatMessage(message, true),
            )
        }
        viewModelScope.launch {
            repository.sendChat(message, _state.value.conversationId, units, userLocation)
                .onSuccess { response -> applyResponse(response) }
                .onFailure { error ->
                    _state.update {
                        it.copy(isLoading = false, error = error.message ?: "Unable to fetch forecast.")
                    }
                }
        }
    }

    fun retry(units: String = "imperial") {
        state.value.lastMessage?.let { send(it, units) }
    }

    private fun applyResponse(response: ChatResponse) {
        _state.update {
            it.copy(
                isLoading = false,
                conversationId = response.conversationId,
                messages = it.messages + ChatMessage(response.assistantMessage, false),
                cards = response.cards,
                clarification = response.clarification,
                sources = response.sources,
                warnings = response.warnings,
                error = null,
            )
        }
    }
}
