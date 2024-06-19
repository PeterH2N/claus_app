export type Element = {
    code?: string;
    name?: string;
    description?: string;
    difficulty?: number;
    categoryCode?: string;
    copID?: number;

}

export type Category = {
    code: string;
    name?: string;
    description?: string;
    parentCode?: string;
    copID?: number;
}

export type ElementRequirement = {
    categoryCode?: string;
    amount?: number;
    copID?: number;
}

export class ItemSelect<T> {
    readonly _item: T;
    selected: boolean = false;
    constructor(item: T) {
        this._item = item;
    }
}

export class ElementList {
    _disabled: boolean = false;
    readonly _category: Category;
    readonly _elements: ItemSelect<Element>[];

    constructor(category: Category, elements: ItemSelect<Element>[]) {
        this._elements = elements;
        this._category = category;
    }

    set disabled(disabled: boolean) {
        this._disabled = disabled;
    }
}

export class Tree<T> {
    readonly _root: Node<T>;

    constructor(root?: Node<T>) {
        root ?
            this._root = root
            :
            this._root = new Node<T>();
    }

}

export class Node<T> {
    private _data?: T;
    private _parent?: Node<T>;
    private _children: Node<T>[] = new Array<Node<T>>();

    addChild(childData: T): Node<T> {
        let child = new Node<T>();
        child._parent = this;
        child._data = childData;
        this._children.push(child);
        return child;
    }

    get data(): T | undefined {
        return this._data;
    }

    get parent(): Node<T> | undefined {
        return this._parent;
    }

    get children(): Node<T>[] {
        return this._children;
    }
}