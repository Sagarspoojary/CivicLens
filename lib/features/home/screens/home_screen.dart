import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/animated_particles.dart';
import '../../../core/widgets/glass_card.dart';
import '../../auth/state/auth_provider.dart';
import '../../auth/screens/login_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  // Handle logout
  Future<void> _handleSignOut(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.signOut();
    
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          elevation: 0,
          backgroundColor: Colors.transparent,
          content: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.electricBlue.withOpacity(0.9),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Row(
              children: [
                Icon(Icons.logout_rounded, color: Colors.white),
                SizedBox(width: 12),
                Text(
                  "Secure citizen session terminated.",
                  style: TextStyle(fontFamily: 'Inter', color: Colors.white),
                ),
              ],
            ),
          ),
        ),
      );
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: AnimatedParticles(
        child: SafeArea(
          child: Column(
            children: [
              // Custom Header Panel
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "CIVICLENS PORTAL",
                          style: TextStyle(
                            fontFamily: 'Outfit',
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.5,
                            color: isDark ? AppColors.electricCyan : AppColors.electricBlue,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          "Welcome Back,",
                          style: TextStyle(
                            fontFamily: 'Outfit',
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: isDark ? Colors.white : AppColors.textLightPrimary,
                          ),
                        ),
                      ],
                    ),
                    // Glass logout circle button
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isDark ? AppColors.borderDark : AppColors.borderLight,
                          width: 1.5,
                        ),
                      ),
                      child: ClipOval(
                        child: Material(
                          color: isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.03),
                          child: IconButton(
                            icon: const Icon(Icons.logout_rounded, color: Colors.redAccent, size: 20),
                            onPressed: () => _handleSignOut(context),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ).animate().fade(duration: 400.ms),

              // Main Dashboard Body
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // User Identity Profile Card
                      GlassCard(
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 30,
                              backgroundColor: (isDark ? AppColors.electricCyan : AppColors.electricBlue).withOpacity(0.2),
                              child: Text(
                                authProvider.citizenName.isNotEmpty 
                                    ? authProvider.citizenName[0].toUpperCase() 
                                    : "C",
                                style: TextStyle(
                                  fontFamily: 'Outfit',
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? AppColors.electricCyan : AppColors.electricBlue,
                                ),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    authProvider.citizenName,
                                    style: TextStyle(
                                      fontFamily: 'Outfit',
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: isDark ? Colors.white : AppColors.textLightPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    authProvider.citizenEmail,
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 13,
                                      color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: AppColors.success.withOpacity(0.12),
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(color: AppColors.success.withOpacity(0.3)),
                                    ),
                                    child: const Text(
                                      "Verified Citizen Profile",
                                      style: TextStyle(
                                        fontFamily: 'Outfit',
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.success,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ).animate().fade(delay: 150.ms, duration: 400.ms).slideY(begin: 0.1, curve: Curves.easeOut),

                      const SizedBox(height: 24),

                      // Smart Governance Metrics Header
                      Text(
                        "AI GOVERNANCE METRICS",
                        style: TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                          color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                        ),
                      ).animate().fade(delay: 200.ms),

                      const SizedBox(height: 12),

                      // Grid of Metrics
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        crossAxisSpacing: 14,
                        mainAxisSpacing: 14,
                        childAspectRatio: 1.35,
                        children: [
                          _buildMetricCard("Index rating", "98.4%", Icons.bolt_outlined, AppColors.electricCyan, isDark),
                          _buildMetricCard("Open Issues", "4 Active", Icons.gavel_rounded, AppColors.electricBlue, isDark),
                          _buildMetricCard("Resolved Rate", "94.2%", Icons.verified_user_outlined, AppColors.success, isDark),
                          _buildMetricCard("Response Time", "4.2 hrs", Icons.alarm_on_outlined, AppColors.vibrantPurple, isDark),
                        ],
                      ).animate().fade(delay: 250.ms, duration: 500.ms).scale(begin: const Offset(0.95, 0.95)),

                      const SizedBox(height: 28),

                      // Grievance Feed List Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "YOUR RECENT CITIZEN FILES",
                            style: TextStyle(
                              fontFamily: 'Outfit',
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.0,
                              color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                            ),
                          ),
                          Text(
                            "View All",
                            style: TextStyle(
                              fontFamily: 'Outfit',
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: isDark ? AppColors.electricCyan : AppColors.electricBlue,
                            ),
                          ),
                        ],
                      ).animate().fade(delay: 350.ms),

                      const SizedBox(height: 12),

                      // List of Mock Grievance Items
                      ListView(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        children: [
                          _buildFileItem(
                            "Streetlight Grid Interruption",
                            "Report #CIV-9014 • AI auto-routed to Power Dept.",
                            "In Progress",
                            Colors.amber,
                            isDark,
                          ),
                          _buildFileItem(
                            "Pothole on Main Blvd",
                            "Report #CIV-8841 • Resolved via Smart-Contract.",
                            "Resolved",
                            AppColors.success,
                            isDark,
                          ),
                          _buildFileItem(
                            "Water Pressure Drop",
                            "Report #CIV-8729 • Technicians dispatched.",
                            "Assigned",
                            AppColors.electricBlue,
                            isDark,
                          ),
                        ],
                      ).animate().fade(delay: 400.ms, duration: 500.ms).slideY(begin: 0.1),
                      
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color, bool isDark) {
    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      opacity: 0.04,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 12,
                  color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                ),
              ),
              Icon(icon, color: color.withOpacity(0.8), size: 18),
            ],
          ),
          Text(
            value,
            style: TextStyle(
              fontFamily: 'Outfit',
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: isDark ? Colors.white : AppColors.textLightPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFileItem(String title, String subtitle, String status, Color statusColor, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: GlassCard(
        padding: const EdgeInsets.all(16),
        opacity: 0.05,
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.description_outlined, color: statusColor, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : AppColors.textLightPrimary,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 11,
                      color: isDark ? AppColors.textDarkSecondary.withOpacity(0.7) : AppColors.textLightSecondary.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: statusColor.withOpacity(0.2)),
              ),
              child: Text(
                status,
                style: TextStyle(
                  fontFamily: 'Outfit',
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: statusColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
