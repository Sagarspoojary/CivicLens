import 'package:flutter/material.dart';

class AppColors {
  // Brand Base Colors
  static const Color primaryDark = Color(0xFF0F172A); // Midnight Navy
  static const Color primaryLight = Color(0xFFF8FAFC); // Clean Light Slate

  // Electric Smart-City Colors
  static const Color electricCyan = Color(0xFF00F0FF); // Vivid Cyan Glow
  static const Color electricBlue = Color(0xFF3B82F6); // High-tech Electric Blue
  static const Color vibrantPurple = Color(0xFF8B5CF6); // Smart-Gov Accent Purple

  // Neutral Dark Theme
  static const Color bgDark = Color(0xFF070A13); // High-end dark background
  static const Color bgDarkSecondary = Color(0xFF0F172A); // Glass card backdrop base
  static const Color textDarkPrimary = Color(0xFFF8FAFC); // Clean White/Slate
  static const Color textDarkSecondary = Color(0xFF94A3B8); // Slate 400
  static const Color borderDark = Color(0x3300F0FF); // Frosted Electric Cyan Border

  // Neutral Light Theme
  static const Color bgLight = Color(0xFFF1F5F9); // Light tech background
  static const Color bgLightSecondary = Color(0xFFFFFFFF); // Frosty white backdrop
  static const Color textLightPrimary = Color(0xFF0F172A); // Deep slate navy
  static const Color textLightSecondary = Color(0xFF64748B); // Slate 500
  static const Color borderLight = Color(0x1F0F172A); // Frosted dark border

  // Premium Gradients
  static const LinearGradient darkBgGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF04060C),
      Color(0xFF0C1322),
      Color(0xFF070B14),
    ],
  );

  static const LinearGradient lightBgGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFFE2E8F0),
      Color(0xFFF1F5F9),
      Color(0xFFF8FAFC),
    ],
  );

  static const LinearGradient electricGlowGradient = LinearGradient(
    colors: [
      electricCyan,
      electricBlue,
      vibrantPurple,
    ],
  );

  static const LinearGradient cardGlowGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0x1A00F0FF),
      Color(0x0A8B5CF6),
    ],
  );

  // Status/Feedback Colors
  static const Color success = Color(0xFF10B981); // Emerald Green
  static const Color error = Color(0xFFEF4444); // Crimson Red
  static const Color warning = Color(0xFFF59E0B); // Amber Orange
}
