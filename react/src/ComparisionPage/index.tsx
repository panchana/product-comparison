import { useEffect, useState, useMemo } from 'react';
import { StorageKeyPreview, EventKeyPreview, EventKeyPreviewRemove } from '../utils/keys';
import Style from './style.css';
import Product from '../product';
import { useRuntime } from 'vtex.render-runtime';
import { Icon } from 'vtex.store-icons';
import Event from '../../rx-event';

const ComparisionPage = (props: any) => {
  const RuntimeContex = useRuntime();
  const currentViews = useMemo(() => (RuntimeContex?.deviceInfo?.isMobile ? 1 : 3), [RuntimeContex]);
  const [productList, setProductList] = useState<any[]>([]);
  const count = useMemo(() => productList.length, [productList]);
  const [margin, setMargin] = useState(0);
  const [viewed, setViewed] = useState(currentViews);

  useEffect(() => {
    if (window) {
      const elements = JSON.parse(localStorage.getItem(StorageKeyPreview) || '[]');
      if (elements) {
        setProductList(elements.filter((e: any) => e?.product));
      }
    }
  }, []);

  const onChangeNext = () => {
    if (viewed < count) {
      setMargin(margin - 100 / currentViews);
      setViewed(viewed + 1);
    }
  };

  const onChangePrev = () => {
    if (viewed > currentViews) {
      setMargin(margin + 100 / currentViews);
      setViewed(viewed - 1);
    }
  };

  const onRemove = (element: any) => {
    Event.sendEvent({ name: EventKeyPreview, data: element });
    Event.sendEvent({ name: EventKeyPreviewRemove, data: element });
  };

  return (
    <>
      <div>
        {count > currentViews && (
          <div onClick={onChangePrev} className={Style.comparisionArrowFixLeft}>
            <Icon id="nav-thin-caret--left" />
          </div>
        )}
        <div className={Style.comparisionPageCustomSlide}>
          <div
            className={Style.comparisionPage}
            style={{
              gridTemplateColumns: `repeat(${count}, 1fr)`,
              width: `${(count / currentViews) * 100}%`,
              marginLeft: `${margin}%`
            }}
          >
            <Product.ProductImage productList={productList} onRemove={onRemove}/>
            <Product.ProductName productList={productList} />
            <Product.ProductPrice productList={productList} />
            <Product.ProductTotalPrice productList={productList} />
            <Product.ProductLinks productList={productList} />
            <Product.ProductVariation productList={productList} />
            <Product.ProductSpecification
              productList={productList}
              speficationOrder={props?.speficationOrder}
            />
          </div>
        </div>
        <div className={Style.comparisionOtherContainer}>
          <a className={Style.comparisionOther} href="/">Comparar otras versiones</a>
        </div>

        {count > currentViews && (
          <div onClick={onChangeNext} className={Style.comparisionArrowFixRigth}>
            <Icon id="nav-thin-caret--right" />
          </div>
        )}
      </div>
    </>
  );
};

ComparisionPage.defaultProps = {
  speficationOrder: [
    {
      name: 'ESPECIFICACIONES',
      spefications: [
        { name: 'Año modelo' },
        { name: 'Marca' },
        { name: 'Motorización' },
        { name: 'Tipo de carrocería' },
        { name: 'Versión' }
      ]
    },
    {
      name: 'EXTERIOR',
      spefications: [{ name: 'Dimensiones y Peso' }, { name: 'Equipamiento Exterior' }, { name: 'Ruedas' }]
    },
    {
      name: 'INTERIOR',
      spefications: [{ name: 'Equipamiento interior' }, { name: 'Moldura interior' }, { name: 'Tapicería' }]
    },
    { name: 'OFERTAS', spefications: [{ name: 'Precio desde' }] },
    {
      name: 'TECNOLOGÍA',
      spefications: [
        { name: 'Asistencias' },
        { name: 'Motor Combustión' },
        { name: 'Tracción' },
        { name: 'Transmisión' }
      ]
    },
    {
      name: 'SEGURIDAD',
      spefications: [{ name: 'Seguridad Activa' }, { name: 'Seguridad Pasiva' }]
    },
    {
      name: 'DESCRIPCIONES ADICIONALES',
      spefications: [{ name: 'Más información' }, { name: 'Ficha Técnica' }, { name: 'Adicionales' }]
    }
  ],
  itemsPerPage: {
    dekstop: 3
  }
};

export default ComparisionPage;
