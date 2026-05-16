import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/trip_provider.dart';
import '../../providers/sync_provider.dart';
import '../../models/trip_model.dart';
import '../../widgets/common/sync_status_bar.dart';

class TripsScreen extends StatefulWidget {
  const TripsScreen({super.key});

  @override
  State<TripsScreen> createState() => _TripsScreenState();
}

class _TripsScreenState extends State<TripsScreen> {
  @override
  void initState() {
    super.initState();
    // Load trips on screen open
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TripProvider>().refreshTrips();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Trips'),
        actions: [
          // Manual refresh button
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => context.read<TripProvider>().refreshTrips(),
          ),
        ],
      ),
      body: Column(
        children: [
          const SyncStatusBar(),
          Expanded(
            child: Consumer<TripProvider>(
              builder: (context, tripProvider, _) {
                if (tripProvider.isLoading) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (tripProvider.error != null) {
                  return _buildErrorState(context, tripProvider);
                }

                if (tripProvider.trips.isEmpty) {
                  return _buildEmptyState(context);
                }

                return RefreshIndicator(
                  onRefresh: () => context.read<TripProvider>().refreshTrips(),
                  child: ListView.builder(
                    padding: const EdgeInsets.all(8),
                    itemCount: tripProvider.trips.length,
                    itemBuilder: (context, index) {
                      return _TripCard(trip: tripProvider.trips[index]);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.safari, size: 64, color: Colors.grey.shade400),
          const SizedBox(height: 16),
          Text(
            'No trips assigned',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Contact admin to get assigned to a trip',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(BuildContext context, TripProvider provider) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.wifi_off, size: 64, color: Colors.orange.shade400),
            const SizedBox(height: 16),
            Text(
              'Offline Mode',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(
              provider.error ?? 'Could not load trips',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () => provider.refreshTrips(),
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }
}

class _TripCard extends StatelessWidget {
  final TripModel trip;

  const _TripCard({required this.trip});

  Color _statusColor(String status) {
    switch (status) {
      case 'in_progress':
        return Colors.green;
      case 'completed':
        return Colors.grey;
      default:
        return Colors.orange;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).colorScheme.primaryContainer,
          child: const Icon(Icons.safari),
        ),
        title: Text(
          trip.safariCenter,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text('Date: ${trip.tripDate}'),
            Text('Guide: ${trip.guideName}'),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: _statusColor(trip.status).withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                trip.status.replaceAll('_', ' ').toUpperCase(),
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: _statusColor(trip.status),
                ),
              ),
            ),
            const SizedBox(height: 4),
            const Icon(Icons.chevron_right),
          ],
        ),
        onTap: () => context.push('/trips/${trip.id}'),
      ),
    );
  }
}
