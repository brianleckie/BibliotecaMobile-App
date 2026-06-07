class Libro {
  final int id;
  final String titulo;
  final List<String> autores;
  final String? categoria;
  final int copiasDisponibles;
  final String? isbn;
  final String? anio;
  final String? editorial;
  final String? descripcion;
  final String? portadaUrl;

  Libro({
    required this.id,
    required this.titulo,
    required this.autores,
    this.categoria,
    required this.copiasDisponibles,
    this.isbn,
    this.anio,
    this.editorial,
    this.descripcion,
    this.portadaUrl,
  });

  factory Libro.fromJson(Map<String, dynamic> json) {
    List<String> parseAutores(dynamic raw) {
      if (raw == null) return [];
      if (raw is List) {
        return raw.map((a) {
          if (a is Map) {
            final nombres = a['nombres'] ?? a['nombre'] ?? '';
            final apellidos = a['apellidos'] ?? '';
            return '$nombres $apellidos'.trim();
          }
          return a.toString();
        }).where((s) => s.isNotEmpty).toList();
      }
      return [raw.toString()];
    }

    String? parseCategoria(dynamic raw) {
      if (raw == null) return null;
      if (raw is Map) return raw['descripcion'] ?? raw['nombre'];
      return raw.toString();
    }

    String? parseEditorial(dynamic raw) {
      if (raw == null) return null;
      if (raw is Map) return raw['nombre'];
      return raw.toString();
    }

    return Libro(
      id: json['id'] as int,
      titulo: json['titulo'] as String? ?? 'Sin título',
      autores: parseAutores(json['autores']),
      categoria: parseCategoria(json['categoria']),
      copiasDisponibles: (json['copias_disponibles'] as num?)?.toInt() ?? 0,
      isbn: json['isbn'] as String?,
      anio: (json['anio'] ?? json['año'])?.toString(),
      editorial: parseEditorial(json['editorial']),
      descripcion: json['descripcion'] as String?,
      portadaUrl: json['portada_url'] as String?,
    );
  }
}
