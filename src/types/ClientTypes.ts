type baseClientType = {
    firstname: string,
    lastname: string,
    companyName: string,
    email?: string | null,
    phoneNumber?: string | null,
    businessPhone?: string | null,
    mobilePhone?: string | null,
    address?: string | null
};

type baseInvoiceType = {
    description: string,
    rate: number,
    quantity: number,
    lineTotal?: number,
    dueDate: Date,
    totalOutstanding?: number,
    notes?: string | null | undefined;
    terms?: string | null | undefined;
}

type clientType = baseClientType & {
    id?: number
};

type invoiceType = baseInvoiceType & {
    id?: number
}

export {
    clientType,
    invoiceType
};
