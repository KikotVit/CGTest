export type RequestCategories = 'Repair' | 'Cleaning' | 'Other'

export type Request = {
    id: string,
    photoUrl: string,
    description: string,
    selectedCategory: RequestCategories,
    hasProposal?: boolean,
}

export type Proposal = {
    price: number,
    deadline: string,
    comment: string,
}