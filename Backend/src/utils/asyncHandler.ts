import type { Request, Response, NextFunction } from "express"

type Asyncfunction=(
    req: Request,
    res:Response,
    next: NextFunction
) => Promise<any>


export const asyncHandler = (fn:Asyncfunction) => async(req:Request,res:Response,next:NextFunction) => {
    try {
        await fn(req,res,next)
    } catch (error:any) {
        
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

