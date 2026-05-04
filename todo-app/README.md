# 2Du — To-Do List App

Aplicación móvil de gestión de tareas construida con **Ionic 8 + Angular 20 + Cordova**. Incluye categorías, prioridades, filtros y feature flags con Firebase Remote Config.

## Stack

| Tecnología | Versión |
|---|---|
| Angular | 20 |
| Ionic | 8 |
| Cordova | Latest |
| @ionic/storage-angular | 4 |
| Firebase Remote Config | @angular/fire |
| Node.js requerido | 20.x |

---

## Correr en el navegador

```bash
# 1. Instala dependencias
npm install

# 2. Levanta el servidor de desarrollo
npx ionic serve
```

Abre `http://localhost:8100` en el navegador.

---

## Requisitos para build Android

| Herramienta | Cómo instalar |
|---|---|
| Node.js 20.x | [nodejs.org](https://nodejs.org) |
| Android Studio | [developer.android.com/studio](https://developer.android.com/studio) |
| JDK 17+ | Incluido en Android Studio |
| Gradle | [gradle.org/releases](https://gradle.org/releases) — extraer en `C:\Gradle\` |
| Cordova CLI | `npm i -g cordova @ionic/cli cordova-res` |

### Variables de entorno (Windows)

Abre PowerShell como Administrador:

```powershell
# Android SDK
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\TU_USUARIO\AppData\Local\Android\Sdk", "User")

# Agregar al PATH
$p = [System.Environment]::GetEnvironmentVariable("Path", "User")
[System.Environment]::SetEnvironmentVariable("Path", $p `
  + ";C:\Users\TU_USUARIO\AppData\Local\Android\Sdk\platform-tools" `
  + ";C:\Users\TU_USUARIO\AppData\Local\Android\Sdk\cmdline-tools\latest\bin" `
  + ";C:\Gradle\gradle-9.5.0\bin" `
  + ";C:\Program Files\Android\Android Studio\jbr\bin", "User")
```

Reemplaza `TU_USUARIO` con tu usuario de Windows y ajusta la versión de Gradle.

### Verificar instalación

```bash
java -version      # debe mostrar 17+
gradle -v          # debe mostrar la versión instalada
adb version        # debe responder con un número
```

---

## Generar APK debug

```bash
# 1. Instala dependencias
npm install

# 2. Genera recursos del splash screen
cordova-res android --skip-config --copy

# 3. Build de Angular
npx ng build --configuration=production

# 4. Agrega plataforma Android (solo la primera vez)
npx cordova platform add android

# 5. Genera el APK
npx cordova build android
```

El APK queda en:
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Task, Category
│   │   └── services/        # StorageService, RemoteConfigService
│   ├── shared/
│   │   ├── components/      # BottomNavComponent, AppButtonComponent
│   │   ├── validators/      # noWhitespaceValidator
│   │   └── styles/          # _form-shared.scss
│   └── features/
│       ├── tasks/           # Lista, formulario, filtros
│       ├── categories/      # Lista y formulario de categorías
│       ├── stats/           # Estadísticas de productividad
│       ├── settings/        # Ajustes y limpieza de datos
│       └── feature-flags/   # Debug de Firebase Remote Config
├── theme/
│   └── variables.scss       # Design tokens (--app-*)
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

---

## Firebase Remote Config

La app usa Firebase Remote Config para controlar feature flags en tiempo real sin publicar una nueva versión.

Las credenciales ya están configuradas en `src/environments/`. En Remote Config están definidas estas keys:

| Key | Tipo | Default |
|---|---|---|
| `nueva_ui_estadisticas` | Boolean | `true` |
| `ai_smart_reminders` | Boolean | `false` |
| `custom_themes_v2` | Boolean | `false` |

---

## Funcionalidades

- Crear, editar y eliminar tareas
- Asignar categoría y prioridad (Alta / Media / Baja)
- Marcar tareas como completadas
- Filtrar por categoría y prioridad
- Crear y gestionar categorías con colores
- Estadísticas de progreso por categoría y prioridad
- Feature flags dinámicos con Firebase Remote Config
- Persistencia local con @ionic/storage (SQLite en dispositivo, IndexedDB en web)
