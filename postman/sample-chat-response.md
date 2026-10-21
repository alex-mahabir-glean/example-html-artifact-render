# Sample chat response

This is the Postman body from `POST /rest/api/v1/chat`. The full HTML page is `resolvedContent` on the message whose `messageType` is `ARTIFACT_HTML`. It starts at `<!DOCTYPE html>` and ends at `</html>`. The artifact id on that same message is `bbaae4347e5844059081b55c36202f2e`.

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
            "messageTrackingToken": "KpIBCiBiMTg0NWQyYWE1ZmI1MTlkOGRiMDFjMTc0NDJkZDQzOBIgMjRlNWZlNjgxOTM1NGZmYWIxZWM3YjMxY2JjZDc1YjYaGElOVEVSTkFMX0xPT1BJTkdfUFlBR0VOVCIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "UPDATE",
            "stepId": "rs_0f9cac9dc7e2eb98016ad92917e38487d1925b9b94f09f79ef_None_None",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "stepRunId": "498f57010ab643c49791d2d467cd48d3",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "turnUsage": {
                        "models": [
                            {
                                "model": {
                                    "modelId": "GPT5_6_LUNA",
                                    "displayName": "GPT-5.6 Luna",
                                    "creator": "CREATOR_OPENAI"
                                }
                            }
                        ]
                    }
                }
            ],
            "ts": "2026-10-21 21:05:28.56451937 +0000 UTC",
            "messageId": "e645441664e64675bb834d6ae9d44727",
            "messageTrackingToken": "KpIBCiBlNjQ1NDQxNjY0ZTY0Njc1YmI4MzRkNmFlOWQ0NDcyNxIgMjRlNWZlNjgxOTM1NGZmYWIxZWM3YjMxY2JjZDc1YjYaGElOVEVSTkFMX0xPT1BJTkdfUFlBR0VOVCIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "METADATA",
            "stepId": "INTERNAL_LOOPING_PYAGENT",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "stepRunId": "8ab58433dbb04aae894a17657cad4cd6",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "modelRoutingInfo": {
                        "modelId": "CLAUDE_5_5_OPUS",
                        "routingReason": "for creating a polished interactive artifact",
                        "displayName": "Claude Opus 5.5",
                        "creator": "CREATOR_ANTHROPIC"
                    }
                }
            ],
            "ts": "2026-10-21 21:05:28.574415586 +0000 UTC",
            "messageId": "83227f4674bf4365ac2ebb9eeea1ad1f",
            "messageTrackingToken": "KpIBCiA4MzIyN2Y0Njc0YmY0MzY1YWMyZWJiOWVlZWExYWQxZhIgMjRlNWZlNjgxOTM1NGZmYWIxZWM3YjMxY2JjZDc1YjYaGElOVEVSTkFMX0xPT1BJTkdfUFlBR0VOVCIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "UPDATE",
            "stepId": "INTERNAL_LOOPING_PYAGENT",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "stepRunId": "8ab58433dbb04aae894a17657cad4cd6",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "text": "I"
                },
                {
                    "text": " should"
                },
                {
                    "text": " check the"
                },
                {
                    "text": " art"
                },
                {
                    "text": "if"
                },
                {
                    "text": "act_"
                },
                {
                    "text": "html_sandbox sk"
                },
                {
                    "text": "ill first before pro"
                },
                {
                    "text": "ceeding.\n\n"
                }
            ],
            "ts": "2026-10-21 21:05:31.500626474 +0000 UTC",
            "messageId": "f8230bc6183e56b6b5e46b0f73ae9265",
            "messageTrackingToken": "KpIBCiBmODIzMGJjNjE4M2U1NmI2YjVlNDZiMGY3M2FlOTI2NRIgMjRlNWZlNjgxOTM1NGZmYWIxZWM3YjMxY2JjZDc1YjYaGElOVEVSTkFMX0xPT1BJTkdfUFlBR0VOVCIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "UPDATE",
            "stepId": "rs_msg_l6gy5bwu32m5b7vecewjcmvu44rodpgw4e3d4s5iebczta2q5fsa_None_None",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "stepRunId": "c3deb000c6b146f39b0a7994163e7787",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "turnUsage": {
                        "models": [
                            {
                                "model": {
                                    "modelId": "GPT5_6_LUNA",
                                    "displayName": "GPT-5.6 Luna",
                                    "creator": "CREATOR_OPENAI"
                                }
                            },
                            {
                                "model": {
                                    "modelId": "CLAUDE_5_5_OPUS",
                                    "displayName": "Claude Opus 5.5",
                                    "creator": "CREATOR_ANTHROPIC"
                                }
                            }
                        ]
                    }
                }
            ],
            "ts": "2026-10-21 21:05:31.85957061 +0000 UTC",
            "messageId": "e645441664e64675bb834d6ae9d44727",
            "messageTrackingToken": "KpIBCiBlNjQ1NDQxNjY0ZTY0Njc1YmI4MzRkNmFlOWQ0NDcyNxIgMjRlNWZlNjgxOTM1NGZmYWIxZWM3YjMxY2JjZDc1YjYaGElOVEVSTkFMX0xPT1BJTkdfUFlBR0VOVCIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "METADATA",
            "stepId": "INTERNAL_LOOPING_PYAGENT",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "stepRunId": "8ab58433dbb04aae894a17657cad4cd6",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "text": "**Reading a skill**"
                },
                {
                    "skillActionNotification": {
                        "skillName": "artifact_html_sandbox"
                    }
                }
            ],
            "ts": "2026-10-21 21:05:32.186184727 +0000 UTC",
            "messageId": "c6599801ee594820b1feb620bb621d16",
            "messageTrackingToken": "KpIBCiBjNjU5OTgwMWVlNTk0ODIwYjFmZWI2MjBiYjYyMWQxNhIgMjRlNWZlNjgxOTM1NGZmYWIxZWM3YjMxY2JjZDc1YjYaGElOVEVSTkFMX0xPT1BJTkdfUFlBR0VOVCIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "UPDATE",
            "stepId": "Shell",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "stepRunId": "d9a6506a545e4ea3ab6d311476e98f62",
            "isStepComplete": true,
            "stepStatusEvent": "COMPLETE",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "text": "I"
                },
                {
                    "text": "'m using"
                },
                {
                    "text": " static"
                },
                {
                    "text": " sample data since the request"
                },
                {
                    "text": " cal"
                },
                {
                    "text": "ls for in"
                },
                {
                    "text": "line C"
                },
                {
                    "text": "SS and SVG only,"
                },
                {
                    "text": " which r"
                },
                {
                    "text": "ules out external char"
                },
                {
                    "text": "ting libraries."
                },
                {
                    "text": " For interactivity, I'"
                },
                {
                    "text": "ll rely m"
                },
                {
                    "text": "ainly on CSS hover"
                },
                {
                    "text": " states, ma"
                },
                {
                    "text": "ybe with"
                },
                {
                    "text": " a"
                },
                {
                    "text": " tou"
                },
                {
                    "text": "ch of minimal in"
                },
                {
                    "text": "line JS for tooltips"
                },
                {
                    "text": " if"
                },
                {
                    "text": " str"
                },
                {
                    "text": "ictly need"
                },
                {
                    "text": "ed.\n\n"
                },
                {
                    "text": "Res"
                },
                {
                    "text": "olving the con"
                },
                {
                    "text": "flict,"
                },
                {
                    "text": " I dec"
                },
                {
                    "text": "ide to honor \""
                },
                {
                    "text": "only"
                },
                {
                    "text": " in"
                },
                {
                    "text": "line CSS and SVG"
                },
                {
                    "text": "\" strictly and skip J"
                },
                {
                    "text": "S entirely, using CS"
                },
                {
                    "text": "S-only hover/"
                },
                {
                    "text": "focus interactions on"
                },
                {
                    "text": " SVG elements with"
                },
                {
                    "text": " tabindex inst"
                },
                {
                    "text": "ead."
                },
                {
                    "text": " Export/"
                },
                {
                    "text": "PDF functionality that"
                },
                {
                    "text": " would"
                },
                {
                    "text": " need JS g"
                },
                {
                    "text": "ets d"
                },
                {
                    "text": "ropped,"
                },
                {
                    "text": " though browser print still"
                },
                {
                    "text": " works as a fallback.\n\n"
                },
                {
                    "text": "Now"
                },
                {
                    "text": " I'm"
                },
                {
                    "text": " chec"
                },
                {
                    "text": "king light"
                },
                {
                    "text": ".md"
                },
                {
                    "text": " for the style t"
                },
                {
                    "text": "okens to"
                },
                {
                    "text": " keep the vis"
                },
                {
                    "text": "ual design consistent."
                },
                {
                    "text": "\n\n"
                }
            ],
            "ts": "2026-10-21 21:05:36.307631688 +0000 UTC",
            "messageId": "b59d51aeba6b54a08cf14d78fb23d1ae",
            "messageTrackingToken": "KpIBCiBiNTlkNTFhZWJhNmI1NGEwOGNmMTRkNzhmYjIzZDFhZRIgMjRlNWZlNjgxOTM1NGZmYWIxZWM3YjMxY2JjZDc1YjYaGElOVEVSTkFMX0xPT1BJTkdfUFlBR0VOVCIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "UPDATE",
            "stepId": "rs_msg_nfo4anglwt43c4gn7arevjkauc4ijr5droguqigdi56v6j7mgqda_None_None",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "stepRunId": "717233f14a264172b3a469077bb1523d",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "text": "**Reading a skill**"
                },
                {
                    "skillActionNotification": {
                        "skillName": "artifact_html_sandbox"
                    }
                }
            ],
            "ts": "2026-10-21 21:05:41.105157524 +0000 UTC",
            "messageId": "fe6fa5b03bc84fadb773dad87f5058f7",
            "messageTrackingToken": "KpIBCiBmZTZmYTViMDNiYzg0ZmFkYjc3M2RhZDg3ZjUwNThmNxIgMjRlNWZlNjgxOTM1NGZmYWIxZWM3YjMxY2JjZDc1YjYaGElOVEVSTkFMX0xPT1BJTkdfUFlBR0VOVCIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "UPDATE",
            "stepId": "Shell",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "stepRunId": "d797ab90e0534a5bbf4280b4844090eb",
            "isStepComplete": true,
            "stepStatusEvent": "COMPLETE",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "text": "I"
                },
                {
                    "text": "'m plan"
                },
                {
                    "text": "ning an"
                },
                {
                    "text": " SVG b"
                },
                {
                    "text": "ar chart with C"
                },
                {
                    "text": "SS-only hover interact"
                },
                {
                    "text": "iv"
                },
                {
                    "text": "ity—"
                },
                {
                    "text": "t"
                },
                {
                    "text": "ooltips on hover, d"
                },
                {
                    "text": "imming other"
                },
                {
                    "text": " bars—"
                },
                {
                    "text": "and la"
                },
                {
                    "text": "ying out the vi"
                },
                {
                    "text": "ewBox d"
                },
                {
                    "text": "imensions and ax"
                },
                {
                    "text": "is scale with"
                },
                {
                    "text": " ticks at"
                },
                {
                    "text": " 0, 5, 10"
                },
                {
                    "text": ", "
                },
                {
                    "text": "15.\n\n"
                },
                {
                    "text": "I"
                },
                {
                    "text": "'m"
                },
                {
                    "text": " calculating b"
                },
                {
                    "text": "ar heights and"
                },
                {
                    "text": " positions from the values "
                },
                {
                    "text": "12, 7"
                },
                {
                    "text": ", 3, and ad"
                },
                {
                    "text": "ding a h"
                },
                {
                    "text": "over-triggered t"
                },
                {
                    "text": "ooltip group"
                },
                {
                    "text": " plus d"
                },
                {
                    "text": "imming eff"
                },
                {
                    "text": "ects and a growth"
                },
                {
                    "text": " animation using CSS transfor"
                },
                {
                    "text": "ms an"
                },
                {
                    "text": "chored at"
                },
                {
                    "text": " the bottom. I'll"
                },
                {
                    "text": " also add a minimal tot"
                },
                {
                    "text": "als summ"
                },
                {
                    "text": "ary and note"
                },
                {
                    "text": " the l"
                },
                {
                    "text": "ack of a J"
                },
                {
                    "text": "S-"
                },
                {
                    "text": "based export option"
                },
                {
                    "text": ".\n\n"
                }
            ],
            "ts": "2026-10-21 21:05:45.291128786 +0000 UTC",
            "messageId": "cad30991934a54a8bbe9295c2f9f94fa",
            "messageTrackingToken": "KpIBCiBjYWQzMDk5MTkzNGE1NGE4YmJlOTI5NWMyZjlmOTRmYRIgMjRlNWZlNjgxOTM1NGZmYWIxZWM3YjMxY2JjZDc1YjYaGElOVEVSTkFMX0xPT1BJTkdfUFlBR0VOVCIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "UPDATE",
            "stepId": "rs_msg_s6bki7lts45jkafev76sgvtg77h37dg2644bzgw6arqowslijbdq_None_None",
            "workflowId": "INTERNAL_LOOPING_PYAGENT",
            "stepRunId": "6f1c872339d540e58fead251449c24ba",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "artifactInfo": {
                "id": "bbaae4347e5844059081b55c36202f2e",
                "version": 1,
                "trackingToken": "IjMSBEhUTUwaCUFSVElGQUNUUyIgYmJhYWU0MzQ3ZTU4NDQwNTkwODFiNTVjMzYyMDJmMmU="
            },
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "artifact": {
                        "name": "sample_pipeline_volume.html",
                        "filePathHint": "sample_pipeline_volume.html",
                        "data": null
                    }
                },
                {
                    "artifact": {
                        "resolvedContent": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<meta name=\"glean-artifact-type\" content=\"visual_content\">\n<title>Sample pipeline volume</title>\n<style>\n:root {\n  --artifact-background: #ffffff;\n  --artifact-background-light: #f1f3f6;\n  --artifact-background-mid: #e9ecf1;\n  --artifact-border-light: #e3e6ec;\n  --artifact-border-dark: #cdd2db;\n  --artifact-primary-brand: #3559e6;\n  --artifact-primary-highlight: #0d0f14;\n  --artifact-primary-hover: #2442b8;\n  --artifact-selected: #eaeefc;\n  --artifact-text-primary: #11141a;\n  --artifact-text-secondary: #5c6470;\n  --artifact-text-highlight: #e8eefc;\n  --artifact-bar-muted: #b9c6f5;\n  --artifact-tooltip-bg: #11141a;\n  --artifact-tooltip-text: #ffffff;\n}\nhtml[data-theme='dark'] {\n  --artifact-background: #0a0b0e;\n  --artifact-background-light: #121419;\n  --artifact-background-mid: #181b22;\n  --artifact-border-light: #23262e;\n  --artifact-border-dark: #343844;\n  --artifact-primary-brand: #6a92ff;\n  --artifact-primary-highlight: #f5f7fb;\n  --artifact-primary-hover: #88a8ff;\n  --artifact-selected: #1a2030;\n  --artifact-text-primary: #eef0f4;\n  --artifact-text-secondary: #9aa0ad;\n  --artifact-text-highlight: #14213d;\n  --artifact-bar-muted: #34477f;\n  --artifact-tooltip-bg: #eef0f4;\n  --artifact-tooltip-text: #0a0b0e;\n}\n* { box-sizing: border-box; }\nbody {\n  margin: 0;\n  padding: 48px 24px;\n  background-color: var(--artifact-background);\n  color: var(--artifact-text-primary);\n  font-family: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif;\n  font-size: 16px;\n  line-height: 1.6;\n  letter-spacing: -0.005em;\n}\nmain { max-width: 880px; margin: 0 auto; }\n.eyebrow {\n  font-family: \"SF Mono\", \"IBM Plex Mono\", \"Cascadia Code\", Consolas, monospace;\n  font-size: 12px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;\n  color: var(--artifact-text-secondary); margin: 0 0 12px;\n}\nh1 {\n  font-size: clamp(2rem, 5vw, 3.25rem); font-weight: 300; line-height: 1.05;\n  letter-spacing: -0.02em; margin: 0 0 8px; color: var(--artifact-text-primary);\n}\n.sub { color: var(--artifact-text-secondary); margin: 0 0 32px; font-size: 15px; }\n.chart-card {\n  border: 1px solid var(--artifact-border-light);\n  border-radius: 8px;\n  padding: 24px 20px 12px;\n  background: var(--artifact-background);\n}\n.chart-head { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; flex-wrap: wrap; margin: 0 4px 8px; }\n.total { font-size: 14px; color: var(--artifact-text-secondary); }\n.total strong { font-weight: 500; color: var(--artifact-text-primary); font-variant-numeric: tabular-nums; }\nsvg { width: 100%; height: auto; display: block; overflow: visible; }\n.grid line { stroke: var(--artifact-border-light); stroke-width: 1; }\n.grid line.base { stroke: var(--artifact-border-dark); }\n.tick { fill: var(--artifact-text-secondary); font-size: 12px; font-family: \"SF Mono\", \"IBM Plex Mono\", Consolas, monospace; font-variant-numeric: tabular-nums; }\n.cat { fill: var(--artifact-text-primary); font-size: 14px; font-weight: 500; }\n.bar-group { cursor: pointer; outline: none; transition: opacity .2s ease; }\n.bar {\n  fill: var(--artifact-primary-brand);\n  transform-box: fill-box; transform-origin: 50% 100%;\n  animation: grow .7s cubic-bezier(.2,.8,.2,1) both;\n  transition: fill .2s ease;\n}\n.bar-group:nth-of-type(2) .bar { animation-delay: .1s; }\n.bar-group:nth-of-type(3) .bar { animation-delay: .2s; }\n.hit { fill: transparent; }\n.val { fill: var(--artifact-text-primary); font-size: 15px; font-weight: 500; font-variant-numeric: tabular-nums; text-anchor: middle; transition: opacity .2s ease; }\n@keyframes grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }\n.plot:hover .bar-group:not(:hover),\n.plot:focus-within .bar-group:not(:focus) { opacity: .35; }\n.bar-group:hover .bar, .bar-group:focus .bar { fill: var(--artifact-primary-hover); }\n.bar-group:focus .bar { stroke: var(--artifact-text-primary); stroke-width: 2; }\n.tip { opacity: 0; pointer-events: none; transition: opacity .15s ease, transform .15s ease; transform: translateY(4px); }\n.bar-group:hover .tip, .bar-group:focus .tip { opacity: 1; transform: translateY(0); }\n.bar-group:hover .val, .bar-group:focus .val { opacity: 0; }\n.tip rect { fill: var(--artifact-tooltip-bg); }\n.tip text { fill: var(--artifact-tooltip-text); font-size: 13px; text-anchor: middle; }\n.tip .tip-num { font-weight: 600; font-size: 15px; }\n.hint { margin: 12px 4px 0; font-size: 13px; color: var(--artifact-text-secondary); }\n@media screen and (max-width: 560px) {\n  body { padding: 32px 14px; }\n  .chart-card { padding: 16px 8px 8px; }\n}\n@media (prefers-reduced-motion: reduce) {\n  .bar { animation: none; }\n}\n@media print {\n  @page { size: auto !important; }\n  body { margin: 0; padding: 0.4in 0.6in; background: #fff; color: #11141a; print-color-adjust: exact; -webkit-print-color-adjust: exact; }\n  main { max-width: 100% !important; width: 100% !important; }\n  .chart-card { break-inside: avoid; border: 1px solid rgba(0,0,0,0.08); }\n  .bar { fill: #3559e6 !important; }\n  .val, .cat { fill: #11141a !important; }\n  .tick { fill: #5c6470 !important; }\n  .tip, .hint { display: none !important; }\n  *, *::before, *::after { animation: none !important; transition: none !important; }\n  @page { size: auto !important; }\n}\n</style>\n</head>\n<body>\n<main>\n  <header data-glean-id=\"chart-header\">\n    <p class=\"eyebrow\">Sample data · Pipeline</p>\n    <h1 data-glean-id=\"chart-title\">Sample pipeline volume</h1>\n    <p class=\"sub\">Number of items currently in each pipeline stage.</p>\n  </header>\n  <section class=\"chart-card\" data-glean-id=\"chart-pipeline-volume\">\n    <div class=\"chart-head\">\n      <span class=\"eyebrow\" style=\"margin:0\">Items by stage</span>\n      <span class=\"total\" data-glean-id=\"kpi-total-items\">Total <strong>22</strong> items</span>\n    </div>\n    <svg viewBox=\"0 0 720 400\" role=\"img\" aria-labelledby=\"svgTitle svgDesc\">\n      <title id=\"svgTitle\">Sample pipeline volume</title>\n      <desc id=\"svgDesc\">Bar chart: Discovery 12, Clinical 7, Filing 3.</desc>\n      <g class=\"grid\">\n        <line x1=\"60\" x2=\"700\" y1=\"40\"  y2=\"40\"/>\n        <line x1=\"60\" x2=\"700\" y1=\"140\" y2=\"140\"/>\n        <line x1=\"60\" x2=\"700\" y1=\"240\" y2=\"240\"/>\n        <line class=\"base\" x1=\"60\" x2=\"700\" y1=\"340\" y2=\"340\"/>\n      </g>\n      <g text-anchor=\"end\">\n        <text class=\"tick\" x=\"48\" y=\"44\">15</text>\n        <text class=\"tick\" x=\"48\" y=\"144\">10</text>\n        <text class=\"tick\" x=\"48\" y=\"244\">5</text>\n        <text class=\"tick\" x=\"48\" y=\"344\">0</text>\n      </g>\n      <g class=\"plot\">\n        <g class=\"bar-group\" data-glean-id=\"bar-discovery\" tabindex=\"0\" role=\"listitem\" aria-label=\"Discovery: 12 items, 55% of total\">\n          <rect class=\"hit\" x=\"94\" y=\"40\" width=\"146\" height=\"300\"/>\n          <rect class=\"bar\" x=\"107\" y=\"100\" width=\"120\" height=\"240\" rx=\"4\"/>\n          <text class=\"val\" x=\"167\" y=\"88\">12</text>\n          <g class=\"tip\">\n            <rect x=\"107\" y=\"44\" width=\"120\" height=\"48\" rx=\"6\"/>\n            <text class=\"tip-num\" x=\"167\" y=\"64\">12 items</text>\n            <text x=\"167\" y=\"83\">55% of total</text>\n          </g>\n          <text class=\"cat\" x=\"167\" y=\"370\" text-anchor=\"middle\">Discovery</text>\n        </g>\n        <g class=\"bar-group\" data-glean-id=\"bar-clinical\" tabindex=\"0\" role=\"listitem\" aria-label=\"Clinical: 7 items, 32% of total\">\n          <rect class=\"hit\" x=\"307\" y=\"40\" width=\"146\" height=\"300\"/>\n          <rect class=\"bar\" x=\"320\" y=\"200\" width=\"120\" height=\"140\" rx=\"4\"/>\n          <text class=\"val\" x=\"380\" y=\"188\">7</text>\n          <g class=\"tip\">\n            <rect x=\"320\" y=\"144\" width=\"120\" height=\"48\" rx=\"6\"/>\n            <text class=\"tip-num\" x=\"380\" y=\"164\">7 items</text>\n            <text x=\"380\" y=\"183\">32% of total</text>\n          </g>\n          <text class=\"cat\" x=\"380\" y=\"370\" text-anchor=\"middle\">Clinical</text>\n        </g>\n        <g class=\"bar-group\" data-glean-id=\"bar-filing\" tabindex=\"0\" role=\"listitem\" aria-label=\"Filing: 3 items, 14% of total\">\n          <rect class=\"hit\" x=\"520\" y=\"40\" width=\"146\" height=\"300\"/>\n          <rect class=\"bar\" x=\"533\" y=\"280\" width=\"120\" height=\"60\" rx=\"4\"/>\n          <text class=\"val\" x=\"593\" y=\"268\">3</text>\n          <g class=\"tip\">\n            <rect x=\"533\" y=\"224\" width=\"120\" height=\"48\" rx=\"6\"/>\n            <text class=\"tip-num\" x=\"593\" y=\"244\">3 items</text>\n            <text x=\"593\" y=\"263\">14% of total</text>\n          </g>\n          <text class=\"cat\" x=\"593\" y=\"370\" text-anchor=\"middle\">Filing</text>\n        </g>\n      </g>\n    </svg>\n    <p class=\"hint\">Hover or Tab to a bar to see its share of the total.</p>\n  </section>\n</main>\n</body>\n</html>\n",
                        "data": null
                    }
                }
            ],
            "ts": "2026-10-21 21:06:19.306160528 +0000 UTC",
            "messageId": "61f4a1dbded842f9a92db31b01a0ab88",
            "messageTrackingToken": "KngKIDYxZjRhMWRiZGVkODQyZjlhOTJkYjMxYjAxYTBhYjg4EiAyNGU1ZmU2ODE5MzU0ZmZhYjFlYzdiMzFjYmNkNzViNiIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "ARTIFACT_HTML",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "text": "I built the interactive bar chart **\"Sample pipeline volume\"** as an HTML artifact, using only inline CSS and SVG with no JavaScript.\n\n- **Bars:** Discovery 12, Clinical 7 and Filing 3, on a 0–15 axis with gridlines. Each bar has its value label above it.\n- **Interactivity:** Hovering over a bar, or tabbing to it with the keyboard, highlights it, fades the other bars and shows a tooltip with the count and its share of the 22 items in total.\n- **Extras:** The bars grow in when the page loads, and the colours adapt to light and dark mode. It also prints cleanly.\n\nBecause the chart has no JavaScript, it doesn't add an \"Export as PDF\" button to the toolbar. You can still save it as a PDF through your browser's normal print option."
                }
            ],
            "ts": "2026-10-21 21:06:23.721388325 +0000 UTC",
            "messageId": "637d9b2137ef5020aef27b7c181bcaaa",
            "messageTrackingToken": "KngKIDYzN2Q5YjIxMzdlZjUwMjBhZWYyN2I3YzE4MWJjYWFhEiAyNGU1ZmU2ODE5MzU0ZmZhYjFlYzdiMzFjYmNkNzViNiIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "CONTENT",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        },
        {
            "author": "GLEAN_AI",
            "fragments": [
                {
                    "followupChatSuggestion": "Would you like to save this as a reusable skill for creating interactive SVG bar charts?",
                    "followupChatSuggestionPresentation": "RESPONSE_MARKDOWN"
                }
            ],
            "ts": "2026-10-21 21:06:32.81584509 +0000 UTC",
            "messageId": "06018927106742369065ec8c3a84434a",
            "messageTrackingToken": "KngKIDA2MDE4OTI3MTA2NzQyMzY5MDY1ZWM4YzNhODQ0MzRhEiAyNGU1ZmU2ODE5MzU0ZmZhYjFlYzdiMzFjYmNkNzViNiIgNTUyYjNiOWQ1MzM0NDdjNWI0YTBiNGUxMTQ4NTZhMjAyEG85ejQ1dXJQY0VMSTQ2MTY=",
            "messageType": "CONTENT",
            "workflowTraceId": "9ebf773eed13088a38054c85b085f6ce",
            "agentTraceInfo": {
                "traceId": "9ebf773eed13088a38054c85b085f6ce",
                "startTimeMillis": 1792616726398
            },
            "workflowRunId": "552b3b9d533447c5b4a0b4e114856a20"
        }
    ],
    "chatId": "24e5fe6819354ffab1ec7b31cbcd75b6",
    "chat": {
        "name": "Sample pipeline volume"
    },
    "chatSessionTrackingToken": "KiISIDI0ZTVmZTY4MTkzNTRmZmFiMWVjN2IzMWNiY2Q3NWI2"
}
```
