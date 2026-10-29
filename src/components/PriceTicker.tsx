'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, ShieldCheck, BarChart2, Users } from 'lucide-react'


export default function PriceTicker() {
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-primary-500/10 shadow-lg z-50 dark:bg-gray-950/95 py-2">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Token info */}
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 p-0.5 border border-white/5 flex-shrink-0"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src="/images/logos/logo.png" alt="ANT" className="w-full h-full" />
            </motion.div>
            <div className="flex items-baseline space-x-1">
              <span className="text-sm font-medium">$0.0325</span>
              <span className="text-xs text-green-500 flex items-center">
                <ArrowUp className="w-3 h-3 mr-0.5" />5.2%
              </span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center space-x-6 text-xs">
            <div className="text-center">
              <div className="text-muted-foreground">24h Vol</div>
              <div className="font-medium">$2.76M</div>
              <div className="text-green-500 text-[10px]">+12.3%</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Mkt Cap</div>
              <div className="font-medium">$32.55M</div>
              <div className="text-green-500 text-[10px]">+5.2%</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Holders</div>
              <div className="font-medium">12.5K</div>
              <div className="text-green-500 text-[10px]">+215</div>
            </div>
          </div>
          
          {/* Features */}
          <div className="hidden lg:flex items-center space-x-6 text-xs">
            <div className="flex items-center space-x-2 text-primary-500">
              <ShieldCheck className="w-4 h-4" />
              <span>Security First</span>
            </div>
            <div className="flex items-center space-x-2 text-green-500">
              <BarChart2 className="w-4 h-4" />
              <span>Sustainable Growth</span>
            </div>
            <div className="flex items-center space-x-2 text-yellow-500">
              <Users className="w-4 h-4" />
              <span>Community Driven</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
