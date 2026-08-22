import json
import uuid


def serialize_data(payload: dict) -> dict | None:
    head_commit = payload.get("head_commit")
    repository = payload.get("repository")
    if not head_commit or not repository:
        return None

    commit_description = head_commit.get("message")
    commit_timestamp = head_commit.get("timestamp")
    author_name = head_commit.get("author", {}).get("name")
    repository_name = repository.get("name")
    owner = repository.get("owner", {})
    avatar_url = owner.get("avatar_url")
    profile_url = owner.get("url")

    if any(
        value is None
        for value in [
            commit_description,
            commit_timestamp,
            author_name,
            repository_name,
        ]
    ):
        return None

    return {
        "author_name": author_name,
        "commit_timestamp": commit_timestamp,
        "commit_description": commit_description,
        "repository_name": repository_name,
        "avatar_url": avatar_url,
        "profile_url": profile_url,
        "id": str(uuid.uuid4()),
    }