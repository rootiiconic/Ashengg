import os
import google.generativeai as genai
from dotenv import load_dotenv
from typing import Optional

# Load environment variables
load_dotenv()

# Get API key with error checking
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

# Configure Gemini API
genai.configure(api_key=api_key)

# Initialize Gemini chat model
model = genai.GenerativeModel("gemini-2.0-flash")
chat = model.start_chat(history=[])

# Function to handle AI chat response
async def run_agent_flow(user_input: str) -> str:
    try:
        # Input validation
        if not user_input or not user_input.strip():
            return "Please provide a valid input."

        # Send message and get response
        response = chat.send_message(user_input)
        
        if not response or not response.text:
            return "I apologize, but I couldn't generate a response. Please try again."
            
        return response.text

    except Exception as e:
        error_msg = str(e)
        if "API key" in error_msg.lower():
            return "Error: Invalid or missing API key. Please check your configuration."
        elif "rate limit" in error_msg.lower():
            return "Error: Rate limit exceeded. Please try again in a moment."
        else:
            return f"An unexpected error occurred: {error_msg}"

# Function to reset chat history
async def reset_chat() -> None:
    global chat
    chat = model.start_chat(history=[])
