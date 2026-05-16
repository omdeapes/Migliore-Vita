import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/invoice_provider.dart';
import '../../providers/auth_provider.dart';
import '../../config/app_config.dart';

/// Invoice creation screen
/// Works 100% offline - saves to Realm immediately
class InvoiceCreateScreen extends StatefulWidget {
  final String? tripId;

  const InvoiceCreateScreen({super.key, this.tripId});

  @override
  State<InvoiceCreateScreen> createState() => _InvoiceCreateScreenState();
}

class _InvoiceCreateScreenState extends State<InvoiceCreateScreen> {
  final _formKey = GlobalKey<FormState>();
  final _guestNameController = TextEditingController();
  final _guestContactController = TextEditingController();
  final _guestHotelController = TextEditingController();
  final _guestRoomController = TextEditingController();
  final _amountController = TextEditingController();

  String _currency = AppConfig.defaultCurrency;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _guestNameController.dispose();
    _guestContactController.dispose();
    _guestHotelController.dispose();
    _guestRoomController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New Invoice'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Offline indicator
              _buildOfflineBanner(context),
              const SizedBox(height: 16),

              // Section: Guest Information
              _buildSectionHeader(context, 'Guest Information', Icons.person),
              const SizedBox(height: 12),

              TextFormField(
                controller: _guestNameController,
                decoration: const InputDecoration(
                  labelText: 'Guest Name *',
                  hintText: 'e.g., Ahmed Hassan',
                  prefixIcon: Icon(Icons.person_outline),
                ),
                textCapitalization: TextCapitalization.words,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Guest name is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 12),

              TextFormField(
                controller: _guestContactController,
                decoration: const InputDecoration(
                  labelText: 'Phone / Email / Telegram *',
                  hintText: '+20 1XX XXX XXXX or guest@email.com',
                  prefixIcon: Icon(Icons.contact_phone_outlined),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Contact info is required for media delivery';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 12),

              TextFormField(
                controller: _guestHotelController,
                decoration: const InputDecoration(
                  labelText: 'Hotel Name',
                  hintText: 'e.g., Grand Hyatt Sharm',
                  prefixIcon: Icon(Icons.hotel_outlined),
                ),
                textCapitalization: TextCapitalization.words,
              ),
              const SizedBox(height: 12),

              TextFormField(
                controller: _guestRoomController,
                decoration: const InputDecoration(
                  labelText: 'Room Number',
                  hintText: 'e.g., 412',
                  prefixIcon: Icon(Icons.door_back_door_outlined),
                ),
              ),
              const SizedBox(height: 24),

              // Section: Payment
              _buildSectionHeader(context, 'Payment', Icons.payments_outlined),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: TextFormField(
                      controller: _amountController,
                      decoration: const InputDecoration(
                        labelText: 'Amount *',
                        hintText: '0.00',
                        prefixIcon: Icon(Icons.attach_money),
                      ),
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Amount is required';
                        }
                        final amount = double.tryParse(value);
                        if (amount == null || amount <= 0) {
                          return 'Enter a valid amount';
                        }
                        return null;
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _currency,
                      decoration: const InputDecoration(labelText: 'Currency'),
                      items: ['EGP', 'USD', 'EUR', 'GBP'].map((c) {
                        return DropdownMenuItem(value: c, child: Text(c));
                      }).toList(),
                      onChanged: (value) {
                        if (value != null) setState(() => _currency = value);
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // Submit button
              ElevatedButton.icon(
                onPressed: _isSubmitting ? null : _handleSubmit,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                ),
                icon: _isSubmitting
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.save_outlined),
                label: Text(
                  _isSubmitting ? 'Saving...' : 'Create Invoice',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 8),

              Text(
                '📱 Saved offline. Will sync when WiFi is available.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOfflineBanner(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.orange.shade200),
      ),
      child: Row(
        children: [
          Icon(Icons.wifi_off, size: 16, color: Colors.orange.shade700),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'Works offline — invoice saved to device immediately',
              style: TextStyle(
                fontSize: 12,
                color: Colors.orange.shade800,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Theme.of(context).colorScheme.primary),
        const SizedBox(width: 8),
        Text(
          title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
      ],
    );
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    final authProvider = context.read<AuthProvider>();
    final invoiceProvider = context.read<InvoiceProvider>();

    final invoice = await invoiceProvider.createInvoice(
      tripId: widget.tripId ?? 'UNASSIGNED',
      photographerId: authProvider.photographerId ?? 'UNKNOWN',
      deviceId: authProvider.deviceId ?? 'UNKNOWN',
      guestName: _guestNameController.text.trim(),
      guestContact: _guestContactController.text.trim(),
      guestHotel: _guestHotelController.text.trim().isEmpty
          ? null
          : _guestHotelController.text.trim(),
      guestRoom: _guestRoomController.text.trim().isEmpty
          ? null
          : _guestRoomController.text.trim(),
      totalAmount: double.parse(_amountController.text.trim()),
      currency: _currency,
    );

    setState(() => _isSubmitting = false);

    if (invoice != null && mounted) {
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✅ Invoice ${invoice.serialNumber} created!'),
          backgroundColor: Colors.green,
          duration: const Duration(seconds: 3),
        ),
      );

      // Navigate to invoice detail to add media
      context.go('/invoices/${invoice.id}');
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(invoiceProvider.error ?? 'Failed to create invoice'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}
