export default store => next => async action => {
  if (!action.payload || !action.payload.then) {
    return next(action);
  }

  const resp = await action.payload;

  const newAction = {
    ...action,
    payload: resp
  };
  store.dispatch(newAction);

  return action.payload;
};
