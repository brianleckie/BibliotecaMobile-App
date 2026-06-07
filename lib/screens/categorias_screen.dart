import 'package:flutter/material.dart';
import '../models/categoria.dart';
import '../services/api_service.dart';
import '../widgets/user_menu_button.dart';
import 'main_screen.dart';

class CategoriasScreen extends StatefulWidget {
  const CategoriasScreen({super.key});

  @override
  State<CategoriasScreen> createState() => _CategoriasScreenState();
}

class _CategoriasScreenState extends State<CategoriasScreen> {
  bool _loading = true;
  String? _error;
  List<Categoria> _categorias = [];

  @override
  void initState() {
    super.initState();
    _fetchCategorias();
  }

  Future<void> _fetchCategorias() async {
    try {
      final data = await ApiService.getCategorias();
      final results = data['results'] ?? data;
      final list = results is List ? results : [];
      setState(() {
        _categorias = list.map((e) => Categoria.fromJson(e)).toList();
        _loading = false;
      });
    } catch (_) {
      setState(() {
        _error = 'No se pudieron cargar las categorías.';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF1e3a5f),
        title: const Text(
          'Categorías',
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w600),
        ),
        actions: const [UserMenuButton()],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF1e3a5f)))
          : _error != null
              ? Center(child: Text(_error!, style: const TextStyle(color: Color(0xFFc0492f))))
              : _buildList(),
    );
  }

  Widget _buildList() {
    if (_categorias.isEmpty) {
      return const Center(
        child: Text('No hay categorías disponibles.', style: TextStyle(color: Color(0xFF929aa4))),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _categorias.length,
      itemBuilder: (context, i) => _buildCard(_categorias[i]),
    );
  }

  Widget _buildCard(Categoria categoria) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(
            builder: (_) => MainScreen(
              initialIndex: 0,
              initialCategoriaId: categoria.id,
            ),
          ),
          (route) => false,
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFdde1e6)),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFF1e3a5f).withAlpha(230),
                borderRadius: BorderRadius.circular(12),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.menu_book, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    categoria.displayName,
                    style: const TextStyle(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF222831),
                      height: 1.25,
                    ),
                  ),
                  if (categoria.descripcion != null &&
                      categoria.descripcion != categoria.nombre) ...[
                    const SizedBox(height: 2),
                    Text(
                      categoria.nombre,
                      style: const TextStyle(fontSize: 12, color: Color(0xFF5c6671)),
                    ),
                  ],
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Color(0xFF929aa4), size: 20),
          ],
        ),
      ),
    );
  }
}
