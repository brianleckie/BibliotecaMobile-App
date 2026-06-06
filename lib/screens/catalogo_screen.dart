import 'dart:async';
import 'package:flutter/material.dart';
import '../models/libro.dart';
import '../models/categoria.dart';
import '../services/api_service.dart';
import '../widgets/availability_badge.dart';
import '../widgets/user_menu_button.dart';

const List<Color> _spineColors = [
  Color(0xFF1f3a5f),
  Color(0xFF2f8f5b),
  Color(0xFF7c3aed),
  Color(0xFF0891b2),
  Color(0xFFbe185d),
  Color(0xFFc98a12),
  Color(0xFFb45309),
  Color(0xFF0f766e),
];

Color _spineColor(int id) => _spineColors[id % _spineColors.length];

class CatalogoScreen extends StatefulWidget {
  final int? initialCategoriaId;

  const CatalogoScreen({super.key, this.initialCategoriaId});

  @override
  State<CatalogoScreen> createState() => _CatalogoScreenState();
}

class _CatalogoScreenState extends State<CatalogoScreen> {
  final _searchController = TextEditingController();
  Timer? _debounce;

  String _query = '';
  bool _soloDisponibles = false;
  int? _categoriaId;
  int _page = 1;
  bool _hasNext = false;
  bool _hasPrev = false;
  int _total = 0;
  bool _loading = true;
  String? _error;

  List<Libro> _libros = [];
  List<Categoria> _categorias = [];

  @override
  void initState() {
    super.initState();
    _categoriaId = widget.initialCategoriaId;
    _loadCategorias();
    _fetchLibros();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadCategorias() async {
    try {
      final data = await ApiService.getCategorias();
      final list = data['results'] ?? data['data'] ?? data;
      if (list is List) {
        setState(() => _categorias = list.map((e) => Categoria.fromJson(e)).toList());
      }
    } catch (_) {}
  }

  Future<void> _fetchLibros() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await ApiService.getLibros(
        q: _query.isEmpty ? null : _query,
        categoriaId: _categoriaId,
        soloDisponibles: _soloDisponibles,
        page: _page,
      );
      final results = data['results'] ?? data;
      final list = results is List ? results : [];
      setState(() {
        _libros = list.map((e) => Libro.fromJson(e)).toList();
        _hasNext = data['next'] != null;
        _hasPrev = data['previous'] != null;
        _total = (data['count'] as num?)?.toInt() ?? list.length;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'No se pudieron cargar los libros.';
        _loading = false;
      });
    }
  }

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      setState(() {
        _query = value;
        _page = 1;
      });
      _fetchLibros();
    });
  }

  void _selectCategoria(int? id) {
    setState(() {
      _categoriaId = id;
      _page = 1;
    });
    _fetchLibros();
  }

  void _toggleDisponibles(bool val) {
    setState(() {
      _soloDisponibles = val;
      _page = 1;
    });
    _fetchLibros();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF1e3a5f),
        title: Container(
          height: 42,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
          ),
          child: TextField(
            controller: _searchController,
            onChanged: _onSearchChanged,
            style: const TextStyle(fontSize: 15, color: Color(0xFF222831)),
            decoration: InputDecoration(
              hintText: 'Buscar por título, autor o ISBN…',
              hintStyle: const TextStyle(fontSize: 14, color: Color(0xFF929aa4)),
              prefixIcon: const Icon(Icons.search, color: Color(0xFF929aa4), size: 20),
              suffixIcon: _query.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.close, size: 18, color: Color(0xFF929aa4)),
                      onPressed: () {
                        _searchController.clear();
                        _onSearchChanged('');
                      },
                    )
                  : null,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 11),
            ),
          ),
        ),
        actions: const [UserMenuButton()],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (_categorias.isNotEmpty) _buildCategoryChips(),
          _buildControls(),
          Expanded(child: _buildBody()),
        ],
      ),
    );
  }

  Widget _buildCategoryChips() {
    return SizedBox(
      height: 48,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        children: [
          _chipButton(label: 'Todos', selected: _categoriaId == null, onTap: () => _selectCategoria(null)),
          ..._categorias.map((c) => _chipButton(
                label: c.displayName,
                selected: _categoriaId == c.id,
                onTap: () => _selectCategoria(c.id),
              )),
        ],
      ),
    );
  }

  Widget _chipButton({required String label, required bool selected, required VoidCallback onTap}) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: selected ? const Color(0xFF1e3a5f) : Colors.white,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(
              color: selected ? const Color(0xFF1e3a5f) : const Color(0xFFdde1e6),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: selected ? Colors.white : const Color(0xFF5c6671),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildControls() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Row(
        children: [
          Text(
            _loading ? '…' : '$_total resultado${_total != 1 ? 's' : ''}',
            style: const TextStyle(fontSize: 12.5, color: Color(0xFF5c6671)),
          ),
          const Spacer(),
          const Text('Solo disponibles', style: TextStyle(fontSize: 13, color: Color(0xFF222831))),
          const SizedBox(width: 8),
          Switch(
            value: _soloDisponibles,
            onChanged: _toggleDisponibles,
            activeColor: const Color(0xFF1e3a5f),
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF1e3a5f)));
    }
    if (_error != null) {
      return Center(child: Text(_error!, style: const TextStyle(color: Color(0xFFc0492f))));
    }
    if (_libros.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.search_off, size: 48, color: Colors.grey[400]),
            const SizedBox(height: 12),
            const Text('Sin resultados para tu búsqueda.', style: TextStyle(color: Color(0xFF929aa4))),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(12, 4, 12, 12),
      itemCount: _libros.length + (_hasNext || _hasPrev ? 1 : 0),
      itemBuilder: (context, i) {
        if (i == _libros.length) return _buildPagination();
        return _buildLibroCard(_libros[i]);
      },
    );
  }

  Widget _buildLibroCard(Libro libro) {
    final available = libro.copiasDisponibles > 0;
    final color = _spineColor(libro.id);
    final initial = libro.titulo.isNotEmpty ? libro.titulo[0].toUpperCase() : '?';

    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, '/libro', arguments: libro),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
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
                Container(width: 4, color: available ? color : const Color(0xFFc0492f)),
                const SizedBox(width: 12),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: available ? color.withAlpha(24) : const Color(0xFFf7e9e4),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      initial,
                      style: TextStyle(
                        fontSize: 21,
                        fontWeight: FontWeight.bold,
                        color: available ? color : const Color(0xFFc0492f),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          libro.titulo,
                          style: const TextStyle(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF222831),
                            height: 1.3,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        if (libro.autores.isNotEmpty) ...[
                          const SizedBox(height: 2),
                          Text(
                            libro.autores.join(', '),
                            style: const TextStyle(fontSize: 12, color: Color(0xFF5c6671)),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            if (libro.categoria != null) ...[
                              Expanded(
                                child: Text(
                                  [libro.categoria, libro.anio].where((e) => e != null).join(' · '),
                                  style: const TextStyle(fontSize: 10.5, color: Color(0xFF929aa4)),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                            AvailabilityBadge(
                              available: available,
                              count: available ? libro.copiasDisponibles : null,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.only(right: 10),
                  child: Icon(Icons.chevron_right, color: Color(0xFF929aa4), size: 18),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPagination() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          TextButton(
            onPressed: _hasPrev
                ? () {
                    setState(() => _page--);
                    _fetchLibros();
                  }
                : null,
            child: const Text('← Anterior'),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text('Página $_page', style: const TextStyle(fontSize: 12.5, color: Color(0xFF5c6671))),
          ),
          TextButton(
            onPressed: _hasNext
                ? () {
                    setState(() => _page++);
                    _fetchLibros();
                  }
                : null,
            child: const Text('Siguiente →'),
          ),
        ],
      ),
    );
  }
}
