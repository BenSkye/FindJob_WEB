import _ from 'lodash'
import { Types } from 'mongoose'

const getInfoData = ({ fields = [], object = {} }: { fields: string[], object: Record<string, any> }) => {
    return _.pick(object, fields)
}

const convertObjectId = (id: string) => {
    new Types.ObjectId(id);
}

const getSelectData = (fields: string[]) => {
    return fields.join(' ')
}

const getUnSelectData = (fields: string[]) => {
    return fields.map(field => `-${field}`).join(' ')
}

const generateOrderCode = (): number => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return parseInt(`${timestamp}${random.toString().padStart(3, '0')}`);
}

export { getInfoData, convertObjectId, getSelectData, getUnSelectData, generateOrderCode }