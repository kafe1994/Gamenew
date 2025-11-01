# 🔧 SOLUCIÓN AL ERROR DE PERMISOS - Agar Roles Game

## ❌ El Problema
```
TAG: 2.14.5-clone(24011893)
PERMISSION: ROOT
java.io.IOException: Unable to create directory /data/data/com.termux/files/home/agar-roles-game/res/android/drawable-ldpi
```

## ✅ La Solución Completa

He creado una **solución sin permisos root** que permite ejecutar el juego correctamente en Termux.

### 📁 Archivos Creados para la Solución:

1. **`fix-permissions.sh`** - Script de corrección completo
2. **`install-termux.sh`** - Instalación simplificada 
3. **`run-in-termux.sh`** - Ejecución directa sin Cordova
4. **`standalone-game.html`** - Versión del juego SIN Cordova
5. **`server.py`** - Servidor HTTP simple en Python
6. **`start.sh`** - Script de inicio mejorado
7. **`stop.sh`** - Script para detener servidor
8. **`status.sh`** - Verificar estado del sistema
9. **`TROUBLESHOOTING.md`** - Guía completa de solución de problemas

## 🚀 Pasos para Solucionar:

### Opción 1: Corrección Automática (Recomendada)
```bash
# 1. Ve al directorio del juego
cd ~/agar-roles-game

# 2. Ejecuta el script de corrección
bash fix-permissions.sh

# 3. Inicia el juego
./start.sh
```

### Opción 2: Instalación Limpia
```bash
# 1. Ejecuta el instalador
bash install-termux.sh

# 2. Ve al directorio creado
cd ~/agar-roles-game

# 3. Inicia el juego
./start.sh
```

### Opción 3: Ejecución Directa
```bash
# 1. Ve al directorio del juego
cd ~/agar-roles-game

# 2. Ejecuta directamente
bash run-in-termux.sh
```

## 🎯 URLs de Acceso:

Una vez iniciado el servidor, puedes acceder al juego desde:

- **Móvil**: http://localhost:8080/standalone-game.html
- **Desktop**: http://127.0.0.1:8080/standalone-game.html

## 🔧 ¿Por qué ocurre este error?

1. **Cordova requiere permisos root** para crear directorios del sistema Android
2. **Termux no tiene acceso root** por seguridad
3. **La solución evita Cordova** y usa un servidor web simple

## ✅ Ventajas de la Nueva Solución:

- ✅ **Sin permisos root** requeridos
- ✅ **Carga más rápida** (sin Cordova)
- ✅ **Compatibilidad total** con Termux
- ✅ **Mismo gameplay** y características
- ✅ **Controles táctiles** optimizados
- ✅ **Servidor local** seguro

## 🛠️ Comandos Útiles:

```bash
# Verificar estado del servidor
./status.sh

# Detener servidor manualmente
./stop.sh

# Ver procesos activos
ps aux | grep python

# Verificar puerto 8080
netstat -tuln | grep 8080
```

## 📖 Características del Juego:

- 🎮 **4 Roles únicos**: Explorador, Cazador, Guardián, Asesino
- 🏆 **4 Modos de juego**: Clásico, Equipos, Supervivencia, Rey del Mapa
- 📱 **Controles táctiles** optimizados para móviles
- 🎨 **Interfaz responsive** con animaciones
- 🔄 **Partidas dinámicas** con IA

## ⚠️ Importante:

**NO uses estos comandos** (causan el error de permisos):
- `cordova run android`
- `cordova build`
- Cualquier comando que trate de acceder a `/data/data/`

## 🆘 Si tienes problemas:

1. **Lee** `TROUBLESHOOTING.md`
2. **Ejecuta** `./status.sh` para diagnosticar
3. **Reinicia** Termux si es necesario
4. **Usa** `http://localhost:8080/standalone-game.html` directamente

## 🎉 ¡Resultado Final!

El juego funcionará perfectamente **SIN** requerir permisos root, con la misma experiencia de juego optimizada para móviles.

---

**Nota**: Esta solución transforma tu aplicación Cordova en una aplicación web que se ejecuta en un servidor HTTP local, eliminando completamente la necesidad de permisos del sistema Android.