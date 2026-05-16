import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';
import '../../providers/sync_provider.dart';
import '../../config/app_config.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final sync = context.watch<SyncProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Account
          _SectionHeader(title: 'Account'),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _InfoRow(label: 'Name', value: auth.photographerName ?? 'Photographer'),
                  _InfoRow(label: 'Device ID', value: auth.deviceId ?? 'Unknown'),
                  _InfoRow(label: 'Role', value: 'Photographer'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Sync
          _SectionHeader(title: 'Sync Status'),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _InfoRow(
                    label: 'Pending Items',
                    value: '${sync.pendingCount}',
                    valueColor: sync.pendingCount > 0 ? Colors.orange : Colors.green,
                  ),
                  if (sync.lastSyncTime != null)
                    _InfoRow(
                      label: 'Last Sync',
                      value: sync.lastSyncTime!.toString().split('.').first,
                    ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: sync.isSyncing ? null : () => sync.triggerSync(),
                      icon: sync.isSyncing
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.sync),
                      label: Text(sync.isSyncing ? 'Syncing...' : 'Sync Now'),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // App Info
          _SectionHeader(title: 'App Info'),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _InfoRow(label: 'Version', value: 'Phase 1 MVP - v1.0.0'),
                  _InfoRow(label: 'Environment', value: AppConfig.environment),
                  _InfoRow(label: 'API', value: AppConfig.apiBaseUrl),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Logout
          ElevatedButton.icon(
            onPressed: () async {
              await auth.logout();
              if (context.mounted) {
                // Router will redirect to login
              }
            },
            icon: const Icon(Icons.logout),
            label: const Text('Logout'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red.shade700,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.labelLarge?.copyWith(
          color: Theme.of(context).colorScheme.primary,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;

  const _InfoRow({required this.label, required this.value, this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: valueColor,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
