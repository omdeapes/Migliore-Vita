import 'package:flutter/material.dart';

/// Central application configuration
/// Environment-based (dev/staging/production)
class AppConfig {
  AppConfig._();

  // ── Environment ───────────────────────────────────────────────────────────
  static const String _env = String.fromEnvironment('ENV', defaultValue: 'development');
  static String get environment => _env;
  static bool get isProduction => _env == 'production';
  static bool get isDevelopment => _env == 'development';

  // ── API URLs ──────────────────────────────────────────────────────────────
  static String get apiBaseUrl {
    switch (_env) {
      case 'production':
        return 'https://api.aten.eg/v1';
      case 'staging':
        return 'https://staging-api.aten.eg/v1';
      default:
        return 'http://localhost:3000/v1';
    }
  }

  // ── App Constants ─────────────────────────────────────────────────────────
  static const int syncTimeoutSeconds = 30;
  static const int maxRetryAttempts = 3;
  static const int maxMediaFileSizeMB = 50;
  static const String defaultCurrency = 'EGP';
  static const int invoiceLinkExpiryDays = 14;

  // ── Material Design 3 Theme ───────────────────────────────────────────────
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF1565C0), // Deep Blue - professional
        brightness: Brightness.light,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
        backgroundColor: Color(0xFF1565C0),
        foregroundColor: Colors.white,
      ),
      cardTheme: const CardThemeData(
        elevation: 2,
        margin: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
      ),
    );
  }
}
