'use client'

import HumanIcon from 'icons/human.svg'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

const Houses = () => {
  const rentOptions = ['На сутки', 'На день', 'Бани']
  const [activeOption, sentActiveOption] = useState(rentOptions[0])

  return (
    <section className="flex flex-col gap-8">
      <h2>Каталог домов</h2>
      <div className="flex justify-between">
        <div className="flex gap-5">
          {rentOptions.map((option) => {
            return (
              <span
                key={option}
                onClick={() => sentActiveOption(option)}
                className={twMerge(
                  'border-3 rounded-md border-black py-1 px-14 font-semibold text-lg cursor-pointer',
                  activeOption === option && 'bg-primary text-white border-primary'
                )}
              >
                {option}
              </span>
            )
          })}
        </div>
        <div className='flex flex-col font-semibold text-xs font-inter text-black gap-1'>
          <div className='flex gap-2 items-center'>
            <div className='bg-secondary w-4 h-4'/>
            <span>Пятница - Воскресенье</span>
          </div>
          <div className='flex gap-2 items-center'>
            <div className='bg-primary w-4 h-4'/>
            <span>Понедельник - Четверг</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-9 row-auto">
        {Array.from({ length: 5 }).map((_, index) => {
          return (
            <div
              className="relative h-64 text-white font-semibold flex flex-col justify-between font-inter"
              key={index}
            >
              <div className="absolute top-0 h-full w-full brightness-[60%] -z-10 bg-house-image bg-auto bg-left-top" />
              <div className="flex justify-between p-4">
                <div className="flex items-center">
                  <span>
                    <HumanIcon />
                  </span>
                  <span>x4</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-primary rounded-md p-1 text-xs">6 000 ₽</span>
                  <span className="bg-secondary rounded-md p-1 text-xs">7 000 ₽</span>
                </div>
              </div>
              <span className="p-4 font-semibold text-4xl">Браунхаус</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Houses
