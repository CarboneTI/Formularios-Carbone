import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 32,
  md: 40,
  lg: 48
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const dimensions = sizes[size]
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Image
          src="/assets/logo-carbone.svg"
          alt="Carbone Company"
          width={dimensions}
          height={dimensions}
          className="object-contain"
          priority
        />
      </div>
      
      {showText && (
        <h1 className="text-2xl font-bold select-none whitespace-nowrap">
          Dashboard <span className="text-[#FFC600]">Admin</span>
        </h1>
      )}
    </div>
  )
} 