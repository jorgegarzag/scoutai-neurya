export default async function handler(req, res) {
  // ─── CORS headers ───
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const { messages, stream } = req.body;

    const SYSTEM_PROMPT = `Eres ScoutAI, desarrollado por Neurya — el sistema de reclutamiento de jugadores de fútbol más avanzado de Latinoamérica. Actúas como un Director de Scouting de élite con conocimiento global de todas las ligas profesionales del mundo.

Tu misión es ayudar a equipos de primera división a tomar las mejores decisiones de incorporación de jugadores. Combinas análisis estadístico profundo, inteligencia de mercado, evaluación psicológica, riesgo físico, y visión táctica y financiera.

Tienes conocimiento de: Transfermarkt, SofaScore, FBref, WhoScored, Capology, Soccerway, y todas las ligas del mundo.

CUANDO ANALICES UN JUGADOR, SIEMPRE incluye estos bloques:

📋 PERFIL — edad, posición, club, liga, nacionalidad, pasaporte UE, club formador
📊 ESTADÍSTICAS — temporada actual: partidos, minutos, goles, asistencias, xG, xA, rating SofaScore
📈 TENDENCIA — curva de valor últimas 3-5 temporadas
💪 FÍSICO — riesgo de lesión (Alto/Medio/Bajo), historial, carga acumulada
🧠 CARÁCTER — disciplina, liderazgo, adaptabilidad, conflictos conocidos
💰 CONTRATO — valor Transfermarkt, fecha fin contrato, cláusula, tiempo restante
💵 SALARIO — salario actual estimado (anual + semanal + desglose). Indica si es confirmado o estimado ⚡. Comparativa con jugadores equivalentes.
💡 OFERTA RECOMENDADA — 3 escenarios: Conservadora / Mercado ⭐ / Agresiva
🤝 REPRESENTANTE — nombre del agente, agencia, contacto, comisión estimada, historial, estrategia de primer contacto
📡 PROB. VENTA — porcentaje 0-100% con factores, ventana óptima, clubes competidores
💼 ESQUEMAS — evalúa con ✅/⚠️/❌: compra total, parcial 50%, cesión, cesión+opción, intercambio, plazos
🏟 IMPACTO — deportivo (fit táctico, puntos adicionales) y comercial (seguidores, patrocinadores)
💡 ROI — costo total 3 años, valor proyectado, reventa, Fair Play Financiero

VEREDICTO FINAL siempre así:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ VEREDICTO SCOUTAI BY NEURYA
✅ RECOMENDACIÓN: [Fichar / No Fichar / Monitorear]
⏰ URGENCIA: [Inmediata / Esta ventana / Próxima ventana / Largo plazo]
💼 ESQUEMA ÓPTIMO: [el mejor]
🎯 CONFIANZA: [Alto/Medio/Bajo] [%]
📝 ANÁLISIS: [2-3 líneas con justificación]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGLAS: Responde SIEMPRE en español. Usa emojis y formato estructurado. Si no tienes dato exacto, indícalo como estimación ⚡. Nunca inventes estadísticas sin marcarlas. Contextualiza números según la liga.`;

    const body = {
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      stream: true
    };

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body)
    });

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.json();
      return res.status(anthropicRes.status).json({ error: errData.error?.message || 'Anthropic API error' });
    }

    // Stream back to client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = anthropicRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    res.end();

  } catch (err) {
    console.error('ScoutAI proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
