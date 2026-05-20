import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/animated_particles.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_textfield.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/loading_overlay.dart';
import '../state/auth_provider.dart';

class ForgotScreen extends StatefulWidget {
  const ForgotScreen({super.key});

  @override
  State<ForgotScreen> createState() => _ForgotScreenState();
}

class _ForgotScreenState extends State<ForgotScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _emailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  // Handle forgot password triggers
  Future<void> _handlePasswordReset() async {
    if (_formKey.currentState!.validate()) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final success = await authProvider.sendPasswordReset(_emailController.text.trim());

      if (mounted) {
        if (success) {
          setState(() {
            _emailSent = true;
          });
          _showCustomSnackBar(
            context,
            "A verification secure link has been sent to your email.",
            AppColors.success,
            Icons.mark_email_read_outlined,
          );
        } else {
          _showCustomSnackBar(
            context,
            authProvider.errorMessage ?? "Failed to send reset link.",
            AppColors.error,
            Icons.error_outline,
          );
        }
      }
    }
  }

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
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: LoadingOverlay(
        isLoading: authProvider.isLoading,
        message: "Requesting key rotation...",
        child: AnimatedParticles(
          child: SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Back Action Button
                    Align(
                      alignment: Alignment.centerLeft,
                      child: IconButton(
                        icon: Icon(
                          Icons.arrow_back_ios_new_rounded,
                          color: isDark ? Colors.white70 : AppColors.textLightPrimary,
                          size: 20,
                        ),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ).animate().fade(duration: 300.ms),

                    const SizedBox(height: 20),

                    // Key Lock Animated Logo
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: (isDark ? AppColors.electricCyan : AppColors.electricBlue).withOpacity(0.12),
                        border: Border.all(
                          color: (isDark ? AppColors.electricCyan : AppColors.electricBlue).withOpacity(0.3),
                          width: 1.5,
                        ),
                      ),
                      child: Icon(
                        _emailSent ? Icons.mark_email_read_rounded : Icons.lock_reset_rounded,
                        color: isDark ? AppColors.electricCyan : AppColors.electricBlue,
                        size: 38,
                      ),
                    ).animate().fade(duration: 450.ms).scale(begin: const Offset(0.7, 0.7), curve: Curves.easeOutBack),

                    const SizedBox(height: 20),

                    Text(
                      _emailSent ? "Secure Link Dispatched" : "Reset Password",
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: isDark ? Colors.white : AppColors.textLightPrimary,
                      ),
                    ).animate().fade(duration: 400.ms),

                    const SizedBox(height: 6),

                    Text(
                      _emailSent
                          ? "We have sent password recovery instruction parameters to your email."
                          : "Provide your registered email to rotate account access credentials",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 14,
                        color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                      ),
                    ).animate().fade(delay: 100.ms, duration: 400.ms),

                    const SizedBox(height: 40),

                    // Animated Cross-fade transition between Input form and Success card
                    AnimatedCrossFade(
                      duration: const Duration(milliseconds: 500),
                      firstCurve: Curves.easeInOut,
                      secondCurve: Curves.easeInOut,
                      crossFadeState: _emailSent ? CrossFadeState.showSecond : CrossFadeState.showFirst,
                      firstChild: GlassCard(
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Text(
                                "CITIZEN ACCESS RECOVERY",
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

                              // Email address input
                              CustomTextField(
                                controller: _emailController,
                                labelText: "Email Address",
                                hintText: "Enter your registered email",
                                prefixIcon: Icons.email_outlined,
                                keyboardType: TextInputType.emailAddress,
                                textInputAction: TextInputAction.done,
                                onFieldSubmitted: (_) => _handlePasswordReset(),
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

                              const SizedBox(height: 24),

                              // Send reset link button
                              CustomButton(
                                text: "DISPATCH RESET LINK",
                                onPressed: _handlePasswordReset,
                              ),
                            ],
                          ),
                        ),
                      ),
                      secondChild: GlassCard(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            const Icon(
                              Icons.verified_rounded,
                              color: AppColors.success,
                              size: 48,
                            ).animate().scale(delay: 200.ms, curve: Curves.bounceOut),
                            const SizedBox(height: 16),
                            const Text(
                              "Transmission Complete",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontFamily: 'Outfit',
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              "A secure verification token has been routed to:\n${_emailController.text}\n\nPlease click the link in the email to construct your new citizen access credentials.",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 13,
                                color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                                height: 1.5,
                              ),
                            ),
                            const SizedBox(height: 24),
                            CustomButton(
                              text: "BACK TO SIGN IN",
                              onPressed: () {
                                Navigator.pop(context);
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
