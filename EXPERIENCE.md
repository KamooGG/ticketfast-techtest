# EXPERIENCE.md

## Desafío Técnico
Durante los últimos 12 meses enfrenté un problema de rendimiento en el frontend: una tabla con más de 10.000 registros que tardaba varios segundos en cargarse.  
El retraso no solo afectaba la experiencia de usuario, sino que también generaba bloqueos en la interfaz, ya que el navegador intentaba renderizar todos los elementos al mismo tiempo.  
Esto hacía que la aplicación se sintiera lenta, especialmente en equipos de gama media o baja, y además aumentaba el consumo de memoria.

## Cómo lo resolví
1. **Análisis inicial**  
   Revisé la implementación existente y confirmé que el problema se debía a que el renderizado intentaba pintar todas las filas de la tabla simultáneamente, incluso las que no eran visibles en pantalla.

2. **Primer intento con paginación**  
   Implementé paginación para mostrar solo un subconjunto de los registros (por ejemplo, 50 por página).  
   Esto redujo la carga inicial, pero obligaba a los usuarios a hacer clic constantemente para moverse entre páginas, lo que no resultaba cómodo para explorar grandes volúmenes de datos.

3. **Prueba con renderizado virtual**  
   Investigando alternativas, encontré la técnica de renderizado virtual, donde solo se generan en el DOM los elementos visibles y se van reemplazando dinámicamente al hacer scroll.  
   Implementé esta técnica en Vue usando una librería especializada, lo que permitió que la tabla se comportara como infinita, sin necesidad de dividirla en páginas manuales.

4. **Ajustes y optimizaciones adicionales**  
   - Añadí un *skeleton loader* para mostrar un indicador visual mientras los datos cargaban, mejorando la percepción de rendimiento.  
   - Implementé un debounce en el scroll para reducir cálculos innecesarios.  
   - Probé con diferentes configuraciones de buffer (cantidad de elementos extra renderizados fuera de la vista) hasta lograr un balance entre fluidez y uso de memoria.

5. **Validación**  
   Realicé pruebas con datos reales (más de 10.000 registros) y medí métricas de carga usando Chrome DevTools.  
   El tiempo de renderizado pasó de más de 6 segundos a menos de 1 segundo, incluso en equipos con recursos limitados.

## Alternativas
- **Paginación simple**  
  - Fácil de implementar.  
  - Poco fluida, los usuarios tenían que moverse entre páginas constantemente.  

- **Renderizado virtual (opción elegida)**  
  - Mucho más fluido, el usuario siente que navega en una sola lista infinita.  
  - Aprovecha mejor los recursos del navegador.  
  - Requiere más esfuerzo inicial y cuidado en detalles de scroll y buffer.  

## Impacto
- El tiempo de carga se redujo de 6 segundos a menos de 1 segundo, mejorando notablemente la experiencia de usuario.  
- Los usuarios pudieron navegar por la tabla sin bloqueos ni ralentizaciones, incluso en dispositivos con menos potencia.  
- El equipo adoptó este patrón como estándar para otros componentes que manejan grandes volúmenes de datos, evitando problemas similares en el futuro.  
- La aplicación se volvió más escalable y mantuvo un rendimiento estable al crecer el número de registros.  
