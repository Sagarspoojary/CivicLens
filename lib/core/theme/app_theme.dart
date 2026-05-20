import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.bgDark,
      primaryColor: AppColors.electricCyan,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.electricCyan,
        secondary: AppColors.electricBlue,
        tertiary: AppColors.vibrantPurple,
        surface: AppColors.bgDarkSecondary,
        error: AppColors.error,
      ),
      textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme).copyWith(
        bodyLarge: GoogleFonts.inter(color: AppColors.textDarkPrimary),
        bodyMedium: GoogleFonts.inter(color: AppColors.textDarkSecondary),
        bodySmall: GoogleFonts.inter(color: AppColors.textDarkSecondary.withOpacity(0.7)),
      ),
      cardTheme: CardThemeData(
        color: AppColors.bgDarkSecondary.withOpacity(0.6),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: AppColors.borderDark, width: 1.5),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.bgDarkSecondary.withOpacity(0.5),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Colors.white10),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Colors.white10),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.electricCyan, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.error, width: 2),
        ),
        hintStyle: GoogleFonts.inter(color: AppColors.textDarkSecondary.withOpacity(0.5)),
        labelStyle: GoogleFonts.outfit(color: AppColors.textDarkSecondary),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.bgDarkSecondary,
        contentTextStyle: GoogleFonts.inter(color: AppColors.textDarkPrimary),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.borderDark),
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.bgLight,
      primaryColor: AppColors.electricBlue,
      colorScheme: const ColorScheme.light(
        primary: AppColors.electricBlue,
        secondary: AppColors.electricCyan,
        tertiary: AppColors.vibrantPurple,
        surface: AppColors.bgLightSecondary,
        error: AppColors.error,
      ),
      textTheme: GoogleFonts.outfitTextTheme(ThemeData.light().textTheme).copyWith(
        bodyLarge: GoogleFonts.inter(color: AppColors.textLightPrimary),
        bodyMedium: GoogleFonts.inter(color: AppColors.textLightSecondary),
        bodySmall: GoogleFonts.inter(color: AppColors.textLightSecondary.withOpacity(0.7)),
      ),
      cardTheme: CardThemeData(
        color: AppColors.bgLightSecondary.withOpacity(0.75),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: AppColors.borderLight, width: 1),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.bgLightSecondary.withOpacity(0.8),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Colors.black12),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Colors.black12),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.electricBlue, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.error, width: 2),
        ),
        hintStyle: GoogleFonts.inter(color: AppColors.textLightSecondary.withOpacity(0.5)),
        labelStyle: GoogleFonts.outfit(color: AppColors.textLightSecondary),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: Colors.white,
        contentTextStyle: GoogleFonts.inter(color: AppColors.textLightPrimary),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.borderLight),
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // Common Glow Shadows for UI Elements
  static List<BoxShadow> cyanGlowShadow({double opacity = 0.3, double blurRadius = 15}) {
    return [
      BoxShadow(
        color: AppColors.electricCyan.withOpacity(opacity),
        blurRadius: blurRadius,
        spreadRadius: 1,
      ),
    ];
  }

  static List<BoxShadow> blueGlowShadow({double opacity = 0.3, double blurRadius = 15}) {
    return [
      BoxShadow(
        color: AppColors.electricBlue.withOpacity(opacity),
        blurRadius: blurRadius,
        spreadRadius: 1,
      ),
    ];
  }
}
