from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

Partner = get_user_model()


class AuthenticationCompatibilityTests(APITestCase):
    def setUp(self):
        self.user = Partner.objects.create_user(
            username='fixture-user', email='fixture@example.invalid',
            password='Fixture-password-only!', first_name='Test',
        )

    def test_login_by_email_and_username_preserves_response_and_session(self):
        for identifier in [self.user.email, self.user.username]:
            with self.subTest(identifier=identifier):
                self.client.logout()
                response = self.client.post('/partner/login/', {
                    'email_or_username': identifier, 'password': 'Fixture-password-only!',
                })
                self.assertEqual(response.status_code, 200, response.data)
                self.assertEqual(response.data['id'], self.user.pk)
                self.assertEqual(set(response.data['tokens']), {'access', 'refresh'})
                self.assertEqual(str(AccessToken(response.data['tokens']['access'])['user_id']), str(self.user.pk))
                self.assertEqual(str(self.client.session['_auth_user_id']), str(self.user.pk))

    def test_bad_password_and_inactive_accounts_cannot_login(self):
        for active, password in [(True, 'Wrong-password!'), (False, 'Fixture-password-only!')]:
            with self.subTest(active=active):
                self.user.is_active = active
                self.user.save()
                response = self.client.post('/partner/login/', {
                    'email_or_username': self.user.email, 'password': password,
                })
                self.assertIn(response.status_code, [401, 403])
                self.assertNotIn('tokens', response.data)

    def test_register_hashes_password_and_does_not_return_it(self):
        response = self.client.post('/partner/register/', {
            'username': 'new-fixture', 'email': 'new@example.invalid', 'first_name': 'New',
            'password': 'Fixture-password-only!', 'password2': 'Fixture-password-only!',
        })
        self.assertEqual(response.status_code, 201, response.data)
        self.assertNotIn('password', response.data['data'])
        self.assertTrue(check_password('Fixture-password-only!', Partner.objects.get(username='new-fixture').password))

    def test_jwt_access_refresh_verify_and_tamper_rejection(self):
        refresh = RefreshToken.for_user(self.user)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(self.client.get('/camera/list/').status_code, 200)
        self.assertEqual(self.client.post('/api/token/refresh/', {'refresh': str(refresh)}).status_code, 200)
        self.assertEqual(self.client.post('/partner/TokenVerify', {'token': token}).status_code, 200)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token[:-12]}invalidtoken')
        self.assertIn(self.client.get('/camera/list/').status_code, [401, 403])

    def test_legacy_token_endpoint_works_without_a_session(self):
        response = self.client.post('/partner/Token', {'username': self.user.username, 'password': 'Fixture-password-only!'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(str(AccessToken(response.data['access_token'])['user_id']), str(self.user.pk))

    def test_private_endpoints_require_authentication(self):
        for url in ['/camera/list/', '/camera/model/', '/partner/UserList', f'/partner/update/{self.user.pk}/']:
            with self.subTest(url=url):
                self.assertIn(self.client.get(url).status_code, [401, 403])

    def test_profile_is_owned_and_user_listing_is_staff_only(self):
        other = Partner.objects.create_user(username='other', email='other@example.invalid', password='Other-password!')
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.patch(f'/partner/update/{self.user.pk}/', {'first_name': 'Updated'}).status_code, 200)
        for method in [self.client.get, self.client.patch, self.client.delete]:
            self.assertEqual(method(f'/partner/update/{other.pk}/').status_code, 403)
        self.assertEqual(self.client.get('/partner/UserList').status_code, 403)
        self.user.is_staff = True
        self.user.save()
        response = self.client.get('/partner/UserList')
        self.assertEqual(response.status_code, 200)
        for user in response.data:
            self.assertNotIn('password', user)

    def test_swagger_works_after_framework_upgrade(self):
        self.assertEqual(self.client.get('/swagger/').status_code, 200)
