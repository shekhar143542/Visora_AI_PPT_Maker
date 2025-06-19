'use server'

import { client } from "@/lib/prisma";
import { onAuthenticateUser } from "./user"
import { OutlineCard } from "@/lib/types";

export const getAllProjects = async () => {

    try {
        
        const checkUser = await onAuthenticateUser();

        if(checkUser.status !== 200 || !checkUser.user){
            return {
                status: 403,
                message: 'User not authenticated'
            }
        }

        const projects = await client.project.findMany({

            where:{
                userId: checkUser.user.id,
                isDeleted: false,
            },
            orderBy: {
                updatedAt: 'desc'
            },

        })
        
        if (projects.length === 0) {
            return {
                status: 404,
                message: 'No projects found'
            }
        }

        return {
            status: 200,
            data: projects
        }

    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: 'Internal server error'
        }
    }

}

export const getRecentProjects = async () => {
    try {

        const checkUser = await onAuthenticateUser();
        if(checkUser.status !== 200 || !checkUser.user){
            return {
                status: 403,
                message: 'User not authenticated'
             }
        }

        const projects = await client.project.findMany({
            where: {
                userId: checkUser.user.id,
                isDeleted: false,
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take: 4,
        });
        
        if (projects.length === 0) {
            return {
                status: 404,
                message: 'No recent projects found'
            }
        }

        return{
            status: 200,
            data: projects
        }

    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: 'Internal server error'
        }
        
    }
}

export const recoverProject = async (projectId: string) => {
     try {

        const checkUser = await onAuthenticateUser();

        if(checkUser.status !== 200 || !checkUser.user){
            return {
                status: 403,
                message: 'User not authenticated'
             }
        }

        const updatedProject = await client.project.update({
            where: {
                id:projectId,
            },

            data: {
                isDeleted:false,
            },
        })

        if(!updatedProject){

            return {
                status: 500,
                error: "Failed to recover project"
            }
        }

        return {

            status:200,
            data:updatedProject
        }
        
     } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: 'Internal server error',
     }
}
}

export const deleteProject = async (projectId: string) => {

    try {
        const checkUser = await onAuthenticateUser();

        if(checkUser.status !== 200 || !checkUser.user){
            return {
                status: 403,
                message: 'User not authenticated'
             }
        }

        const updatedProject = await client.project.update({
            where: {
                id:projectId,
            },

            data: {
                isDeleted:true,
            },
        })

         if(!updatedProject){

            return {
                status: 500,
                error: "Failed to delete project"
            }
        }

         return {

            status:200,
            data:updatedProject
        }

    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: 'Internal server error',
     }
    }
}

export const createProject = async (title: string, outlines: OutlineCard[]) => {
    try {
        if(!title || !outlines || outlines.length === 0) {
            return {
                status: 400,
                message: 'Title and outlines are required'
            }
        }
        
        const allOutlines = outlines.map((outline) => outline.title)
        const checkUser = await onAuthenticateUser();
        if(checkUser.status !== 200 || !checkUser.user){
            return {
                status: 403,
                message: 'User not authenticated'
            }
        }
        
        const project = await client.project.create({
            data: {
                title,
                userId: checkUser.user.id,
                outlines: allOutlines,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        if(!project) {
            return {
                status: 500,
                message: 'Failed to create project'
            }
        }
        return {
            status: 200,
            data: project
        }

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: 'Internal server error'
        }
        
    }
}


export const getProjectById = async (projectId: string) => {
    try {
        const checkUser = await onAuthenticateUser();
        if(checkUser.status !== 200 || !checkUser.user){
            return {status: 403, error: 'User not authenticated'}
        }


        const project = await client.project.findFirst({
            where:{id:projectId},
        })

        if(!project){
            return{
                status:404,
                error: 'Project not found'
            }
        }

        return{
            status:200,
            data:project
        }

    } catch (error) {
        return {
            status:500,
            error:'Internal server error'
        }
    }
}