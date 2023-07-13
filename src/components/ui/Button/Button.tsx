import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  color?: 'primary'
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ color = 'primary', className, children, ...rest }: Props) => {
  return (
    <button
      className={twMerge(
        'text-center align-middle rounded-lg',
        color === 'primary' && 'bg-primary text-white px-[41px] py-[8px]',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
