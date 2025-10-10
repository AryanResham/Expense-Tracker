import { type Request, type Response } from "express";
import {supabase} from "../services/supabase.js"


export const handleGetCategories = async (req: Request, res: Response) => {
  try {
    const supabaseUser = (req as any).userId;
    if (!supabaseUser) {
      return res.status(400).json({ error: "Missing user ID" });
    }
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', supabaseUser)
      .order('name', { ascending: true });
    if (error) {
      throw error;
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}


export const handleAddCategory = async (req: Request, res: Response) => {
  try{
    const supabaseUser = (req as any).userId;
    if (!supabaseUser) {
      return res.status(400).json({ error: "Missing user ID" });
    }
    const { name, type, description, color, icon } = req.body as { name?: string; type?: 'income' | 'expense'; description?: string; color?: string; icon?: string };
    if (!name || !type) {
      return res.status(400).json({ error: "Missing name or type" });
    }
    const { data, error } = await supabase
      .from('categories')
      .insert([
        { 
          user_id: supabaseUser,
          name, 
          type, 
          description: description ?? null,
          color: color ?? null,
          icon: icon ?? null
        }
      ])
      .select()
      .single();
    if (error) {
      throw error;
    }
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}


export const handleGetSystemCategories = async (req: Request, res: Response) => {
  try {
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_system', true)
      .order('name', { ascending: true });
    if (error) {
      throw error;
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}