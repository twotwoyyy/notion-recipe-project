'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

function loadWebhookUrl(cwd) {
  if (process.env.SLACK_WEBHOOK_URL) return process.env.SLACK_WEBHOOK_URL;

  const envFile = path.join(cwd, '.env.local');
  try {
    const content = fs.readFileSync(envFile, 'utf8');
    const match = content.match(/^SLACK_WEBHOOK_URL=(.+)$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  } catch {
    // .env.local 없으면 조용히 스킵
  }
  return null;
}

function sendSlack(webhookUrl, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const url = new URL(webhookUrl);
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        res.resume();
        res.on('end', resolve);
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const eventType = process.argv[2]; // 'notification' | 'stop'

  let rawInput = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) rawInput += chunk;

  let data = {};
  try {
    data = JSON.parse(rawInput);
  } catch {
    // 파싱 실패 시 빈 객체로 진행
  }

  const cwd = data.cwd || process.cwd();
  const webhookUrl = loadWebhookUrl(cwd);
  if (!webhookUrl) process.exit(0);

  const projectName = path.basename(cwd);
  let payload;

  if (eventType === 'notification') {
    const message = (data.message || '권한 승인이 필요합니다.').slice(0, 400);
    payload = {
      attachments: [
        {
          color: '#f39c12',
          fallback: `🔔 [${projectName}] 권한 요청 대기 중`,
          blocks: [
            {
              type: 'section',
              text: { type: 'mrkdwn', text: '*🔔  권한 요청이 대기 중입니다*' },
            },
            { type: 'divider' },
            {
              type: 'section',
              text: { type: 'mrkdwn', text: message },
            },
            {
              type: 'context',
              elements: [
                { type: 'mrkdwn', text: `📁 *${projectName}*  ·  Claude Code를 열어 승인해주세요` },
              ],
            },
          ],
        },
      ],
    };
  } else if (eventType === 'stop') {
    // stop_hook_active = true 이면 Stop 훅이 이미 실행 중 → 무한루프 방지
    if (data.stop_hook_active) process.exit(0);

    const lastMsg = (data.last_assistant_message || '').slice(0, 500);
    payload = {
      attachments: [
        {
          color: '#27ae60',
          fallback: `✅ [${projectName}] 작업 완료`,
          blocks: [
            {
              type: 'section',
              text: { type: 'mrkdwn', text: '*✅  작업이 완료되었습니다*' },
            },
            { type: 'divider' },
            ...(lastMsg
              ? [
                  {
                    type: 'section',
                    text: { type: 'mrkdwn', text: lastMsg },
                  },
                ]
              : []),
            {
              type: 'context',
              elements: [
                { type: 'mrkdwn', text: `📁 *${projectName}*` },
              ],
            },
          ],
        },
      ],
    };
  } else {
    process.exit(0);
  }

  await sendSlack(webhookUrl, payload);
}

main().catch(() => process.exit(0));
