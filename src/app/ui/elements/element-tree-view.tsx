'use client'
import {Category, Element, ElementList, Tree, Node} from "@/app/lib/definitions";
import "bootstrap/dist/css/bootstrap.min.css"
import React, {ReactNode, useState} from "react";
import {Accordion, AccordionHeader, AccordionItem, Button, ListGroupItem} from "react-bootstrap";
import {ListGroup} from "react-bootstrap";


export default function ElementTreeView({tree, onClick}: {tree: Tree<ElementList>, onClick?: (element: Element) => void,}): JSX.Element {

    return (
        <TreeView nodes={tree._root.children} func={onClick} ></TreeView>
    );
}

function TreeView({nodes, func}: {nodes: Node<ElementList>[], func?: (element: Element) => void}): React.JSX.Element {
    return (
        <Accordion flush>
                {nodes.map(child => {
                    return (
                        <Accordion.Item key={'acc'+child.data?._category?.code} eventKey={child.data?._category?.code ? child.data?._category?.code : ""} >
                            <Accordion.Header>
                                    <div style={{height: "100%", width: "100%", display: "flex"}}>
                                        <b style={{width: "40px", textAlign: "center"}}> {child.data?._category?.code} </b>
                                        <div className="vr" style={{marginRight: "20px", marginLeft: "10px"}}></div>
                                        <label > {child.data?._category?.name} </label>
                                    </div>
                            </Accordion.Header>
                                <Accordion.Body style={{paddingTop: "2px", paddingBottom: "2px"}}>
                                    <ListGroup variant={"flush"}>
                                        {child.data?._elements.map((element: Element) => {
                                            return (
                                                <ListGroupItem key={'acc'+element.code}>
                                                    <div style={{height: "100%", width: "100%", display: "flex"}}>
                                                        <b style={{width: "60px", textAlign: "center"}}> {element.code} </b>
                                                        <div className="vr" style={{marginRight: "20px", marginLeft: "10px"}}></div>
                                                        <label > {element.name} </label>
                                                        <div style={{marginLeft: "auto", height: "100%"}}>
                                                            <label style={{marginLeft: "auto", marginRight: "20px"}}> {element.difficulty} </label>
                                                            {/* Button with passed function */}
                                                            {
                                                                func ?
                                                                <Button onClick={() => func(element)}>
                                                                Add
                                                                </Button>
                                                                : <></>
                                                            }


                                                        </div>
                                                    </div>
                                                </ListGroupItem>
                                            )
                                        })}
                                    </ListGroup>
                                    <TreeView nodes={child.children} func={func}></TreeView>
                                </Accordion.Body>
                        </Accordion.Item>
                    )
                })}

        </Accordion>
    )
}



