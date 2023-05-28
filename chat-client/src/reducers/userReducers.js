const initial_state = {
    user: {},
    contacts:[],
    chat: {},
    chatSelected: false,
    messages: [],
}

const userReducer = (state=initial_state,action) => {
    switch(action.type){
        case 'SET_USER':
            console.log('state has been called')
            return{
                ...state,
                user: action.payload
            };

        case 'SET_CONTACTS':
            return{
                ...state,
                contacts: action.payload
            };

        case 'SET_CHAT':
            return{
                ...state,
                chat: action.payload
            }

        case 'SET_CHATSELECTED':
            return{
                ...state,
                chatSelected: true
            }

        case 'SET_MESSAGES':
            return{
                ...state,
                messages: action.payload
            }

        default:
            return state;
    }
}

export default userReducer;