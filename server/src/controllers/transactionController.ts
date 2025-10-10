import type {Request, Response} from "express"
import {supabase} from "../services/supabase.js"

export const handleGetExpenses = async (req:Request, res:Response) => {
  try{
    const supabaseUser = (req as any).userId;
    if (!supabaseUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', supabaseUser)
      .order('date', { ascending: false });
    if (error) {
      throw error;
    }
    return res.status(200).json({ success: true, transactions: data });
  } catch(err){
    console.error("Error fetching expenses", err)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }

}

export const handleAddExpense = async (req:Request, res:Response) => {
  try{
    const supabaseUser = (req as any).userId;
    if (!supabaseUser) {
      return res.status(401).json({ success:false, error: "Unauthorized" });
    }
    const { amount, description, date, time, payment_method, category_id, type } = req.body;
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ user_id: supabaseUser, amount, description, date, time, payment_method: payment_method || "cash", category_id, type }])
      .select()
      .single();
    if (error) {
      throw error;
    }
    return res.status(201).json({ success: true, transaction: data });
  } catch(err){
    console.error("Error adding expense", err)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }

}

export const handleDeleteExpense = async (req:Request, res:Response) => {
  try{
    const supabaseUser = (req as any).userId;
    if (!supabaseUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', supabaseUser);
    if (error) {
      throw error;
    }
    return res.status(200).json({ success: true });
  } catch(err){
    console.error("Error deleting expense", err)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

export const handleUpdateExpense = async (req:Request, res:Response) => {
  try{
    const supabaseUser = (req as any).userId;
    if (!supabaseUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const { amount, description, date } = req.body;
    const { data, error } = await supabase
      .from('transactions')
      .update({ amount, description, date })
      .eq('id', id)
      .eq('user_id', supabaseUser)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return res.status(200).json({ success: true, transaction: data });
  }catch(err){
    console.error("Error updating expense", err)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}