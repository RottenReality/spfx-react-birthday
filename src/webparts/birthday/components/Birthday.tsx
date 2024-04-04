import * as React from 'react';
import styles from './Birthday.module.scss';
import type { IBirthdayProps } from './IBirthdayProps';
import { useState,useEffect } from 'react';
import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/fields";
import { WebPartContext } from '@microsoft/sp-webpart-base';
//import { escape } from '@microsoft/sp-lodash-subset'; 

export interface IFormattedItem {
  ID: number;
  Date: string;
  MonthNumber: number;
  MonthName: string;
  Day:number;
  User: {
    Title: string;
    EMail:string
  }
}

const Birthday: React.FC<IBirthdayProps> =(props)=> {

  return (
    <p className={styles.mainText}>hi</p>
  );
}

export default Birthday
