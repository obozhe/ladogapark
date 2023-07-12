import HomePage from 'pages/Home/HomePage';
import { getWeather } from 'api/weather';

export default async function Home() {
  const weather = await getWeather();

  return <HomePage weather={weather} />;
}
