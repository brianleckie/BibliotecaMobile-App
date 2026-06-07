import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/libro.dart';
import '../widgets/availability_badge.dart';

class DetalleLibroScreen extends StatelessWidget {
  const DetalleLibroScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final libro = ModalRoute.of(context)!.settings.arguments as Libro;
    final available = libro.copiasDisponibles > 0;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF1e3a5f),
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text(
          'Detalle del libro',
          style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w600),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: _buildCover(libro),
            ),
            const SizedBox(height: 20),
            Text(
              libro.titulo,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Color(0xFF222831),
                height: 1.3,
              ),
            ),
            if (libro.autores.isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(
                libro.autores.join(', '),
                style: const TextStyle(fontSize: 15, color: Color(0xFF5c6671)),
              ),
            ],
            const SizedBox(height: 12),
            Row(
              children: [
                AvailabilityBadge(
                  available: available,
                  count: available ? libro.copiasDisponibles : null,
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Divider(color: Color(0xFFdde1e6)),
            const SizedBox(height: 16),
            _buildInfoTable(libro),
            if (libro.descripcion != null && libro.descripcion!.isNotEmpty) ...[
              const SizedBox(height: 20),
              const Text(
                'Descripción',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF222831)),
              ),
              const SizedBox(height: 8),
              Text(
                libro.descripcion!,
                style: const TextStyle(fontSize: 14, color: Color(0xFF5c6671), height: 1.6),
              ),
            ],
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton(
                onPressed: () => Navigator.pop(context),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF1e3a5f)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text(
                  'Volver',
                  style: TextStyle(color: Color(0xFF1e3a5f), fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCover(Libro libro) {
    if (libro.portadaUrl != null && libro.portadaUrl!.isNotEmpty) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: CachedNetworkImage(
          imageUrl: libro.portadaUrl!,
          width: 140,
          height: 200,
          fit: BoxFit.cover,
          placeholder: (_, __) => _placeholderCover(libro),
          errorWidget: (_, __, ___) => _placeholderCover(libro),
        ),
      );
    }
    return _placeholderCover(libro);
  }

  Widget _placeholderCover(Libro libro) {
    final initial = libro.titulo.isNotEmpty ? libro.titulo[0].toUpperCase() : '?';
    return Container(
      width: 140,
      height: 200,
      decoration: BoxDecoration(
        color: const Color(0xFF1e3a5f),
        borderRadius: BorderRadius.circular(10),
      ),
      alignment: Alignment.center,
      child: Text(
        initial,
        style: const TextStyle(fontSize: 64, fontWeight: FontWeight.bold, color: Colors.white),
      ),
    );
  }

  Widget _buildInfoTable(Libro libro) {
    final rows = <Map<String, String?>>[
      {'label': 'Categoría', 'value': libro.categoria},
      {'label': 'Editorial', 'value': libro.editorial},
      {'label': 'Año', 'value': libro.anio},
      {'label': 'ISBN', 'value': libro.isbn},
    ].where((r) => r['value'] != null && r['value']!.isNotEmpty).toList();

    if (rows.isEmpty) return const SizedBox.shrink();

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFdde1e6)),
      ),
      child: Column(
        children: rows.asMap().entries.map((e) {
          final i = e.key;
          final row = e.value;
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              border: i > 0 ? const Border(top: BorderSide(color: Color(0xFFdde1e6))) : null,
            ),
            child: Row(
              children: [
                SizedBox(
                  width: 90,
                  child: Text(
                    row['label']!,
                    style: const TextStyle(fontSize: 12.5, color: Color(0xFF929aa4), fontWeight: FontWeight.w500),
                  ),
                ),
                Expanded(
                  child: Text(
                    row['value']!,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF222831)),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
