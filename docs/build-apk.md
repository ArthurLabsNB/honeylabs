# Análisis del proceso de generación de APK

Este repositorio usa **Next.js** para la web y **Capacitor** para empaquetar la aplicación móvil. Cuando un administrador genera un APK se ejecutan los siguientes pasos:

1. `next build` compila la aplicación web en la carpeta `out`.
2. Capacitor copia el resultado a `android/app/src/main/assets/public` y prepara los plugins definidos en `capacitor.config.ts`.
3. Gradle firma la app usando las variables `ANDROID_KEYSTORE_PATH`, `KEYSTORE_PASSWORD`, `KEY_ALIAS` y `KEY_PASSWORD` presentes en el entorno.
4. El workflow de GitHub ejecuta `./gradlew assembleRelease` y genera `app-release.apk` en `android/app/build/outputs/apk/release/`.
5. El script `scripts/update-app-info.js` actualiza `lib/app-info.json` con la versión y la URL del APK.

De esta forma, la aplicación Android incluye el código web optimizado y los plugins nativos configurados. El archivo final se distribuye desde `/public/downloads` o desde el enlace firmado en S3.
