import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';

import '../models/trip_model.dart';
import '../services/realm_service.dart';
import '../services/sync_service.dart';
import '../services/api_service.dart';

class TripProvider extends ChangeNotifier {
  final _logger = Logger();
  final _syncService = SyncService(apiService: ApiService());

  List<TripModel> _trips = [];
  bool _isLoading = false;
  String? _error;

  List<TripModel> get trips => _trips;
  bool get isLoading => _isLoading;
  String? get error => _error;

  /// Load trips from local Realm (offline-first)
  void loadTrips() {
    _trips = RealmService.getAllTrips().toList();
    notifyListeners();
  }

  /// Fetch trips from server and update local cache
  Future<void> refreshTrips() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _syncService.syncTripsFromServer();
      if (success) {
        _trips = RealmService.getAllTrips().toList();
        _logger.i('Trips refreshed: ${_trips.length} trips');
      } else {
        _error = 'Could not fetch trips. Showing offline data.';
        _trips = RealmService.getAllTrips().toList();
      }
    } catch (e) {
      _logger.e('Failed to refresh trips: $e');
      _error = 'Failed to load trips';
      _trips = RealmService.getAllTrips().toList();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  TripModel? getTrip(String tripId) {
    return RealmService.getTrip(tripId);
  }
}
