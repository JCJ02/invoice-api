type baseAdminType = {
    firstname: string,
    lastname: string,
    email: string,
}

type adminType = baseAdminType & {
    id?: number
}

type adminAccountType = baseAdminType & {
    id?: number,
    password: string
}

export {
    baseAdminType,
    adminType,
    adminAccountType
}