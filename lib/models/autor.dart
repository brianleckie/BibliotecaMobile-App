class Autor {
  final int id;
  final String nombreCompleto;
  final String? pais;
  final String? anioNacimiento;

  Autor({
    required this.id,
    required this.nombreCompleto,
    this.pais,
    this.anioNacimiento,
  });

  factory Autor.fromJson(Map<String, dynamic> json) {
    final nombres = json['nombres'] ?? json['nombre'] ?? '';
    final apellidos = json['apellidos'] ?? '';
    final nombre = '$nombres $apellidos'.trim();

    String? parsePais(dynamic raw) {
      if (raw == null) return null;
      if (raw is Map) return raw['nombre'];
      return raw.toString();
    }

    String? parseAnio() {
      final anio = json['anio_nacimiento'];
      if (anio != null) return anio.toString();
      final fecha = json['fecha_nacimiento'] as String?;
      if (fecha != null && fecha.length >= 4) return fecha.substring(0, 4);
      return null;
    }

    return Autor(
      id: json['id'] as int,
      nombreCompleto: nombre.isEmpty ? '—' : nombre,
      pais: parsePais(json['pais']) ?? json['nacionalidad'] as String?,
      anioNacimiento: parseAnio(),
    );
  }
}
