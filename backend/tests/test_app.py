import sys
import unittest
from pathlib import Path
from unittest.mock import patch


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import app  # noqa: E402


class AppSmokeTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload["ok"])
        self.assertIn("time", payload)

    def test_auth_me_requires_token(self):
        response = self.client.post("/auth/me")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json()["error"], "missing_token")

    def test_auth_redirect_requires_token(self):
        response = self.client.post("/auth/redirect")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json()["error"], "missing_token")

    def test_clientes_requires_token(self):
        response = self.client.get("/api/clientes/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json()["error"], "missing_token")

    def test_contact_requires_valid_payload(self):
        response = self.client.post("/api/contacto/", json={"nombre": "", "email": "bad", "mensaje": "hi"})
        self.assertEqual(response.status_code, 400)
        payload = response.get_json()
        self.assertFalse(payload["success"])
        self.assertIn("errors", payload)

    @patch("routes.contact.email_service.send_contact_message")
    def test_contact_sends_message(self, mocked_send_contact_message):
        mocked_send_contact_message.return_value = True
        response = self.client.post(
            "/api/contacto/",
            json={
                "nombre": "Ana Perez",
                "email": "ana@example.com",
                "asunto": "Consulta",
                "mensaje": "Necesito informacion sobre una cita disponible.",
            },
        )
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload["success"])
        mocked_send_contact_message.assert_called_once()


if __name__ == "__main__":
    unittest.main()
