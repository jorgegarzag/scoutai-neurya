# ScoutAI by Neurya — Guía de Despliegue en Vercel

## ¿Qué es esto?
Sistema completo de reclutamiento de jugadores de fútbol con IA.
El frontend HTML se conecta a un proxy en `/api/chat` que llama a la API de Anthropic de forma segura.

---

## PASO A PASO — 10 minutos

### 1. Crear cuenta en GitHub (si no tienes)
Ve a https://github.com y crea una cuenta gratuita.

### 2. Subir estos archivos a GitHub
- Ve a https://github.com/new
- Nombre del repositorio: `scoutai-neurya`
- Público o Privado (cualquiera funciona)
- Clic en "Create repository"
- Sube todos los archivos de esta carpeta:
  - `/api/chat.js`
  - `/public/index.html`
  - `vercel.json`
  - `package.json`

### 3. Crear cuenta en Vercel (gratis)
Ve a https://vercel.com y regístrate con tu cuenta de GitHub.

### 4. Importar proyecto
- En Vercel: "New Project" → "Import Git Repository"
- Selecciona `scoutai-neurya`
- Clic en "Deploy" (sin cambiar nada más)

### 5. Agregar la API Key de Anthropic (MUY IMPORTANTE)
Esto es lo que resuelve el error — la key vive en el servidor, no en el navegador.

En Vercel, una vez desplegado:
1. Ve a tu proyecto → "Settings" → "Environment Variables"
2. Agrega:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-TU-KEY-AQUI`
3. Clic en "Save"
4. Ve a "Deployments" → clic en los 3 puntos del último deploy → "Redeploy"

### 6. ¡Listo!
Vercel te da una URL como: `https://scoutai-neurya.vercel.app`
Comparte esa URL con cualquier equipo de fútbol — funciona en cualquier dispositivo.

---

## Estructura del proyecto
```
scoutai-neurya/
├── api/
│   └── chat.js          ← Proxy seguro a Anthropic API
├── public/
│   └── index.html       ← App completa ScoutAI
├── vercel.json          ← Configuración de rutas
└── package.json         ← Metadata del proyecto
```

---

## Costo estimado
- Vercel: GRATIS (plan hobby)
- Anthropic API: ~$0.01-0.03 USD por análisis completo
- Con $10 USD tienes ~500-800 análisis completos

---

## Soporte
Desarrollado por Neurya · neurya.ai
