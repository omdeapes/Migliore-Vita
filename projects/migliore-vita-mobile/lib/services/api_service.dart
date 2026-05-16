import 'dart:io';
import 'package:dio/dio.dart';
import 'package:logger/logger.dart';

import '../config/app_config.dart';
import '../models/trip_model.dart';

/// API client for all backend communication
/// Handles auth headers, error responses, and retries
class ApiService {
  late final Dio _dio;
  final _logger = Logger();
  String? _authToken;

  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Request interceptor - add auth token
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_authToken != null) {
            options.headers['Authorization'] = 'Bearer $_authToken';
          }
          _logger.d('API Request: ${options.method} ${options.path}');
          handler.next(options);
        },
        onResponse: (response, handler) {
          _logger.d('API Response: ${response.statusCode} ${response.requestOptions.path}');
          handler.next(response);
        },
        onError: (error, handler) {
          _logger.e('API Error: ${error.response?.statusCode} ${error.message}');
          handler.next(error);
        },
      ),
    );
  }

  // ── Auth ───────────────────────────────────────────────────────────────

  void setAuthToken(String token) {
    _authToken = token;
  }

  void clearAuthToken() {
    _authToken = null;
  }

  /// Login with device ID + API key (photographer auth)
  Future<Map<String, dynamic>?> login({
    required String deviceId,
    required String apiKey,
  }) async {
    try {
      final response = await _dio.post('/auth/login', data: {
        'device_id': deviceId,
        'api_key': apiKey,
      });

      if (response.statusCode == 200) {
        final data = response.data as Map<String, dynamic>;
        setAuthToken(data['token'] as String);
        return data;
      }
    } on DioException catch (e) {
      _logger.e('Login failed: ${e.message}');
    }
    return null;
  }

  // ── Trips ──────────────────────────────────────────────────────────────

  /// Fetch trips assigned to this photographer
  Future<List<TripModel>> fetchAssignedTrips() async {
    try {
      final response = await _dio.get('/trips');

      if (response.statusCode == 200) {
        final data = response.data as Map<String, dynamic>;
        final tripsJson = data['trips'] as List<dynamic>;

        return tripsJson.map((json) {
          final t = json as Map<String, dynamic>;
          return TripModel(
            t['id'] as String,
            tripDate: t['trip_date'] as String,
            safariCenter: t['safari_center'] as String,
            guideId: t['guide_id'] as String,
            guideName: t['guide_name'] as String,
            status: t['status'] as String,
            lastSyncedAt: DateTime.now(),
            assignedPhotographerIds: (t['photographer_ids'] as List<dynamic>).join(','),
            notes: t['notes'] as String?,
          );
        }).toList();
      }
    } on DioException catch (e) {
      _logger.e('Failed to fetch trips: ${e.message}');
      rethrow;
    }
    return [];
  }

  // ── Invoices ───────────────────────────────────────────────────────────

  /// Create invoice on server (called during sync)
  Future<bool> createInvoice(Map<String, dynamic> payload) async {
    try {
      final response = await _dio.post('/invoices', data: payload);
      return response.statusCode == 201 || response.statusCode == 200;
    } on DioException catch (e) {
      // 409 Conflict = duplicate serial number (already synced)
      if (e.response?.statusCode == 409) {
        _logger.w('Invoice already exists (serial conflict): ${payload['serial_number']}');
        return true; // Treat as success - data is on server
      }
      _logger.e('Failed to create invoice: ${e.message}');
      return false;
    }
  }

  // ── Media ──────────────────────────────────────────────────────────────

  /// Upload media file to server
  Future<Map<String, dynamic>?> uploadMedia({
    required String filePath,
    required String invoiceId,
    required String mediaType,
  }) async {
    try {
      final file = File(filePath);
      if (!await file.exists()) {
        _logger.e('Media file not found: $filePath');
        return null;
      }

      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath),
        'invoice_id': invoiceId,
        'media_type': mediaType,
      });

      final response = await _dio.post(
        '/media/upload',
        data: formData,
        options: Options(
          sendTimeout: const Duration(minutes: 5),
          receiveTimeout: const Duration(minutes: 5),
        ),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.data as Map<String, dynamic>;
      }
    } on DioException catch (e) {
      _logger.e('Media upload failed: ${e.message}');
    }
    return null;
  }

  // ── Health Check ───────────────────────────────────────────────────────

  Future<bool> isServerReachable() async {
    try {
      final response = await _dio.get(
        '/health',
        options: Options(
          sendTimeout: const Duration(seconds: 5),
          receiveTimeout: const Duration(seconds: 5),
        ),
      );
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
