import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class UserMenuButton extends StatelessWidget {
  const UserMenuButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        if (!auth.isLoggedIn) {
          return IconButton(
            icon: const Icon(Icons.person_outline, color: Colors.white),
            tooltip: 'Iniciar sesión',
            onPressed: () => Navigator.pushNamed(context, '/login'),
          );
        }
        return PopupMenuButton<String>(
          icon: const Icon(Icons.person, color: Colors.white),
          tooltip: 'Mi cuenta',
          onSelected: (value) async {
            switch (value) {
              case 'prestamos':
                Navigator.pushNamed(context, '/mis-prestamos');
                break;
              case 'perfil':
                Navigator.pushNamed(context, '/perfil');
                break;
              case 'logout':
                await context.read<AuthProvider>().logout();
                break;
            }
          },
          itemBuilder: (_) => [
            const PopupMenuItem(
              value: 'prestamos',
              child: Row(
                children: [
                  Icon(Icons.bookmark_outline, size: 18),
                  SizedBox(width: 10),
                  Text('Mis Préstamos'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'perfil',
              child: Row(
                children: [
                  Icon(Icons.person_outline, size: 18),
                  SizedBox(width: 10),
                  Text('Mi Perfil'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'logout',
              child: Row(
                children: [
                  Icon(Icons.logout, size: 18, color: Color(0xFFc0492f)),
                  SizedBox(width: 10),
                  Text('Cerrar sesión',
                      style: TextStyle(color: Color(0xFFc0492f))),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
