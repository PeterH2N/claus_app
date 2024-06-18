import ElementTreeView from "@/app/ui/elements/element-tree-view";
import {Element, ElementList} from "@/app/lib/definitions";
import {Button} from "react-bootstrap";
import React from "react";
import {getParentCategories} from "@/app/services/element-service";
import AddElementsToPlan from "@/app/ui/elements/add-elements-to-plan";
export default function Page() {

    const cop = "Liga 2024"



    return (
        <div>
            <AddElementsToPlan cop={cop}></AddElementsToPlan>
        </div>

    );
}


