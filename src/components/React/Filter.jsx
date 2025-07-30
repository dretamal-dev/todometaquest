import { useState, useEffect, useRef} from 'react';


function Filter({target}) {

    const [filter, setFilter] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [parent, setParent] = useState(null);
    const [dataDom, setDataDom] = useState(null);
    const debounceTimeout = useRef(null);

    function getDataDomByPrefix(selector, dataPrefix) {
        
        const element = document.querySelector(selector);
        const plainText = element.innerHTML;

        if (!element) return [];
        const regex = new RegExp(`${dataPrefix}[^=]*="([^"]*)"`, 'g');
        const matches = [];
        let match;
        while ((match = regex.exec(plainText)) !== null) {
            matches.push(match[0]);
        }

        const result = matches.map(str => {
            const eqIndex = str.indexOf('=');
            const dataAttr = str.substring(0, eqIndex);
            let value = str.substring(eqIndex + 2, str.length - 1); // remove =" and ending "
            // Si value contiene ',', lo convertimos en array
            if (value.includes(',')) {
            value = value.split(',').map(v => v.trim());
            }
            // Remove prefix and split by '-'
            const suffix = dataAttr.replace(dataPrefix, '');
            const [type, group, ...rest] = suffix.split('-');
            return {
            dataAttr,
            value,
            type,
            group,
            rest: rest.join('-')
            };
        });

        // Agrupar por type y luego por group, juntando los valores de los mismos groups
        const groupedByType = result.reduce((acc, item) => {
            if (!item.type) return acc; // omitir si no hay type
            if (!acc[item.type]) acc[item.type] = {};
            // Para 'search', no usar 'default', poner los valores directamente en acc[item.type]
            if (item.type === 'search') {
            const values = Array.isArray(item.value) ? item.value : [item.value];
            acc[item.type] = acc[item.type].concat(values);
            } else {
            const groupKey = item.group || 'default';
            if (!acc[item.type][groupKey]) acc[item.type][groupKey] = [];
            const values = Array.isArray(item.value) ? item.value : [item.value];
            values.forEach(val => {
                if (val && !acc[item.type][groupKey].includes(val)) {
                acc[item.type][groupKey].push(val);
                }
            });
            }
            return acc;
        }, { search: [] });

        console.log('getDataDomByPrefix', groupedByType);

        return groupedByType;
    }

    useEffect(() => {
        let parentAux = document.querySelector(target);
        setParent(parentAux);

        if (parentAux) {
            let dataDomAux = getDataDomByPrefix(target, 'data-jsfilter-');
            setDataDom(dataDomAux);
        }
        setInitialized(true);
    }, []);
    
    useEffect(() => {
        if (initialized && parent) {
                const items = Array.from(parent.querySelectorAll('*')).filter(el =>
                    Array.from(el.attributes).some(attr => attr.name.startsWith('data-jsfilter-'))
                );
                
                items.forEach(item => {
                    let visible = true;

                    // Filtro de búsqueda
                    if (filter?.search && filter.search.trim() !== '') {
                        const attr = item.getAttribute('data-jsfilter-search');
                        if (!attr || !attr.toLowerCase().includes(filter.search.toLowerCase())) {
                            visible = false;
                        }
                    }

                    // // Filtros de select
                    Object.keys(filter || {}).forEach(key => {
                        if (key.startsWith('select-')) {
                            const group = key.replace('select-', '');
                            const value = filter[key];
                            if (value && value !== '') {
                                const attr = item.getAttribute(`data-jsfilter-select-${group}`);
                                // Mostrar solo si el atributo existe y coincide el valor
                                if (!attr || attr !== value) {
                                    visible = false;
                                }
                            }
                        }
                    });

                    Object.keys(filter || {}).forEach(key => {
                        if (key.startsWith('check-')) {
                            const group = key.replace('check-', '');
                            const values = filter[key];
                            if (values && values.length > 0) {
                                const attr = item.getAttribute(`data-jsfilter-check-${group}`);
                                // El atributo puede tener varias tags separadas por coma
                                const attrValues = attr ? attr.split(',').map(v => v.trim()) : [];
                                // Mostrar solo si TODOS los valores seleccionados están en attrValues
                                if (
                                    !attr ||
                                    ![].concat(values).every(val => attrValues.includes(val))
                                ) {
                                    visible = false;
                                }
                            }
                        }
                    });

                    item.style.display = visible ? '' : 'none';

                });
            
        }
    }, [filter]);
    
   
    function formularioModificado(e) {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            const form = e.target.form || e.target.closest('form');
            const formData = new FormData(form);
            const values = {};
            for (let [key, value] of formData.entries()) {
                if (key.endsWith('[]')) {
                    const cleanKey = key.replace('[]', '');
                    if (!values[cleanKey]) values[cleanKey] = [];
                    values[cleanKey].push(value);
                } else {
                    values[key] = value;
                }
            }
            setFilter(values);

            if (form) {
              const rect = form.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              window.scrollTo({
                top: rect.top + scrollTop - 20,
                behavior: 'smooth'
              });
            }

        }, 300);
    }

    const [checkedState, setCheckedState] = useState({});

    function handleCheckboxChange(e, group, option) {
      setCheckedState(prev => {
        const groupState = prev[group] || {};
        return {
          ...prev,
          [group]: {
            ...groupState,
            [option]: e.target.checked
          }
        };
      });
      formularioModificado(e);
    }

    return (
      <>
        {dataDom && 
          <form
            onChange={(e) => {
              // Solo llamar formularioModificado si no es checkbox
              if (e.target.type !== "checkbox") {
                formularioModificado(e);
              }
            }}
          >
            {dataDom.search && dataDom.search.length > 0 && (
              <div className="shadow-2xl flex items-center bg-gray-900/80 p-4 rounded-md max-w-xl mx-auto mb-6">
                <span className="text-pink-700">&gt;</span>
                <input
                  className=" text-white p-0.5 outline-none ml-2 w-full"
                  name="search"
                  type="text"
                  placeholder="Buscar..."
                />
              </div>
            )}
            
            {dataDom.select &&
              Object.entries(dataDom.select).map(([group, options], idx) => (
                <select key={group} name={`select-${group}`} defaultValue="">
                  <option value="">Selecciona...</option>
                  {options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              ))
            }

            {dataDom.check &&
              Object.entries(dataDom.check).map(([group, options]) => (
                <div key={group} className='flex items-center justify-center mb-6 gap-2'>
                  {options.map((option, idx) => {
                    const checked = checkedState[group]?.[option] || false;
                    return (
                      <label
                        key={idx}
                        className={`px-2 py-1 border border-pink-700 rounded-md bg-gray-900/80 text-white cursor-pointer ${checked ? 'bg-pink-700/40 text-black' : ''}`}
                      >
                        <input
                          type="checkbox"
                          value={option}
                          name={`check-${group}[]`}
                          checked={checked}
                          onChange={e => handleCheckboxChange(e, group, option)}
                          style={{ display: 'none' }}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              ))
            }

          </form>
        }
      </>
    );
}

export default Filter;