import random
import uuid

from fastapi import FastAPI, Request, WebSocket
from util.util import serialize_data

app = FastAPI()

ws_client: WebSocket | None = None

@app.get("/")
async def root():
    return {"message": "Quack Successful"}

@app.get("/418")
async def teapot():
    return {"message": "Congrats, you found the teapot"}
@app.post("/webhook")
async def webhook(request: Request):
    global ws_client
    payload = await request.json()
    prepared_json_data = serialize_data(payload)
    print("Received webhook payload:", prepared_json_data)

    # Forward to WebSocket client if connected
    if ws_client:
        try:
            await ws_client.send_json(prepared_json_data)
            print("Forwarded webhook to WebSocket client")
        except Exception as e:
            print("Error sending to WebSocket client:", e)
            ws_client = None

    return {"status": "ok"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global ws_client
    await websocket.accept()
    ws_client = websocket
    print("WebSocket client connected")

    try:
        while True:
            # Keep connection alive, optionally handle incoming messages
            data = await websocket.receive_text()
            print("Received from client:", data)
            await websocket.send_text("Pong")
    except Exception as e:
        print("WebSocket connection closed:", e)
    finally:
        ws_client = None
        print("WebSocket client disconnected")

@app.get("/test_websocket")
async def test_websocket():
    global ws_client

    if ws_client:
        try:

            prepared_json_data = {"author_name": "Poisonlocket", "commit_description": "QuackIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
                                  "repository_name": "Quackstream",
                                  "avatar_url": "https://avatars.githubusercontent.com/u/128643203?v=4", "id": str(uuid.uuid4())}

            await ws_client.send_json(prepared_json_data)
            print("Forwarded webhook to WebSocket client")

        except Exception as e:
            print("Error sending to WebSocket client:", e)
            ws_client = None
