import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface SendEventProps {
  [key: string]: any;
  name: string;
  data?: any;
}

export type CustomFilter = (value: any, index?: number) => boolean;

interface Window {
  pageInformation: object;
}

declare var window: Window;

const subject = new BehaviorSubject<SendEventProps>({} as any);

const event = {
  sendEvent: (info: SendEventProps, key?: string) => {
    if (key) window.pageInformation[key] = info;
    subject.next(info);
  },
  getEvent: (name?: string, customFilter?: CustomFilter): Observable<SendEventProps> => {
    return name || customFilter
      ? subject.pipe<SendEventProps>(customFilter ? filter(customFilter) : filter(e => e.name === name))
      : subject.asObservable();
  }
};

export default event;
