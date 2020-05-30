import { subscription } from '../src/subscription';

describe('subscription', () => {
  it('works with one listener', () => {
    const listener = jest.fn();

    const sub = subscription<string>();
    const unsubscribe = sub.subscribe(listener);

    sub.notify('first call value');

    expect(listener).toBeCalledTimes(1);
    expect(listener).toBeCalledWith('first call value');
    listener.mockClear();

    unsubscribe();

    sub.notify('second call value');

    expect(listener).toBeCalledTimes(0);
  });

  it('works with two listeners', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    const sub = subscription<string>();
    const unsubscribe1 = sub.subscribe(listener1);
    const unsubscribe2 = sub.subscribe(listener2);

    sub.notify('first call value');

    expect(listener1).toBeCalledTimes(1);
    expect(listener1).toBeCalledWith('first call value');
    expect(listener2).toBeCalledTimes(1);
    expect(listener2).toBeCalledWith('first call value');
    listener1.mockClear();
    listener2.mockClear();

    unsubscribe1();

    sub.notify('second call value');

    expect(listener1).toBeCalledTimes(0);
    expect(listener2).toBeCalledTimes(1);
    expect(listener2).toBeCalledWith('second call value');

    listener2.mockClear();

    unsubscribe2();

    sub.notify('third call value');

    expect(listener2).toBeCalledTimes(0);
  });
});
