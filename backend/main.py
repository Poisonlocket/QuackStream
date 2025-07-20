from fastapi import FastAPI, Request, Response

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Quack Successful"}

@app.get("/418")
async def teapot():
    return {"message": "Congrats, you found the teapot"}

@app.post("/webhook")
async def websocket(request: Request):
    payload = await request.json()
    commit_description = payload["head_commit"]["message"]
    author_name = payload["head_commit"]["author"]["name"]
    author_email = payload["head_commit"]["author"]["email"]
    repository_name = payload["repository"]["name"]

    print("Commit description:", commit_description)
    print("Author:", author_name)
    print("Author email:", author_email)
    print("Repository name:", repository_name)

