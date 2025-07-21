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
    except Exception as e:
        print("WebSocket connection closed:", e)
    finally:
        ws_client = None
        print("WebSocket client disconnected")

@app.get("/test_websocket")
async def test_websocket():
    global ws_client
    prepared_json_data = {"author_name": "Poisonlocket", "commit_description": "Quack", "repository_name": "Quackstream", "avatar_url": "https://avatars.githubusercontent.com/u/128643203?v=4"}
    if ws_client:
        try:
            await ws_client.send_json(prepared_json_data)
            print("Forwarded webhook to WebSocket client")
        except Exception as e:
            print("Error sending to WebSocket client:", e)
            ws_client = None