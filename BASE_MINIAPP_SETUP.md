# Base Mini App Setup Guide

## ✅ Completado

1. ✅ Manifest file creado en `/public/.well-known/farcaster.json`
2. ✅ Todas las imágenes generadas (icon, splash, hero, og-image, screenshots)
3. ✅ Metadata configurada según especificaciones de Base:
   - subtitle: max 30 chars ✓
   - tags: max 5 tags ✓
   - ogTitle: max 30 chars ✓
   - ogDescription: max 100 chars ✓
   - description: max 170 chars ✓

## 📋 Pasos Post-Deployment

Después de desplegar en Vercel, debes completar el **Account Association**:

### 1. Desplegar en Vercel

```bash
# Tu repo ya está listo en GitHub
# Importa en Vercel: https://vercel.com/new
# Root directory: frontend
```

### 2. Completar Account Association

Una vez que tu app esté live en Vercel:

1. Ve a: https://www.base.dev/preview?tab=account

2. Pega tu dominio de Vercel (ej: `baseproof.vercel.app`) en el campo **App URL**

3. Haz clic en **Submit**

4. Haz clic en **Verify** y firma el manifest con tu wallet

5. La herramienta generará los campos `accountAssociation`:
   - `header`
   - `payload`
   - `signature`

6. Copia esos valores y actualiza tu archivo `/public/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "TU_VALOR_GENERADO",
    "payload": "TU_VALOR_GENERADO",
    "signature": "TU_VALOR_GENERADO"
  },
  "miniapp": {
    // ... resto del config
  }
}
```

7. Commit y push los cambios:

```bash
git add frontend/public/.well-known/farcaster.json
git commit -m "Add account association to farcaster manifest"
git push origin main
```

8. Vercel desplegará automáticamente los cambios

### 3. Verificar que el Manifest sea Accesible

Tu manifest debe estar disponible en:
```
https://baseproof.vercel.app/.well-known/farcaster.json
```

Verifica que sea accesible públicamente usando curl:
```bash
curl https://baseproof.vercel.app/.well-known/farcaster.json
```

### 4. Compartir en Farcaster

Una vez que el manifest esté completo con el account association:

1. Publica un cast en Farcaster con tu URL
2. La plataforma Base indexará tu Mini App
3. Tu app aparecerá en la búsqueda y descubrimiento de Base App

## 🔍 Validación

Para validar que todo esté configurado correctamente:

- [ ] El manifest está accesible en `/.well-known/farcaster.json`
- [ ] Todas las imágenes (icon, splash, hero, screenshots) están accesibles
- [ ] El account association está completo (header, payload, signature)
- [ ] Has compartido el link en Farcaster para activar la indexación
- [ ] Tu Mini App aparece en Base App

## 📱 URLs de las Imágenes

Todas estas URLs deben estar accesibles:
- Icon: https://baseproof.vercel.app/icon.png (1024x1024px)
- Splash: https://baseproof.vercel.app/splash.png (200x200px)
- Hero: https://baseproof.vercel.app/hero.png (1200x630px)
- OG Image: https://baseproof.vercel.app/og-image.png (1200x630px)
- Screenshots: https://baseproof.vercel.app/screenshot[1-3].png (1284x2778px)

## 🎯 Categorías y Tags

**Primary Category:** `utility`

**Tags:** (máximo 5)
- certification
- timestamp
- legal
- documents
- blockchain

## ⚠️ Notas Importantes

1. **noindex** está en `false` para producción - tu app será indexable
2. Si despliegas a staging, cambia `noindex: true` para evitar indexación
3. Los cambios al manifest toman efecto cuando redespliegues y compartas nuevamente
4. La plataforma re-indexa la configuración actualizada

## 🔗 Recursos

- [Base Mini Apps Docs](https://docs.base.org/mini-apps)
- [Account Association Tool](https://www.base.dev/preview?tab=account)
- [Mini App Assets Generator](https://www.miniappassets.com/)
- [Mini App Display Specs](https://docs.base.org/images/miniapps/miniapp-design-spec.png)
