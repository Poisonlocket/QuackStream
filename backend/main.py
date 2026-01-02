import random
import uuid

from fastapi import FastAPI, Request, WebSocket
from util.ws_connection_manager import ConnectionManager
from util.util import serialize_data

app = FastAPI()
cm = ConnectionManager()


@app.get("/")
async def root():
    return {"message": "Quack Successful"}

@app.get("/418")
async def teapot():
    return {"message": "Congrats, you found the teapot"}
@app.post("/webhook")
async def webhook(request: Request):
    payload = await request.json()
    prepared_json_data = serialize_data(payload)
    print("Received webhook payload:", prepared_json_data)

    # Forward to WebSocket client if connected
    if len(cm.active_connections) > 0:
        try:
            await cm.broadcast_commit(prepared_json_data)
            print("Forwarded webhook to WebSocket client")
        except Exception as e:
            print("Something went wrong", e)


    return {"status": "ok"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    ws_client_endpoint = websocket
    await cm.connect(ws_client_endpoint)
    print("WebSocket client connected")

    try:
        while True:
            # Keep connection alive, optionally handle incoming messages
            current_ws_index = cm.active_connections.index(ws_client_endpoint)
            data = await cm.active_connections[current_ws_index].receive_text()
            print("Received from client:", data)
            await websocket.send_text("Pong")
    except Exception as e:
        print("WebSocket connection closed:", e)
    finally:
        current_ws_index = cm.active_connections.index(ws_client_endpoint)
        current_ws = cm.active_connections[current_ws_index]
        await cm.disconnect(current_ws)
        print("WebSocket client disconnected")
