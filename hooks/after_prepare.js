#!/bin/bash

# Hook de pre-compilación para Agar.io: Roles Edition
# Este script se ejecuta antes de compilar la aplicación

echo "🚀 Iniciando pre-compilación de Agar.io: Roles Edition..."

# Verificar estructura del proyecto
if [ ! -f "config.xml" ]; then
    echo "❌ Error: config.xml no encontrado"
    exit 1
fi

if [ ! -d "www" ]; then
    echo "❌ Error: directorio www no encontrado"
    exit 1
fi

# Crear directorio de build si no existe
mkdir -p platforms/android/app/src/main/assets/www

# Copiar archivos web al directorio de assets
echo "📁 Copiando archivos web..."
rsync -av --exclude='*.md' --exclude='*.json' --exclude='node_modules' --exclude='.git' ./www/ platforms/android/app/src/main/assets/www/

# Verificar que los archivos se copiaron correctamente
if [ ! -f "platforms/android/app/src/main/assets/www/index.html" ]; then
    echo "❌ Error: No se pudo copiar index.html"
    exit 1
fi

# Verificar que cordova.js existe
if [ ! -f "platforms/android/app/src/main/assets/www/cordova.js" ]; then
    echo "⚠️  Advertencia: cordova.js no encontrado, creando placeholder..."
    echo '// Placeholder for Cordova in development mode' > platforms/android/app/src/main/assets/www/cordova.js
fi

echo "✅ Pre-compilación completada exitosamente"

# Crear archivo de versión
echo "2.0.0" > platforms/android/app/src/main/assets/www/version.txt
echo "Built on: $(date)" >> platforms/android/app/src/main/assets/www/version.txt