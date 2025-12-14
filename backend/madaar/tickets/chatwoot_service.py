import requests
from django.conf import settings

class ChatwootService:
    def __init__(self):
        self.base_url = "https://app.chatwoot.com"
        self.account_id = settings.CHATWOOT_ACCOUNT_ID
        self.api_token = settings.CHATWOOT_API_TOKEN
        self.inbox_id = settings.CHATWOOT_INBOX_ID
        
    def _get_headers(self):
        return {
            'Content-Type': 'application/json',
            'api_access_token': self.api_token
        }
    
    def create_contact(self, email, name=None):
        """Create a contact in Chatwoot"""
        url = f"{self.base_url}/api/v1/accounts/{self.account_id}/contacts"
        
        payload = {
            "inbox_id": self.inbox_id,
            "email": email,
            "name": name or email.split('@')[0]
        }
        
        try:
            response = requests.post(url, json=payload, headers=self._get_headers())
            if response.status_code in [200, 201]:
                return response.json()
            return None
        except Exception as e:
            print(f"Error creating contact: {e}")
            return None
    
    def create_conversation(self, contact_id, message):
        """Create a conversation in Chatwoot"""
        url = f"{self.base_url}/api/v1/accounts/{self.account_id}/conversations"
        
        payload = {
            "inbox_id": self.inbox_id,
            "contact_id": contact_id,
            "status": "open"
        }
        
        try:
            response = requests.post(url, json=payload, headers=self._get_headers())
            if response.status_code in [200, 201]:
                conversation = response.json()
                # Send first message
                self.send_message(conversation['id'], message)
                return conversation
            return None
        except Exception as e:
            print(f"Error creating conversation: {e}")
            return None
    
    def send_message(self, conversation_id, message):
        """Send a message in a conversation"""
        url = f"{self.base_url}/api/v1/accounts/{self.account_id}/conversations/{conversation_id}/messages"
        
        payload = {
            "content": message,
            "message_type": "outgoing"
        }
        
        try:
            response = requests.post(url, json=payload, headers=self._get_headers())
            return response.status_code in [200, 201]
        except Exception as e:
            print(f"Error sending message: {e}")
            return False
    
    def notify_ticket_created(self, ticket):
        """Notify Chatwoot when a ticket is created"""
        # Find or create contact
        contact = self.create_contact(
            email=ticket.created_by.email,
            name=ticket.created_by.username
        )
        
        if contact:
            message = f"""
🎫 New Ticket Created

Ticket ID: #{ticket.id}
Title: {ticket.title}
Category: {ticket.category}
Priority: {ticket.priority}
Status: {ticket.status}

Description:
{ticket.description}
            """
            
            conversation = self.create_conversation(
                contact_id=contact['payload']['contact']['id'],
                message=message
            )
            return conversation
        return None
