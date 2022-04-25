// pages/[[...app]].js
import React, { useState, useEffect } from 'react';
import Viewer from '../src/components/Viewer/Viewer';

function App() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <Viewer />
}

export default App