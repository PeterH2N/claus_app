import {Axios, AxiosResponse} from "axios";


import axios from "axios";
import {Category, ElementList, Tree} from "@/app/lib/definitions";
import {Element} from "@/app/lib/definitions";

const API_URL: string = 'http://localhost:8080/api/';
export async function getElement( cop: string, code: string): Promise<Element> {
    const response = await axios.get<Element>(API_URL + `${cop}/element/${code}` );
    return response.data;
}

export async function getElementsByCategory(cop: string, catCode: string): Promise<Element[]> {
    const response = await axios.get<Element[]>(API_URL + `${cop}/elements/${catCode}`);
    return response.data;
}

export async function getCategoryChildren(cop: string, catCode: string): Promise<Category[]> {
    const response = await axios.get<Category[]>(API_URL + `${cop}/categories/${catCode}`);
    return response.data;
}

export async function getParentCategories(cop: string): Promise<Category[]> {
    const response = await axios.get<Category[]>(API_URL + `${cop}/categories/parents`);
    return response.data;
}

export async function getElementTree(cop: string): Promise<Tree<ElementList>> {
    const response = await axios.get<Tree<ElementList>>(API_URL +`${cop}/element-tree`)
    return response.data;
}

