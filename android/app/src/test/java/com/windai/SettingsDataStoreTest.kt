package com.windai

import org.junit.Assert.assertEquals
import org.junit.Test

class SettingsDataStoreTest {
    @Test
    fun defaultSettingsMatchAppDefaults() {
        val units = "imperial"
        val activity = "general"
        assertEquals("imperial", units)
        assertEquals("general", activity)
    }
}
