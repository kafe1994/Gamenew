#!/bin/bash

# Script de build local para Agar.io: Roles Edition
# Este script facilita la compilación local del APK

set -e

echo "🚀 Iniciando build local de Agar.io: Roles Edition"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar dependencias
check_dependencies() {
    log "Verificando dependencias..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js no está instalado"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm no está instalado"
        exit 1
    fi
    
    if ! command -v java &> /dev/null; then
        log_error "Java JDK no está instalado"
        exit 1
    fi
    
    log_success "Todas las dependencias están disponibles"
}

# Instalar dependencias
install_dependencies() {
    log "Instalando dependencias npm..."
    npm install
    
    # Intentar instalar Cordova globalmente si es posible
    if command -v npm &> /dev/null; then
        if sudo npm install -g cordova@latest; then
            log_success "Cordova instalado globalmente"
        else
            log_warning "No se pudo instalar Cordova globalmente, se usará local"
        fi
    fi
}

# Verificar estructura del proyecto
check_project_structure() {
    log "Verificando estructura del proyecto..."
    
    if [ ! -f "config.xml" ]; then
        log_error "config.xml no encontrado"
        exit 1
    fi
    
    if [ ! -d "www" ]; then
        log_error "Directorio www no encontrado"
        exit 1
    fi
    
    if [ ! -f "www/index.html" ]; then
        log_error "index.html no encontrado"
        exit 1
    fi
    
    log_success "Estructura del proyecto verificada"
}

# Preparar proyecto
prepare_project() {
    log "Preparando proyecto..."
    
    # Crear plataformas si no existen
    if [ ! -d "platforms" ]; then
        log "Creando directorio de plataformas..."
        mkdir -p platforms
    fi
    
    # Limpiar archivos previos
    if [ -d "platforms/android" ]; then
        log "Limpiando build anterior..."
        rm -rf platforms/android
    fi
    
    log_success "Proyecto preparado"
}

# Añadir plataforma Android
add_android_platform() {
    log "Añadiendo plataforma Android..."
    
    if command -v cordova &> /dev/null; then
        cordova platform add android@latest --verbose
        log_success "Plataforma Android añadida"
    else
        log_warning "Cordova no disponible globalmente, usando npm scripts"
    fi
}

# Instalar plugins
install_plugins() {
    log "Instalando plugins de Cordova..."
    
    if command -v cordova &> /dev/null; then
        cordova plugin add cordova-plugin-whitelist --verbose
        cordova plugin add cordova-plugin-statusbar --verbose
        cordova plugin add cordova-plugin-vibration --verbose
        cordova plugin add cordova-plugin-splashscreen --verbose
        log_success "Plugins instalados"
    else
        log_warning "Cordova no disponible, saltando instalación de plugins"
    fi
}

# Compilar APK
build_apk() {
    local build_type="${1:-debug}"
    
    log "Compilando APK ($build_type)..."
    
    if command -v cordova &> /dev/null; then
        if [ "$build_type" = "release" ]; then
            cordova build android --release --verbose
        else
            cordova build android --debug --verbose
        fi
        log_success "APK compilado exitosamente"
    else
        log_error "Cordova no disponible para compilación"
        exit 1
    fi
}

# Mostrar resultados
show_results() {
    log "Mostrando resultados del build..."
    
    if [ -d "platforms/android/app/build/outputs/apk" ]; then
        echo ""
        log_success "APKs generados:"
        find platforms/android/app/build/outputs/apk -name "*.apk" -type f -exec ls -lh {} \;
        
        echo ""
        log "Información del APK:"
        if [ -f "platforms/android/app/build/outputs/apk/debug/app-debug.apk" ]; then
            echo "Debug APK:"
            aapt dump badging platforms/android/app/build/outputs/apk/debug/app-debug.apk | grep -E "package|sdkVersion|targetSdkVersion" || echo "aapt no disponible"
        fi
        
        if [ -f "platforms/android/app/build/outputs/apk/release/app-release.apk" ]; then
            echo "Release APK:"
            aapt dump badging platforms/android/app/build/outputs/apk/release/app-release.apk | grep -E "package|sdkVersion|targetSdkVersion" || echo "aapt no disponible"
        fi
    else
        log_warning "No se encontraron APKs generados"
    fi
}

# Función principal
main() {
    local build_type="${1:-debug}"
    
    echo ""
    echo "=========================================="
    echo "  AGAR.IO: ROLES EDITION - BUILD SCRIPT"
    echo "=========================================="
    echo ""
    
    check_dependencies
    install_dependencies
    check_project_structure
    prepare_project
    add_android_platform
    install_plugins
    build_apk "$build_type"
    show_results
    
    echo ""
    log_success "¡Build completado exitosamente!"
    echo ""
}

# Ayuda
show_help() {
    echo "Uso: $0 [opciones] [tipo_build]"
    echo ""
    echo "Opciones:"
    echo "  -h, --help     Mostrar esta ayuda"
    echo "  --check-only   Solo verificar dependencias y estructura"
    echo ""
    echo "Tipos de build:"
    echo "  debug          Build de debug (por defecto)"
    echo "  release        Build de release"
    echo ""
    echo "Ejemplos:"
    echo "  $0                    # Build de debug"
    echo "  $0 release            # Build de release"
    echo "  $0 --check-only       # Solo verificar"
}

# Procesar argumentos
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    --check-only)
        check_dependencies
        check_project_structure
        log_success "Verificación completada"
        exit 0
        ;;
    debug|release|"")
        main "${1:-debug}"
        ;;
    *)
        log_error "Opción desconocida: $1"
        show_help
        exit 1
        ;;
esac