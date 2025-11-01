#!/data/data/com.termux/files/usr/bin/bash

# Script para ejecutar Agar Roles Game en Termux sin problemas de permisos
# Versión: 1.0

echo "🎮 Iniciando Agar Roles Game en Termux..."
echo "========================================="

# Verificar si estamos en Termux
if [ ! -d "/data/data/com.termux" ]; then
    echo "❌ Error: Este script está diseñado para ejecutarse en Termux"
    echo "Por favor, instala la aplicación desde Termux para ejecutar este juego."
    exit 1
fi

# Cambiar al directorio del juego
cd "$HOME/agar-roles-game" 2>/dev/null || {
    echo "❌ Error: No se encontró el directorio del juego"
    echo "Asegúrate de que el proyecto esté en ~/agar-roles-game"
    exit 1
}

# Verificar si Node.js está disponible
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js en Termux..."
    pkg update && pkg install -y nodejs
fi

# Verificar si Python está disponible
if ! command -v python &> /dev/null; then
    echo "📦 Instalando Python en Termux..."
    pkg update && pkg install -y python
fi

# Instalar servidor HTTP simple
echo "🌐 Iniciando servidor web local..."

# Usar servidor Python HTTP
python -m http.server 8080 > /dev/null 2>&1 &
SERVER_PID=$!

# Esperar un momento para que el servidor inicie
sleep 2

# Verificar si el servidor está funcionando
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "❌ Error: No se pudo iniciar el servidor web"
    exit 1
fi

echo "✅ Servidor iniciado en el puerto 8080"
echo "🎯 URL del juego: http://localhost:8080"
echo "🔗 O accede desde cualquier navegador con: http://127.0.0.1:8080"
echo ""
echo "💡 Instrucciones:"
echo "1. Abre tu navegador en Termux"
echo "2. Navega a: http://localhost:8080"
echo "3. ¡Disfruta jugando!"
echo ""
echo "⚠️  Para detener el servidor, presiona Ctrl+C"

# Abrir automáticamente el navegador (si está disponible)
if command -v termux-open &> /dev/null; then
    echo "🚀 Abriendo navegador automáticamente..."
    sleep 3
    termux-open http://localhost:8080
fi

# Mantener el servidor ejecutándose
trap "echo ''; echo '🛑 Deteniendo servidor...'; kill $SERVER_PID; exit" INT
wait $SERVER_PID