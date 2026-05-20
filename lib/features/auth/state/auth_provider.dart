import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/auth_service.dart';

// Simulated citizen profile if Firebase is unconfigured/running offline
class SimulatedUser {
  final String uid;
  final String? displayName;
  final String? email;
  final String? phoneNumber;

  SimulatedUser({
    required this.uid,
    this.displayName,
    this.email,
    this.phoneNumber,
  });
}

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  
  bool _isLoading = false;
  String? _errorMessage;
  
  // Track active authenticated citizen
  User? _firebaseUser;
  SimulatedUser? _simulatedUser;
  
  StreamSubscription<User?>? _authSubscription;

  AuthProvider() {
    // If Firebase core is up, listen to changes
    if (_authService.isFirebaseAvailable) {
      _authSubscription = _authService.authStateChanges.listen((user) {
        _firebaseUser = user;
        notifyListeners();
      });
    }
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    super.dispose();
  }

  // Getters
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _firebaseUser != null || _simulatedUser != null;
  bool get isFirebaseConfigured => _authService.isFirebaseAvailable;
  
  // Get active name
  String get citizenName {
    if (_firebaseUser != null) {
      return _firebaseUser!.displayName ?? "Citizen User";
    }
    return _simulatedUser?.displayName ?? "Demo Citizen";
  }

  // Get active email
  String get citizenEmail {
    if (_firebaseUser != null) {
      return _firebaseUser!.email ?? "";
    }
    return _simulatedUser?.email ?? "demo@civiclens.gov";
  }

  // Reset error states
  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  // Set loading state
  void _setLoading(bool val) {
    _isLoading = val;
    notifyListeners();
  }

  // General Error Handler wrapper
  void _handleError(dynamic e) {
    if (e is AuthException) {
      _errorMessage = e.message;
    } else {
      _errorMessage = e.toString();
    }
    _setLoading(false);
  }

  // Sign In Action
  Future<bool> signIn(String email, String password) async {
    _setLoading(true);
    clearError();
    
    // Simulate auth if Firebase has no native configs
    if (!isFirebaseConfigured) {
      await Future.delayed(const Duration(seconds: 2)); // Simulate network lag
      if (email.contains("error")) {
        _errorMessage = "Invalid email or password combination. Please verify your credentials.";
        _setLoading(false);
        return false;
      }
      _simulatedUser = SimulatedUser(
        uid: "sim-12345",
        displayName: "Sagar S",
        email: email,
        phoneNumber: "+1 (555) 0199",
      );
      _setLoading(false);
      return true;
    }

    try {
      final credential = await _authService.signIn(email, password);
      _setLoading(false);
      return credential != null;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  // Sign Up Action
  Future<bool> signUp({
    required String email,
    required String password,
    required String name,
    required String phone,
  }) async {
    _setLoading(true);
    clearError();

    // Simulate registration
    if (!isFirebaseConfigured) {
      await Future.delayed(const Duration(seconds: 2));
      if (email.contains("exists")) {
        _errorMessage = "A citizen account already exists under this email address.";
        _setLoading(false);
        return false;
      }
      _simulatedUser = SimulatedUser(
        uid: "sim-12345",
        displayName: name,
        email: email,
        phoneNumber: phone,
      );
      _setLoading(false);
      return true;
    }

    try {
      final credential = await _authService.signUp(email, password, name);
      _setLoading(false);
      return credential != null;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  // Google Sign In Action
  Future<bool> signInWithGoogle() async {
    _setLoading(true);
    clearError();

    // Simulate Google SSO
    if (!isFirebaseConfigured) {
      await Future.delayed(const Duration(milliseconds: 1500));
      _simulatedUser = SimulatedUser(
        uid: "sim-google-999",
        displayName: "Sagar S (Google)",
        email: "sagar.s@gmail.com",
        phoneNumber: null,
      );
      _setLoading(false);
      return true;
    }

    try {
      final credential = await _authService.signInWithGoogle();
      _setLoading(false);
      return credential != null;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  // Forgot Password Request
  Future<bool> sendPasswordReset(String email) async {
    _setLoading(true);
    clearError();

    // Simulate password reset
    if (!isFirebaseConfigured) {
      await Future.delayed(const Duration(milliseconds: 1500));
      if (email.contains("invalid")) {
        _errorMessage = "The email address is formatted incorrectly. Please check and try again.";
        _setLoading(false);
        return false;
      }
      _setLoading(false);
      return true;
    }

    try {
      await _authService.sendPasswordReset(email);
      _setLoading(false);
      return true;
    } catch (e) {
      _handleError(e);
      return false;
    }
  }

  // Sign Out Action
  Future<void> signOut() async {
    _setLoading(true);
    
    if (!isFirebaseConfigured) {
      await Future.delayed(const Duration(milliseconds: 500));
      _simulatedUser = null;
      _setLoading(false);
      notifyListeners();
      return;
    }

    try {
      await _authService.signOut();
      _firebaseUser = null;
      _setLoading(false);
      notifyListeners();
    } catch (e) {
      _handleError(e);
    }
  }
}
