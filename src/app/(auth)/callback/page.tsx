import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'


const AuthCallBackPage = async () => {

    const auth = await onAuthenticateUser()

     console.log('Auth response:', auth) // ADD THIS

    if (auth && (auth.status === 200 || auth.status === 201)) {
        redirect('/dashboard')
    }
    else if (auth && (auth.status === 403 || auth.status === 500 || auth.status === 400)) {
        // redirect to sign in page
        redirect('/sign-in')
    }

    return <div>Redirecting...</div>
  
}

export default AuthCallBackPage
