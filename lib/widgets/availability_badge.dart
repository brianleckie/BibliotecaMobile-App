import 'package:flutter/material.dart';

class AvailabilityBadge extends StatelessWidget {
  final bool available;
  final int? count;

  const AvailabilityBadge({super.key, required this.available, this.count});

  @override
  Widget build(BuildContext context) {
    final color = available ? const Color(0xFF2f8f5b) : const Color(0xFFc0492f);
    final bg = available ? const Color(0xFFe7f3ec) : const Color(0xFFf7e9e4);
    final label = available ? (count != null ? '$count disp.' : 'Disponible') : 'Prestado';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }
}
