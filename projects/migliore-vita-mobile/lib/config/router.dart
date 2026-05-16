import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../screens/auth/login_screen.dart';
import '../screens/trips/trips_screen.dart';
import '../screens/trips/trip_detail_screen.dart';
import '../screens/invoices/invoice_list_screen.dart';
import '../screens/invoices/invoice_create_screen.dart';
import '../screens/invoices/invoice_detail_screen.dart';
import '../screens/media/media_capture_screen.dart';
import '../screens/settings/settings_screen.dart';
import '../widgets/common/main_scaffold.dart';

class AppRouter {
  AppRouter._();

  static final _rootNavigatorKey = GlobalKey<NavigatorState>();

  static final GoRouter router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/trips',
    redirect: (context, state) {
      final authProvider = context.read<AuthProvider>();
      final isLoggedIn = authProvider.isLoggedIn;
      final isLoginRoute = state.matchedLocation == '/login';

      if (!isLoggedIn && !isLoginRoute) return '/login';
      if (isLoggedIn && isLoginRoute) return '/trips';
      return null;
    },
    routes: [
      // Auth
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),

      // Main shell with bottom navigation
      ShellRoute(
        builder: (context, state, child) => MainScaffold(child: child),
        routes: [
          // Trips
          GoRoute(
            path: '/trips',
            builder: (context, state) => const TripsScreen(),
            routes: [
              GoRoute(
                path: ':tripId',
                builder: (context, state) => TripDetailScreen(
                  tripId: state.pathParameters['tripId']!,
                ),
              ),
            ],
          ),

          // Invoices
          GoRoute(
            path: '/invoices',
            builder: (context, state) => const InvoiceListScreen(),
            routes: [
              GoRoute(
                path: 'create',
                builder: (context, state) => InvoiceCreateScreen(
                  tripId: state.uri.queryParameters['tripId'],
                ),
              ),
              GoRoute(
                path: ':invoiceId',
                builder: (context, state) => InvoiceDetailScreen(
                  invoiceId: state.pathParameters['invoiceId']!,
                ),
                routes: [
                  GoRoute(
                    path: 'media',
                    builder: (context, state) => MediaCaptureScreen(
                      invoiceId: state.pathParameters['invoiceId']!,
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Settings
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsScreen(),
          ),
        ],
      ),
    ],
  );
}
