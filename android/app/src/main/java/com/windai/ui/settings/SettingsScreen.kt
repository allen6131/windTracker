package com.windai.ui.settings

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.AssistChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SettingsScreen(
    units: String,
    activity: String,
    permissionStatus: String,
    onUnitsSelected: (String) -> Unit,
    onActivitySelected: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(modifier.padding(16.dp)) {
        Text("Settings", style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(16.dp))
        Text("Units", style = MaterialTheme.typography.titleMedium)
        Row(Modifier.fillMaxWidth()) {
            listOf("imperial", "knots", "metric").forEach {
                AssistChip(onClick = { onUnitsSelected(it) }, label = { Text(if (it == units) "✓ $it" else it) })
            }
        }
        Spacer(Modifier.height(16.dp))
        Text("Default activity", style = MaterialTheme.typography.titleMedium)
        Row(Modifier.fillMaxWidth()) {
            listOf("general", "kitesurfing", "sailing", "surfing").forEach {
                AssistChip(onClick = { onActivitySelected(it) }, label = { Text(if (it == activity) "✓ $it" else it) })
            }
        }
        Spacer(Modifier.height(16.dp))
        Text("Location permission: $permissionStatus")
        Spacer(Modifier.height(16.dp))
        Text("Data sources", style = MaterialTheme.typography.titleMedium)
        Text("Mobile apps call the backend only. OpenAI, Open-Meteo, NOAA, Google, Stormglass, and Meteomatics keys stay server-side.")
        Spacer(Modifier.height(12.dp))
        Text(
            "Forecasts are estimates and can change. This app is not a substitute for official marine, aviation, emergency, or local safety guidance.",
            style = MaterialTheme.typography.bodySmall,
        )
    }
}
