'use client'
import {Category, ElementList, Element} from "@/app/lib/definitions";
import React, {useEffect, useState} from "react";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {getParentCategories} from "@/app/services/element-service";

export default function ElementListView({elementLists}: {elementLists: ElementList[]}) {
    console.log(elementLists);
    const [test, setTest] = useState(elementLists);

    useEffect(() => {
        setTest(elementLists)
    }, [elementLists]);

    return (
        <ListGroup>
            {test.map((list) => {
                return (
                    <ListGroupItem key={'list'+list._category.code}>
                        {list._category.code}
                        <ListGroup>
                            {list._elements.map((element) => {
                                return (
                                    <ListGroupItem key={'list'+element.code}>
                                        {element.name}
                                    </ListGroupItem>
                                )
                            })}
                        </ListGroup>

                    </ListGroupItem>
                )
            })}


        </ListGroup>
    )
}