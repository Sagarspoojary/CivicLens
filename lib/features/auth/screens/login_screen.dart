import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/animated_particles.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_textfield.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/loading_overlay.dart';
import '../state/auth_provider.dart';
import 'signup_screen.dart';
import 'forgot_screen.dart';
import '../../home/screens/home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // Handle email/password sign in
  Future<void> _handleSignIn() async {
    if (_formKey.currentState!.validate()) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final success = await authProvider.signIn(
        _emailController.text.trim(),
        _passwordController.text.trim(),
      );

      if (mounted) {
        if (success) {
          _showCustomSnackBar(
            context,
            "Citizen authentication verified successfully.",
            AppColors.success,
            Icons.verified_user,
          );
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const HomeScreen()),
          );
        } else {
          _showCustomSnackBar(
            context,
            authProvider.errorMessage ?? "Authentication failed.",
            AppColors.error,
            Icons.error_outline,
          );
        }
      }
    }
  }

  // Handle Google sign in
  Future<void> _handleGoogleSignIn() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.signInWithGoogle();

    if (mounted) {
      if (success) {
        _showCustomSnackBar(
          context,
          "Google citizen credential authenticated.",
          AppColors.success,
          Icons.verified_user,
        );
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      } else {
        _showCustomSnackBar(
          context,
          authProvider.errorMessage ?? "Google Sign-In failed.",
          AppColors.error,
          Icons.error_outline,
        );
      }
    }
  }

  // Beautiful custom snackbar
  void _showCustomSnackBar(BuildContext context, String message, Color color, IconData icon) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        duration: const Duration(seconds: 4),
        content: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: color.withOpacity(0.95),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white24, width: 1),
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: Row(
            children: [
              Icon(icon, color: Colors.white, size: 22),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  message,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final size = MediaQuery.of(context).size;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: LoadingOverlay(
        isLoading: authProvider.isLoading,
        message: "Verifying civic credentials...",
        child: AnimatedParticles(
          child: SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Container(
                constraints: BoxConstraints(
                  minHeight: size.height - MediaQuery.of(context).padding.top - MediaQuery.of(context).padding.bottom,
                ),
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Offline Simulator Indicator Banner
                    if (!authProvider.isFirebaseConfigured)
                      Container(
                        margin: const EdgeInsets.only(bottom: 24),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        decoration: BoxDecoration(
                          color: AppColors.vibrantPurple.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.vibrantPurple.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.info_outline, color: AppColors.electricCyan, size: 20),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                "Running in Offline Simulation Mode. All views fully interactive.",
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 12,
                                  color: isDark ? Colors.white70 : AppColors.textLightPrimary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ).animate().fade(duration: 400.ms).slideY(begin: -0.2),

                    // Elegant glowing logo mark
                    _buildLogo(isDark)
                        .animate()
                        .fade(duration: 600.ms)
                        .scale(begin: const Offset(0.8, 0.8), curve: Curves.easeOutBack),

                    const SizedBox(height: 12),

                    // Title & Tagline
                    Text(
                      "CivicLens",
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.0,
                        color: isDark ? Colors.white : AppColors.textLightPrimary,
                      ),
                    ).animate().fade(delay: 150.ms, duration: 400.ms),

                    const SizedBox(height: 4),

                    Text(
                      "Empowering Citizens Through Smart Governance",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 14,
                        color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ).animate().fade(delay: 250.ms, duration: 400.ms),

                    const SizedBox(height: 36),

                    // Main Glassmorphic Form Card
                    GlassCard(
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              "SECURE CITIZEN SIGN IN",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontFamily: 'Outfit',
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.5,
                                color: isDark ? AppColors.electricCyan : AppColors.electricBlue,
                              ),
                            ),
                            const SizedBox(height: 24),

                            // Email input
                            CustomTextField(
                              controller: _emailController,
                              labelText: "Email Address",
                              hintText: "Enter your registered email",
                              prefixIcon: Icons.email_outlined,
                              keyboardType: TextInputType.emailAddress,
                              validator: (val) {
                                if (val == null || val.isEmpty) {
                                  return "Email is required";
                                }
                                if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(val)) {
                                  return "Enter a valid email address";
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 16),

                            // Password input
                            CustomTextField(
                              controller: _passwordController,
                              labelText: "Citizen Access Password",
                              hintText: "Enter your password",
                              prefixIcon: Icons.lock_outlined,
                              isPassword: true,
                              textInputAction: TextInputAction.done,
                              onFieldSubmitted: (_) => _handleSignIn(),
                              validator: (val) {
                                if (val == null || val.isEmpty) {
                                  return "Password is required";
                                }
                                if (val.length < 6) {
                                  return "Password must be at least 6 characters";
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 12),

                            // Forgot Password Action
                            Align(
                              alignment: Alignment.centerRight,
                              child: TextButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (_) => const ForgotScreen()),
                                  );
                                },
                                style: TextButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                ),
                                child: Text(
                                  "Reset Password?",
                                  style: TextStyle(
                                    fontFamily: 'Outfit',
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: isDark ? AppColors.electricCyan : AppColors.electricBlue,
                                  ),
                                ),
                              ),
                            ),

                            const SizedBox(height: 20),

                            // Animated Sign In button
                            CustomButton(
                              text: "AUTHENTICATE",
                              onPressed: _handleSignIn,
                            ),

                            const SizedBox(height: 20),

                            // OR Divider
                            Row(
                              children: [
                                Expanded(
                                  child: Divider(
                                    color: isDark ? Colors.white12 : Colors.black12,
                                    thickness: 1.2,
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 16),
                                  child: Text(
                                    "OR CONTINUING WITH",
                                    style: TextStyle(
                                      fontFamily: 'Outfit',
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 1.0,
                                      color: isDark ? AppColors.textDarkSecondary.withOpacity(0.6) : AppColors.textLightSecondary.withOpacity(0.6),
                                    ),
                                  ),
                                ),
                                Expanded(
                                  child: Divider(
                                    color: isDark ? Colors.white12 : Colors.black12,
                                    thickness: 1.2,
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 20),

                            // Google login button
                            CustomButton(
                              text: "Continue with Google",
                              customIconAsset: "assets/images/google_logo.jpeg",
                              isSecondary: true,
                              onPressed: _handleGoogleSignIn,
                            ),
                          ],
                        ),
                      ),
                    ).animate().fade(delay: 350.ms, duration: 500.ms).slideY(begin: 0.1, curve: Curves.easeOut),

                    const SizedBox(height: 28),

                    // Signup prompt link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Don't have an account?",
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 14,
                            color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                          ),
                        ),
                        const SizedBox(width: 6),
                        GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const SignUpScreen()),
                            );
                          },
                          child: Text(
                            "Sign Up",
                            style: TextStyle(
                              fontFamily: 'Outfit',
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: isDark ? AppColors.electricCyan : AppColors.electricBlue,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ],
                    ).animate().fade(delay: 500.ms, duration: 400.ms),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Futuristic interlocking vector branding icon
  Widget _buildLogo(bool isDark) {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [
            AppColors.electricCyan.withOpacity(0.2),
            AppColors.vibrantPurple.withOpacity(0.2),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border.all(
          color: isDark ? AppColors.electricCyan.withOpacity(0.4) : AppColors.electricBlue.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.electricCyan.withOpacity(isDark ? 0.15 : 0.05),
            blurRadius: 20,
            spreadRadius: 1,
          )
        ],
      ),
      child: Center(
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Inner glowing particle core
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [AppColors.electricCyan, AppColors.electricBlue],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: AppTheme.cyanGlowShadow(opacity: 0.5, blurRadius: 10),
              ),
              child: const Icon(
                Icons.lens_outlined,
                color: Colors.white,
                size: 16,
              ),
            ),
            // Outer rotating ring outline elements (animated by parent loop)
            const SizedBox(
              width: 56,
              height: 56,
              child: CircularProgressIndicator(
                value: 0.7,
                strokeWidth: 1.5,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.vibrantPurple),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
