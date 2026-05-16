import 'package:flutter/foundation.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:logger/logger.dart';

import '../services/sync_service.dart';
import '../services/api_service.dart';

/// Manages sync state and triggers
/// Shows sync status in UI (e.g., "3 items pending sync")
class SyncProvider extends ChangeNotifier {
  final SyncService _syncService = SyncService(apiService: ApiService());
  final _logger = Logger();

  bool _isSyncing = false;
  int _pendingCount = 0;
  int _lastSuccessCount = 0;
  int _lastFailureCount = 0;
  String? _lastSyncError;
  DateTime? _lastSyncTime;

  bool get isSyncing => _isSyncing;
  int get pendingCount => _pendingCount;
  int get lastSuccessCount => _lastSuccessCount;
  String? get lastSyncError => _lastSyncError;
  DateTime? get lastSyncTime => _lastSyncTime;

  /// Check current connectivity and auto-sync if connected
  Future<void> checkAndSync() async {
    final connectivity = await Connectivity().checkConnectivity();
    if (connectivity != ConnectivityResult.none) {
      await triggerSync();
    } else {
      _updatePendingCount();
    }
  }

  /// Manual sync trigger (user presses sync button)
  Future<bool> triggerSync() async {
    if (_isSyncing) return false;

    _isSyncing = true;
    _lastSyncError = null;
    notifyListeners();

    try {
      final result = await _syncService.syncNow();
      _lastSuccessCount = result['success'] ?? 0;
      _lastFailureCount = result['failed'] ?? 0;
      _lastSyncTime = DateTime.now();

      if (_lastFailureCount > 0) {
        _lastSyncError = '$_lastFailureCount items failed to sync';
        _logger.w('Sync completed with $_lastFailureCount failures');
      } else {
        _logger.i('Sync completed: $_lastSuccessCount items synced');
      }

      _updatePendingCount();
      return _lastFailureCount == 0;

    } catch (e) {
      _lastSyncError = 'Sync failed: ${e.toString()}';
      _logger.e('Sync error: $e');
      return false;
    } finally {
      _isSyncing = false;
      notifyListeners();
    }
  }

  void _updatePendingCount() {
    _pendingCount = _syncService.getPendingCount();
    notifyListeners();
  }
}
