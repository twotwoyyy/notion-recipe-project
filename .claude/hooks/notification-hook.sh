#!/bin/bash

# Windows Chocolatey 설치 대응: PATH에 없으면 직접 경로 사용
JQ=$(command -v jq 2>/dev/null || echo "/c/ProgramData/chocolatey/bin/jq")

# stdin에서 훅 JSON 읽기
INPUT=$(cat)

# jq로 필드 추출
MESSAGE=$($JQ -r '.message // "권한 승인이 필요합니다."' <<< "$INPUT")
CWD=$($JQ -r '.cwd // ""' <<< "$INPUT")
PROJECT=$(basename "$CWD")

# 웹훅 URL: 환경변수 → .env.local 순서로 조회
WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
if [ -z "$WEBHOOK_URL" ] && [ -f "$CWD/.env.local" ]; then
  WEBHOOK_URL=$(grep '^SLACK_WEBHOOK_URL=' "$CWD/.env.local" | cut -d'=' -f2- | tr -d '"'"'")
fi

[ -z "$WEBHOOK_URL" ] && exit 0

# jq로 Slack Block Kit 페이로드 생성
PAYLOAD=$($JQ -n \
  --arg project "$PROJECT" \
  --arg message "${MESSAGE:0:400}" \
  '{
    attachments: [{
      color: "#f39c12",
      fallback: ("🔔 [" + $project + "] 권한 요청 대기 중"),
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: "*🔔  권한 요청이 대기 중입니다*" }
        },
        { type: "divider" },
        {
          type: "section",
          text: { type: "mrkdwn", text: $message }
        },
        {
          type: "context",
          elements: [
            { type: "mrkdwn", text: ("📁 *" + $project + "*  ·  Claude Code를 열어 승인해주세요") }
          ]
        }
      ]
    }]
  }')

curl -s -o /dev/null -X POST \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "$WEBHOOK_URL"
