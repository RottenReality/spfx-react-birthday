import * as React from 'react';
import styles from './Birthday.module.scss';
import type { IBirthdayProps } from './IBirthdayProps';
import { useState, useEffect } from 'react';
import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/fields";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IFormattedItem {
  ID: number;
  Date: string;
  MonthNumber: number;
  MonthName: string;
  Day: number;
  User: {
    Title: string;
    EMail: string
  }
}

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
const colors = [styles.dayBackground1, styles.dayBackground2, styles.dayBackground3, styles.dayBackground4]
const currentMonth = new Date().getMonth() + 1;
let listValid = false;
const Birthday: React.FC<IBirthdayProps> = (props) => {
  const [elements, setElements] = useState<IFormattedItem[]>([]);
  const sectionRef = React.useRef<HTMLElement>(null);
  const filterElements = async (users: IFormattedItem[]): Promise<void> => {
    try {

      const formattedUsers: IFormattedItem[] = users.map((user) => {
        const formattedMonthNumber: number = parseInt(user.Date.slice(5, 7))
        const formattedDayNumber: number = parseInt(user.Date.slice(8, 10))
        const formattedMonthName: string = monthNames[formattedMonthNumber - 1]
        return { ...user, MonthNumber: formattedMonthNumber, Day: formattedDayNumber, MonthName: formattedMonthName };
      });
      listValid = true;
      if (currentMonth === 12) {
        const happyUsers: IFormattedItem[] = formattedUsers.filter(user => user.MonthNumber === currentMonth || user.MonthNumber === 1)
        setElements(happyUsers)
      } else {
        const happyUsers: IFormattedItem[] = formattedUsers.filter(user => user.MonthNumber === currentMonth || user.MonthNumber === currentMonth + 1)
        setElements(happyUsers)
      }
    } catch (error) {
      listValid = false;

      console.log(error);
    }
  };

  const getElements = async (context: WebPartContext): Promise<void> => {
    try {
      listValid = false;
      const sp = spfi().using(SPFx(context));
      const items: IFormattedItem[] = await sp.web.lists.getById(props.listGuid).items
        .select("Date", "User/EMail", "User/Name", "User/Title", "User/ID")
        .orderBy("Date", true).expand("User")();
      filterElements(items).catch(error => console.log(error))
    } catch (error) {
      listValid = false;
      setElements([]);
      console.log(error);
    }
  };


  useEffect(() => {
    if (props.listGuid && props.listGuid !== '') {
      getElements(props.context)
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props]);
  const width = sectionRef.current ? sectionRef.current.offsetWidth : null;



  return (
    <div>

      {(!listValid) &&
        <Placeholder
          iconName='BirthdayCake'
          iconText='Configure your webpart'
          description='Select a birthday list with a "user" and "date" column to display its items rendered'
          buttonLabel='Choose a List'
          onConfigure={props.onConfigure}
        />

      }
      {listValid &&
        <section ref={sectionRef}>
          <div className={`${styles.table} ${styles.container}`}>
            <div>
              <img className={`${styles.image}`} src={require('../assets/images/cumpleizq.png')} alt="" />
            </div>
            <div style={{ width: '52%' }}>
              <h2 className={`${styles.title} ${width && width <= 600 ? styles.titleSmall : ''}`}> CUMPLEAÑOS DEL MES</h2>

              <div className={`${styles.table}`}>
                <div>
                  <span className={`${styles.month}  ${width && width <= 600 ? styles.monthSmall : ''}`}> {monthNames[currentMonth - 1]}:</span>
                  <div className={`${styles.birthdayListContainer}`}>
                    {elements.filter(item => item.MonthNumber == currentMonth).map((item) => (
                      <div className={`${styles.dayContainer}`} key={item.ID}>
                        <span className={`${styles.day} ${colors[item.Day % 4]}`}>{item.Day} </span>  <span className={`${styles.mainText}  ${width && width <= 600 ? styles.mainTextSmall : ''}`}>{item.User.Title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className={`${styles.month}  ${width && width <= 600 ? styles.monthSmall : ''}`}> {monthNames[currentMonth]}:</span>
                  <div className={`${styles.birthdayListContainer}`}>
                    {elements.filter(item => item.MonthNumber == currentMonth + 1).map((item) => (
                      <div className={`${styles.dayContainer} `} key={item.ID}>
                        <span className={`${styles.day} ${colors[item.Day % 4]}`}>{item.Day} </span>  <span className={`${styles.mainText}  ${width && width <= 600 ? styles.mainTextSmall : ''}`}>{item.User.Title}</span>
                      </div>

                    ))}
                  </div>

                </div>
              </div>
            </div>

            <div>
              <img className={`${styles.image}`} src={require('../assets/images/cumpleder.png')} alt="" />
            </div>
          </div>
        </section>
      }
    </div>
  );
}

export default Birthday
