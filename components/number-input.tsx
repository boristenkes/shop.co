'use client'

import { cn } from '@/lib/utils'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'

export type NumberInputProps = {
	value: number
	onChange: (value: number) => void
	min?: number
	max?: number
	step?: number
	size?: 'lg' | 'sm'
	disabled?: boolean
	id?: string
}

export default function NumberInput({
	value = 1,
	onChange,
	min = 1,
	max = 100,
	step = 1,
	disabled,
	size = 'lg',
	...props
}: NumberInputProps) {
	const [inputValue, setInputValue] = useState<number>(value)

	const handleDecrement = () => {
		if (inputValue > min) {
			const newValue = inputValue - step
			setInputValue(newValue)
			onChange?.(newValue)
		}
	}

	const handleIncrement = () => {
		if (inputValue < max) {
			const newValue = inputValue + step
			setInputValue(newValue)
			onChange?.(newValue)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.valueAsNumber
		if (!isNaN(newValue) && newValue >= min && newValue <= max) {
			setInputValue(newValue)
			onChange?.(newValue)
		}
	}

	return (
		<div
			className={cn(
				'flex items-center border rounded-full bg-gray-100',
				size === 'sm' ? 'px-1 py-2' : 'px-2 py-3',
				{
					'opacity-50': disabled
				}
			)}
		>
			<button
				type='button'
				onClick={handleDecrement}
				disabled={disabled}
				className='px-2 text-lg font-bold text-gray-600 hover:text-gray-900'
				aria-label='decrement'
			>
				<MinusIcon className={size === 'sm' ? 'size-4' : 'size-6'} />
			</button>
			<input
				type='number'
				value={inputValue}
				onChange={handleInputChange}
				className={cn(
					'text-center bg-transparent border-none focus:outline-none',
					size === 'sm' ? 'pr-0 w-8' : 'pl-4'
				)}
				min={min}
				max={max}
				step={step}
				disabled={disabled}
				{...props}
			/>
			<button
				type='button'
				onClick={handleIncrement}
				disabled={disabled}
				className='px-2 text-lg font-bold text-gray-600 hover:text-gray-900'
				aria-label='increment'
			>
				<PlusIcon className={size === 'sm' ? 'size-4' : 'size-6'} />
			</button>
		</div>
	)
}
