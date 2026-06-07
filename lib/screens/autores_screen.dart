import 'dart:async';
import 'package:flutter/material.dart';
import '../models/autor.dart';
import '../services/api_service.dart';
import '../widgets/user_menu_button.dart';

class AutoresScreen extends StatefulWidget {
  const AutoresScreen({super.key});

  @override
  State<AutoresScreen> createState() => _AutoresScreenState();
}

class _AutoresScreenState extends State<AutoresScreen> {
  final _searchController = TextEditingController();
  Timer? _debounce;

  String _query = '';
  int _page = 1;
  bool _hasNext = false;
  bool _hasPrev = false;
  int _total = 0;
  bool _loading = true;
  String? _error;
  List<Autor> _autores = [];

  @override
  void initState() {
    super.initState();
    _fetchAutores();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchAutores() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await ApiService.getAutores(
        q: _query.isEmpty ? null : _query,
        page: _page,
      );
      final results = data['results'] ?? data;
      final list = results is List ? results : [];
      setState(() {
        _autores = list.map((e) => Autor.fromJson(e)).toList();
        _hasNext = data['next'] != null;
        _hasPrev = data['previous'] != null;
        _total = (data['count'] as num?)?.toInt() ?? list.length;
        _loading = false;
      });
    } catch (_) {
      setState(() {
        _error = 'No se pudieron cargar los autores.';
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
      _fetchAutores();
    });
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
              hintText: 'Buscar autor por nombre…',
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
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Text(
              _loading ? '…' : '$_total autor${_total != 1 ? 'es' : ''}',
              style: const TextStyle(fontSize: 12.5, color: Color(0xFF5c6671)),
            ),
          ),
          Expanded(child: _buildBody()),
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
    if (_autores.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.person_search, size: 48, color: Colors.grey[400]),
            const SizedBox(height: 12),
            const Text('No se encontraron autores.', style: TextStyle(color: Color(0xFF929aa4))),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
      itemCount: _autores.length + (_hasNext || _hasPrev ? 1 : 0),
      itemBuilder: (context, i) {
        if (i == _autores.length) return _buildPagination();
        return _buildAutorCard(_autores[i]);
      },
    );
  }

  Widget _buildAutorCard(Autor autor) {
    final meta = [autor.pais, autor.anioNacimiento].where((e) => e != null).join(' · ');
    final initial = autor.nombreCompleto.isNotEmpty ? autor.nombreCompleto[0].toUpperCase() : '?';

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
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
              color: const Color(0xFFe7eaed),
              borderRadius: BorderRadius.circular(999),
            ),
            alignment: Alignment.center,
            child: Text(
              initial,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1e3a5f),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  autor.nombreCompleto,
                  style: const TextStyle(
                    fontSize: 15.5,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF222831),
                    height: 1.25,
                  ),
                ),
                if (meta.isNotEmpty) ...[
                  const SizedBox(height: 3),
                  Text(meta, style: const TextStyle(fontSize: 12.5, color: Color(0xFF5c6671))),
                ],
              ],
            ),
          ),
        ],
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
                    _fetchAutores();
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
                    _fetchAutores();
                  }
                : null,
            child: const Text('Siguiente →'),
          ),
        ],
      ),
    );
  }
}
