import React from 'react'

const Button = React.forwardRef(({ 
  className = '', 
  variant = 'default',
  size = 'default',
  children, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-black text-white hover:bg-gray-900',
    outline: 'border border-black bg-transparent hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
  }

  const sizes = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-9 px-3 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10',
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }
