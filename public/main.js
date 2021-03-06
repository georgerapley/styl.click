(function () {
    'use strict';
  
    var serverBasePath = "https://stylclick.glitch.me";
    var defaultSeedProduct = '9503873';
    var numberOfProductsToShow = 5;
    var similarityAlgorithm = 'YMAL_mf_anyCat_noBr';

    var showCompletion = true;
    var repeatProducts = false;

    var localApi = new localProxyApi(serverBasePath);
    var currentApi = localApi;
    
    // MAKES D3.js TREE/CONTAINER RESPONSIVE
    window.onresize = function () {
        dndTree.resizeOverlay();
        var height = $(window).height();
        $('#rightpane').height(height * 1.5);
    };

    $('#rightpane').height($(window).height());
    
    // INITIALISES D3.js CONTAINER
    function qs(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
          results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));}

    function stripTrailingSlash(str) {
        if (str.substr(-1) == '/') {return str.substr(0, str.length - 1);}
        return str;}
  
    function initContainer() {
        var initProductId = stripTrailingSlash(qs('product_id'))
        if (initProductId) {
            currentApi.getProduct(initProductId).then(initRootWithProduct);
        } else {
            currentApi.getProduct(defaultSeedProduct).then(initRootWithProduct);
        }
    }

    initContainer();
    
    // ALGORITHM SELECTOR
    /* checks the radio button with default similarityAlgorithm (set at start of script) */
    $('input:radio[name="algo"]').filter('[value=' + similarityAlgorithm + ']').attr('checked', true);

    /* Updates the similarityAlgorithm variable when user selects different radio button */
    function setSimilarityAlgorithm() {
        similarityAlgorithm = $('input[name=algo]:checked').val();
    };
  
    // REPEAT PRODUCTS SELECTOR
    function setRepeatProducts() {
        if (document.getElementById('repeatProducts').checked) {
            repeatProducts = true;
        } else {
            repeatProducts = false;
        }
    }
  
    // MANUAL TEXT/KEYWORD SEARCH
    var formProduct = document.getElementById('search-product');
    formProduct.addEventListener('submit', function (e) {
        showCompletion = false;
        e.preventDefault();
        var search = document.getElementById('product-search');
        currentApi.productSearch(
            search.value.trim(), {'limit': 50}
        ).then(function (data) {
          
          // if have any search result
          if (data.product.itemCount > 0) {
            var topSearchResult = data.product.products[0].id
            currentApi.getProduct(topSearchResult).then(initRootWithProduct);
          }
          else {
            // PLACEHOLDER TO DISPLAY NO-RESULTS MESSAGE
            return false;
          }

        });
    });

    function initRootWithProduct(product) {
      // if/else handles if ASOS Product API responds with an empty array
      if (product.product.length > 0) {
        _getInfo(product);
        dndTree.setRoot(product);
      }
      else {
        alert("ASOS API Error 😢") 
        return;
      }
    }

    function initRootWithData(data) {
        dndTree.setRootData(data);
        $('#product-search').val('');
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    var getInfoTimeoutid;

    function getInfo(product) {
        getInfoTimeoutid = window.setTimeout(function () {
            _getInfo(product);
            $('#rightpane').animate({
                scrollTop: '0px'
            });
        }, 20);
    }

    function getInfoCancel(product) {
        window.clearTimeout(getInfoTimeoutid);
    }

    var productInfoModel = function () {
        var self = this;

        self.productName = ko.observable();
        self.isProductInfoVisible = ko.observable(true);
        self.asosPdpLink = ko.observable();
        self.errorMessage = ko.observable();
        self.productImg = ko.observable();
        self.productPrice = ko.observable();
        self.prevProductPrice = ko.observable();

        var localAccessToken = getAccessTokenLocal();

        /* REDUDANCIES IN HERE */
        if (localAccessToken && localAccessToken !== '') {
            self.isLoggedIn = ko.observable(true);
            self.userId = ko.observable(localStorage.getItem('ae_userid', ''));
            self.displayName = ko.observable(localStorage.getItem('ae_display_name', ''));
            self.userImage = ko.observable(localStorage.getItem('ae_user_image', ''));
            //spotifyWebApi.setAccessToken(localStorage.getItem('ae_token', ''));

        } else {
            self.isLoggedIn = ko.observable(false);
            self.userId = ko.observable();
            self.displayName = ko.observable();
            self.userImage = ko.observable();

        }
    }

    var productInfoModel = new productInfoModel()

    ko.applyBindings(productInfoModel, document.getElementById('mainn'));

    function _getInfo(product) {
        $('#hoverwarning').css('display', 'none');
        $('#prevProductPrice').hide();
        $('#productPrice').css("color", "#2e2f33");

        productInfoModel.isProductInfoVisible(true);

        /* this if/else deals with different JSON structure of initially loaded product vs. related products */
        if (product && product.product) {
            productInfoModel.productName(product.product[0].name);
            productInfoModel.asosPdpLink("http://www.asos.com/prd/" + product.product[0].id);
            productInfoModel.productImg(getSuitableImage(product.product[0].images));
            productInfoModel.productPrice(product.product[0].price.current.text);

            /* get price before discount */
            if (product.product[0].price.isMarkedDown) {
                productInfoModel.prevProductPrice(String("£" + product.product[0].price.previous.value.toFixed(2)));
            } else {
                productInfoModel.prevProductPrice(String("£" + Math.max(product.product[0].price.xrp.value, product.product[0].price.rrp.value).toFixed(2)));
            }

            /* if discounted, show discounted price & make current price red */
            if (product.product[0].price.isMarkedDown || product.product[0].price.isOutletPrice) {
                $('#prevProductPrice').show();
                $('#productPrice').css("color", "#D01345");
            }
        } else {
            productInfoModel.productName(product.name);
            productInfoModel.asosPdpLink("http://www.asos.com/prd/" + product.id);
            productInfoModel.productImg(getSuitableImage(product.images));
            productInfoModel.productPrice(product.price.current.text);

            /* get price before discount */
            if (product.price.isMarkedDown) {
                productInfoModel.prevProductPrice(String("£" + product.price.previous.value.toFixed(2)));
            } else {
                productInfoModel.prevProductPrice(String("£" + Math.max(product.price.xrp.value, product.price.rrp.value).toFixed(2)));
            }

            /* if discounted, show discounted price & make current price red */
            if (product.price.isMarkedDown || product.price.isOutletPrice) {
                $('#prevProductPrice').show();
                $('#productPrice').css("color", "#D01345");
            }
        }
    }

    /* get related products */
    function getRelated(productId, excludeList) {

        return new Promise(function (resolve, reject) {

            /* MAP ENDPOINT TO SELECTED RADIO BUTTON */
            var algoToEndpointDict = {
                "YMAL_mf_sameCat": currentApi.getSimilar_YMAL_mf_sameCat,
                "YMAL_mf_sameCat_noBr": currentApi.getSimilar_YMAL_mf_sameCat_noBr,
                "YMAL_mf_anyCat_noBr": currentApi.getSimilar_YMAL_mf_anyCat_noBr
            }

            return algoToEndpointDict[similarityAlgorithm](productId)
                .then(function (data) {

                    data.product.recommendations.sort(function (a, b) {
                        return b.score - a.score;
                    });

                    if (!repeatProducts) {
                        data.products = data.product.recommendations.filter(function (product) {
                            return excludeList.indexOf(product.id) === -1;
                        });
                    } else {
                        data.products = data.product.recommendations
                    }

                    resolve(data.products.slice(0, numberOfProductsToShow));
                });
        });
    }

    function getIdFromProductUri(productUri) {
        return productUri.split(':').pop();
    }

    function changeNumberOfProducts(value) {
        numberOfProductsToShow = value;
        document.getElementById('range-indicator').innerHTML = value;
    }

    /* SEARCH AUTO-COMPLETE */
    function createAutoCompleteDiv(product) {
        if (!product) {
          return;
        }
        var val = '<div class="autocomplete-item">' +
            '<div class="product-icon-container">' +
            '<div class="product-label" value="' + product.label + '">' + product.label + '</div>' +
            '</div>' +
            '</div>';
        return val;
    }

    var unavailCountryMessageSet = false;

    /*
    function setUnavailCountryErrorMessage() {
        var msg = 'Oops, seems like ASOS is not available in your country yet';
        if (unavailCountryMessageSet) {
            return;
        }
        var message = '<div class="alert alert-danger alert-error">' +
            msg +
            '</div>';
        $('#rightpane').prepend(message);
        unavailCountryMessageSet = true;
    }
    */

    /* SEARCH */
    $(function () {
        $('#product-search')
            // don't navigate away from the field on tab when selecting an item
            .bind('keydown', function (event) {
                showCompletion = true;
                if (event.keyCode === $.ui.keyCode.TAB &&
                    $(this).autocomplete('instance').menu.active) {
                    event.preventDefault();
                }
            })
            .autocomplete({
                minLength: 2, // minimum number of characters to send to API
                source: function (request, response) {
                    currentApi.searchAutocomplete(request.term, {'limit': 50})
                      .then(function (data) {
                        if (data.product && data.product.suggestionGroups[0].suggestions.length > 0) {
                            var res = [];
                            data.product.suggestionGroups[0].suggestions.forEach(function (item) {
                                res.push(item.searchTerm);
                            });
                            if (showCompletion) {
                                response(res);
                            } else {
                                response(["No results found"]);
                            }
                        }
                    }, function (err) {
                        if (err.status == 400) {
                            console.log("Autocomplete API 400 error :-(")
                            return;
                        }
                    });
                },
                focus: function () {
                    // prevent value inserted on focus
                    return false;
                },
          
                // when user selects one of autocomplete results:
                select: function (event, ui) {
                  
                  $('#product-search').val(ui.item.searchTerm);
                  
                  var searchTerm = ui.item.value
                  
                  ga("send", "pageview", "/search/?q=" + searchTerm);
                  
                  // Do local search API request
                  currentApi.productSearch(searchTerm, {'limit': 50
                    }).then(function (data) {
                    
                    var topSearchResult = data.product.products[0].id
                    
                    // seed tree with 1st search result
                    currentApi.getProduct(topSearchResult).then(initRootWithProduct);
          
                    })
                }
            })
            .autocomplete('instance')._renderItem = function (ul, item) {
                if (!item) {
                    return;
                }
                return $('<li></li>')
                    .data('item.autocomplete', item)
                    .append(createAutoCompleteDiv(item))
                    .appendTo(ul);
            };

    });
  
    function getSuitableImage(images) {
        var minSize = 64;

        if (images.length === 0) {
            return 'img/asos.jpeg';
        }
        /*
                images.forEach(function (image) {
                    if (image && image.width > minSize && image.width > 64 ) {
                        return image.url;
                    }
                });
        */
        return "https://" + images[0].url;
    }

    var currentLink;

    function getAccessTokenLocal() {
        var expires = 0 + localStorage.getItem('ae_expires', '0');
        if ((new Date()).getTime() > expires) {
            return '';
        }
        return localStorage.getItem('ae_token', '');
    }

    var errorBoxModel = function () {
        var self = this;
        self.errorMessage = ko.observable();
    }

    function login() {
        return new Promise(function (resolve, reject) {
            OAuthManager.obtainToken({
                scopes: [
                    'playlist-read-private',
                    'playlist-modify-public',
                    'playlist-modify-private'
                ]
            }).then(function (token) {
                resolve(onTokenReceived(token));
            }).catch(function (error) {
                console.error(error);
            });
        });
    }

    function getDisplayName(str) {
        var maxDisplayLength = 11;
        if (str.length < maxDisplayLength) {
            return str;
        }

        var spaceIndex = str.indexOf(' ');
        if (spaceIndex != -1 && spaceIndex < maxDisplayLength) {
            return str.substr(0, spaceIndex);
        }
        return str.substr(0, maxDisplayLength);
    }

    function onTokenReceived(accessToken) {
        return new Promise(function (resolve, reject) {
            productInfoModel.isLoggedIn(true);
            spotifyWebApi.setAccessToken(accessToken);
            localStorage.setItem('ae_token', accessToken);
            localStorage.setItem('ae_expires', (new Date()).getTime() + 3600 * 1000); // 1 hour
            spotifyWebApi.getMe().then(function (data) {
                productInfoModel.userId(data.id);
                productInfoModel.displayName(getDisplayName(data.display_name));
                productInfoModel.userImage(data.images[0].url);
                localStorage.setItem('ae_userid', data.id);
                localStorage.setItem('ae_display_name', data.display_name);
                localStorage.setItem('ae_user_image', data.images[0].url);
                currentApi = spotifyWebApi;
            });

        });
    }


    /* CHANGE THIS TO "SHARING" MODAL */
    function createPlaylistModal() {
        if (!productInfoModel.isLoggedIn()) {
            errorBoxModel.errorMessage("Please log in first");
            $('#error-modal').modal('show');
        } else {
            $('#createPlaylistModal').modal('show');
        }

    }

    /* prettify range bar */
    $('input[type="range"]').change(function () {
        var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));

        $(this).css('background-image',
            '-webkit-gradient(linear, left top, right top, ' +
            'color-stop(' + val + ', #fff), ' +
            'color-stop(' + val + ', #fff)' +
            ')'
        );
    });

    function logout() {
        productInfoModel.isLoggedIn(false);
        productInfoModel.userId("");
        productInfoModel.displayName("");
        productInfoModel.userImage("");
        localStorage.clear();
        savedTracks = [];
        currentApi = localApi;
    }


    window.AE = {
        getSuitableImage: getSuitableImage,
        getRelated: getRelated,
        getInfoCancel: getInfoCancel,
        getInfo: getInfo,
        changeNumberOfProducts: changeNumberOfProducts,
        setRepeatProducts: setRepeatProducts,
        setSimilarityAlgorithm: setSimilarityAlgorithm,
        toTitleCase: toTitleCase,
        productInfoModel: productInfoModel,
        login: login,
        logout: logout
    };
})();