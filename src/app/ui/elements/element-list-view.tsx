'use client'
import {Category, ElementList, Element, ItemSelect, ElementRequirement} from "@/app/lib/definitions";
import React, {useEffect, useState} from "react";
import {Button, ListGroup, ListGroupItem} from "react-bootstrap";
import {getParentCategories} from "@/app/services/element-service";
import {CategoryView, ElementView} from "@/app/ui/elements/simple-views";
import {Requirement} from "@/app/ui/elements/add-elements-to-plan";

export default function ElementListView({elementLists, reqs, onPress}: {elementLists: ElementList[], reqs?: Requirement[], onPress: (elementSelect: ItemSelect<Element>) => void}) {

    return (
        <ListGroup variant={"flush"}>
            {elementLists.map((list, index) => {
                return (
                    <>
                        <ListGroupItem className={"list-group-item-primary"} key={'list'+list._category.code}>
                            <CategoryView category={list._category}>
                                {/*requirements*/}
                                {
                                    reqs?.[index].amountSelected != reqs?.[index].elReq.amount! ?
                                    reqs?.[index].amountSelected.toString() + " / " +
                                    reqs?.[index].elReq.amount?.toString() : "✓"
                                }
                            </CategoryView>
                        </ListGroupItem>
                        {list._elements.map((elementSelect) => {
                            return (
                                <ListGroupItem key={'list'+elementSelect._item.code}>
                                    <ElementView elementSelect={elementSelect} comp={
                                        <Button disabled={elementSelect.selected} variant={"outline-danger"}
                                                onClick = {() => onPress(elementSelect)}>
                                            —
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