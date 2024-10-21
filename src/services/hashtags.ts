import IhashTag from "../types/hashtag"
import intansce from "./intansce"

export const GetAllHashtag = () => {
    return intansce.get('/hashtags')
}

export const GetOneHashtag = (_id: string) => {
    return intansce.get('/hashtags/' + _id)
}

export const CreateHashtag = (data: IhashTag) => {
    return intansce.post(`/hashtags`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });

}

export const UpdateHashtag = (data: IhashTag) => {
    return intansce.put(`/hashtags/${data._id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}

export const RemoveHashtag = (_id: string) => {
        return intansce.delete(`/hashtags/${_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
}