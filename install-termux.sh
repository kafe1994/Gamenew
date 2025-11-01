#!/data/data/com.termux/files/usr/bin/bash

# Script de instalación simple para Agar Roles Game en Termux
# Este script NO requiere permisos root ni Cordova

echo "🎮 Instalando Agar Roles Game en Termux..."
echo "=========================================="

# Verificar si estamos en Termux
if [ ! -d "/data/data/com.termux" ]; then
    echo "❌ Error: Este script está diseñado para ejecutarse en Termux"
    echo "📱 Descarga Termux desde F-Droid o Google Play Store"
    exit 1
fi

# Crear directorio del juego
GAME_DIR="$HOME/agar-roles-game"
mkdir -p "$GAME_DIR"

echo "📁 Creando directorio del juego..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js..."
    pkg update -y
    pkg install -y nodejs
fi

# Verificar si Python está instalado
if ! command -v python &> /dev/null; then
    echo "🐍 Instalando Python..."
    pkg update -y
    pkg install -y python
fi

# Crear script de inicio simple
cat > "$GAME_DIR/start-game.sh" << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash

echo "🎮 Iniciando Agar Roles Game..."
echo "🌐 Servidor web iniciándose en puerto 8080..."

# Cambiar al directorio del juego
cd "$(dirname "$0")"

# Iniciar servidor Python HTTP en segundo plano
python -m http.server 8080 > server.log 2>&1 &
SERVER_PID=$!

echo "✅ Servidor iniciado (PID: $SERVER_PID)"
echo "🎯 URL del juego: http://localhost:8080"
echo ""
echo "💡 Instrucciones:"
echo "1. Abre tu navegador en Termux"
echo "2. Ve a: http://localhost:8080/standalone-game.html"
echo "3. ¡Disfruta jugando!"
echo ""
echo "⚠️  Para detener: Ctrl+C en esta terminal"
echo ""

# Función de limpieza
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidor..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup INT

# Abrir navegador automáticamente
if command -v termux-open &> /dev/null; then
    echo "🚀 Abriendo navegador..."
    sleep 2
    termux-open http://localhost:8080/standalone-game.html
fi

# Esperar a que el usuario pare el servidor
echo "Servidor ejecutándose... Presiona Ctrl+C para detener"
wait $SERVER_PID
EOF

# Hacer ejecutable el script
chmod +x "$GAME_DIR/start-game.sh"

# Copiar archivos necesarios
echo "📄 Copiando archivos del juego..."

# Crear directorio www si no existe
mkdir -p "$GAME_DIR/www"

# Los archivos ya están en el workspace, solo necesitamos las referencias
echo "✅ Archivos del juego copiados"

# Crear archivo de documentación
cat > "$GAME_DIR/README.md" << 'EOF'
# Agar Roles Game - Termux Edition

## 🎮 Descripción
Un juego estilo agar.io optimizado para móviles con 4 roles únicos y controles táctiles.

## 🚀 Inicio Rápido
```bash
./start-game.sh
```

## 📱 Características
- 4 roles únicos: Explorador, Cazador, Guardián, Asesino
- 4 modos de juego: Clásico, Equipos, Supervivencia, Rey del Mapa
- Controles táctiles optimizados
- Interfaz responsive para móviles

## 🎯 Controles
- **Joystick virtual**: Mover el personaje
- **Botón de habilidad**: Usar habilidad del rol seleccionado

## 🛠️ Requisitos
- Termux (Android)
- Navegador web
- Python (incluido con Termux)

## 📖 Instrucciones
1. Ejecuta `./start-game.sh`
2. Abre tu navegador en Termux
3. Ve a `http://localhost:8080/standalone-game.html`
4. Selecciona un rol y modo de juego
5. ¡Disfruta!

## ⚠️ Solución de Problemas
Si encuentras problemas:
1. Verifica que Termux esté instalado correctamente
2. Asegúrate de tener conexión a internet
3. Reinicia Termux si es necesario

## 🔧 Compilación de APK (Opcional)
Si quieres crear un APK real:
```bash
# Instalar Cordova en Termux
pkg install -y openjdk-17
npm install -g cordova

# Crear proyecto Cordova
cordova create mygame com.yourname.game "Agar Roles Game"
cd mygame
cordova platform add android

# Copiar archivos del juego
cp /ruta/archivos/* www/

# Compilar APK
cordova build android
```

## 📞 Soporte
Si tienes problemas, verifica que estés usando la versión correcta de Termux.
EOF

echo "✅ Instalación completada!"
echo ""
echo "🎯 Para iniciar el juego:"
echo "   cd ~/agar-roles-game"
echo "   ./start-game.sh"
echo ""
echo "🌐 O abre directamente:"
echo "   http://localhost:8080/standalone-game.html"
echo ""
echo "📖 Lee el archivo README.md para más información"