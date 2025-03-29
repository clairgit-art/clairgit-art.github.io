(function(d, t, e, m, undef){
    var version = "1.1.1";
    var author = "Vova Feldman";

    window.RW_Async_Init = function()
    {
        var all_types = {
            'blog-post': {
                rclass: 'blog-post',
                selector: ['.hentry'],
                target: [
                    {selector: '.post-meta', insert: 'before'},
                    {selector: '.comment-share-like', insert: 'before'},
                    {selector: '.first.meta-row', insert: 'before'},
                    {selector: '.article-meta', insert: 'prepend'},
                    {selector: '.meta', insert: 'prepend'},
                    {selector: '.entry-content', insert: 'append'}
                ],
                single: function (elements)
                {
                    return RW._is(Static.SQUARESPACE_CONTEXT.item);
                },
                getters: {
                    single: {
                        urid: function (element)
                        {
                            return Static.SQUARESPACE_CONTEXT.item.id;
                        },
                        title: function (element)
                        {
                            return Static.SQUARESPACE_CONTEXT.item.title;
                        },
                        url: function (element)
                        {
                            return 'http://' + RW.getDomain() + '/' + Static.SQUARESPACE_CONTEXT.item.fullUrl;
                        },
                        img: function (element)
                        {
                            // Extract image from og:image meta.
                            var og_image = RW._getFirstByAttr('property', 'og:image', '', 'meta', document.head);
                            
                            return RW._is(og_image) ? og_image.getAttribute('content') : null;
                        }
                    },
                    loop: {
                        urid: function (element)
                        {
                            if (!RW._is(element.id))
                                return null;
                            
                            var id = element.id.split('-');
                            return (2 === id.length) ? id[1] : null;
                        },
                        title: function (element)
                        {
                            var title = RW._getFirstByClassName('title', '*', element);
                            
                            if (!RW._is(title))
                                return null;
                            
                            if (title.innerHTML.contains('</'))
                                title = title.children[0];
                                
                            return title.innerHTML;
                        },
                        url: function (element)
                        {
                            var title = RW._getFirstByClassName('title', '*', element);

                            if (!RW._is(title))
                                return null;
                            
                            var a = RW._getFirstByTagName('a', title);
                            
                            return RW._is(a) ? 'http://' + RW.getDomain() + a.getAttribute('href') : null;
                        },
                        img: function (element)
                        {
                            var social_buttons = RW._getFirstByClassName('squarespace-social-buttons', '*', element);
                            
                            return RW._is(social_buttons) ? social_buttons.getAttribute('data-asset-url') : null;
                        }
                    }
                }
            },
            comment: {
                rclass: 'comment',
                fingerprint: ['.comment-list', '.comments-wrapper'],
                trials: 5,
                selector: ['.comment'],
                target: [
                    {selector: '.comment-body', insert: 'append'}
                ],
                getters: {
                    loop: {
                        urid: function (element)
                        {
                            if (!RW._is(element.id))
                                return null;
                            
                            var id = element.id.split('-');
                            return (2 === id.length) ? id[1] : null;
                        },
                        title: function (element)
                        {
                            var title = RW._getFirstByClassName('comment-body', '*', element);
                            
                            if (!RW._is(title))
                                return null;
                            
                            if (title.innerHTML.contains('</'))
                                title = title.children[0];
                                
                            return title.innerHTML;
                        },
                        url: function (element)
                        {
                            return 'http://' + RW.getDomain() + '/' + Static.SQUARESPACE_CONTEXT.item.fullUrl;
                        },
                        img: function (element)
                        {
                            // Extract image from og:image meta.
                            var og_image = RW._getFirstByAttr('property', 'og:image', '', 'meta', document.head);
                            
                            return RW._is(og_image) ? og_image.getAttribute('content') : null;
                        }
                    }
                }
            },
            product: {
                rclass: 'product',
                selector: ['.hentry.product'],
                target: [
                    {selector: '#productDetails .product-title', insert: 'after'},
                    {selector: '.product-title', insert: 'after'}
                ],
                single: function (elements)
                {
                    return RW._is(Static.SQUARESPACE_CONTEXT.item);
                },
                getters: {
                    single: {
                        urid: function (element)
                        {
                            return Static.SQUARESPACE_CONTEXT.item.id;
                        },
                        title: function (element)
                        {
                            return Static.SQUARESPACE_CONTEXT.item.title;
                        },
                        url: function (element)
                        {
                            return Static.SQUARESPACE_CONTEXT.item.fullUrl;
                        },
                        img: function (element)
                        {
                            // Extract image from og:image meta.
                            var og_image = RW._getFirstByAttr('property', 'og:image', '', 'meta', document.head);
                            
                            return RW._is(og_image) ? og_image.getAttribute('content') : null;
                        }
                    },
                    loop: {
                        urid: function (element)
                        {
                            return Static.SQUARESPACE_CONTEXT.item.id;
                        },
                        title: function (element)
                        {
                            return Static.SQUARESPACE_CONTEXT.item.title;
                        },
                        url: function (element)
                        {
                            return Static.SQUARESPACE_CONTEXT.item.fullUrl;
                        },
                        img: function (element)
                        {
                            return '';
                        }
                    }
                }
            }
        };

        var platform = {
            title: 'squarespace',
        };
        
        if (window._rwsc)
        {
            platform.types = {};
            
            // Add ratings only to specified types.
            for (var type in window._rwsc)
                platform.types[type] = all_types[type];
        }
        else
        {
            // Add ratings to all types.
            platform.types = all_types;
        }
        
        RW.Platform = function(options)
        {
            var
                _hasItems = false,
                _unprocessedTypes = {},
                _getCanonicalUrl = function ()
                {
                    // Extract image from og:image meta.
                    var canonical = RW._getFirstByAttr('rel', 'canonical', '', 'link', document.head);
                    return RW._is(canonical) ? canonical.getAttribute('href') : false;
                },
                _createRating = function (rating, rclass)
                {
                    var r = document.createElement('div');
                    rclass = rclass || 'blog-post';
                    RW._Class.set(r, 'rw-ui-' + options.title + '-container');
                    r.innerHTML = '<div class=\"rw-ui-container rw-class-' + rclass + '\" data-urid=\"' + rating.urid + '\"></div>';
                    
                    return r;
                },
                _insertRatingContainer = function (o, element, data)
                {
                    // Try to find explicit rating container.
                    var 
                        insert = 'before',
                        container = RW._getFirstByClassName('rw-rating-container', '*', element);
                    
                    if (!RW._is(container))
                    {
                        for (var i = 0, len_i = o.target.length; i < len_i; i++)
                        {
                            container = RW._getFirst(o.target[i].selector, element);
                            
                            if (RW._is(container))
                            {
                                insert = o.target[i].insert;
                                break;
                            }
                        }
                    }
                    
                    if (!RW._is(container))
                    {
                        console.warn('Couldn\'t find target container for ' + o.rclass + ' (ID: ' + data.urid + '). Please contact support via http://rating-widget.com/contact/?platform=squarespace');
                        return;
                    }
                    
                    var rating = _createRating(data, o.rclass);
                    switch (insert)
                    {
                        case 'append':
                            container.appendChild(rating);
                            break;
                        case 'prepend':
                            RW.prependChild(container, rating);
                            break;
                        case 'after':
                            RW.insertAfter(rating, container);
                            break;
                        case 'before':
                        default:
                            RW.insertBefore(rating, container);
                            break;
                    }
                    
                },
                _insertRatings = function (o)
                {
                    var data,
                        property,
                        canonical = (RW._is(o.single) && o.single(o.elements)) ? _getCanonicalUrl() : false,
                        getters =  (RW._is(o.single) && o.single(o.elements)) ? o.getters.single : o.getters.loop;
                    
                    // Init specified type's ratings data.
                    o.data = [];
                    
                    RW._foreach(o.elements, function(e)
                    {
                        // Init element's data.
                        data = {};
                        
                        for (var g in getters)
                        {
                            property = getters[g](e);
                            
                            if (RW._is(property))
                                data[g] = property;
                        }
                        
                        // Verify rating ID found.
                        if (!RW._is(data.urid))
                            return;
                        
                        if (false !== canonical)
                            data.url = canonical;
                        
                        _insertRatingContainer(o, e, data);
                        
                        o.data.push(data);
                    });
                    
                    return o.data;
                },
                _findFirstElements = function (selectors)
                {
                    var elements;
                    
                    // Try to find elements.
                    for (var i = 0, len = selectors.length; i < len; i++)
                    {
                        elements = RW._get(selectors[i]);
                        
                        if (RW._isNotEmptyArray(elements))
                            return elements;
                    }
                    
                    return null;
                },
                // Return FALSE only if (found type's fingerprint || requested to ignore fingerpirnt check) but couldn't find any elements of the type.
                _initType = function (type, ignore_fingerprint)
                {
                    // Try to find type's elements.
                    var elements = _findFirstElements(options.types[type].selector);

                    if (null == elements)
                    {
                        if (!RW._is(options.types[type].fingerprint))
                            // No items and no fingerprint selectors set.
                            return true;
                        
                        if (true === ignore_fingerprint)
                            return false;

                        // Check if type's fingerprint is in the HTML.
                        var fingerprint = _findFirstElements(options.types[type].fingerprint);
                        
                        if (null == fingerprint)
                            // No fingerprint found in the page.
                            return true;
                            
                        // Found fingerprint element but no items.
                        return false;
                    }
                    
                    // Assign elements to type.
                    options.types[type].elements = elements;
                    
                    _insertRatings(options.types[type]);
                    
                    _hasItems = true;
                    
                    return true;
                },
                _init = function ()
                {
                    options = options || {};

                    //for (var type in options.types)
                    //    _unprocessedTypes.push(type);
                        
                    for (var type in options.types)
                    {
                        if (false === _initType(type))
                            _unprocessedTypes[type] = true;
                    }
                };

            /* Init
            -----------------------------------------------------------------------------*/
            _init();
            
            return {
                ready : function ()
                {
                    var ready = true,
                        processed;
                    
                    for (var type in _unprocessedTypes)
                    {
                        if (_unprocessedTypes.hasOwnProperty(type))
                        {
                            // Try to process type
                            processed = _initType(type);
                            
                            if (processed || 0 === options.types[type].trials)
                                // Type was successfully processed or number of
                                // trials to process the type are over.
                                delete _unprocessedTypes[type];
                            else
                            {
                                // Failed to process type.
                                ready = false;
                                options.types[type].trials--;
                            }
                        }
                    }
                    
                    return ready;
                },
                hasItems : function (type)
                {
                    if (!RW._is(type))
                        return _hasItems;
                        
                    return RW._is(options.types[type]) && RW._is(options.types[type].elements) && (0 < options.types[type].elements.length);
                },
                containerHAlign : function (labelAlign)
                {
                    switch (labelAlign)
                    {
                        case 'left':
                            return 'right';
                        case 'center':
                            return 'center';
                        default:
                            return 'left';
                    }
                },
                initRatings : function ()
                {
                    for (var type in options.types)
                    {
                        if (!RW._is(options.types[type].data))
                            continue;
                        
                        for (var i = 0, len = options.types[type].data.length; i < len; i++)
                            RW.initRating(options.types[type].data[i].urid, options.types[type].data[i]);
                    }
                }
            };
        }(platform);
        

        // Init global settings.
        RW.init.apply(RW, _rws);
        var render = function (){
            if (RW.Platform.hasItems())
            {
                if (!RW.Platform.ready())
                {
                    setTimeout(render, 200);
                    return;
                }
                    
                RW.Platform.initRatings();
            }
            
            if (window._rwsc)
            {
                for (var type in window._rwsc)
                {
                    //if (RW.Platform.hasItems(type))
                        RW.initClass(type, _rwsc[type]);
                }
            }

            RW.render(function(ratings){
                // Add alignment.
                for (var urid in ratings)
                {
                    var elements = RW._getByClassName('rw-urid-' + urid, 'div');
                    
                    RW._foreach(elements, function (e){
                        RW._Class.add(e.parentNode, 'rw-' + RW.Platform.containerHAlign(ratings[urid].getInstances(0).options.advanced.layout.align.hor));
                    });
                }
            });
        };
        
        render();
    };
    
    // Append Rating-Widget JavaScript library.
    var rw, s = d.getElementsByTagName(e)[0], id = "rw-js",
        l = d.location, ck = "Y" + t.getFullYear() + 
        "M" + t.getMonth() + "D" + t.getDate(), p = l.protocol,
        f = (-1 < l.search.indexOf("DBG=") ? "" : ".min"),
        a = ("https:" == p ? "secure." + m + "js/" : "js." + m);
    if (d.getElementById(id)) return;              
    rw = d.createElement(e);
    rw.id = id; rw.async = true; rw.type = "text/javascript";
    rw.src = p + "//" + a + "external" + f + ".js?ck=" + ck;
    s.parentNode.insertBefore(rw, s);
}(document, new Date(), "script", "rating-widget.com/"));