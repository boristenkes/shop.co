'use client'

import { MinusIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'

export type NumberInputProps = {
	value?: number
	onChange?: (value: number) => void
	min?: number
	max?: number
	step?: number
}

export default function NumberInput({
	value = 1,
	onChange,
	min = 1,
	max = 100,
	step = 1
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
		<div className='flex items-center border rounded-full px-2 py-3 bg-gray-100'>
			<button
				type='button'
				onClick={handleDecrement}
				className='px-2 text-lg font-bold text-gray-600 hover:text-gray-900'
			>
				<MinusIcon />
			</button>
			<input
				type='number'
				value={inputValue}
				onChange={handleInputChange}
				className='pl-4 text-center bg-transparent border-none focus:outline-none'
				min={min}
				max={max}
				step={step}
			/>
			<button
				type='button'
				onClick={handleIncrement}
				className='px-2 text-lg font-bold text-gray-600 hover:text-gray-900'
			>
				<PlusIcon />
			</button>
		</div>
	)
}
