// import { PrismaClient } from '@prisma/client'

// declare global {
//   // Allow global prisma for hot-reloading in development
//   var prisma: PrismaClient | undefined
// }

// const client = globalThis.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') {
//   globalThis.prisma = client
// }

// export default client

import { PrismaClient } from '../generated/prisma'



declare global {

    var prisma: PrismaClient | undefined

}

export const client = globalThis.prisma || new PrismaClient()

if(process.env.NODE_ENV !== "production") {
    globalThis.prisma = client
}
