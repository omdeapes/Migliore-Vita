import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/sync_provider.dart';

/// Compact sync status bar shown at top of main screens
/// Shows: online/offline indicator + pending count + last sync time
class SyncStatusBar extends StatelessWidget {
  const SyncStatusBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<SyncProvider>(
      builder: (context, sync, _) {
        final pending = sync.pendingCount;
        final hasError = sync.lastSyncError != null;

        if (pending == 0 && !hasError && !sync.isSyncing) {
          // All synced — show minimal bar
          return Container(
            height: 2,
            color: Colors.green.shade400,
          );
        }

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          color: hasError
              ? Colors.red.shade50
              : sync.isSyncing
                  ? Colors.blue.shade50
                  : Colors.orange.shade50,
          child: Row(
            children: [
              if (sync.isSyncing)
                const SizedBox(
                  width: 14,
                  height: 14,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              else
                Icon(
                  hasError ? Icons.error_outline : Icons.sync_problem,
                  size: 16,
                  color: hasError ? Colors.red.shade700 : Colors.orange.shade700,
                ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  sync.isSyncing
                      ? 'Syncing...'
                      : hasError
                          ? sync.lastSyncError!
                          : '$pending item${pending != 1 ? 's' : ''} pending sync',
                  style: TextStyle(
                    fontSize: 12,
                    color: hasError
                        ? Colors.red.shade700
                        : Colors.orange.shade800,
                  ),
                ),
              ),
              if (!sync.isSyncing)
                GestureDetector(
                  onTap: () => sync.triggerSync(),
                  child: Text(
                    'Sync now',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.blue.shade700,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}
