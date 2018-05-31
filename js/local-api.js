var localProxyApi = function (serverBasePath) {

  var getSimilar_YMAL_mf_sameCat = function (productId) {
    var url = serverBasePath + '/asos/similar/' + productId + '/ymal_mf_sameCat';
    return $.ajax({
      url: url
    })
  };

  var getSimilar_YMAL_mf_sameCat_noBr = function (productId) {
    var url = serverBasePath + '/asos/similar/' + productId + '/ymal_mf_sameCat_noBr';
    return $.ajax({
      url: url
    })
  };

  var getSimilar_YMAL_mf_anyCat_noBr = function (productId) {
    var url = serverBasePath + '/asos/similar/' + productId + '/ymal_mf_anyCat_noBr';
    return $.ajax({
      url: url
    })
  };

  var getSimilar_OOSA_v2b = function (productId) {
    var url = serverBasePath + '/asos/similar/' + productId + '/OOSA_v2b';
    return $.ajax({
      url: url
    })
  };

  var getSimilar_complementaryItems_mf = function (productId) {
    var url = serverBasePath + '/asos/similar/' + productId + '/complementaryItems_mf';
    return $.ajax({
      url: url
    })
  };

  var getSimilar_impulseItems_mf = function (productId) {
    var url = serverBasePath + '/asos/similar/' + productId + '/impulseItems_mf';
    return $.ajax({
      url: url
    })
  };

  var getProduct = function (productId) {
    var url = serverBasePath + '/asos/product/' + productId;
    return $.ajax({
      url: url
    })
  };

  var getProducts = function (productIds) {
    var url = serverBasePath + '/asos/products?ids=' + productIds;
    return $.ajax({
      url: url
    })
  };

  var searchProducts = function (q, params) {
    var url = serverBasePath + '/asos/search';
    var data = params
    data['q'] = q
    data['type'] = 'product'

    return $.ajax({
      url: url,
      data: data
    })
  };

  return {
    getSimilar_YMAL_mf_sameCat: getSimilar_YMAL_mf_sameCat,
    getSimilar_YMAL_mf_sameCat_noBr: getSimilar_YMAL_mf_sameCat_noBr,
    getSimilar_YMAL_mf_anyCat_noBr: getSimilar_YMAL_mf_anyCat_noBr,
    getSimilar_OOSA_v2b: getSimilar_OOSA_v2b,
    getSimilar_complementaryItems_mf: getSimilar_complementaryItems_mf,
    getSimilar_impulseItems_mf: getSimilar_impulseItems_mf,
    getProduct: getProduct,
    getProducts: getProducts,
    searchProducts: searchProducts
  }

};