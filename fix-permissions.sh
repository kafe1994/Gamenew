#!/data/data/com.termux/files/usr/bin/bash

# Script de corrección para Agar Roles Game - Soluciona problemas de permisos
# Versión: 1.1 - Fix para errores de permisos root

echo "🔧 Corrigiendo Agar Roles Game para Termux..."
echo "=============================================="

# Verificar si estamos en Termux
if [ ! -d "/data/data/com.termux" ]; then
    echo "❌ Error: Este script debe ejecutarse en Termux"
    exit 1
fi

# Directorio del proyecto
PROJECT_DIR="$HOME/agar-roles-game"

# Crear respaldo del proyecto original
echo "💾 Creando respaldo..."
if [ -d "$PROJECT_DIR" ]; then
    mv "$PROJECT_DIR" "${PROJECT_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ Respaldo creado"
fi

# Crear nuevo directorio del proyecto
mkdir -p "$PROJECT_DIR"

echo "📁 Creando estructura del proyecto..."

# Crear estructura de directorios necesaria
mkdir -p "$PROJECT_DIR/www"
mkdir -p "$PROJECT_DIR/css"
mkdir -p "$PROJECT_DIR/js"
mkdir -p "$PROJECT_DIR/assets"

# Copiar archivos del juego principal
echo "🎮 Copiando archivos del juego..."

# Crear index.html simplificado (sin Cordova)
cat > "$PROJECT_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agar Roles Game - Termux</title>
    <meta http-equiv="refresh" content="0; url=standalone-game.html">
</head>
<body>
    <p>Redirigiendo al juego...</p>
    <p><a href="standalone-game.html">Haz clic aquí si no se redirige automáticamente</a></p>
</body>
</html>
EOF

# El archivo standalone-game.html ya debería estar copiado
if [ ! -f "$PROJECT_DIR/standalone-game.html" ]; then
    echo "❌ Error: No se encontró standalone-game.html"
    echo "Asegúrate de copiar todos los archivos del proyecto"
    exit 1
fi

# Crear servidor HTTP simple
cat > "$PROJECT_DIR/server.py" << 'EOF'
#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    PORT = 8080
    
    # Cambiar al directorio del script
    os.chdir(Path(__file__).parent)
    
    print(f"🎮 Agar Roles Game Server")
    print(f"🌐 Servidor iniciado en puerto {PORT}")
    print(f"🎯 URL: http://localhost:{PORT}")
    print(f"📱 Para móvil: http://127.0.0.1:{PORT}")
    print("⚠️  Presiona Ctrl+C para detener")
    print("-" * 50)
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Error: El puerto {PORT} ya está en uso")
            print("💡 Intenta: lsof -i :8080 para ver qué proceso lo usa")
            sys.exit(1)
        else:
            raise

if __name__ == "__main__":
    main()
EOF

# Crear script de inicio mejorado
cat > "$PROJECT_DIR/start.sh" << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash

# Script de inicio mejorado para Agar Roles Game
# Versión: 1.1 - Sin problemas de permisos

echo "🎮 Agar Roles Game - Termux Edition"
echo "=================================="

# Verificar si estamos en Termux
if [ ! -d "/data/data/com.termux" ]; then
    echo "❌ Error: Este script requiere Termux"
    echo "📱 Descarga Termux desde F-Droid"
    exit 1
fi

# Cambiar al directorio del script
cd "$(dirname "$0")"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "📦 Instalando Python3..."
    pkg update -y && pkg install -y python
fi

echo "🌐 Iniciando servidor del juego..."

# Iniciar servidor
python3 server.py &
SERVER_PID=$!

echo "✅ Servidor iniciado (PID: $SERVER_PID)"
echo ""
echo "🎯 URLs de acceso:"
echo "   📱 Móvil: http://localhost:8080"
echo "   🖥️  Desktop: http://127.0.0.1:8080"
echo ""
echo "🎮 Juego principal:"
echo "   http://localhost:8080/standalone-game.html"
echo ""
echo "⚠️  Para detener: Ctrl+C en esta terminal"
echo ""

# Función de limpieza
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidor (PID: $SERVER_PID)..."
    kill $SERVER_PID 2>/dev/null
    echo "✅ Servidor detenido correctamente"
    exit 0
}

# Capturar Ctrl+C
trap cleanup INT

# Intentar abrir navegador
if command -v termux-open &> /dev/null; then
    echo "🚀 Abriendo navegador automáticamente..."
    sleep 2
    termux-open http://localhost:8080/standalone-game.html
fi

# Esperar
echo "⏳ Servidor ejecutándose... (Ctrl+C para detener)"
wait $SERVER_PID
EOF

# Crear script de parada
cat > "$PROJECT_DIR/stop.sh" << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash

echo "🛑 Deteniendo Agar Roles Game..."

# Buscar y terminar procesos del servidor
PIDS=$(ps aux | grep "python.*server.py" | grep -v grep | awk '{print $2}')

if [ -n "$PIDS" ]; then
    echo "🔍 Procesos encontrados: $PIDS"
    for PID in $PIDS; do
        echo "❌ Terminando proceso $PID..."
        kill $PID 2>/dev/null
        sleep 1
        kill -9 $PID 2>/dev/null
    done
    echo "✅ Todos los procesos terminados"
else
    echo "ℹ️  No se encontraron procesos del servidor"
fi

# Limpiar puertos
echo "🧹 Limpiando puertos..."
fuser -k 8080/tcp 2>/dev/null

echo "🛑 Servidor detenido correctamente"
EOF

# Hacer scripts ejecutables
chmod +x "$PROJECT_DIR/start.sh"
chmod +x "$PROJECT_DIR/stop.sh"
chmod +x "$PROJECT_DIR/server.py"

# Crear documentación de solución de problemas
cat > "$PROJECT_DIR/TROUBLESHOOTING.md" << 'EOF'
# 🔧 Guía de Solución de Problemas

## ❌ Error: "Unable to create directory /data/data/com.termux/files/home/..."

### Causa
Este error ocurre cuando la aplicación trata de crear directorios del sistema Android que requieren permisos root.

### ✅ Solución
Usa los scripts de inicio incluidos en lugar de ejecutar Cordova directamente:

```bash
# Iniciar el juego correctamente
cd ~/agar-roles-game
./start.sh

# O manualmente
python3 server.py
```

## 🔄 Otras Soluciones

### 1. Problema: "Port already in use"
```bash
# Ver qué proceso usa el puerto
lsof -i :8080

# Detener servidor manualmente
./stop.sh

# O terminar procesos específicos
fuser -k 8080/tcp
```

### 2. Problema: "Node.js not found"
```bash
# Instalar Node.js en Termux
pkg update -y
pkg install -y nodejs
```

### 3. Problema: "Permission denied"
```bash
# Hacer ejecutables los scripts
chmod +x ~/agar-roles-game/*.sh
```

### 4. Problema: "Cannot connect to server"
```bash
# Verificar que el servidor esté ejecutándose
ps aux | grep python

# Reiniciar servidor
./stop.sh
./start.sh
```

## 🆘 Si nada funciona

1. Reinicia Termux:
   ```bash
   exit
   # Abrir Termux nuevamente
   ```

2. Reinstala desde cero:
   ```bash
   rm -rf ~/agar-roles-game
   # Copia nuevamente los archivos
   ```

3. Usa la versión web directamente:
   - Abre tu navegador
   - Ve a: `http://localhost:8080/standalone-game.html`

## 📞 Información del Sistema
- Versión de Termux: Verificable con `termux-info`
- Python: `python3 --version`
- Node.js: `node --version` (opcional)

## 🚫 No uses estos comandos (causan problemas):
- `cordova run android` (requiere permisos root)
- `cordova build` (requiere permisos root)
- Cualquier comando que trate de acceder a `/data/data/`
EOF

# Crear archivo de estado
cat > "$PROJECT_DIR/status.sh" << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash

echo "📊 Estado de Agar Roles Game"
echo "============================"

echo "📁 Directorio: $(pwd)"
echo "🖥️  Sistema: $(uname -a)"
echo ""

echo "🔍 Procesos del servidor:"
PS_OUTPUT=$(ps aux | grep "python.*server.py" | grep -v grep)
if [ -n "$PS_OUTPUT" ]; then
    echo "$PS_OUTPUT"
    echo ""
    echo "✅ Servidor ejecutándose"
else
    echo "❌ Servidor NO ejecutándose"
fi

echo ""
echo "🌐 Estado del puerto 8080:"
if netstat -tuln 2>/dev/null | grep :8080 > /dev/null; then
    echo "✅ Puerto 8080 en uso"
    netstat -tuln | grep :8080
else
    echo "❌ Puerto 8080 libre"
fi

echo ""
echo "📱 URLs disponibles:"
echo "   http://localhost:8080"
echo "   http://localhost:8080/standalone-game.html"
echo ""
echo "💡 Para iniciar: ./start.sh"
echo "🛑 Para detener: ./stop.sh"
EOF

chmod +x "$PROJECT_DIR/status.sh"

echo ""
echo "✅ Corrección completada!"
echo ""
echo "🎯 Para iniciar el juego:"
echo "   cd ~/agar-roles-game"
echo "   ./start.sh"
echo ""
echo "📊 Para verificar estado:"
echo "   ./status.sh"
echo ""
echo "🛑 Para detener servidor:"
echo "   ./stop.sh"
echo ""
echo "📖 Lee TROUBLESHOOTING.md para más ayuda"