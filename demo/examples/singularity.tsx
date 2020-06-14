import React, { useCallback, useState } from 'react';
import { singularity } from '../utils';

const $value = singularity(() => '');

export const SingularityApp = () => {
  const [id, setId] = useState('xyz');

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  }, []);

  return (
    <div>
      id: {id}
      <div>
        <input onChange={onChange} value={id} />
      </div>
      <hr />
      <Component id={id} />
      <hr />
      <Dump />
    </div>
  );
};

export const Component = ({ id }: { id: string }) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      $value.set(id, () => e.target.value);
    },
    [id],
  );

  const value = $value.use(id);

  return (
    <div>
      value for {id}: "{value}"
      <div>
        <input onChange={onChange} value={value} />
      </div>
    </div>
  );
};

export const Dump = () => {
  const [dump, setDump] = useState({});

  const onClick = () => {
    setDump($value.dump());
  };

  return (
    <div>
      <button onClick={onClick}>Dump</button>
      <div style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(dump, undefined, 2)}</div>
    </div>
  );
};
