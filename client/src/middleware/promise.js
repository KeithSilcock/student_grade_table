
export default store => next => async action => {
    console.log('here', action);

    if(!action.payload || !action.payload.then){
        return next(action);
    }

    const resp = await action.payload;

    const newAction = {
        ...action,
        payload: resp,
    };
    store.dispatch(newAction);

    return action.payload;

}




// export default store => next => action =>{
//     console.log(action);
//
//     if(!action.payload || !action.payload.then){
//         return next(action);
//     }
//
//     action.payload.then( resp => {
//         const newAction = {
//             ...action,
//             payload: resp,
//         };
//         store.dispatch(newAction);
//     });
//
//     return action.payload;
//
// }