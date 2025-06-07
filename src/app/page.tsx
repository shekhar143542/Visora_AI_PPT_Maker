import { Button } from '@/components/ui/button'
import { SignedIn } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      This is the lander page
     <Link href='/sign-in'> <Button>Get Started</Button> </Link>
    </div>
  )
}

export default page
