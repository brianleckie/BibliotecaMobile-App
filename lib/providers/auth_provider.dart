import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  String? _token;

  bool get isLoggedIn => _token != null;
  String? get token => _token;

  Future<void> loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('access_token');
    notifyListeners();
  }

  Future<bool> login(String username, String password) async {
    try {
      final data = await ApiService.login(username, password);
      final access = data['access'] as String?;
      if (access == null) return false;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', access);
      final refresh = data['refresh'] as String?;
      if (refresh != null) await prefs.setString('refresh_token', refresh);
      _token = access;
      notifyListeners();
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
    _token = null;
    notifyListeners();
  }
}
