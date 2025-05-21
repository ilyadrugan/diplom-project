export const getUserStatusName = (status: string) => {
    switch(status) {
        case 'M':
            return 'master'
        case 'W': 
            return 'worker'
    }
}

export const getUserStatusRuName = (status: string) => {
    switch(status) {
        case 'M':
            return 'Администратор'
        case 'W': 
            return 'Расклейщик'
    }
}
