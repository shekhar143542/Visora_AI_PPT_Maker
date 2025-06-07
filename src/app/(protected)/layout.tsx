import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'
export const dynamic = 'force-dynamic'

type props = {children: React.ReactNode}

const layout = async (prop: props) => {

    const auth = await onAuthenticateUser();

    if(!auth.user){
        redirect('/sign-in')
    }
  return (
    <div  className='w-full min-h-screen'>
       {prop.children}
    </div>
  )
}

export default layout
