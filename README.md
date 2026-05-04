# 2Du — To-Do List Ionic + Angular + Cordova + Firebase Remote Config

Aplicación móvil híbrida (Android + iOS) de gestión de tareas personales con CRUD de categorías, almacenamiento local persistente y feature flags vía Firebase Remote Config.

> **Stack:** Ionic 8 · Angular 20 · Cordova · Firebase · `@angular/fire`
> **Node requerido:** 20.19+ LTS 
> **JDK requerido (Android):** 17+

---

## Tabla de contenidos

1. [Prerrequisitos](#1-prerrequisitos)
2. [Clonar el repositorio](#2-clonar-el-repositorio)
3. [Instalar dependencias del proyecto](#3-instalar-dependencias-del-proyecto)
4. [Ejecutar en navegador (`ionic serve`)](#4-ejecutar-en-navegador-ionic-serve)
5. [Troubleshooting](#5-troubleshooting)
6. [Estructura del proyecto](#6-estructura-del-proyecto)

---

## 1. Prerrequisitos

Instalar **una sola vez por máquina**:

### 1.1 Node.js 20 LTS

Descargar desde [nodejs.org](https://nodejs.org) o vía `nvm`:

```powershell
# Verificar versión (debe ser 20.19.x o superior)
node --version
npm --version
```

### 1.2 CLIs globales

```powershell
npm install -g @ionic/cli cordova cordova-res
```

Verificar:

```powershell
ionic --version
cordova --version
ng version
```

### 1.3 Para builds Android

| Componente | Versión |
|---|---|
| **JDK** | 17+ (incluido en Android Studio) |
| Android Studio | Latest |
| Android SDK Command-line Tools | Latest (instalar desde SDK Manager) |
| Gradle | 9.5.0 |

```powershell
# Verificar JDK 17
java -version
# Debe imprimir: openjdk version "17.x.x"
```

Variables de entorno necesarias:

```powershell
# Ejemplo PowerShell (ajustar rutas reales)
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.10-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\cmdline-tools\latest\bin"
```

### 1.4 Para builds iOS (solo macOS)

- macOS 13+
- Xcode 15+
- CocoaPods 1.14+: `sudo gem install cocoapods`
- iOS deployment target: 13.0+

---

## 2. Clonar el repositorio

```powershell
git clone <https://github.com/sebashdm1/2du-app.git> 2Du
cd 2Du
```

---

## 3. Instalar dependencias del proyecto

> **Nota:** El proyecto Angular vive en la subcarpeta [todo-app/](todo-app/). Todos los comandos `npm`/`ionic`/`cordova` se ejecutan **dentro de esa carpeta**.

### 3.1 Entrar al proyecto e instalar

```powershell
cd todo-app
npm install
```

Esto instala todas las dependencias declaradas en [todo-app/package.json](todo-app/package.json) en `node_modules/`. Versiones críticas pinadas (ver [docs/architecture/spikes/spike-ionic-cordova-firebase.md](docs/architecture/spikes/spike-ionic-cordova-firebase.md)):

| Paquete | Versión exacta |
|---|---|
| `@ionic/angular` | 7.8.6 |
| `@angular/core` y resto | 17.3.12 |
| `@angular/fire` | 17.1.0 |
| `firebase` | 10.13.2 (NO 11.x) |
| `@ionic/storage-angular` | 4.0.0 |
| `localforage-cordovasqlitedriver` | 1.8.0 |

### 3.2 Agregar plataformas Cordova

```powershell
cordova platform add android@13.0.0
cordova platform add ios@7.1.1     # solo en macOS
```

### 3.3 Instalar plugins Cordova

```powershell
cordova plugin add cordova-sqlite-storage@6.1.0
cordova plugin add cordova-plugin-androidx-adapter
```

> **No instalar** `cordova-plugin-whitelist` — ya viene embebido en cordova-android 10+.

### 3.4 Verificar la instalación

```powershell
cordova requirements
```

Debe reportar `Installed` para Java JDK, Android SDK y Gradle.

---


## 4. Generar APK Android

```powershell
cd todo-app

# Genera los recursos del splash screen
cordova-res android --skip-config --copy

# Build de Angular
npx ng build --configuration=production

# Agrega plataforma Android (solo la primera vez)
npx cordova platform add android

# Genera el APK
npx cordova build android
```

El APK queda en:
```
todo-app/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 5. Ejecutar en navegador (`ionic serve`)

Modo desarrollo con hot-reload. El driver SQLite no carga en browser — cae automáticamente a IndexedDB (esto es esperado, ver [docs/architecture/decisions/ADR-002-storage-strategy.md](docs/architecture/decisions/ADR-002-storage-strategy.md)).

```powershell
cd todo-app
ionic serve
```

Abre `http://localhost:8100` automáticamente.

---


## 5. Troubleshooting


### Problemas comunes

- Si `ionic serve` falla por versión de Node, asegúrate de tener Node 20.19.x o superior (pero no Node 22+).
- Si `npm install` da errores de dependencias, prueba con `npm install --legacy-peer-deps`.

---

## 6. Estructura del proyecto

```
2Du/
├── todo-app/                      # Proyecto Ionic + Angular
│   ├── src/
│   │   ├── main.ts                # Bootstrap standalone
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts      # Providers: Firebase, Storage, Router
│   │   │   ├── app.routes.ts      # Lazy loading de páginas
│   │   │   ├── core/
│   │   │   │   ├── models/        # Task, Category
│   │   │   │   ├── services/      # StorageService, RemoteConfigService
│   │   │   │   └── utils/
│   │   │   └── features/
│   │   │       ├── tasks/pages/task-list/
│   │   │       └── categories/pages/category-list/
│   │   ├── environments/          # Config Firebase
│   │   └── theme/                 # Variables Ionic
│   ├── platforms/                 # Generado por Cordova (no commitear)
│   ├── plugins/                   # Plugins Cordova instalados
│   ├── www/                       # Build web (no commitear)
│   └── config.xml                 # Configuración Cordova
```

---

## Licencia

Desarrollado por Sebastian Hernandez.
