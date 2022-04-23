import React from 'react';


type TestProps = {
  name: string;
}


export default function TestComponent(props: TestProps) {
  return <div>{props.name}</div>;
}
