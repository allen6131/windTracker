package com.windai

import com.windai.data.api.ChatRequest
import com.windai.data.api.ChatResponse
import com.windai.data.api.Clarification
import com.windai.data.repository.ChatRepository
import com.windai.ui.chat.ChatViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class ChatViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before
    fun setup() {
        Dispatchers.setMain(dispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun sendMessageUpdatesSuccessState() = runTest {
        val repository = object : ChatRepository {
            override suspend fun sendMessage(
                message: String,
                conversationId: String?,
                units: String,
                userLocation: com.windai.data.api.Coordinates?,
            ): Result<ChatResponse> =
                Result.success(
                    ChatResponse(
                        conversationId = "c1",
                        assistantMessage = "Looks windy.",
                        clarification = Clarification(false, null, emptyList()),
                    ),
                )
        }
        val viewModel = ChatViewModel(repository)

        viewModel.send("South Padre tomorrow")
        advanceUntilIdle()

        assertFalse(viewModel.state.value.isLoading)
        assertEquals("Looks windy.", viewModel.state.value.messages.last().text)
        assertTrue(viewModel.state.value.error == null)
    }
}
