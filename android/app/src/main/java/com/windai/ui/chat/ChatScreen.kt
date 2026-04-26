package com.windai.ui.chat

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.windai.data.api.Coordinates
import com.windai.ui.cards.ForecastCards

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(viewModel: ChatViewModel, onUseLocation: (() -> Unit)? = null) {
    val state by viewModel.state.collectAsState()
    var draft by remember { mutableStateOf("Is South Padre good for kiteboarding tomorrow afternoon?") }

    Scaffold(topBar = { TopAppBar(title = { Text("Wind AI") }) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            LazyColumn(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(state.messages) { message ->
                    Text("${if (message.isUser) "You" else "Wind AI"}: ${message.text}")
                }
                state.response?.let { response ->
                    item { ForecastCards(response.cards, response.sources, response.warnings) }
                    if (response.clarification.needed) {
                        item {
                            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                Text(response.clarification.question ?: "Which location did you mean?")
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    response.clarification.choices.take(3).forEach { choice ->
                                        AssistChip(
                                            onClick = { viewModel.send("Use ${choice.label}") },
                                            label = { Text(choice.label) }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
            state.errorMessage?.let {
                Text(it)
                TextButton(onClick = { viewModel.send(draft) }) { Text("Retry") }
            }
            if (state.isLoading) CircularProgressIndicator(modifier = Modifier.semantics { contentDescription = "Loading forecast" })
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(value = draft, onValueChange = { draft = it }, modifier = Modifier.weight(1f), label = { Text("Ask about wind or marine conditions") })
                Button(onClick = { viewModel.send(draft) }, enabled = !state.isLoading) { Text("Send") }
            }
            Button(onClick = { onUseLocation?.invoke(); viewModel.send(draft, Coordinates(0.0, 0.0)) }) {
                Text("Use current location")
            }
            Spacer(Modifier.height(4.dp))
        }
    }
}
