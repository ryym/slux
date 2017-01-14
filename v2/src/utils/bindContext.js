export default function bindContext(context, methods) {
  methods.forEach(name => {
    context[name] = context[name].bind(context);
  });
}
