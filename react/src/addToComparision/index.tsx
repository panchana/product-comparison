import { useEffect, useState } from 'react';
import Event from '../../rx-event';
import useProduct from 'vtex.product-context/useProduct';
import { EventKeyPreview, StorageKeyPreview, EventKeyPreviewRemove } from '../utils/keys';
import { findIndex } from 'ramda';
import Style from './style.css';
import classNames from 'classnames';
import { Subscription } from 'rxjs';

const AddToComparision = () => {
    
    const ProductContext = useProduct();
    let eventSubscribe: Subscription;

    const [state,setState] = useState(false);
    const itemId = ProductContext?.selectedItem?.itemId;

    const EventFunction = (e: any) => {
        const itemId = ProductContext?.selectedItem?.itemId
        if (itemId === e?.data?.selectedItem?.itemId) {
            setState(false);
        }
    };

    useEffect(() => {
        eventSubscribe = Event.getEvent(EventKeyPreviewRemove).subscribe(EventFunction);
        return () => {
          eventSubscribe && eventSubscribe.unsubscribe();
        };
      }, [ProductContext]);

    const onCompare = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        setState(!state);
        Event.sendEvent({ name: EventKeyPreview, data: ProductContext })
    }

    useEffect(() => {
        if (window) {
            const elements = JSON.parse(localStorage.getItem(StorageKeyPreview) || '[]');
            const finded = (f:any) => f?.selectedItem?.itemId === itemId;
            const index = findIndex(finded)(elements);
            setState(index !== -1);
        }
    }, []);

    const classes = classNames(Style.addToComparisionCheck, state && Style.active);

    return <div onClick={onCompare} className={Style.addToComparisionContainer}>
                <div className={classes}></div>
                Comparar
            </div>
}

export default AddToComparision;
