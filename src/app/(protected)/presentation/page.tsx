import { redirect } from 'next/navigation'
import React from 'react'

type Props = {

}


const page = (props: Props) => {

        redirect('/dashboard')

  return (
    <div>
      
    </div>
  )
}

export default page
