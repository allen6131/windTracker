@rem
@rem Minimal Gradle startup script for Windows.
@rem
@echo off
set DIRNAME=%~dp0
set APP_HOME=%DIRNAME%
set CLASSPATH=%APP_HOME%\gradle\wrapper\gradle-wrapper.jar

if not exist "%CLASSPATH%" (
  echo gradle-wrapper.jar is not checked in. Install Gradle or generate the wrapper with: gradle wrapper
  exit /b 1
)

java -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*
