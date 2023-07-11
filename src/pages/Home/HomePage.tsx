import { getWeather } from 'api/weather'

import Button from 'ui/Button/Button'
import Houses from './components/Houses/Houses'

const HomePage = async () => {
  const weather = await getWeather()

  return (
    <main>
      <section className="relative flex flex-col justify-center items-center gap-14 pt-[153px] pb-[253px] ">
        <div className="bg-home-image absolute top-0 w-full h-full -z-10 brightness-[35%]" />
        <div className="text-white text-6xl text-center font-semibold">
          <p>Аренда домов на берегу</p>
          <p>Ладожского озера</p>
        </div>
        <div className="flex flex-col text-center gap-5">
          <div className="flex gap-3">
            <div className="h-[50px] bg-white w-[220px]" />
            <div className="h-[50px] bg-white w-[220px]" />
            <Button>Показать объекты</Button>
          </div>
          {weather && (
            <span className="text-white font-semibold text-xl">
              У нас сейчас {weather[0]} на выходных {weather[1] ?? weather[0]}
            </span>
          )}
        </div>
      </section>
      <Houses />
    </main>
  )
}

export default HomePage
