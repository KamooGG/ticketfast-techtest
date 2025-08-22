# EXPERIENCE.md

## Desafío Técnico
Durante los últimos 12 meses enfrenté un problema de **rendimiento en el frontend**: una tabla con más de 10.000 registros que tardaba varios segundos en cargarse y hacía que la aplicación se sintiera lenta.

## Cómo lo resolví
1. Analicé el código y detecté que todos los registros se renderizaban al mismo tiempo.  
2. Implementé **paginación** y luego probé con **renderizado virtual** para cargar solo los elementos visibles en pantalla.  
3. Opté por la solución de renderizado virtual con Vue, ya que daba una mejor experiencia al usuario.  
4. Realicé pruebas con datos reales y medí la mejora en el tiempo de carga.  

## Alternativas
- **Paginación simple** → fácil de implementar, pero menos fluida.  
- **Renderizado virtual (opción elegida)** → más esfuerzo inicial, pero mejor experiencia para tablas muy grandes.  

## Impacto
- El tiempo de carga se redujo de **6 segundos a menos de 1 segundo**.  
- Los usuarios pudieron navegar por la tabla sin bloqueos.  
- El equipo adoptó este patrón para otros componentes pesados.  
