import React from 'react'
interface HeadingProps {
  title: string
}

export default function Heading({title}:HeadingProps) {
    return (
        <div className="inline-block">
            <h1 className="text-4xl font-bold text-balance capitalize">
                {title}
            </h1>
            <div className="h-1 w-20 bg-[var(--primary)] mt-0.5 rounded-full"></div>
        </div>
    )
}
