export const getRequestStatus = (status: number) => {
    switch(status) {
        case 0:
            return 'Новый'
        case 1: 
            return 'Выполнено'
        case 2: 
            return 'Отклонено'
    }
}

export const getRequestStatusBadgeColor = (status: number) => {
    switch(status) {
        case 0:
            return '#FFFACD'
        case 1: 
            return '#D4EDDA'
        case 2: 
            return '#F8D7DA'
    }
}