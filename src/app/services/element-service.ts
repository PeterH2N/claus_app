import {Axios, AxiosResponse} from "axios";


import axios from "axios";
import {Category, ElementList, ElementRequirement, Node, Selectable, Tree} from "@/app/lib/definitions";
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

export async function getRequirements(cop: string): Promise<ElementRequirement[]> {
    const response = await axios.get<ElementRequirement[]>(API_URL + `${cop}/requirements`);
    return response.data;
}

export async function makeTree(cop: string): Promise<Tree<ElementList>> {
    let parents = await getParentCategories(cop);
    let tree: Tree<ElementList> = new Tree();

    await treeHelper(cop, parents, tree._root)

    return tree;
}

async function treeHelper(cop: string, cats: Category[], currentNode: Node<ElementList>): Promise<Node<ElementList>> {
    if (cats.length == 0) {
        return currentNode;
    }

    let node: Node<ElementList> = new Node();

    for (let parent of cats) {
        let elements = await getElementsByCategory(cop, parent.code);
        let elementSelects: Selectable<Element>[] = [];
        for (let elem of elements) {
            elementSelects.push(new Selectable<Element>(elem));
        }
        node = currentNode?.addChild(new ElementList(parent, elementSelects));
        let children = await getCategoryChildren(cop, parent.code);
        await treeHelper(cop, children, node)
    }

    return node;
}

