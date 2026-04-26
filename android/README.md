# WindAI Android

Native Kotlin + Jetpack Compose Android app for the Wind AI Forecast API.

## Stack

- Kotlin
- Jetpack Compose + Material 3
- MVVM with `StateFlow`
- Retrofit + OkHttp
- Kotlinx Serialization
- Coroutines
- DataStore preferences
- Runtime fine/coarse location permissions only when the user taps **Use current location**

## Backend

Set `BASE_URL` in `app/build.gradle.kts` to your backend URL. The default Android emulator URL is:

```kotlin
buildConfigField("String", "BASE_URL", "\"http://10.0.2.2:3000/api/\"")
```

No OpenAI, Open-Meteo, NOAA, Google, Stormglass, or Meteomatics keys are stored in this app.

## Run

Open this directory in Android Studio, install an Android SDK, then run the `app` configuration.

## Test

```bash
./gradlew test
```

The checked-in wrapper scripts require a verified `gradle-wrapper.jar`. If it is missing, install Gradle locally and run:

```bash
gradle wrapper --gradle-version 8.9
```

This Linux VM may not include the Android SDK; Android Studio locally is the recommended validation path.
