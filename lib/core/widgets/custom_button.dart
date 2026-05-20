import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class CustomButton extends StatefulWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isLoading;
  final bool isSecondary;
  final IconData? icon;
  final String? customIconAsset;
  final double width;
  final double height;

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.isSecondary = false,
    this.icon,
    this.customIconAsset,
    this.width = double.infinity,
    this.height = 56.0,
  });

  @override
  State<CustomButton> createState() => _CustomButtonState();
}

class _CustomButtonState extends State<CustomButton> with SingleTickerProviderStateMixin {
  late final AnimationController _scaleController;
  late final Animation<double> _scaleAnimation;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _scaleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 150),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _scaleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTapDown: (_) {
          if (!widget.isLoading) _scaleController.forward();
        },
        onTapUp: (_) {
          if (!widget.isLoading) {
            _scaleController.reverse();
            widget.onPressed();
          }
        },
        onTapCancel: () {
          if (!widget.isLoading) _scaleController.reverse();
        },
        child: ScaleTransition(
          scale: _scaleAnimation,
          child: Container(
            width: widget.width,
            height: widget.height,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              gradient: widget.isSecondary
                  ? null
                  : LinearGradient(
                      colors: [
                        AppColors.electricCyan,
                        AppColors.electricBlue,
                        AppColors.vibrantPurple.withOpacity(0.9),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
              color: widget.isSecondary
                  ? (isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.03))
                  : null,
              border: widget.isSecondary
                  ? Border.all(
                      color: isDark 
                          ? AppColors.electricCyan.withOpacity(0.2) 
                          : AppColors.electricBlue.withOpacity(0.2),
                      width: 1.5,
                    )
                  : null,
              boxShadow: widget.isSecondary || widget.isLoading
                  ? null
                  : [
                      BoxShadow(
                        color: AppColors.electricCyan.withOpacity(_isHovered ? 0.45 : 0.3),
                        blurRadius: _isHovered ? 25 : 15,
                        spreadRadius: _isHovered ? 2 : 0,
                        offset: const Offset(0, 4),
                      ),
                      BoxShadow(
                        color: AppColors.vibrantPurple.withOpacity(_isHovered ? 0.35 : 0.2),
                        blurRadius: _isHovered ? 20 : 12,
                        spreadRadius: _isHovered ? 1 : 0,
                        offset: const Offset(0, 2),
                      ),
                    ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Material(
                color: Colors.transparent,
                child: Center(
                  child: widget.isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (widget.customIconAsset != null) ...[
                              Image.asset(
                                widget.customIconAsset!,
                                width: 22,
                                height: 22,
                                fit: BoxFit.contain,
                              ),
                              const SizedBox(width: 12),
                            ] else if (widget.icon != null) ...[
                              Icon(
                                widget.icon,
                                color: widget.isSecondary 
                                    ? (isDark ? Colors.white : AppColors.textLightPrimary) 
                                    : Colors.white,
                                size: 20,
                              ),
                              const SizedBox(width: 10),
                            ],
                            Text(
                              widget.text,
                              style: TextStyle(
                                fontFamily: 'Outfit',
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: widget.isSecondary
                                    ? (isDark ? Colors.white : AppColors.textLightPrimary)
                                    : Colors.white,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
