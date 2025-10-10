import { backend } from "./api";

export const getSystemCategories = async () => {
    const response = await backend.get("/categories/system");
    return response.data;
}


export const getUserCategories = async () => {
    const response = await backend.get("/categories");
    return response.data;
};

export const createCategory = async (name: string) => {
    const response = await backend.post("/categories", { name });
    return response.data;
}


export const updateCategory = async (id: string, name: string) => {
    const response = await backend.put(`/categories/${id}`, { name });
    return response.data;
}
