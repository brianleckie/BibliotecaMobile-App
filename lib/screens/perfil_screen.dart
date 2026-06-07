import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';

class PerfilScreen extends StatefulWidget {
  const PerfilScreen({super.key});

  @override
  State<PerfilScreen> createState() => _PerfilScreenState();
}

class _PerfilScreenState extends State<PerfilScreen> {
  late Future<Map<String, dynamic>> _future;

  @override
  void initState() {
    super.initState();
    _future = ApiService.getPerfil();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        if (!auth.isLoggedIn) {
          return Scaffold(
            appBar: AppBar(
              backgroundColor: const Color(0xFF1e3a5f),
              title: const Text('Perfil',
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
                      'Iniciá sesión para ver tu perfil.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 16, color: Color(0xFF5c6671)),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () => Navigator.pushNamed(context, '/login'),
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
            title: const Text('Mi Perfil',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
          ),
          body: FutureBuilder<Map<String, dynamic>>(
            future: _future,
            builder: (context, snap) {
              if (snap.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator(color: Color(0xFF1e3a5f)));
              }
              if (snap.hasError) {
                return Center(
                  child: Text('No se pudo cargar el perfil.', style: TextStyle(color: Colors.red[700])),
                );
              }
              final perfil = snap.data ?? {};
              return _buildPerfil(context, auth, perfil);
            },
          ),
        );
      },
    );
  }

  Widget _buildPerfil(BuildContext context, AuthProvider auth, Map<String, dynamic> perfil) {
    String nombre = perfil['nombre'] as String? ?? '';
    if (nombre.isEmpty) {
      final first = perfil['first_name'] ?? '';
      final last = perfil['last_name'] ?? '';
      nombre = '$first $last'.trim();
    }
    if (nombre.isEmpty) nombre = perfil['username'] as String? ?? '';

    final initial = nombre.isNotEmpty ? nombre[0].toUpperCase() : '?';
    final email = perfil['email'] as String?;

    final datos = <Map<String, dynamic>>[
      {'icon': Icons.person_outline, 'label': 'Nombre', 'valor': nombre},
      {'icon': Icons.alternate_email, 'label': 'Usuario', 'valor': perfil['username']},
      {'icon': Icons.badge_outlined, 'label': 'Carnet', 'valor': perfil['carnet'] ?? perfil['numero_carnet']},
      {'icon': Icons.school_outlined, 'label': 'Curso', 'valor': perfil['curso'] ?? perfil['grado']},
    ].where((d) => d['valor'] != null && d['valor'].toString().isNotEmpty).toList();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            color: const Color(0xFF1e3a5f),
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),
            child: Column(
              children: [
                Container(
                  width: 84,
                  height: 84,
                  decoration: BoxDecoration(
                    color: const Color(0xFFd99a2b),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white.withAlpha(64), width: 3),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    initial,
                    style: const TextStyle(
                      fontSize: 38,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1a3252),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  nombre,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                if (email != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    email,
                    style: TextStyle(fontSize: 12.5, color: Colors.white.withAlpha(191)),
                  ),
                ],
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Mis datos',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Color(0xFF222831)),
                ),
                const SizedBox(height: 8),
                if (datos.isNotEmpty)
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFdde1e6)),
                    ),
                    child: Column(
                      children: datos.asMap().entries.map((e) {
                        final i = e.key;
                        final d = e.value;
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 13),
                          decoration: BoxDecoration(
                            border: i > 0
                                ? const Border(top: BorderSide(color: Color(0xFFdde1e6)))
                                : null,
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFe7eaed),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                alignment: Alignment.center,
                                child: Icon(d['icon'] as IconData, size: 18, color: const Color(0xFF1e3a5f)),
                              ),
                              const SizedBox(width: 13),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      d['label'] as String,
                                      style: const TextStyle(
                                          fontSize: 11.5, color: Color(0xFF929aa4), fontWeight: FontWeight.w500),
                                    ),
                                    Text(
                                      d['valor'].toString(),
                                      style: const TextStyle(
                                          fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF222831)),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      await auth.logout();
                      if (context.mounted) Navigator.pushReplacementNamed(context, '/');
                    },
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFc0492f)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(13)),
                      foregroundColor: const Color(0xFFc0492f),
                    ),
                    icon: const Icon(Icons.logout, size: 19),
                    label: const Text('Cerrar sesión',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
