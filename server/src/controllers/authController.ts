import { type Request, type Response } from "express";
import { firebaseAdmin } from "../services/firebaseAdmin.js"
import {supabase} from "../services/supabase.js"



const FIVE_DAYS = 5*24*60*60*1000


const registerUserInDb = async (uid: string, email: string, name: string, picture: string) => {
  const { data, error } = await supabase.from('users').upsert([
    {
        firebase_uid: uid,
        email: email ?? null,
        name: name ?? null,
        avatar_url: picture ?? null,
    }
  ]).select();
  console.log("data - ", data)
  return { data, error };
}

export const handleSessionLogin= async (req: Request, res: Response)=> {
  const { idToken } = req.body as { idToken?: string };
  if (!idToken) {
    res.status(400).json({
      error: "Missing idToken"
    });
    return;
  }
  try{
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken)
    if (!decoded) {
      throw new Error("Unauthorized")
    }
    const { uid, email, name, picture } = decoded

    const { data, error } = await registerUserInDb(
      uid ?? "",
      email ?? "",
      name ?? "",
      picture ?? ""
    )
    const cookie = await firebaseAdmin.auth().createSessionCookie(idToken, {expiresIn: FIVE_DAYS})
    const isProd = process.env.NODE_ENV === "production"

    res.cookie("session", cookie, {
      httpOnly: true,
      secure: isProd, 
      sameSite: "lax", 
      maxAge: FIVE_DAYS

    })
    if (error || !data || data.length === 0) {
      throw new Error("Failed to create user session")
    }
    res.cookie("userId", data[0].id, {
      httpOnly: false,
      secure: isProd, 
      sameSite: "lax", 
      maxAge: FIVE_DAYS
    })
    return res.status(200).json({success: true})

  }catch(err){
    console.error("Error creating session cookie", err)
    return res.status(401).json({ success: false, error: "Unauthorized" })
  }
}

export const handleSessionLogout= async (req: Request, res: Response)=> {
  const session = req.cookies?.session
  try{
    const decoded = await firebaseAdmin.auth().verifySessionCookie(session, true)
    if (!decoded) {
      throw new Error("Unauthorized")
    }
    await firebaseAdmin.auth().revokeRefreshTokens(decoded.uid)
    res.clearCookie("session", {path: '/'})
    res.clearCookie("userId", {path: '/'})
    return res.status(200).json({success: true})
  
  }catch(err){
    res.clearCookie("session", {path: '/'})
    res.clearCookie("userId", {path: '/'})

    return res.status(200).json({success: true, error: err})
  }
}

export const handleGetMe = async (req: Request, res: Response)=> {
    const { uid } = (req as any).user
    const user = await firebaseAdmin.auth().getUser(uid) // always up-to-date
    return res.status(200).json({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    phoneNumber: user.phoneNumber,
    emailVerified: user.emailVerified,
  })
}