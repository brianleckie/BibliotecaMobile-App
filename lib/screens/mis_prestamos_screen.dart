import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/prestamo.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';

const _estadoConfig = {
  'PENDIENTE': {'color': Color(0xFFc98a12), 'bg': Color(0xFFfbf0d8), 'label': 'Pendiente'},
  'ENTREGADO': {'color': Color(0xFF2f8f5b), 'bg': Color(0xFFe7f3ec), 'label': 'Entregado'},
  'VENCIDO': {'color': Color(0xFFc0492f), 'bg': Color(0xFFf7e9e4), 'label': 'Vencido'},
};

class MisPrestamosScreen extends StatefulWidget {
  const MisPrestamosScreen({super.key});

  @override
  State<MisPrestamosScreen> createState() => _MisPrestamosScreenState();
}

class _MisPrestamosScreenState extends State<MisPrestamosScreen> {
  late Future<List<Prestamo>> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<List<Prestamo>> _load() async {
    final list = await ApiService.getMisPrestamos();
    return list.map((e) => Prestamo.fromJson(e)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        if (!auth.isLoggedIn) {
          return Scaffold(
            appBar: AppBar(
              backgroundColor: const Color(0xFF1e3a5f),
              title: const Text('Mis Préstamos',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
            ),
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.lock_outline, size: 56, color: Colors.grey[400]),
                    const SizedBox(height: 16),
                    const Text(
                      'Iniciá sesión para ver tus préstamos.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 16, color: Color(0xFF5c6671)),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () => Navigator.pushNamed(
                        context,
                        '/login',
                        arguments: {'message': 'Iniciá sesión para ver tus préstamos.'},
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1e3a5f),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Iniciar sesión'),
                    ),
                  ],
                ),
              ),
            ),
          );
        }

        return Scaffold(
          appBar: AppBar(
            backgroundColor: const Color(0xFF1e3a5f),
            title: const Text('Mis Préstamos',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
          ),
          body: FutureBuilder<List<Prestamo>>(
            future: _future,
            builder: (context, snap) {
              if (snap.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator(color: Color(0xFF1e3a5f)));
              }
              if (snap.hasError) {
                return Center(
                  child: Text('No se pudieron cargar los préstamos.',
                      style: TextStyle(color: Colors.red[700])),
                );
              }
              final prestamos = snap.data ?? [];
              if (prestamos.isEmpty) {
                return Center(
                  child: Padding(
                    padding: const EdgeInsets.all(40),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.bookmark_border, size: 56, color: Colors.grey[400]),
                        const SizedBox(height: 16),
                        const Text(
                          'Todavía no tenés préstamos',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF222831)),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Cuando retires un libro de la biblioteca, vas a verlo acá con su fecha de vencimiento.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 13.5, color: Color(0xFF5c6671), height: 1.5),
                        ),
                      ],
                    ),
                  ),
                );
              }

              final activos = prestamos.where((p) => p.estado != 'ENTREGADO').length;

              return ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  const Text(
                    'Mis Préstamos',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF222831)),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$activos activo${activos != 1 ? 's' : ''} · ${prestamos.length} en total',
                    style: const TextStyle(fontSize: 13, color: Color(0xFF5c6671)),
                  ),
                  const SizedBox(height: 16),
                  ...prestamos.map((p) => _buildCard(context, p)),
                ],
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildCard(BuildContext context, Prestamo p) {
    final cfg = _estadoConfig[p.estado] ?? _estadoConfig['PENDIENTE']!;
    final color = cfg['color'] as Color;
    final bg = cfg['bg'] as Color;
    final label = cfg['label'] as String;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFdde1e6)),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(width: 4, color: color),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(13),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        p.titulo,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF222831),
                          height: 1.25,
                        ),
                      ),
                      if (p.autores.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(p.autores,
                            style: const TextStyle(fontSize: 12, color: Color(0xFF5c6671))),
                      ],
                      if (p.fechaVencimiento != null) ...[
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            const Icon(Icons.calendar_today_outlined, size: 13, color: Color(0xFF929aa4)),
                            const SizedBox(width: 5),
                            Text(
                              'Vence ${p.fechaVencimiento}',
                              style: const TextStyle(fontSize: 11.5, color: Color(0xFF929aa4)),
                            ),
                          ],
                        ),
                      ],
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: bg,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          label,
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
