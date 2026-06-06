class Prestamo {
  final int id;
  final String titulo;
  final String autores;
  final String estado;
  final String? fechaVencimiento;
  final int? libroId;

  Prestamo({
    required this.id,
    required this.titulo,
    required this.autores,
    required this.estado,
    this.fechaVencimiento,
    this.libroId,
  });

  factory Prestamo.fromJson(Map<String, dynamic> json) {
    final libro = json['libro'] as Map<String, dynamic>?;
    final material = json['material'] as Map<String, dynamic>?;

    String resolveTitle() {
      return libro?['titulo'] ?? material?['titulo'] ?? json['titulo'] ?? 'Sin título';
    }

    String resolveAutores() {
      final raw = libro?['autores'] ?? json['autores'];
      if (raw == null) return '';
      if (raw is List) {
        return raw.map((a) {
          if (a is Map) {
            final nombres = a['nombres'] ?? a['nombre'] ?? '';
            final apellidos = a['apellidos'] ?? '';
            return '$nombres $apellidos'.trim();
          }
          return a.toString();
        }).where((s) => s.isNotEmpty).join(', ');
      }
      return raw.toString();
    }

    return Prestamo(
      id: json['id'] as int,
      titulo: resolveTitle(),
      autores: resolveAutores(),
      estado: (json['estado'] as String? ?? 'PENDIENTE').toUpperCase(),
      fechaVencimiento: json['fecha_vencimiento'] ?? json['fecha_devolucion'] ?? json['fecha_fin'],
      libroId: libro?['id'] as int? ?? json['libro_id'] as int?,
    );
  }
}
