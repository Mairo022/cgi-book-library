export interface IBook {
    id: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    added: string;
    checkOutCount: number;
    status: IBookStatus;
    dueDate: string;
    comment: string;
}

export type IBookStatus =
    'AVAILABLE'
    | 'BORROWED'
    | 'RETURNED'
    | 'DAMAGED'
    | 'PROCESSING';

export interface IBookEditDialogue {
    book: IBook
    setShowEditDialogue: (state: boolean) => void
}