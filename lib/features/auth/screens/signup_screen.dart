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
import '../../home/screens/home_screen.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  // Handle Sign Up registration
  Future<void> _handleSignUp() async {
    if (_formKey.currentState!.validate()) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final success = await authProvider.signUp(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
        name: _nameController.text.trim(),
        phone: _phoneController.text.trim(),
      );

      if (mounted) {
        if (success) {
          _showCustomSnackBar(
            context,
            "Smart-city citizen account registered!",
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
            authProvider.errorMessage ?? "Registration failed.",
            AppColors.error,
            Icons.error_outline,
          );
        }
      }
    }
  }

  // Handle Google signup
  Future<void> _handleGoogleSignUp() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.signInWithGoogle();

    if (mounted) {
      if (success) {
        _showCustomSnackBar(
          context,
          "Google citizen credential registered.",
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
          authProvider.errorMessage ?? "Google registration failed.",
          AppColors.error,
          Icons.error_outline,
        );
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
        message: "Provisioning citizen keys...",
        child: AnimatedParticles(
          child: SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Back arrow icon
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

                    const SizedBox(height: 10),

                    // Header Info
                    Text(
                      "Register Account",
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 30,
                        fontWeight: FontWeight.w900,
                        color: isDark ? Colors.white : AppColors.textLightPrimary,
                      ),
                    ).animate().fade(duration: 400.ms).slideY(begin: -0.1),

                    const SizedBox(height: 6),

                    Text(
                      "Join CivicLens smart governance network today",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 14,
                        color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                      ),
                    ).animate().fade(delay: 100.ms, duration: 400.ms),

                    const SizedBox(height: 30),

                    // Glass card containing forms
                    GlassCard(
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              "CITIZEN PROFILE DETAILS",
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

                            // Full Name
                            CustomTextField(
                              controller: _nameController,
                              labelText: "Full Name",
                              hintText: "Enter your full name",
                              prefixIcon: Icons.person_outline,
                              validator: (val) {
                                if (val == null || val.isEmpty) {
                                  return "Full name is required";
                                }
                                if (val.trim().split(' ').length < 2) {
                                  return "Please enter both first and last name";
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 16),

                            // Email Address
                            CustomTextField(
                              controller: _emailController,
                              labelText: "Email Address",
                              hintText: "Enter valid email address",
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

                            // Phone Number
                            CustomTextField(
                              controller: _phoneController,
                              labelText: "Phone Number",
                              hintText: "+1 (555) 012-3456",
                              prefixIcon: Icons.phone_android_outlined,
                              keyboardType: TextInputType.phone,
                              validator: (val) {
                                if (val == null || val.isEmpty) {
                                  return "Phone number is required";
                                }
                                if (val.length < 8) {
                                  return "Please enter a valid phone number";
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 16),

                            // Password
                            CustomTextField(
                              controller: _passwordController,
                              labelText: "Access Password",
                              hintText: "At least 6 characters",
                              prefixIcon: Icons.lock_outlined,
                              isPassword: true,
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

                            const SizedBox(height: 16),

                            // Confirm Password
                            CustomTextField(
                              controller: _confirmPasswordController,
                              labelText: "Confirm Password",
                              hintText: "Re-type password",
                              prefixIcon: Icons.lock_clock_outlined,
                              isPassword: true,
                              textInputAction: TextInputAction.done,
                              onFieldSubmitted: (_) => _handleSignUp(),
                              validator: (val) {
                                if (val == null || val.isEmpty) {
                                  return "Please confirm your password";
                                }
                                if (val != _passwordController.text) {
                                  return "Passwords do not match";
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 24),

                            // Register Button
                            CustomButton(
                              text: "CREATE CITIZEN ACCOUNT",
                              onPressed: _handleSignUp,
                            ),

                            const SizedBox(height: 20),

                            // Divider
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
                                    "OR SIGNUP WITH",
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

                            // Google Signup Option
                            CustomButton(
                              text: "Signup with Google",
                              customIconAsset: "assets/images/google_logo.jpeg",
                              isSecondary: true,
                              onPressed: _handleGoogleSignUp,
                            ),
                          ],
                        ),
                      ),
                    ).animate().fade(delay: 200.ms, duration: 450.ms).slideY(begin: 0.1, curve: Curves.easeOut),

                    const SizedBox(height: 24),

                    // Back to login prompt
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Already have an account?",
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 14,
                            color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                          ),
                        ),
                        const SizedBox(width: 6),
                        GestureDetector(
                          onTap: () {
                            Navigator.pop(context);
                          },
                          child: Text(
                            "Log In",
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
                    ).animate().fade(delay: 350.ms, duration: 400.ms),
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
