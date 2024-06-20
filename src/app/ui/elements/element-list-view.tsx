'use client'
import {Category, ElementList, Element, Selectable, ElementRequirement, Tree, Node} from "@/app/lib/definitions";
import React, {useEffect, useState} from "react";
import {Button, ListGroup, ListGroupItem} from "react-bootstrap";
import {getParentCategories} from "@/app/services/element-service";
import {CategoryView, ElementView} from "@/app/ui/elements/simple-views";

export default function ElementListView({elementTree, reqs, onPress}: {elementTree: Tree<ElementList>, reqs?: ElementRequirement[], onPress: (elementSelect: Selectable<Element>) => void}) {

    // construct ElementList[] from tree
    let elementLists: ElementList[] = [];

    for (let node of elementTree._root.children) {
        let el = new ElementList(node.data?._category!, []);
        el._amountSelected = node.data!._amountSelected;
        pushElements(node, el._elements);
        elementLists.push(el);
    }

    // get all elements from node
    function pushElements(node: Node<ElementList>, list: Selectable<Element>[]) {
        // if selected
        for (let element of node.data?._elements!) {
            if (element.selected)
                list.push(element);
        }

        for (let child of node.children) {
            pushElements(child, list);
        }
    }

    return (
        <ListGroup variant={"flush"}>
            {elementLists.map((list, index) => {
                return (
                    <>
                        <ListGroupItem className={"list-group-item-primary"} key={'list'+list._category.code}>
                            <CategoryView category={list._category}>
                                {/*requirements*/}
                                {
                                    list._amountSelected != reqs?.[index].amount! ?
                                    list._amountSelected + " / " +
                                    reqs![index].amount! : "✓"
                                }
                            </CategoryView>
                        </ListGroupItem>
                        {list._elements.map((elementSelect) => {
                            return (
                                <ListGroupItem key={'list'+elementSelect._item.code}>
                                    <ElementView elementSelect={elementSelect} comp={
                                        <Button variant={"outline-danger"}
                                                onClick = {() => onPress(elementSelect)}>
                                            {"—"}
                                        </Button>}>
                                    </ElementView>
                                </ListGroupItem>
                            )
                        })}
                    </>
                )
            })}
        </ListGroup>
    )
}