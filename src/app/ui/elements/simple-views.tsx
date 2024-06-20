import {Category, Selectable, Element} from "@/app/lib/definitions";
import React from "react";
import {Button} from "react-bootstrap";

export function CategoryView({category, children}: {category?: Category, children?: string}) {
    return (
        <div style={{height: "100%", width: "100%", display: "flex"}}>
            <div style={{width: "12%", textAlign: "center"}}> {category?.code} </div>
            <div className="vr" style={{marginRight: "20px", marginLeft: "6px"}}></div>
            <div style={{alignSelf: "center"}}> {category?.name} </div>
            <div style={{width: "9.7%", alignSelf: "center", marginLeft: "auto", textAlign: "center"}}>{children}</div>
        </div>
    )
}

export function ElementView({elementSelect, comp}: {elementSelect: Selectable<Element>, comp?: React.ReactNode}) {
    return (
        <div style={{height: "100%", width: "100%", display: "flex"}}>
            <div style={{
                width: "12%",
                alignSelf: "center",
                textAlign: "center",
            }}> {elementSelect._item.code} </div>
            {<div className="vr" style={{marginRight: "10px", marginLeft: "10px"}}></div>}
            <div style={{width: "75%", alignSelf: "center"}}> {elementSelect._item.name} </div>
            <div style={{width: "20%", alignSelf: "center", height: "100%", display: "flex", marginLeft: "auto"}}>
                <div style={{
                    width: "15%",
                    marginLeft: "auto",
                    marginRight: "10px",
                    alignSelf: "center",
                    textAlign: "center"
                }}> {elementSelect._item.difficulty} </div>
                {/* Button with passed function */}
                {comp ? <div style={{width: "85%", marginLeft: "auto", textAlign: "center"}}>
                    {comp}
                </div>: <></>}


            </div>
        </div>
    )
}