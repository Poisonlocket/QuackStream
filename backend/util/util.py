import json

def serialize_data(payload: dict) -> dict:
    commit_description = payload["head_commit"]["message"]
    author_name = payload["head_commit"]["author"]["name"]
    repository_name = payload["repository"]["name"]

    return {"author_name": author_name, "commit_description": commit_description, "repository_name": repository_name}