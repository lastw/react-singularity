export type Listener<T> = (value: T) => void;

export type Subscription<T> = {
  notify: Listener<T>;
  subscribe: (fn: Listener<T>) => () => void;
};

export const subscription = <T>(): Subscription<T> => {
  type Node = { prev?: Node; next?: Node; fn: Listener<T> };

  let first: Node | undefined = undefined;
  let last: Node | undefined = undefined;

  return {
    notify(value: T) {
      let curr = first;

      while (curr) {
        curr.fn(value);
        curr = curr.next;
      }
    },

    subscribe(fn: Listener<T>) {
      const node: Node = { fn };

      if (!first || !last) {
        first = node;
        last = node;
      } else {
        last.next = node;
        node.prev = last;
        last = node;
      }

      return () => {
        if (node.prev && node.next) {
          node.prev.next = node.next;
          node.next.prev = node.prev;
        } else if (node.prev) {
          last = node.prev;
          last.next = undefined;
        } else if (node.next) {
          first = node.next;
          first.prev = undefined;
        } else {
          first = undefined;
          last = undefined;
        }
      };
    },
  };
};
