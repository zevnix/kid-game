# ¡Aprende Jugando! - Juego Educativo Interactivo 🚀

Este es un juego educativo interactivo diseñado especialmente para niños. Está desarrollado con tecnologías modernas (Next.js, React, Tailwind CSS) y está pensado para ser seguro, divertido y muy fácil de usar.

## 🌟 Características Principales

1. **Matemáticas (`/math`)**: Aprende a sumar, restar, multiplicar y dividir con operaciones simples, recompensas visuales (confeti) y auditivas.
2. **Letras (`/letters`)**: Abecedario interactivo. Al tocar una letra, el navegador la pronunciará. Las vocales tienen una pequeña celebración.
3. **Colores (`/colors`)**: Tarjetas de colores que dicen su nombre en voz alta al ser tocadas.
4. **Formas Geométricas (`/shapes`)**: Figuras básicas con animaciones y voz.
5. **Animales (`/animals`)**: Divertidos animales. Al tocarlos, escucharás su nombre y el sonido que hacen (onomatopeya).
6. **Dibujo Libre (`/draw`)**: Una pizarra digital para dibujar con diferentes colores y tamaños de pincel.
7. **Pintar Dibujos (`/color`)**: Un libro de colorear donde los niños pueden rellenar formas con un solo clic.
8. **Panel de Administrador (`/admin`)**: Un área protegida con PIN para que los padres o profesores puedan añadir nuevos animales o dibujos al juego.

*Otras funciones incluyen vibración en móviles (haptic feedback), animaciones fluidas, un contador de estrellas como sistema de recompensas y diseño amigable (botones grandes, colores pastel).*

---

## 🛠️ ¿Cómo visualizar y jugar en tu computadora (laptop)?

Dado que este proyecto está construido con un framework llamado Next.js (React), **no se puede abrir simplemente haciendo doble clic en un archivo en GitHub**. Necesitas ejecutar un "servidor de desarrollo" en tu computadora.

### Opción 1: Ejecutarlo localmente en tu laptop (Recomendado)

Sigue estos pasos detallados:

1. **Instalar Node.js:**
   - Ve a la página oficial de [Node.js](https://nodejs.org/es/).
   - Descarga e instala la versión recomendada (LTS). Esto instalará `node` y `npm` en tu sistema.

2. **Descargar el código:**
   - En esta página de GitHub, busca el botón verde que dice **"<> Code"**.
   - Haz clic y selecciona **"Download ZIP"**.
   - Descomprime el archivo ZIP en una carpeta de tu computadora.

3. **Abrir la terminal:**
   - Abre la "Terminal" (en Mac/Linux) o el "Símbolo del sistema / PowerShell" (en Windows).
   - Navega hasta la carpeta donde descomprimiste el juego usando el comando `cd`. (Ejemplo: `cd Descargas/kids-educational-game`).

4. **Instalar dependencias y arrancar:**
   - Escribe el siguiente comando y presiona Enter para instalar las librerías necesarias:
     ```bash
     npm install
     ```
   - Una vez que termine, escribe este comando para encender el juego:
     ```bash
     npm run dev
     ```

5. **¡A jugar!**
   - Abre tu navegador web (Chrome, Edge, Safari, etc.) y visita la siguiente dirección: **`http://localhost:3000`**
   - ¡Listo! Deberías ver la pantalla principal del juego.

### Opción 2: Desplegarlo gratis en Internet (Para que cualquiera pueda jugar)

Si quieres tener un enlace público sin instalar nada en tu PC, puedes usar plataformas como **Vercel**:
1. Crea una cuenta gratuita en [Vercel.com](https://vercel.com/).
2. Haz clic en "Add New..." -> "Project".
3. Conecta tu cuenta de GitHub e importa este repositorio.
4. Vercel hará toda la magia por ti y te dará un enlace web (ejemplo: `mi-juego-ninos.vercel.app`) para que lo abras desde tu laptop, celular o tablet.

---

## 🔒 Panel de Administrador (Para Padres)

Para entrar al panel de ajustes en el juego, haz clic en "Panel de Padres" en el menú principal.
**El PIN por defecto para esta versión es: `12345`**

Dentro podrás:
- Añadir nuevos animales (colocando un emoji, nombre y sonido).
- Añadir nuevos dibujos para colorear (usando rutas SVG).
