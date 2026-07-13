# Reglas de Operación del Agente (LLM Wiki)

Este archivo define el comportamiento y las normas que yo (el Agente de IA) debo seguir para mantener la base de conocimiento estructurada (wiki) de este proyecto en colaboración contigo.

---

## 📖 Roles y Responsabilidades
1.  **El Usuario** es el curador y estratega. Tú decides qué fuentes agregar, qué preguntas investigar y qué prioridades tenemos en el código.
2.  **El Agente (yo)** es el bibliotecario y ejecutor. Hago el trabajo de formatear, resumir, cruzar referencias y escribir código basado en las notas.

---

## 📁 Estructura del Conocimiento
*   `/raw/`: Contiene archivos de origen inmutables (artículos clipped, notas de voz, requerimientos del usuario, logs brutos). Yo nunca los modifico.
*   `/wiki/`: Contiene las notas curadas, resúmenes, conceptos e índices de la wiki creados y mantenidos por mí en formato Markdown.

---

## 🛠️ Protocolos de Operación

### 📥 Protocolo de Ingesta (Ingest)
Cuando agregues un nuevo archivo a `/raw/` y me pidas procesarlo, yo debo:
1.  Leer el archivo de origen en `/raw/`.
2.  Identificar qué conceptos clave, entidades o reglas de código se mencionan.
3.  Determinar qué páginas en `/wiki/` deben actualizarse o crearse.
4.  Realizar las modificaciones correspondientes en los archivos de `/wiki/`.
5.  Añadir enlaces de referencia cruzada (`[[nombre_de_nota]]` o enlaces markdown) entre notas relevantes.
6.  Actualizar el índice general en `/wiki/index.md`.
7.  Registrar la operación en `/wiki/log.md` usando el formato:
    `### [YYYY-MM-DD] ingest | Nombre del archivo original - Resumen corto`

### 🔍 Protocolo de Consulta (Query)
Cuando me hagas una pregunta sobre el conocimiento acumulado:
1.  Debo consultar primero `/wiki/index.md` para encontrar las páginas con mayor relevancia semántica.
2.  Leeré las páginas correspondientes de `/wiki/` para fundamentar mi respuesta.
3.  Te responderé citando y enlazando las notas de origen.
4.  *Tip*: Si la respuesta a tu consulta genera una nueva síntesis o comparación valiosa, te sugeriré crear una nota nueva en `/wiki/` para guardar ese conocimiento.

### 🧹 Protocolo de Limpieza (Lint)
Cuando me pidas auditar la wiki, escanearé `/wiki/` buscando:
1.  **Contradicciones**: Datos antiguos que chocan con nuevas fuentes ingeridas.
2.  **Enlaces rotos o vacíos**: Notas enlazadas que aún no existen.
3.  **Páginas huérfanas**: Archivos en `/wiki/` que no tienen ningún enlace apuntando a ellos desde otras notas o desde el índice.
4.  **Conceptos huérfanos**: Palabras clave repetidas en la wiki que merecen su propia nota.

---

## 📝 Formato de las Notas de la Wiki
*   Usar títulos y subtítulos claros (`#`, `##`).
*   Incluir enlaces cruzados de forma abundante para conectar conceptos.
*   Mantener las notas concisas para facilitar la lectura de ambos.
