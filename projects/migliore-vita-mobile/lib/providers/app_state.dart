import 'package:flutter/foundation.dart';

/// Global application state (connectivity, theme, etc.)
class AppState extends ChangeNotifier {
  bool _isOnline = false;

  bool get isOnline => _isOnline;

  void setOnlineStatus(bool online) {
    if (_isOnline != online) {
      _isOnline = online;
      notifyListeners();
    }
  }
}
