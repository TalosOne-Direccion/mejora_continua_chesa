# Metodología: LLM Wiki

El patrón **LLM Wiki** es un sistema para construir bases de conocimiento personales acumulativas en colaboración con un modelo de lenguaje (LLM). A diferencia de los sistemas RAG tradicionales, el LLM Wiki destila y sintetiza la información de manera persistente en páginas Markdown interconectadas.

---

## 🧠 Idea Central

*   **RAG Tradicional**: Recupera fragmentos de documentos en tiempo de consulta. La IA "redescubre" el conocimiento desde cero cada vez.
*   **LLM Wiki**: Compila la información de forma incremental. Al añadir una fuente, el agente actualiza notas de conceptos, resúmenes e índices. El conocimiento se sintetiza una vez y se mantiene actualizado.
*   **Obsidian como Interfaz**: El usuario usa Obsidian como su "IDE de conocimiento" y el agente actúa como el "programador" que mantiene las notas ordenadas y cruzadas.

---

## 🏗️ Arquitectura de Tres Capas

1.  **Fuentes Crudas (`/raw`)**: Documentos inmutables (artículos, transcripciones, audios). La fuente de verdad.
2.  **La Wiki (`/wiki`)**: Documentos generados por el LLM. Notas de conceptos, resúmenes, relaciones.
3.  **El Esquema (`.agents/AGENTS.md`)**: Las reglas y protocolos que guían al agente sobre cómo formatear e ingestar información.

---

## 🛠️ Operaciones Clave

*   **Ingest (Ingesta)**: El agente lee una fuente de `/raw`, crea/actualiza notas en `/wiki/`, genera enlaces bidireccionales y actualiza el índice y registro de actividades.
*   **Query (Consulta)**: El usuario pregunta, el agente consulta `wiki/index.md` para localizar las notas relevantes, y responde sintetizando con citas de las notas.
*   **Lint (Limpieza)**: Auditoría del estado de la wiki buscando contradicciones entre notas antiguas y nuevas, enlaces rotos o notas huérfanas.

---

## 📂 Archivos de Navegación

*   **`wiki/index.md`**: El catálogo clasificado de todo el contenido de la wiki.
*   **`wiki/log.md`**: El registro cronológico e inmutable de actividades.

---

## 🔗 Relaciones Recomendadas
*   Consulte el manual del agente en: [AGENTS.md](file:///c:/Users/carlo/Documents/GitHub/modo-ágil---grupo-chesa/mejora_continua_chesa/.agents/AGENTS.md)
