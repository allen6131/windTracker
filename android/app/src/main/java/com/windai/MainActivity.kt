package com.windai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import com.windai.data.api.ApiService
import com.windai.data.repository.ChatRepository
import com.windai.ui.chat.ChatScreen
import com.windai.ui.chat.ChatViewModel
import com.windai.ui.theme.WindAITheme
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import retrofit2.Retrofit

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val json = Json { ignoreUnknownKeys = true }
        val retrofit = Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
        val viewModel = ChatViewModel(ChatRepository(retrofit.create(ApiService::class.java)))
        setContent {
            WindAITheme {
                ChatScreen(viewModel)
            }
        }
    }
}
