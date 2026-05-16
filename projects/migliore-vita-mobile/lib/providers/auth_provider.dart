import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'package:logger/logger.dart';

/// Authentication state for the photographer app
/// Photographers log in with device ID + API key (no username/password)
class AuthProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final _logger = Logger();

  bool _isLoggedIn = false;
  String? _photographerId;
  String? _photographerName;
  String? _deviceId;

  bool get isLoggedIn => _isLoggedIn;
  String? get photographerId => _photographerId;
  String? get photographerName => _photographerName;
  String? get deviceId => _deviceId;
  ApiService get apiService => _apiService;

  /// Try to restore session from secure storage on app launch
  Future<void> tryRestoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final photographerId = prefs.getString('photographer_id');
    final photographerName = prefs.getString('photographer_name');
    final deviceId = prefs.getString('device_id');

    if (token != null && photographerId != null) {
      _apiService.setAuthToken(token);
      _photographerId = photographerId;
      _photographerName = photographerName;
      _deviceId = deviceId;
      _isLoggedIn = true;
      notifyListeners();
      _logger.i('Session restored for photographer: $photographerName');
    }
  }

  /// Login with API key
  Future<bool> login(String apiKey) async {
    final deviceId = await _getDeviceId();
    final result = await _apiService.login(deviceId: deviceId, apiKey: apiKey);

    if (result != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', result['token'] as String);
      await prefs.setString('photographer_id', result['photographer_id'] as String);
      await prefs.setString('photographer_name', result['name'] as String);
      await prefs.setString('device_id', deviceId);

      _photographerId = result['photographer_id'] as String;
      _photographerName = result['name'] as String;
      _deviceId = deviceId;
      _isLoggedIn = true;
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _apiService.clearAuthToken();
    _isLoggedIn = false;
    _photographerId = null;
    _photographerName = null;
    notifyListeners();
  }

  Future<String> _getDeviceId() async {
    final prefs = await SharedPreferences.getInstance();
    var deviceId = prefs.getString('device_id');
    if (deviceId == null) {
      // Generate a stable device ID on first run
      deviceId = 'device_${DateTime.now().millisecondsSinceEpoch}';
      await prefs.setString('device_id', deviceId);
    }
    return deviceId;
  }
}
