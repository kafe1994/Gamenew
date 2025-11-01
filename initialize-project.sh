#!/bin/bash

# Script para inicializar proyecto Agar Roles Game
# Genera package-lock.json y verifica dependencias

echo "🚀 Inicializando Agar Roles Game..."
echo "=================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json"
    echo "Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

echo "📦 Instalando dependencias..."

# Intentar instalar dependencias localmente
if npm install --no-optional --no-audit --no-fund 2>/dev/null; then
    echo "✅ Dependencias instaladas correctamente"
    
    # Verificar si se generó package-lock.json
    if [ -f "package-lock.json" ]; then
        echo "✅ package-lock.json generado"
    else
        echo "⚠️ package-lock.json no se generó"
    fi
else
    echo "⚠️ Error al instalar dependencias localmente"
    echo "El proyecto funcionará con el package-lock.json básico"
fi

# Verificar estructura del proyecto
echo ""
echo "🔍 Verificando estructura del proyecto..."

if [ -d "www" ]; then
    echo "✅ Directorio www encontrado"
else
    echo "❌ Directorio www no encontrado"
fi

if [ -d "res" ]; then
    echo "✅ Directorio res encontrado"
else
    echo "❌ Directorio res no encontrado"
fi

if [ -f "config.xml" ]; then
    echo "✅ config.xml encontrado"
else
    echo "❌ config.xml no encontrado"
fi

if [ -d ".github/workflows" ]; then
    echo "✅ GitHub Actions configurado"
else
    echo "⚠️ GitHub Actions no configurado"
fi

echo ""
echo "🎯 Inicialización completada!"
echo ""
echo "💡 Para hacer commit de los cambios:"
echo "   git add ."
echo "   git commit -m 'Fix GitHub Actions dependencies issue'"
echo "   git push"
echo ""
echo "🚀 GitHub Actions debería funcionar correctamente ahora"