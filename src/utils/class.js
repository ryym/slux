
/**
 * Bind 'this' of specified methods to the 'context'.
 */
export const bindMethodContext = (context, methodNames) => {
  methodNames.forEach(name => {
    context[name] = context[name].bind(context);
  });
};
