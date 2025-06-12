export async function broadcastChatMessage(text: string) {
  const tasks = [] as Promise<any>[];
  if (process.env.SLACK_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).catch((err) => console.error("Slack webhook error", err))
    );
  }
  if (process.env.CHAT_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).catch((err) => console.error("Chat webhook error", err))
    );
  }
  await Promise.all(tasks);
}
