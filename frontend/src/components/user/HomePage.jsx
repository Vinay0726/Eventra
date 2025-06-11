import React from 'react'
import Hero from './Hero'
import Features from './Features'
import Contact from './Contact'
import PublicFeedback from './PublicFeedback'

const HomePage = () => {
  return (
    <div><Hero />
                  <Features />
                  <PublicFeedback/>
                  <Contact /></div>
  )
}

export default HomePage