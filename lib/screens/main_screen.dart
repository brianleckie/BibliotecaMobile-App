import 'package:flutter/material.dart';
import 'catalogo_screen.dart';
import 'autores_screen.dart';
import 'categorias_screen.dart';

class MainScreen extends StatefulWidget {
  final int initialIndex;
  final int? initialCategoriaId;

  const MainScreen({
    super.key,
    this.initialIndex = 0,
    this.initialCategoriaId,
  });

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  late int _selectedIndex;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.initialIndex;
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      CatalogoScreen(initialCategoriaId: widget.initialCategoriaId),
      const AutoresScreen(),
      const CategoriasScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (i) => setState(() => _selectedIndex = i),
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        indicatorColor: const Color(0xFF1e3a5f).withAlpha(25),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.menu_book_outlined),
            selectedIcon: Icon(Icons.menu_book, color: Color(0xFF1e3a5f)),
            label: 'Catálogo',
          ),
          NavigationDestination(
            icon: Icon(Icons.people_outlined),
            selectedIcon: Icon(Icons.people, color: Color(0xFF1e3a5f)),
            label: 'Autores',
          ),
          NavigationDestination(
            icon: Icon(Icons.label_outlined),
            selectedIcon: Icon(Icons.label, color: Color(0xFF1e3a5f)),
            label: 'Categorías',
          ),
        ],
      ),
    );
  }
}
