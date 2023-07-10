import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  color?: 'primary'
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ color = 'primary', children }: Props) => {
  return (
    <button
      className={twMerge(
        'text-center align-middle rounded-lg',
        color === 'primary' && 'bg-primary text-white px-8 py-3'
      )}
    >
      {children}
    </button>
  )
}

export default Button
