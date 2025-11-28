import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import BuiltWithLove from '../components/BuiltWithLove';

export default function Layout(props) {
  return (
    <OriginalLayout {...props}>
      {props.children}
      <BuiltWithLove />
    </OriginalLayout>
  );
}
