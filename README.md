# Agar.io: Roles Edition - Enhanced Mobile Game

Un emocionante juego tipo agar.io con roles únicos, gráficos mejorados y optimización para dispositivos móviles.

## 🎮 Características

### Roles Únicos
- **🐺 DEPREDADOR**: Rápido y agresivo, efectivo contra Tanques
- **🛡️ TANQUE**: Lento pero resistente, efectivo contra Sanadores  
- **👤 SIGILO**: Sigiloso y rápido, efectivo contra Depredadores
- **💚 SANADOR**: Regenera salud, efectivo contra Sigilosos

### Modos de Juego
- **🏆 CLÁSICO**: Modo tradicional con dificultad normal
- **⚡ SUPERVIVENCIA**: Sobrevive el mayor tiempo posible
- **⏱️ TIEMPO**: 3 minutos para conseguir la mayor puntuación
- **🐝 ENJAMBRE**: Muchos enemigos pequeños y rápidos

### Mejoras Técnicas
- ✨ Gráficos mejorados con efectos de partículas
- 📱 Optimización completa para móviles
- 🎮 Controles táctiles intuitivos
- ⚡ Rendimiento optimizado
- 🌟 Efectos visuales avanzados
- 💫 Sistema de trails y explosiones

## 🚀 Instalación y Compilación

### Requisitos Previos

```bash
# Instalar Node.js (versión 16 o superior)
# Instalar Java JDK 11 o superior
# Instalar Android Studio y SDK
# Instalar Gradle
```

### Configuración del Entorno

1. **Instalar Cordova CLI:**
```bash
npm install -g cordova
```

2. **Instalar dependencias del proyecto:**
```bash
npm install
```

3. **Configurar Android SDK:**
```bash
export ANDROID_HOME=/ruta/a/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Comandos de Desarrollo

```bash
# Preparar proyecto
npm run prepare

# Compilar APK de debug
npm run build

# Compilar APK de release
npm run build:release

# Instalar en dispositivo conectado
npm run deploy

# Probar en emulador
npm run test:emulator

# Servidor de desarrollo local
npm run dev
```

## 📱 Compilación con GitHub Actions

El proyecto incluye un pipeline automatizado para compilación:

### Características del Pipeline
- ✅ Compilación automática en cada push
- 🏗️ Build de APK de debug y release
- 📱 Tests en emulador Android
- 📦 Subida automática de artifacts
- 🐛 Detección de errores de compilación

### Configuración Requerida

1. **Configurar secrets en GitHub:**
   - `ANDROID_SIGNING_KEY`: Clave de firma para release
   - `KEYSTORE_PASSWORD`: Contraseña del keystore
   - `KEY_PASSWORD`: Contraseña de la clave

2. **Configurar Android SDK en Actions:**
   - El pipeline incluye setup automático del SDK
   - Instala Android API 33 y build tools

### Uso del Pipeline

```bash
# Hacer commit y push
git add .
git commit -m "Update game features"
git push origin main

# El APK se generará automáticamente en Actions
```

## 🎯 Estructura del Proyecto

```
agar-roles-game/
├── www/                    # Archivos web del juego
│   ├── index.html         # Página principal
│   ├── css/
│   │   └── style.css      # Estilos mejorados
│   └── js/
│       └── game.js        # Motor del juego optimizado
├── config.xml             # Configuración de Cordova
├── package.json           # Dependencias y scripts
├── .github/
│   └── workflows/
│       └── build.yml      # Pipeline de GitHub Actions
└── res/                   # Recursos (iconos, splash)
    ├── android/           # Iconos Android
    └── ios/               # Iconos iOS (futuro)
```

## 🛠️ Desarrollo

### Archivos Principales

- **`www/index.html`**: Interfaz del juego con UI responsive
- **`www/css/style.css`**: Estilos mejorados con animaciones CSS
- **`www/js/game.js`**: Motor del juego con 1600+ líneas de código optimizado
- **`config.xml`**: Configuración de la app móvil

### Características Técnicas

- **Performance**: 60 FPS objetivo con optimización de renderizado
- **Memory**: Gestión eficiente de partículas y trails
- **Touch**: Controles táctiles multi-touch
- **Responsive**: Adaptable a cualquier tamaño de pantalla
- **Battery**: Optimizado para consumo de batería

### Debug y Testing

```bash
# Servidor local para testing web
npm run dev

# Logs del emulador
adb logcat | grep -i cordova

# Instalar en dispositivo específico
adb devices
adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## 📊 Performance

- **FPS**: 60 FPS en dispositivos modernos
- **Memory**: < 100MB RAM en uso normal
- **Battery**: Optimizado para largas sesiones
- **Size**: APK ~15-20MB con todos los assets

## 🐛 Troubleshooting

### Errores Comunes

1. **Error de compilación SDK:**
```bash
# Verificar variables de entorno
echo $ANDROID_HOME
echo $PATH

# Instalar SDK missing
sdkmanager "platforms;android-33"
```

2. **Error de firma en release:**
```bash
# Generar keystore nuevo
keytool -genkey -v -keystore release-key.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```

3. **Performance en emulador:**
```bash
# Usar emulador con aceleración por hardware
emulator -avd your_avd_name -gpu host
```

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear una rama feature
3. Commit cambios
4. Push a la rama
5. Abrir un Pull Request

## 📞 Soporte

- **Email**: developer@agarroles.game
- **Issues**: [GitHub Issues](https://github.com/agarroles/game/issues)
- **Web**: https://agarroles.game

---

**Agar.io: Roles Edition v2.0** - Enhanced Mobile Gaming Experience 🎮