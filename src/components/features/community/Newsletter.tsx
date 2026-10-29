'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Send, CheckCircle, Bell, Zap, Shield, Mail } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(true)
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value && !validateEmail(value)) {
      setIsValid(false)
    } else {
      setIsValid(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !validateEmail(email)) {
      setIsValid(false)
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      setEmail('')
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  const benefits = [
    { icon: <Bell className="h-5 w-5" />, text: "Early access to token sales" },
    { icon: <Zap className="h-5 w-5" />, text: "Exclusive community events" },
    { icon: <Shield className="h-5 w-5" />, text: "Security alerts & updates" },
    { icon: <Mail className="h-5 w-5" />, text: "Weekly market insights" },
  ]

  return (
    <section id="newsletter" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30 dark:from-background dark:via-background dark:to-muted/10 z-0"></div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.6 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.6 } : {}}
        transition={{ duration: 1, delay: 0.4 }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl dark:shadow-primary/5">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Left content */}
              <div className="md:col-span-3 p-8 md:p-12">
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Join the <span className="text-gradient">ANT Colony</span>
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Get the latest updates, exclusive offers, and early access to new features.
                  </p>
                </motion.div>
                
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email address"
                        required
                        className={`w-full px-5 py-4 rounded-xl border ${!isValid ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'} bg-background/50 focus:outline-none focus:ring-2 transition-all duration-200`}
                      />
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    {!isValid && (
                      <p className="text-sm text-red-500 ml-1">Please enter a valid email address</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitted}
                    className={`w-full relative overflow-hidden group rounded-xl py-4 px-6 font-medium transition-all duration-300 ${isSubmitted ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90'} text-white shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Successfully Subscribed!
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Subscribe to Newsletter
                        </>
                      )}
                    </span>
                  </button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </div>
                </motion.form>
              </div>
              
              {/* Right content */}
              <div className="md:col-span-2 bg-muted/30 dark:bg-muted/10 p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h3 className="text-xl font-semibold">Newsletter Benefits</h3>
                  
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      >
                        <div className="mt-0.5 flex-shrink-0 rounded-full bg-primary/10 p-1.5 text-primary">
                          {benefit.icon}
                        </div>
                        <span>{benefit.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-background border-2 border-card overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30"></div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm font-medium">
                        Join <span className="text-gradient font-bold">8,000+</span> subscribers
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
