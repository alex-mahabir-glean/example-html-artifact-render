# Sample chat response

`POST /rest/api/v1/chat` returns the artifact id on the message whose `messageType` is `ARTIFACT_HTML`.

```json
"artifactInfo": {
  "id": "bbaae4347e5844059081b55c36202f2e",
  "version": 1
}
```

The Chat request in `glean-html-artifact.postman_collection.json` copies that `artifactInfo.id` into `{{artifactId}}` when the request finishes. Get artifact then calls `GET /api/v1/artifacts/{{artifactId}}`.

Chat id: `24e5fe6819354ffab1ec7b31cbcd75b6`.

```json
{
    "messages": [
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "text": "**Preparing HTML expert handoff**"
                }
            ],
            "ts": "2026-10-21 21:05:28.390710577 +0000 UTC",
            "messageId": "b1845d2aa5fb519d8db01c17442dd438",
            "messageType": "UPDATE",
            "stepId": "rs_0f9cac9dc7e2eb98016ad92917e38487d1925b9b94f09f79ef_None_None",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "messageType": "METADATA",
            "messageId": "e645441664e64675bb834d6ae9d44727",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "artifactInfo": {
                "id": "bbaae4347e5844059081b55c36202f2e",
                "version": 1
            },
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "artifact": {
                        "name": "sample_pipeline_volume.html",
                        "filePathHint": "sample_pipeline_volume.html"
                    }
                },
                {
                    "artifact": {
                        "resolvedContent": "Full HTML document titled Sample pipeline volume. Bars: Discovery 12, Clinical 7, Filing 3. Total 22."
                    }
                }
            ],
            "messageId": "61f4a1dbded842f9a92db31b01a0ab88",
            "messageType": "ARTIFACT_HTML",
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "text": "I built the interactive bar chart **\"Sample pipeline volume\"** as an HTML artifact, using only inline CSS and SVG with no JavaScript."
                }
            ],
            "messageId": "637d9b2137ef5020aef27b7c181bcaaa",
            "messageType": "CONTENT",
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        }
    ],
    "chatId": "24e5fe6819354ffab1ec7b31cbcd75b6",
    "chat": {
        "name": "Sample pipeline volume"
    }
}
```
