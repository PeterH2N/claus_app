'use client'
import React, {useEffect, useState} from "react";
import {Category, Element, ElementList, ElementRequirement, Selectable, Node, Tree} from "@/app/lib/definitions";
import {
    getCategoryChildren,
    getElementsByCategory,
    getParentCategories,
    getRequirements, makeTree
} from "@/app/services/element-service";
import ElementTreeView from "@/app/ui/elements/element-tree-view";
import ElementListView from "@/app/ui/elements/element-list-view";
import "@/app/globals.css";

//TODO: clean up, make the state a single tree with selected bool, where list is constructed from
export default function AddElementsToPlan({cop}: {cop: string}) {

    // state
    const [tree, setTree] = useState<Tree<ElementList>>({_root: new Node()});
    const [reqList, setReqList] = React.useState<ElementRequirement[]>([]);

    useEffect(() => {
        // make tree
        makeTree(cop).then((tree) => {
            setTree(tree);
        });

        // get requirements
        getRequirements(cop).then((reqs) => {
            setReqList(reqs);
        })

    }, [cop])

    function handleAddElement(elementSelect: Selectable<Element>) {
        // select element
        elementSelect.selected = true;

        // update selected number in ElementList
        tree._root.children.map((child, index) => {
            if (elementSelect._item.categoryCode!.startsWith(child.data!._category.code!)) {
                child.data!._amountSelected++;
                // disable category if we meet reqs
                if (child.data!._amountSelected >= reqList[index].amount!) {
                    child.data!.disabled = true;
                }
                return;
            }
        })

        // update tree
        let tempTree = new Tree<ElementList>(tree._root)
        setTree(tempTree)
    }

    function handleRemoveElement(elementSelect: Selectable<Element>) {
        // deselect element
        elementSelect.selected = false;

        // update selected number in ElementList
        for(let child of tree._root.children) {
            if (elementSelect._item.categoryCode?.startsWith(child.data?._category.code!)) {
                child.data!._amountSelected--;

                // we can be certain that this category's requirements are no longer met
                child.data!.disabled = false;
            }
        }

        // update tree
        let tempTree = new Tree<ElementList>(tree._root)
        setTree(tempTree)
    }

    return (
        <div style={{maxHeight: "800px", width: "100%", display: "flex"}}>
            <div style={{width: "50%", overflowY: "scroll"}}>
                <ElementTreeView
                    key={"addTree"}
                    tree={tree}
                    onPress={(element) => {handleAddElement(element)}}
                    >
                </ElementTreeView>
            </div>

            <div style={{width: "50%", overflowY: "scroll"}}>
                <ElementListView
                    elementTree={tree}
                    onPress={handleRemoveElement}
                    reqs={reqList}>

                </ElementListView>
            </div>
        </div>
    )
}

