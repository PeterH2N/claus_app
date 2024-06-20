'use client'
import {Category, Element, ElementList, Tree, Node, Selectable} from "@/app/lib/definitions";
import "bootstrap/dist/css/bootstrap.min.css"
import React, {ReactNode, useState} from "react";
import {Accordion, AccordionHeader, AccordionItem, Button, ListGroupItem} from "react-bootstrap";
import {ListGroup} from "react-bootstrap";
import {CategoryView, ElementView} from "@/app/ui/elements/simple-views";


export default function ElementTreeView({tree, onPress}: {tree: Tree<ElementList>, onPress?: (elementSelect: Selectable<Element>, id: string) => void,}): JSX.Element {

    function getDisabled(code: string): boolean {
        for (let child of tree._root.children) {
            if (code.startsWith(child.data!._category.code))
                return child.data!._disabled;
        }
        return false;
    }

    return (
        <TreeView node={tree._root.children} func={onPress} getDisabled={getDisabled} ></TreeView>
    );


}

function TreeView({node, func, getDisabled}: {node: Node<ElementList>[], func?: (elementSelect: Selectable<Element>, id: string) => void, getDisabled: (code: string) => boolean}): React.JSX.Element {

    return (
        <Accordion flush>
            {node.map(child => {
                return (
                    <Accordion.Item  key={'acc'+child.data?._category?.code} eventKey={child.data?._category?.code ? child.data?._category?.code : ""}>
                        <div className={"bg-primary"}>
                            <Accordion.Header>
                                <CategoryView category={child.data?._category}></CategoryView>
                            </Accordion.Header>
                        </div>
                        <Accordion.Body style={{paddingTop: "0", paddingBottom: "0"}}>
                            <ListGroup variant={"flush"}>
                                {child.data?._elements.map((elementSelect: Selectable<Element>) => {
                                    return (
                                        <ListGroupItem key={'acc'+elementSelect._item.code} disabled={elementSelect.selected || getDisabled(elementSelect._item.categoryCode!)}>
                                            <ElementView elementSelect={elementSelect}
                                                         comp={
                                                            func ?
                                                             <Button style={{width: "65px", textAlign: "center"}} disabled={elementSelect.selected || getDisabled(elementSelect._item.categoryCode!)} variant={"outline-success"}
                                                                     onClick={() => func? func(elementSelect, child.data!._category!.code.toString()) : {}}>
                                                                 {elementSelect.selected ? "Added" : "Add"}
                                                             </Button> : <></>}>
                                            </ElementView>
                                        </ListGroupItem>
                                    )
                                })}
                            </ListGroup>
                            <TreeView node={child.children} func={func} getDisabled={getDisabled}></TreeView>
                        </Accordion.Body>
                    </Accordion.Item>
                )
            })}

        </Accordion>
    )
}





