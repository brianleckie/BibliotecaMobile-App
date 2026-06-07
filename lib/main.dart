import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'screens/main_screen.dart';
import 'screens/login_screen.dart';
import 'screens/detalle_libro_screen.dart';
import 'screens/mis_prestamos_screen.dart';
import 'screens/perfil_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final auth = AuthProvider();
  await auth.loadToken();
  runApp(
    ChangeNotifierProvider.value(
      value: auth,
      child: const BibliotecaApp(),
    ),
  );
}

class BibliotecaApp extends StatelessWidget {
  const BibliotecaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Biblioteca CTN',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1e3a5f),
          brightness: Brightness.light,
          primary: const Color(0xFF1e3a5f),
          secondary: const Color(0xFFd99a2b),
        ),
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFeef0f2),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1e3a5f),
          foregroundColor: Colors.white,
          elevation: 0,
          centerTitle: false,
        ),
        navigationBarTheme: const NavigationBarThemeData(
          backgroundColor: Colors.white,
          indicatorColor: Color(0x191e3a5f),
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF1e3a5f),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            textStyle: const TextStyle(fontWeight: FontWeight.w600),
          ),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (_) => const MainScreen(),
        '/login': (_) => const LoginScreen(),
        '/libro': (_) => const DetalleLibroScreen(),
        '/mis-prestamos': (_) => const MisPrestamosScreen(),
        '/perfil': (_) => const PerfilScreen(),
      },
    );
  }
}
