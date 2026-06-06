import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl =
      'https://bibliotecamobile-production.up.railway.app';

  static const List<String> _privatePaths = [
    '/api/mis-prestamos',
    '/api/perfil',
  ];

  static bool _isPrivate(String path) =>
      _privatePaths.any((p) => path.contains(p));

  static Future<Map<String, String>> _headers(String path) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    if (_isPrivate(path)) {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('access_token');
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  static Future<Map<String, dynamic>> login(
      String username, String password) async {
    const path = '/api/token/';
    final response = await http.post(
      Uri.parse('$baseUrl$path'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    }
    throw Exception('Credenciales incorrectas');
  }

  static Future<Map<String, dynamic>> getLibros({
    String? q,
    int? categoriaId,
    bool soloDisponibles = false,
    int page = 1,
  }) async {
    const path = '/api/libros/';
    final params = <String, String>{'page': page.toString()};
    if (q != null && q.isNotEmpty) params['q'] = q;
    if (soloDisponibles) params['solo_disponibles'] = 'true';
    if (categoriaId != null) params['categoria_id'] = categoriaId.toString();

    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: params);
    final response = await http.get(uri, headers: await _headers(path));
    if (response.statusCode == 200) {
      return jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    }
    throw Exception('Error al cargar libros');
  }

  static Future<Map<String, dynamic>> getLibro(int id) async {
    final path = '/api/libros/$id/';
    final uri = Uri.parse('$baseUrl$path');
    final response = await http.get(uri, headers: await _headers(path));
    if (response.statusCode == 200) {
      return jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    }
    throw Exception('Libro no encontrado');
  }

  static Future<Map<String, dynamic>> getCategorias() async {
    const path = '/api/categorias/';
    final uri = Uri.parse('$baseUrl$path');
    final response = await http.get(uri, headers: await _headers(path));
    if (response.statusCode == 200) {
      return jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    }
    throw Exception('Error al cargar categorías');
  }

  static Future<Map<String, dynamic>> getAutores({
    String? q,
    int page = 1,
  }) async {
    const path = '/api/autores/';
    final params = <String, String>{'page': page.toString()};
    if (q != null && q.isNotEmpty) params['q'] = q;

    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: params);
    final response = await http.get(uri, headers: await _headers(path));
    if (response.statusCode == 200) {
      return jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    }
    throw Exception('Error al cargar autores');
  }

  static Future<List<dynamic>> getMisPrestamos() async {
    const path = '/api/mis-prestamos/';
    final uri = Uri.parse('$baseUrl$path');
    final response = await http.get(uri, headers: await _headers(path));
    if (response.statusCode == 200) {
      final data = jsonDecode(utf8.decode(response.bodyBytes));
      if (data is Map && data.containsKey('results')) return data['results'] as List;
      if (data is List) return data;
      return [];
    }
    throw Exception('Error al cargar préstamos');
  }

  static Future<Map<String, dynamic>> getPerfil() async {
    const path = '/api/perfil/';
    final uri = Uri.parse('$baseUrl$path');
    final response = await http.get(uri, headers: await _headers(path));
    if (response.statusCode == 200) {
      return jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    }
    throw Exception('Error al cargar perfil');
  }
}
