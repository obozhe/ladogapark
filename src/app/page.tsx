import { Button } from "@/shared/ui/Button";

export default function Home() {
  return (
    <main className="">
      <section className="relative flex flex-col justify-center items-center gap-14 py-[153px] ">
        <div className="bg-home-image absolute w-full h-full -z-10 brightness-[35%]" />
        <div className="text-white text-6xl text-center font-semibold">
          <p>Аренда домов на берегу</p>
          <p>Ладожского озера</p>
        </div>
        <div className="flex gap-3">
          <div className="h-[50px] bg-white w-[220px]" />
          <div className="h-[50px] bg-white w-[220px]" />
          <Button>Показать объекты</Button>
        </div>
      </section>
    </main>
  )
}
