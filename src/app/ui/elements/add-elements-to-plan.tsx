'use client'
import React, {useEffect, useState} from "react";
import {Category, Element, ElementList, ElementRequirement, ItemSelect, Node, Tree} from "@/app/lib/definitions";
import {
    getCategoryChildren,
    getElementsByCategory,
    getParentCategories,
    getRequirements
} from "@/app/services/element-service";
import ElementTreeView from "@/app/ui/elements/element-tree-view";
import ElementListView from "@/app/ui/elements/element-list-view";
import "@/app/globals.css";

//TODO: clean up, make the state a single tree with selected bool, where list is constructed from
export default function AddElementsToPlan({cop}: {cop: string}) {

    // state
    const [tree, setTree] = useState<Tree<ElementList>>({_root: new Node()});
    const [selectedList, setSelectedList] = React.useState<ElementList[]>([]);
    const [reqList, setReqList] = React.useState<Requirement[]>([]);

    useEffect(() => {
        // make tree
        makeTree(cop).then((tree) => {
            setTree(tree);
        });

        // make selection list
        getParentCategories(cop).then((cats) => {
            let lists: ElementList[] = [];
            for (let cat of cats) {
                let list = new ElementList(cat, []);
                lists.push(list);
            }
            setSelectedList(lists);
        });

        // make requirements list
        getRequirements(cop).then((reqs) => {
            let list: Requirement[] = [];
            for (let req of reqs) {
                list.push(new Requirement(req));
            }
            setReqList(list);
        })

    }, [cop])

    function handleAddElement(elementSelect: ItemSelect<Element>) {

        // add to list
        let tempList: ElementList[] = [...selectedList];
        for (let el of tempList) {
            // if categories match
            if (elementSelect._item.categoryCode?.startsWith(el._category.code)) {
                el._elements.push(new ItemSelect<Element>(elementSelect._item));
                break;
            }
        }
        setSelectedList(tempList);

        // if we meet reqs
        for (let req of reqList) {
            // add to amount
            if (elementSelect._item.categoryCode!.startsWith(req.elReq.categoryCode!))
                req.amountSelected!++;

            if (req.amountSelected >= req.elReq.amount!) {
                // disable category
                for (let child of tree._root.children) {
                    if (req.elReq.categoryCode! == child.data!._category.code) {
                        child.data!._disabled = true;
                    }
                }
            }
        }

        // update reqs
        let tempReqs = [...reqList];
        setReqList(tempReqs);

        // update tree
        elementSelect.selected = true;
        let tempTree = new Tree<ElementList>(tree._root)
        setTree(tempTree)
    }

    function handleRemoveElement(elementSelect: ItemSelect<Element>) {
        // deselect item
        // look through tree and deselect if found
        setElementSelected(tree._root, elementSelect._item, false);

        // handle element reqs
        for (let req of reqList) {
            // subtract to amount
            if (elementSelect._item.categoryCode!.startsWith(req.elReq.categoryCode!))
                req.amountSelected!--;

            for (let child of tree._root.children) {
                if (req.elReq.categoryCode! == child.data!._category.code) {
                    child.data!._disabled = false;
                }
            }
        }

        // update list
        let tempList = [...selectedList];
        for (let el of tempList) {
            let index = el._elements.indexOf(elementSelect);
            if (~index) el._elements.splice(index, 1);
        }
        setSelectedList(tempList)

        // update tree
        let tempTree = new Tree<ElementList>(tree._root);
        setTree(tempTree);

        // update reqs
        let tempReqs = [...reqList];
        setReqList(tempReqs);

    }

    return (
        <div style={{height: "100%", width: "100%", display: "flex"}}>
            <div style={{width: "50%"}}>
                <ElementTreeView
                    key={"addTree"}
                    tree={tree}
                    onClick={(element) => {handleAddElement(element)}}>
                </ElementTreeView>
            </div>

            <div style={{width: "50%"}}>
                <ElementListView
                    elementLists={selectedList}
                    onPress={handleRemoveElement}
                    reqs={reqList}>

                </ElementListView>
            </div>
        </div>
    )
}

function setElementSelected(node: Node<ElementList>, element: Element, selected: boolean) {
    for (let child of node.children) {
        // find element if present
        if (child.data?._elements)
            for (let elemSel of child.data?._elements) {
                if (elemSel._item.code == element.code) {
                    elemSel.selected = selected;
                    return;
                }
            }
        setElementSelected(child, element, selected);
    }
}

export class Requirement {
    elReq: ElementRequirement;
    amountSelected: number;

    constructor(elReq: ElementRequirement) {
        this.elReq = elReq;
        this.amountSelected = 0;
    }
}


async function makeTree(cop: string): Promise<Tree<ElementList>> {
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
        let elementSelects: ItemSelect<Element>[] = [];
        for (let elem of elements) {
            elementSelects.push(new ItemSelect<Element>(elem));
        }
        node = currentNode?.addChild(new ElementList(parent, elementSelects));
        let children = await getCategoryChildren(cop, parent.code);
        await treeHelper(cop, children, node)
    }

    return node;
}