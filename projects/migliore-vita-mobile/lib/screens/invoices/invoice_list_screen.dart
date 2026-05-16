import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/invoice_provider.dart';
import '../../providers/sync_provider.dart';
import '../../models/invoice_model.dart';
import '../../widgets/common/sync_status_bar.dart';

class InvoiceListScreen extends StatefulWidget {
  const InvoiceListScreen({super.key});

  @override
  State<InvoiceListScreen> createState() => _InvoiceListScreenState();
}

class _InvoiceListScreenState extends State<InvoiceListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<InvoiceProvider>().loadInvoices();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Invoices'),
        actions: [
          Consumer<SyncProvider>(
            builder: (context, sync, _) {
              final pending = sync.pendingCount;
              return Stack(
                children: [
                  IconButton(
                    icon: sync.isSyncing
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const Icon(Icons.sync),
                    onPressed: sync.isSyncing ? null : () => sync.triggerSync(),
                    tooltip: 'Sync now',
                  ),
                  if (pending > 0)
                    Positioned(
                      right: 8,
                      top: 8,
                      child: Container(
                        width: 16,
                        height: 16,
                        decoration: const BoxDecoration(
                          color: Colors.orange,
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            '$pending',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          const SyncStatusBar(),
          Expanded(
            child: Consumer<InvoiceProvider>(
              builder: (context, provider, _) {
                if (provider.invoices.isEmpty) {
                  return _buildEmptyState(context);
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(8),
                  itemCount: provider.invoices.length,
                  itemBuilder: (context, index) {
                    return _InvoiceCard(invoice: provider.invoices[index]);
                  },
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/invoices/create'),
        icon: const Icon(Icons.add),
        label: const Text('New Invoice'),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.receipt_long_outlined, size: 64, color: Colors.grey.shade400),
          const SizedBox(height: 16),
          Text(
            'No invoices yet',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Tap + to create your first invoice',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }
}

class _InvoiceCard extends StatelessWidget {
  final InvoiceModel invoice;

  const _InvoiceCard({required this.invoice});

  Color _syncColor() {
    if (invoice.isSynced) return Colors.green;
    if (invoice.retryCount >= 3) return Colors.red;
    return Colors.orange;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: Colors.blue.shade50,
          child: Icon(Icons.receipt, color: Colors.blue.shade700),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                invoice.guestName,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                color: _syncColor(),
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 2),
            Text(
              '${invoice.totalAmount.toStringAsFixed(0)} ${invoice.currency}',
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
            Text(
              invoice.serialNumber,
              style: TextStyle(fontSize: 11, color: Colors.grey.shade600, fontFamily: 'monospace'),
            ),
          ],
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => context.push('/invoices/${invoice.id}'),
      ),
    );
  }
}
