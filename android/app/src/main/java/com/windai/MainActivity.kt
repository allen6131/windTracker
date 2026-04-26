package com.windai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.windai.ui.chat.ChatScreen
import com.windai.ui.theme.WindAITheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            WindAITheme {
                ChatScreen()
            }
        }
    }
}
