import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class AnimatedParticles extends StatefulWidget {
  final Widget child;

  const AnimatedParticles({super.key, required this.child});

  @override
  State<AnimatedParticles> createState() => _AnimatedParticlesState();
}

class _AnimatedParticlesState extends State<AnimatedParticles> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  final List<_Particle> _particles = [];
  final List<_GlowBlob> _glowBlobs = [];
  final math.Random _random = math.Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();

    // Initialize smaller floating particles
    for (int i = 0; i < 35; i++) {
      _particles.add(_Particle(
        x: _random.nextDouble(),
        y: _random.nextDouble(),
        size: _random.nextDouble() * 3 + 1.5,
        speed: _random.nextDouble() * 0.05 + 0.02,
        angle: _random.nextDouble() * 2 * math.pi,
        opacity: _random.nextDouble() * 0.4 + 0.2,
        color: _random.nextBool()
            ? AppColors.electricCyan
            : (_random.nextBool() ? AppColors.electricBlue : AppColors.vibrantPurple),
      ));
    }

    // Initialize large soft pulsing background glowing blobs (nebula effect)
    _glowBlobs.add(_GlowBlob(
      baseX: 0.2,
      baseY: 0.3,
      radius: 180,
      color: AppColors.electricCyan.withOpacity(0.12),
      speed: 0.15,
    ));
    _glowBlobs.add(_GlowBlob(
      baseX: 0.8,
      baseY: 0.7,
      radius: 220,
      color: AppColors.vibrantPurple.withOpacity(0.1),
      speed: 0.12,
    ));
    _glowBlobs.add(_GlowBlob(
      baseX: 0.5,
      baseY: 0.5,
      radius: 150,
      color: AppColors.electricBlue.withOpacity(0.08),
      speed: 0.1,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Stack(
      children: [
        // Premium adaptive base background gradient
        Container(
          width: double.infinity,
          height: double.infinity,
          decoration: BoxDecoration(
            gradient: isDark ? AppColors.darkBgGradient : AppColors.lightBgGradient,
          ),
        ),
        // Live floating elements
        AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            _updatePositions();
            return CustomPaint(
              painter: _ParticlePainter(
                particles: _particles,
                glowBlobs: _glowBlobs,
                isDark: isDark,
              ),
              child: Container(),
            );
          },
        ),
        // Child content
        widget.child,
      ],
    );
  }

  void _updatePositions() {
    // Update floating particle positions
    for (var particle in _particles) {
      particle.y -= particle.speed * 0.01;
      // Gently drift horizontally
      particle.x += math.sin(_controller.value * 2 * math.pi + particle.angle) * 0.001;
      
      // Recycle particle when it drifts off top screen
      if (particle.y < -0.05) {
        particle.y = 1.05;
        particle.x = _random.nextDouble();
      }
      if (particle.x < -0.05) particle.x = 1.05;
      if (particle.x > 1.05) particle.x = -0.05;
    }

    // Update glowing blobs orbits
    for (var blob in _glowBlobs) {
      blob.x = blob.baseX + math.sin(_controller.value * 2 * math.pi * blob.speed) * 0.08;
      blob.y = blob.baseY + math.cos(_controller.value * 2 * math.pi * blob.speed) * 0.08;
      // Pulsate size slightly
      blob.currentRadius = blob.radius + math.sin(_controller.value * 2 * math.pi) * 15;
    }
  }
}

class _Particle {
  double x;
  double y;
  final double size;
  final double speed;
  final double angle;
  final double opacity;
  final Color color;

  _Particle({
    required this.x,
    required this.y,
    required this.size,
    required this.speed,
    required this.angle,
    required this.opacity,
    required this.color,
  });
}

class _GlowBlob {
  final double baseX;
  final double baseY;
  double x = 0;
  double y = 0;
  final double radius;
  double currentRadius = 0;
  final Color color;
  final double speed;

  _GlowBlob({
    required this.baseX,
    required this.baseY,
    required this.radius,
    required this.color,
    required this.speed,
  }) {
    x = baseX;
    y = baseY;
    currentRadius = radius;
  }
}

class _ParticlePainter extends CustomPainter {
  final List<_Particle> particles;
  final List<_GlowBlob> glowBlobs;
  final bool isDark;

  _ParticlePainter({
    required this.particles,
    required this.glowBlobs,
    required this.isDark,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Draw large background glowing blobs (nebula glow effects)
    for (var blob in glowBlobs) {
      final double xPos = blob.x * size.width;
      final double yPos = blob.y * size.height;
      
      final Paint blobPaint = Paint()
        ..shader = RadialGradient(
          colors: [
            blob.color,
            blob.color.withOpacity(0.01),
          ],
        ).createShader(Rect.fromCircle(center: Offset(xPos, yPos), radius: blob.currentRadius));

      canvas.drawCircle(Offset(xPos, yPos), blob.currentRadius, blobPaint);
    }

    // 2. Draw smaller floating particles
    for (var particle in particles) {
      final double xPos = particle.x * size.width;
      final double yPos = particle.y * size.height;

      // Outer soft glow aura for particles in dark mode
      if (isDark) {
        final Paint glowPaint = Paint()
          ..color = particle.color.withOpacity(particle.opacity * 0.4)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3);
        canvas.drawCircle(Offset(xPos, yPos), particle.size * 2, glowPaint);
      }

      // Solid core
      final Paint corePaint = Paint()
        ..color = particle.color.withOpacity(particle.opacity);
      canvas.drawCircle(Offset(xPos, yPos), particle.size, corePaint);
    }
  }

  @override
  bool shouldRepaint(covariant _ParticlePainter oldDelegate) => true;
}
