import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()


class SupabaseClientFactory:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    def create(self):
        return create_client(self.url, self.key)


class SupabaseEntityService:
    def __init__(self, table_name, order_field, searchable_fields=None):
        self.table_name = table_name
        self.order_field = order_field
        self.searchable_fields = searchable_fields or []
        self.client = SupabaseClientFactory().create()

    def list_records(self, search=None, descending=False, filters=None):
        query = self.client.table(self.table_name).select("*").order(self.order_field, desc=descending)
        for field, value in (filters or {}).items():
            query = query.eq(field, value)

        response = query.execute()
        records = response.data or []

        if search and self.searchable_fields:
            needle = str(search).strip().lower()
            records = [
                record for record in records
                if any(needle in str(record.get(field, "")).lower() for field in self.searchable_fields)
            ]

        return records

    def get_record(self, record_id):
        response = self.client.table(self.table_name).select("*").eq("id", record_id).single().execute()
        return response.data

    def create_record(self, payload):
        response = self.client.table(self.table_name).insert(payload).execute()
        return response.data

    def update_record(self, record_id, payload):
        response = self.client.table(self.table_name).update(payload).eq("id", record_id).execute()
        return response.data

    def delete_record(self, record_id):
        self.client.table(self.table_name).delete().eq("id", record_id).execute()
        return True
