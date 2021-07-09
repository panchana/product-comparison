import { Fragment, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import Event from '../../rx-event';
import {
  EventKeyPreview,
  StorageKeyPreview,
  EventKeyPreviewRemove
} from '../utils/keys';
import { findIndex, pathOr } from 'ramda';
import Style from './style.css';
import SliderLayout from 'vtex.slider-layout/SliderLayout';
import FlexLayout from 'vtex.flex-layout/FlexLayout';
import { Icon } from 'vtex.store-icons';

interface IProduct {
  images: {
    imageUrl: string;
  }[];
  itemId: string;
  link: string;
  name: string;
  nameComplete: string;
  sellers: {
    commertialOffer: {
      AvailableQuantity: number;
      ListPrice: number;
      Price: number;
    };
  }[];
}

interface ComparisionPreviewProps {
  showComponent: boolean;
  page: string;
}

const ComparisionPreview = ({ showComponent, page }: ComparisionPreviewProps) => {
  const [productList, setProductList] = useState<IProduct[]>([]);

  let eventSubscribe: Subscription;

  const onHandleSubscribe = (key: string, value: any, id: any, condition: any[]) => {
    let elements = JSON.parse(localStorage.getItem(key) || '[]');
    const finded = (f: IProduct) => pathOr('', condition, f) === id;
    const index = findIndex(finded)(elements);
    if (index === -1) {
      elements.push(value);
    } else {
      elements.splice(index, 1);
    }
    localStorage.setItem(key, JSON.stringify(elements));
    return elements;
  };

  useEffect(() => {
    const EventFunction = (e: any) => {
      const elements = onHandleSubscribe(StorageKeyPreview, e.data, e.data?.selectedItem?.itemId, [
        'selectedItem',
        'itemId'
      ]);
      setProductList(elements);
    };
    eventSubscribe = Event.getEvent(EventKeyPreview).subscribe(EventFunction);
    return () => {
      eventSubscribe && eventSubscribe.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (window) {
      const elements = JSON.parse(localStorage.getItem(StorageKeyPreview) || '[]');
      setProductList(elements);
    }
  }, []);

  const onRemove = (element: any) => {
    Event.sendEvent({ name: EventKeyPreview, data: element });
    Event.sendEvent({ name: EventKeyPreviewRemove, data: element });
  };

  if (!showComponent) return <Fragment />;

  return (
    <div className={Style.previewContainer}>
      <FlexLayout preventHorizontalStretch={true}>
        <div className={Style.previewProductList}>
          <SliderLayout itemsPerPage={{ desktop: 3, tablet: 1, phone: 1 }} showPaginationDots="never">
            {productList.map(p => {
              const image = pathOr('', ['selectedItem', 'images', 0, 'imageUrl'], p);
              const price = pathOr<any>('', ['selectedItem', 'sellers', 0, 'commertialOffer', 'Price'], p);
              const name = pathOr<any>('', ['product', 'productName'], p);
              const link = pathOr<any>('', ['product', 'link'], p);
              return (
                <div className={Style.previewContainerItem}>
                  <div className={Style.previewRemoveItem} onClick={() => onRemove(p)}>
                    <Icon id="sti-close--line" size={20} />
                  </div>
                  <a href={link} className={Style.previewLink}>
                    <img className={Style.previewImage} src={image} alt={name} />
                  </a>
                  <div className={Style.previewContainerDescription}>
                    <div className={Style.previewContainerName}>{name}</div>
                    <div className={Style.previewContainerPrice}>
                      Reservar con {price.toLocaleString('es-CO')}
                    </div>
                  </div>
                </div>
              );
            })}
          </SliderLayout>
        </div>

        {productList && productList.length ? (
          <a className={Style.previewContainerButton} href={page}>
            Comparar
          </a>
        ) : (
          <Fragment />
        )}
      </FlexLayout>
    </div>
  );
};

ComparisionPreview.defaultProps = {
  showComponent: true,
  page: '/'
};

ComparisionPreview.schema = {
  title: 'Preview Comparision',
  type: 'object',
  properties: {
    showComponent: {
      title: 'Mostrar componente',
      type: 'boolean',
      default: true
    },
    page: {
      title: 'url',
      type: 'string',
      default: '/'
    }
  }
};

export default ComparisionPreview;
