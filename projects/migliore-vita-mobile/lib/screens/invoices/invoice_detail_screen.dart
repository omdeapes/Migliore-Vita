import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../services/realm_service.dart';
import '../../models/invoice_model.dart';
import '../../providers/invoice_provider.dart';
import '../../providers/sync_provider.dart';

class InvoiceDetailScreen extends StatelessWidget {
  final String invoiceId;

  const InvoiceDetailScreen({super.key, required this.invoiceId});

  @override
  Widget build(BuildContext context) {
    final invoice = RealmService.getInvoice(invoiceId);

    if (invoice == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Invoice Details')),
        body: const Center(child: Text('Invoice not found')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(invoice.serialNumber, style: const TextStyle(fontFamily: 'monospace', fontSize: 14)),
        actions: [
          IconButton(
            icon: Icon(
              invoice.isSynced ? Icons.cloud_done : Icons.cloud_upload_outlined,
              color: invoice.isSynced ? Colors.green.shade200 : Colors.orange.shade200,
            ),
            onPressed: invoice.isSynced ? null : () => context.read<SyncProvider>().triggerSync(),
            tooltip: invoice.isSynced ? 'Synced' : 'Tap to sync',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Guest card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.person, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          'Guest Information',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 16),
                    _Row(label: 'Name', value: invoice.guestName),
                    _Row(label: 'Contact', value: invoice.guestContact),
                    if (invoice.guestHotel != null)
                      _Row(label: 'Hotel', value: invoice.guestHotel!),
                    if (invoice.guestRoom != null)
                      _Row(label: 'Room', value: invoice.guestRoom!),
                    _Row(
                      label: 'Amount',
                      value: '${invoice.totalAmount.toStringAsFixed(2)} ${invoice.currency}',
                      valueStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Status card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _StatusRow(
                      label: 'Invoice Status',
                      value: invoice.status,
                      synced: true,
                    ),
                    _StatusRow(
                      label: 'Sync Status',
                      value: invoice.isSynced ? 'Synced ✅' : 'Pending sync ⏳',
                      synced: invoice.isSynced,
                    ),
                    _Row(label: 'Media Files', value: '${invoice.mediaCount}'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Add media button
            if (invoice.status == 'draft' || invoice.status == 'finalized')
              OutlinedButton.icon(
                onPressed: () => context.push('/invoices/$invoiceId/media'),
                icon: const Icon(Icons.photo_camera),
                label: const Text('Add Photos / Videos'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label;
  final String value;
  final TextStyle? valueStyle;

  const _Row({required this.label, required this.value, this.valueStyle});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
            ),
          ),
          Expanded(
            child: Text(value, style: valueStyle),
          ),
        ],
      ),
    );
  }
}

class _StatusRow extends StatelessWidget {
  final String label;
  final String value;
  final bool synced;

  const _StatusRow({required this.label, required this.value, required this.synced});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: synced ? Colors.green.shade700 : Colors.orange.shade700,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
