'use client'

import React, {useEffect, useState} from "react";
import {Category, Element, ElementList, Node, Tree} from "@/app/lib/definitions";
import {getCategoryChildren, getElementsByCategory, getParentCategories} from "@/app/services/element-service";
import ElementTreeView from "@/app/ui/elements/element-tree-view";
import ElementListView from "@/app/ui/elements/element-list-view";

export default function AddElementsToPlan({cop}: {cop: string}) {

    // state
    const [tree, setTree] = useState<Tree<ElementList>>({_root: new Node()});
    const [selectedList, setSelectedList] = React.useState<ElementList[]>([]);

    useEffect(() => {
        // make tree
        makeTree(cop).then((tree) => {
            setTree(tree);
        });

        getParentCategories(cop).then((cats) => {
            let lists: ElementList[] = [];
            for (let cat of cats) {
                let list = new ElementList(cat, []);
                lists.push(list);
            }
            setSelectedList(lists);
        });
    }, [cop])



    return (
        <div style={{height: "100%", width: "100%", display: "flex"}}>
            <div style={{width: "50%"}}>
                <ElementTreeView
                    key={"addTree"}
                    tree={tree}
                    onClick={(element) => {
                        addElement(selectedList, element, setSelectedList)
                    }}>
                </ElementTreeView>
            </div>

            <ElementListView  elementLists={selectedList}></ElementListView>
        </div>
    )
}

function addElement(list: ElementList[], element: Element, setList: React.Dispatch<React.SetStateAction<ElementList[]>>) {

    for (let el of list) {
        // if categories match
        if (element.categoryCode?.startsWith(el._category.code)) {
            el._elements.push(element);
            break;
        }
    }
    setList(list);

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
        node = currentNode?.addChild(new ElementList(parent, elements));
        let children = await getCategoryChildren(cop, parent.code);
        await treeHelper(cop, children, node)
    }

    return node;
}