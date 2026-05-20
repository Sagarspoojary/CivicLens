import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final double blur;
  final double opacity;
  final double borderRadius;
  final BorderSide? border;
  final EdgeInsetsGeometry padding;
  final List<BoxShadow>? customShadows;

  const GlassCard({
    super.key,
    required this.child,
    this.blur = 18.0,
    this.opacity = 0.08,
    this.borderRadius = 24.0,
    this.border,
    this.padding = const EdgeInsets.all(24.0),
    this.customShadows,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // Premium frosted colors based on dark vs light adaptive UI
    final Color glassColor = isDark 
        ? Colors.white.withOpacity(opacity) 
        : Colors.white.withOpacity(opacity * 2.5 + 0.1); // slightly more opaque in light mode

    final Border defaultBorder = Border.all(
      color: isDark 
          ? AppColors.electricCyan.withOpacity(0.12) 
          : Colors.white.withOpacity(0.5),
      width: 1.5,
    );

    final List<BoxShadow> defaultShadows = [
      BoxShadow(
        color: isDark 
            ? Colors.black.withOpacity(0.25) 
            : AppColors.electricBlue.withOpacity(0.06),
        blurRadius: 30,
        spreadRadius: -5,
        offset: const Offset(0, 10),
      ),
      if (isDark) BoxShadow(
        color: AppColors.electricCyan.withOpacity(0.03),
        blurRadius: 15,
        spreadRadius: 1,
      )
    ];

    return Container(
      decoration: BoxDecoration(
        boxShadow: customShadows ?? defaultShadows,
        borderRadius: BorderRadius.circular(borderRadius),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              color: glassColor,
              borderRadius: BorderRadius.circular(borderRadius),
              border: border != null ? Border.fromBorderSide(border!) : defaultBorder,
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}
