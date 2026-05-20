import 'package:flutter_test/flutter_test.dart';
import 'package:civiclens/features/auth/state/auth_provider.dart';

void main() {
  group('AuthProvider Offline Simulation Tests', () {
    test('Successful authentication with demo credential parameters', () async {
      final authProvider = AuthProvider();

      // Ensure start state is unauthenticated
      expect(authProvider.isAuthenticated, isFalse);
      expect(authProvider.isLoading, isFalse);

      // Trigger sign in
      final success = await authProvider.signIn("sagar.s@gmail.com", "password123");

      // Verify simulated citizen parameters
      expect(success, isTrue);
      expect(authProvider.isAuthenticated, isTrue);
      expect(authProvider.citizenName, equals("Sagar S"));
      expect(authProvider.citizenEmail, equals("sagar.s@gmail.com"));
    });

    test('Failed authentication with error command', () async {
      final authProvider = AuthProvider();

      // Trigger sign in with error trigger
      final success = await authProvider.signIn("error@civiclens.gov", "password123");

      expect(success, isFalse);
      expect(authProvider.isAuthenticated, isFalse);
      expect(authProvider.errorMessage, isNotNull);
    });
  });
}
