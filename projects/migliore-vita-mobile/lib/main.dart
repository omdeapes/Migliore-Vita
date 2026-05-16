import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:logger/logger.dart';

import 'config/app_config.dart';
import 'config/router.dart';
import 'providers/app_state.dart';
import 'providers/auth_provider.dart';
import 'providers/invoice_provider.dart';
import 'providers/sync_provider.dart';
import 'providers/trip_provider.dart';
import 'services/realm_service.dart';

final logger = Logger(
  printer: PrettyPrinter(
    methodCount: 2,
    errorMethodCount: 8,
    lineLength: 120,
    colors: true,
    printEmojis: true,
  ),
);

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Realm (local database)
  await RealmService.initialize();

  logger.i('Migliore Vita App starting...');
  logger.i('Environment: ${AppConfig.environment}');
  logger.i('API Base URL: ${AppConfig.apiBaseUrl}');

  runApp(const MiglioreVitaApp());
}

class MiglioreVitaApp extends StatelessWidget {
  const MiglioreVitaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppState()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => TripProvider()),
        ChangeNotifierProvider(create: (_) => InvoiceProvider()),
        ChangeNotifierProvider(create: (_) => SyncProvider()),
      ],
      child: Consumer<AppState>(
        builder: (context, appState, _) {
          return MaterialApp.router(
            title: 'Migliore Vita',
            debugShowCheckedModeBanner: false,
            theme: AppConfig.lightTheme,
            routerConfig: AppRouter.router,
          );
        },
      ),
    );
  }
}
