package com.windai

import com.windai.data.api.ChatResponse
import kotlinx.serialization.json.Json
import org.junit.Assert.assertEquals
import org.junit.Test

class ChatResponseSerializationTest {
    @Test
    fun decodesChatResponse() {
        val json = """
            {
              "conversationId":"c1",
              "assistantMessage":"Looks breezy.",
              "clarification":{"needed":false,"question":null,"choices":[]},
              "cards":[{"type":"current_conditions","title":"Wind","items":[{"label":"Wind","value":"15 mph"}]}],
              "timeSeries":[],
              "sources":[{"provider":"Open-Meteo","dataset":"Forecast API","fetchedAt":"2026-04-26T12:00:00Z"}],
              "warnings":[]
            }
        """.trimIndent()
        val decoded = Json { ignoreUnknownKeys = true }.decodeFromString<ChatResponse>(json)
        assertEquals("c1", decoded.conversationId)
        assertEquals("Wind", decoded.cards.first().title)
    }
}
