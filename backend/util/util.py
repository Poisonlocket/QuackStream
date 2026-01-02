import json
import uuid


def serialize_data(payload: dict) -> dict:
    commit_description = payload["head_commit"]["message"]
    author_name = payload["head_commit"]["author"]["name"]
    repository_name = payload["repository"]["name"]
    avatar_url = payload["repository"]["owner"]["avatar_url"]
    profile_url = payload["repository"]["owner"]["url"]

    return {"author_name": author_name, "commit_description": commit_description, "repository_name": repository_name, "avatar_url": avatar_url, "profile_url": profile_url, "id":str(uuid.uuid4())}