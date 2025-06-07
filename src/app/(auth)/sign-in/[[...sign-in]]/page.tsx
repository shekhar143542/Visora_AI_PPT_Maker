import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <SignIn  redirectUrl="/callback"/>
  )
}

export default page
