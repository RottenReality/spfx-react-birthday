import * as React from 'react';
import styles from './Birthday.module.scss';
import type { IBirthdayProps } from './IBirthdayProps';
//import { escape } from '@microsoft/sp-lodash-subset';

const Birthday: React.FC<IBirthdayProps> =(props)=> {

    return (
      <p className={styles.mainText}>hi</p>
    );
}

export default Birthday
