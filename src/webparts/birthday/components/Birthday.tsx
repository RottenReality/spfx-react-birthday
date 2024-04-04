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

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "noviembre", "Diciembre"]

const Birthday: React.FC<IBirthdayProps> =(props)=> {
  const [elements, setElements] = useState<IFormattedItem[]>([]);

  const filterElements = async (users: IFormattedItem[]): Promise<void> => {
    try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        console.log("test: ", currentMonth)
  
        const formattedUsers: IFormattedItem[] = users.map((user) => {
          const formattedMonthNumber:number = parseInt(user.Date.slice(5, 7))
          const formattedDayNumber:number = parseInt(user.Date.slice(8, 10))
          const formattedMonthName:string = monthNames[formattedMonthNumber - 1]
          return { ...user, MonthNumber: formattedMonthNumber, Day:formattedDayNumber, MonthName: formattedMonthName};
        });
        
  
      if (currentMonth === 12) {
        const happyUsers:IFormattedItem[] = formattedUsers.filter(user => user.MonthNumber === currentMonth || user.MonthNumber === 1)
        setElements(happyUsers)
      } else {
        const happyUsers:IFormattedItem[] = formattedUsers.filter(user => user.MonthNumber === currentMonth || user.MonthNumber === currentMonth+1)
        setElements(happyUsers)
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const getElements = async (context: WebPartContext): Promise<void> => {
    try {
      const sp = spfi().using(SPFx(context));
      const items: IFormattedItem[] = await sp.web.lists.getById(props.listGuid).items.select("Date", "User/EMail", "User/Name", "User/Title", "User/ID").expand("User")();
      filterElements(items).catch(error=>console.log(error))
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if(props.listGuid && props.listGuid !== ''){
      getElements(props.context)
      .catch((error) => {
        console.log(error);
      });
    }
  }, [props]);

  return (
    <section>
      {elements.map((item) => (
        <div key={item.ID}>
          <h2 className={styles.mainText}>{item.User.Title}</h2>
          <p>{item.MonthName}</p>
          <p>{item.Day}</p>
        </div>
      ))}
    </section>
  );
}

export default Birthday
