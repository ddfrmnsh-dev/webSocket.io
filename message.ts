import moment from 'moment'

interface Message {
    username : string;
    text: string;
    time: string;
}
function formatMessage(username: string, text: string): Message {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

export default {
    formatMessage
}
