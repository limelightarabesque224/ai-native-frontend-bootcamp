'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface MobileNavContextType {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const MobileNavContext = createContext<MobileNavContextType>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
})

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <MobileNavContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </MobileNavContext.Provider>
  )
}

export function useMobileNav() {
  return useContext(MobileNavContext)
}
