package com.windai.location

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import com.windai.data.api.Coordinates

class LocationProvider(private val context: Context) {
    fun hasLocationPermission(): Boolean {
        val fine = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
        val coarse = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION)
        return fine == PackageManager.PERMISSION_GRANTED || coarse == PackageManager.PERMISSION_GRANTED
    }

    suspend fun currentLocationOrNull(): Coordinates? {
        // Production implementation should use FusedLocationProviderClient after explicit user tap.
        // The app never continuously tracks location and never sends location unless the user requests it.
        return null
    }
}
