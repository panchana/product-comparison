import { pathOr, find } from 'ramda';
import { useMemo } from 'react';
import { removeAccents } from '../utils/utils';
import style from './product.css';

const ProductImage = ({ productList }: any) => {
  const selectedItems = useMemo<string[]>(() => {
    return productList.map((product: any) => {
      return pathOr({}, ['selectedItem'], product);
    });
  }, [productList]);

  return (
    <>
      {selectedItems.map((items, index) => {
        const image = pathOr<any>('', ['images', 0, 'imageUrl'], items)
        return (
        <img key={image+index} src={image} className={style.imageProductPage}/>
      )})}
    </>
  );
};

const ProductName = ({ productList }: any) => {
  const names = useMemo<string[]>(() => {
    return productList.map((product: any) => {
      return pathOr('', ['selectedItem', 'name'], product);
    });
  }, [productList]);

  return (
    <>
      {names.map((name, index) => (
        <div className={style.nameProductPage} key={name+index}>{name}</div>
      ))}
    </>
  );
};

const ProductPrice = ({ productList }: any) => {
  const prices = useMemo<any[]>(() => {
    return productList.map((product: any) => {
      return pathOr('', ['selectedItem', 'sellers', 0, 'commertialOffer', 'Price'], product);
    });
  }, [productList]);

  return (
    <>
      {prices.map((price, index) => (
        <div className={style.imageProductPriceBook} key={'price'+ index}>Reservar con ${price.toLocaleString('es-CO')}</div>
      ))}
    </>
  );
};

const ProductTotalPrice = ({ productList }: any) => {
  const prices = useMemo<any[]>(() => {
    return productList.map((product: any) => {
      const r = find((a: any) => a?.name === 'Precio desde')(pathOr([], ['product', 'properties'], product));
      return pathOr(null, ['values', 0], r);
    });
  }, [productList]);

  return (
    <>
      {prices.map((price, index) => (
        <div className={style.imageProductTotalPrice} key={'total-price'+index} >{price.toLocaleString('es-CO')}</div>
      ))}
    </>
  );
};

const ProductVariation = ({ productList }: any) => {
  const variations = useMemo<any[]>(() => {
    return productList.map((product: any) => {
      let va = {};
      pathOr([], ['product', 'items'], product).map(i => {
        const variations = pathOr([], ['variations'], i);
        const image = pathOr('', ['images', 0, 'imageUrl'], i);
        variations.map(v => {
          const val = pathOr('', ['values', 0], v);
          const a = {
            ...v,
            values: val,
            image
          };
          va[v?.name] ? va[v?.name].push(a) : (va[v?.name] = [a]);
        });
      });
      return va;
    });
  }, [productList]);
  return (
    <>
      {variations.map(variation => {
        const keys = Object.keys(variation);
        const values: any[] = Object.values(variation);
        return (
          <div className={style.variationContainer}>
            {keys.map((k, i) => {
              return (
                <div>
                  <div className={style.titleVariationPage}>{k}</div>
                  <div>
                    {values[i].map((v: any) => (
                      <img className={style.imageVariationPage} src={v?.image} alt={v?.values} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const ProductSpecification = ({ productList, speficationOrder }: any) => {
  const Specification = useMemo(() => {
    return productList.map((product: any) => {
      return pathOr([], ['product', 'specificationGroups'], product);
    });
  }, [productList]);

  const Specifications = useMemo(() => {
    return Specification.map((s: any) => {
      return speficationOrder.map((so: any) => {
        return (
          find((a: any) => removeAccents(a?.name) == removeAccents(so?.name))(s) || {
            name: so?.name,
            originalName: so?.name,
            specifications: []
          }
        );
      });
    });
  }, [Specification, speficationOrder]);

  const ordered = useMemo(() => {
    return speficationOrder.map((s: any) => {
      const res = Specifications.map((sp: any) => {
        const x = find((a: any) => removeAccents(a?.name) === removeAccents(s?.name))(sp) || [];
        return s?.spefications.map((l: any) => {
          return (
            find((a: any) => removeAccents(a?.name) === removeAccents(l?.name))(x?.specifications) || {
              name: l?.name,
              originalName: l?.name,
              values: [null]
            }
          );
        });
      });

      return {
        title: s?.name,
        specifications: res
      };
    });
  }, [Specifications, speficationOrder]);

  return (
    <>
      {ordered.map((o: any, i: number) => {
        const specifications = pathOr([], ['specifications'], o);
        const values = pathOr([], [0], specifications);
        let specficationName = new Array(specifications.length).fill('');
        specficationName[0] = pathOr('', [i, 'name'], speficationOrder);
        return (
          <>
            {specficationName.map(s => <div className={style.SpecificationContainerTitle}>{s}</div>)}
            {values.map((v, i) => {
              let sName = new Array(specifications.length).fill('');
              sName[0] = v?.name
              return <>
              {sName.map(s => <div className={style.nameSpecification}>{s}</div>)}
              {specifications.map(s => {
                const element = pathOr(null, [i, 'values', 0], s);
                return (
                  <div className={style.SpecificationContainer}>
                    <div className={style.valueSpecification}>{element}</div>
                  </div>
                );
              })}
              </>
            })}
          </>
        );
      })}
    </>
  );
};

const ProductLinks = ({ productList }: any) => {
  
    const Links = useMemo<any[]>(() => {
      return productList.map((product: any) => {
        return pathOr([], ['product', 'link'], product)
      });
    }, [productList]);

    return (
      <>
        {Links.map((link, index) => {
          return <div className={style.buttonsLinksPage} key={link+index}>
              <a href={link}>Reservar</a>
              <a href={link}>Detalles y planes</a>
          </div>
        })}
      </>
    );
  };

export default {
  ProductImage,
  ProductName,
  ProductPrice,
  ProductTotalPrice,
  ProductVariation,
  ProductSpecification,
  ProductLinks
};
