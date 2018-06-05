import types from './types';

export function incrementCount(count){
    return {
        type: types.INCREMENT_COUNT,
        payload: ++count,
    }
}