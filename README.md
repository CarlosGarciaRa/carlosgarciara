# Mi portafolio

Portafolio personal. Publicado en GitHub Pages.

## Cómo verlo en local

Abre `index.html` en el navegador o usa un servidor local:

```bash
# Con Python 3
python3 -m http.server 8000
# Luego visita http://localhost:8000
```

## Cómo publicar en GitHub Pages (perfil)

1. Crea un repositorio en GitHub con el nombre: **`<tu-usuario>.github.io`** (ej: `carlosgarciara.github.io`).
2. En tu proyecto, inicializa git y sube el código:

   ```bash
   git init
   git add .
   git commit -m "Portafolio inicial"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-usuario>.github.io.git
   git push -u origin main
   ```

3. En el repo: **Settings → Pages**. En "Source" elige **Deploy from a branch**. Rama **main**, carpeta **/ (root)**. Guarda.
4. En unos minutos tu sitio estará en `https://<tu-usuario>.github.io`.

## Personalizar

- Edita `index.html`: cambia "[Tu nombre]", textos, enlaces y añade más tarjetas en `#proyectos`.
- Edita `styles.css` para colores, fuentes y layout.
- Revisa la [documentación de GitHub Pages](https://docs.github.com/en/pages) si quieres dominios propios o Jekyll.
