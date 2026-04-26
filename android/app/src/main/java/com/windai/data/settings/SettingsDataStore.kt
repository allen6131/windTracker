package com.windai.data.settings

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.settingsDataStore by preferencesDataStore("settings")

data class UserSettings(
    val units: String = "imperial",
    val defaultActivity: String = "general",
)

class SettingsDataStore(private val context: Context) {
    private val unitsKey = stringPreferencesKey("units")
    private val activityKey = stringPreferencesKey("default_activity")

    val settings: Flow<UserSettings> = context.settingsDataStore.data.map { prefs ->
        UserSettings(
            units = prefs[unitsKey] ?: "imperial",
            defaultActivity = prefs[activityKey] ?: "general",
        )
    }

    suspend fun setUnits(units: String) {
        context.settingsDataStore.edit { it[unitsKey] = units }
    }

    suspend fun setDefaultActivity(activity: String) {
        context.settingsDataStore.edit { it[activityKey] = activity }
    }
}
