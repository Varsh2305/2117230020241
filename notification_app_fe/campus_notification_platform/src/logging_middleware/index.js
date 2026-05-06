const LOG_API = "http://20.207.122.201/evaluation-service/logs";

/**
 * @param {"frontend"|"backend"} stack
 * @param {"debug"|"info"|"error"|"fatal"} level
 * @param {"api"|"component"|"hook"|"page"|"state"|"style"|"auth"|"config"|"middleware"|"utils"} pkg
 * @param {string} message
 */
async function Log(stack, level, pkg, message) {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  try {
    const res = await fetch(LOG_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
    if (!res.ok) {
      console.warn("[Logger] API returned:", res.status);
    }
  } catch {
    // Logging must never crash the app
  }
}

module.exports = { Log };