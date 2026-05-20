import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/state/auth_provider.dart';
import 'features/auth/screens/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set systems overlays (status bar and bottom nav bar colors)
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Try to initialize Firebase gracefully.
  // This allows the app to compile and run smoothly in offline simulated mode
  // if the developer has not yet placed their google-services files.
  try {
    await Firebase.initializeApp();
    debugPrint("CivicLens: Firebase Core connected successfully.");
  } catch (e) {
    debugPrint("-----------------------------------------------------------------");
    debugPrint("CivicLens WARNING: Firebase is uninitialized or files are missing.");
    debugPrint("Running app in premium Simulated Demo Mode.");
    debugPrint("Add google-services.json/GoogleService-Info.plist for real server runs.");
    debugPrint("-----------------------------------------------------------------");
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: const CivicLensApp(),
    ),
  );
}

class CivicLensApp extends StatelessWidget {
  const CivicLensApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CivicLens',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system, // Adaptive Light + Dark theme matching system preferences
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      home: const LoginScreen(),
    );
  }
}
