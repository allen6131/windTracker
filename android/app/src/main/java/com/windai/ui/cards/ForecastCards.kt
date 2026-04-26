package com.windai.ui.cards

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.windai.data.api.ForecastCard

@Composable
fun ForecastCards(cards: List<ForecastCard>, modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        cards.forEach { card ->
            ForecastCardView(card)
            Spacer(Modifier.height(10.dp))
        }
    }
}

@Composable
fun ForecastCardView(card: ForecastCard) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .semantics { contentDescription = card.title },
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(card.title, style = MaterialTheme.typography.titleMedium)
            card.subtitle?.let {
                Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Spacer(Modifier.height(8.dp))
            card.items.forEach { item ->
                Text("${item.label}: ${item.value}", style = MaterialTheme.typography.bodyMedium)
            }
        }
    }
}

@Composable fun CurrentConditionsCard(card: ForecastCard) = ForecastCardView(card)
@Composable fun WindCard(card: ForecastCard) = ForecastCardView(card)
@Composable fun MarineCard(card: ForecastCard) = ForecastCardView(card)
@Composable fun BestWindowsCard(card: ForecastCard) = ForecastCardView(card)
@Composable fun TideCard(card: ForecastCard) = ForecastCardView(card)
@Composable fun AlertsCard(card: ForecastCard) = ForecastCardView(card)
