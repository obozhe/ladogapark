// https://open-meteo.com/en/docs
export const getWeather = async (format: 'short' | 'full' = 'short') => {
  const response = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=60.05510980881007&longitude=31.0781051841388&daily=temperature_2m_max&timezone=Europe%2FMoscow'
  )

  if (!response.ok) {
    console.error('Cannot fetch weather data')

    return
  }

  const {
    daily: { time, temperature_2m_max },
  } = (await response.json()) as {
    daily: { time: string[]; temperature_2m_max: number[] }
  }

  const data: string[] = []

  for (let i = 0; i < time.length; i++) {
    const date = new Date(time[i])
    const temp = String(temperature_2m_max[i]).includes('-')
      ? String(temperature_2m_max[i])
      : `+${temperature_2m_max[i]}`

    if (format === 'short' && (date.getDay() === 6 || i === 0)) {
      data.push(temp)
    }

    if (format === 'full') {
      data.push(temp)
    }
  }

  return data
}
