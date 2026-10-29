import { getMemePath } from '@/lib/asset-paths';
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Shuffle, ThumbsUp, MessageSquare, Share2 } from 'lucide-react'
import Button from './ui/button'

// Sample meme data - in a real app, this would come from an API or CMS
const MEMES = [
  {
    id: 1,
    title: 'When your ANT tokens pump 300%',
    image: getMemePath('moon.jpg'),
    likes: 423,
    comments: 87
  },
  {
    id: 2,
    title: 'HODLing ANT through the dip',
    image: getMemePath('hodl.jpg'),
    likes: 356,
    comments: 42
  },
  {
    id: 3,
    title: 'The face when someone sells their ANT',
    image: getMemePath('paper-hands.jpg'),
    likes: 289,
    comments: 31
  },
  {
    id: 4,
    title: 'ANT army taking over Solana',
    image: getMemePath('army.jpg'),
    likes: 512,
    comments: 94
  }
]

export default function MemeGallery() {
  const [currentMeme, setCurrentMeme] = useState(0)
  const [liked, setLiked] = useState<number[]>([])
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const handleShuffle = () => {
    const nextMeme = (currentMeme + 1) % MEMES.length
    setCurrentMeme(nextMeme)
  }

  const handleLike = (id: number) => {
    if (liked.includes(id)) {
      setLiked(liked.filter(memeId => memeId !== id))
    } else {
      setLiked([...liked, id])
    }
  }

  return (
    <section id="memes" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/95 -z-10" />
      
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.span variants={itemVariants} className="text-sm uppercase tracking-wider text-primary-500 font-medium mb-3 block">
            Community Creations
          </motion.span>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Meme <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Gallery</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The best ANT memes created by our community. Got a good one? Share it with us on Discord!
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold mb-4">
              Join the ANT Meme Army
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              Our community is known for creating the dankest memes in the Solana ecosystem. Every week, we reward the best meme creators with ANT tokens.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Share your creations on our Discord or Twitter with the hashtag <span className="text-primary-500 font-semibold">#ANTmemes</span> for a chance to win!
            </p>
            
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-6 mt-8">
              <h4 className="font-semibold text-lg mb-3">Weekly Meme Contest</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">🥇</span>
                  <span>1st Place: 1,000 ANT tokens</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">🥈</span>
                  <span>2nd Place: 500 ANT tokens</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">🥉</span>
                  <span>3rd Place: 250 ANT tokens</span>
                </li>
              </ul>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                variant="primary" 
                size="md" 
                href="https://discord.gg/anttoken"
                icon={<Share2 size={16} />}
              >
                Join Discord
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h4 className="font-medium">Featured Meme</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleShuffle}
                  icon={<Shuffle size={16} />}
                  iconPosition="left"
                >
                  Shuffle
                </Button>
              </div>
              
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={MEMES[currentMeme].image}
                  alt={MEMES[currentMeme].title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-4">
                <h5 className="font-medium text-lg mb-2">{MEMES[currentMeme].title}</h5>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleLike(MEMES[currentMeme].id)}
                      className={`flex items-center space-x-1 ${liked.includes(MEMES[currentMeme].id) ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      <ThumbsUp size={16} />
                      <span>{liked.includes(MEMES[currentMeme].id) ? MEMES[currentMeme].likes + 1 : MEMES[currentMeme].likes}</span>
                    </button>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MessageSquare size={16} />
                      <span>{MEMES[currentMeme].comments}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Posted by <span className="text-primary-500">@ANTlover42</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary-500/20 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-secondary-500/20 rounded-full blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
