import 'dart:async';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthException implements Exception {
  final String message;
  final String code;

  AuthException(this.message, this.code);

  @override
  String toString() => message;
}

class AuthService {
  FirebaseAuth? get _auth {
    try {
      if (Firebase.apps.isNotEmpty) {
        return FirebaseAuth.instance;
      }
    } catch (_) {}
    return null;
  }

  final GoogleSignIn _googleSignIn = GoogleSignIn();

  // Helper check to see if Firebase is working/connected
  bool get isFirebaseAvailable => _auth != null;

  // Auth state stream
  Stream<User?> get authStateChanges => _auth?.authStateChanges() ?? const Stream.empty();

  // Get current user
  User? get currentUser => _auth?.currentUser;

  // Sign In with Email & Password
  Future<UserCredential?> signIn(String email, String password) async {
    final auth = _auth;
    if (auth == null) {
      throw AuthException("Firebase authentication services are unavailable.", "offline");
    }
    try {
      return await auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw AuthException("An unexpected authentication error occurred.", "unknown");
    }
  }

  // Sign Up with Email & Password
  Future<UserCredential?> signUp(String email, String password, String name) async {
    final auth = _auth;
    if (auth == null) {
      throw AuthException("Firebase registration services are unavailable.", "offline");
    }
    try {
      final credential = await auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      // Update display name
      if (credential.user != null) {
        await credential.user!.updateDisplayName(name);
      }
      return credential;
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw AuthException("An unexpected registration error occurred.", "unknown");
    }
  }

  // Sign In with Google
  Future<UserCredential?> signInWithGoogle() async {
    final auth = _auth;
    if (auth == null) {
      throw AuthException("Google Sign-In is unavailable in offline simulation mode.", "offline");
    }
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        throw AuthException("Google Sign-In was cancelled by user.", "cancelled");
      }

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      return await auth.signInWithCredential(credential);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw AuthException("Failed to authenticate with Google: ${e.toString()}", "google-error");
    }
  }

  // Send Password Reset Email
  Future<void> sendPasswordReset(String email) async {
    final auth = _auth;
    if (auth == null) {
      throw AuthException("Password recovery services are unavailable.", "offline");
    }
    try {
      await auth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw AuthException("Failed to submit password reset request.", "unknown");
    }
  }

  // Sign Out
  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
      await _auth?.signOut();
    } catch (e) {
      throw AuthException("Failed to securely log out.", "signout-error");
    }
  }

  // Exception Mapper to return premium, developer/user-friendly messages
  AuthException _handleAuthException(FirebaseAuthException e) {
    String msg;
    switch (e.code) {
      case 'invalid-email':
        msg = "The email address is formatted incorrectly. Please check and try again.";
        break;
      case 'user-disabled':
        msg = "This CivicLens citizen account has been disabled by administrators.";
        break;
      case 'user-not-found':
      case 'invalid-credential':
        msg = "Invalid email or password combination. Please verify your credentials.";
        break;
      case 'wrong-password':
        msg = "Incorrect password. If you forgot your password, tap Reset Password.";
        break;
      case 'email-already-in-use':
        msg = "A citizen account already exists under this email address.";
        break;
      case 'weak-password':
        msg = "Your password is too weak. Please use at least 6 characters including numbers/symbols.";
        break;
      case 'operation-not-allowed':
        msg = "This sign-in method is currently disabled in backend administration.";
        break;
      case 'network-request-failed':
        msg = "CivicLens server unreachable. Please check your internet connection.";
        break;
      default:
        msg = e.message ?? "An authentication error occurred. Code: ${e.code}";
    }
    return AuthException(msg, e.code);
  }
}
