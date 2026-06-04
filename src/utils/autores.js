export function autoresStr(autores) {
  if (!autores) return '';
  if (Array.isArray(autores))
    return autores
      .map(a =>
        a.nombres
          ? `${a.nombres} ${a.apellidos ?? ''}`.trim()
          : (a.nombre ?? String(a))
      )
      .join(', ');
  return String(autores);
}
