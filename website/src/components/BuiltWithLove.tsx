import React from 'react';
import styles from './BuiltWithLove.module.css';

export default function BuiltWithLove(): JSX.Element {
  return (
    <div className={styles.builtWithLove}>
      Built with <span className={styles.heart}>♥</span> by AWS
    </div>
  );
}
