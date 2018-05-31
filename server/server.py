from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask import request, g
import requests
import time

app = Flask(__name__)
 
#Allowed origins
ORIGINS = ['*']

bearerToken = '' # -- Need to get your own bearer token to use for authorisation in using the Recommendations API

app.config['CORS_HEADERS'] = "Content-Type"
app.config['CORS_RESOURCES'] = {r"/*": {"origins": ORIGINS}}
app.config['PROPAGATE_EXCEPTIONS'] = True

cors = CORS(app)

# ---------- GET PRODUCT INFO -----------
@app.route('/asos/product/<product_id>')
def get_product(product_id):
    start = time.time()

    url = "http://www.asos.com/api/product/catalogue/v2/summaries?productIds="\
          + str(product_id) + "&store=COM&currency=GBP&lang=en-GB&includeunavailable=true"

    headers = {'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
                }

    response = requests.request(
        "GET", url, json={"key": "value"}, headers=headers)
    requestTime = time.time() - start
    print("Request Time:" + str(requestTime))
    finalRes = jsonify(product=response.json())
    return finalRes


# --------- SIMILAR PRODUCTS APIS ------------

# 2 -- GET RELATED PRODUCTS (VISUAL SIMILARITY)
# 3 -- GET RELATED ARTICLE --
# 4 -- GET RELATED PRODUCTS (BUY THE LOOK)


# ---------- GET YMAL_mf_sameCat ----------
@app.route('/asos/similar/<product_id>/ymal_mf_sameCat')
def get_ymal_mf_sameCat(product_id):
    start = time.time()
    url = "http://www.asos.com/api/customer/recommendation/v2/customer/me/recommendations"
    querystring = {
        "ctx_origin": "pdt",
        "offset": "1",
        "limit": "100",
        "version": "VProductType::",
        "country": "GB",
        "currency": "GBP",
        "keyStoreDataversion": "7jhdf34h-6",
        "lang": "en-GB",
        "sizeSchema": "UK",
        "store": "COM",
        "ctx_productids": product_id
    }

    headers = {
        'authorization': bearerToken,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    }

    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    requestTime = time.time() - start
    print("Request Time:" + str(requestTime))
    finalRes = jsonify(product=response.json())
    print("Response Time:" + str((time.time() - start)))
    return finalRes


# ---------------------------------------------------


# ---------- GET YMAL_mf_sameCat_noBr ----------
@app.route('/asos/similar/<product_id>/ymal_mf_sameCat_noBr')
def get_ymal_mf_sameCat_noBr(product_id):
    url = "http://www.asos.com/api/customer/recommendation/v2/customer/me/recommendations"
    querystring = {
        "ctx_origin": "pdt",
        "offset": "1",
        "limit": "100",
        "version": "VProductType::VNosegbr",
        "country": "GB",
        "currency": "GBP",
        "keyStoreDataversion": "7jhdf34h-6",
        "lang": "en-GB",
        "sizeSchema": "UK",
        "store": "COM",
        "ctx_productids": product_id
    }

    headers = {
        'authorization': bearerToken,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    }

    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    return jsonify(product=response.json())


# ---------------------------------------------------


# ---------- GET YMAL_mf_anyCat_noBr ----------
@app.route('/asos/similar/<product_id>/ymal_mf_anyCat_noBr')
def get_ymal_mf_anyCat_noBr(product_id):
    url = "http://www.asos.com/api/customer/recommendation/v2/customer/me/recommendations"
    querystring = {
        "ctx_origin": "pdt",
        "offset": "1",
        "limit": "100",
        "version": "VNosegbr",
        "country": "GB",
        "currency": "GBP",
        "keyStoreDataversion": "7jhdf34h-6",
        "lang": "en-GB",
        "sizeSchema": "UK",
        "store": "COM",
        "ctx_productids": product_id
    }

    headers = {
        'authorization': bearerToken,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    }

    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    return jsonify(product=response.json())


# ---------------------------------------------------


# ---------- GET OOSA_v2b ----------
@app.route('/asos/similar/<product_id>/OOSA_v2b')
def get_OOSA_v2b(product_id):
    url = "http://www.asos.com/api/customer/recommendation/v2/customer/me/recommendations"
    querystring = {
        "ctx_origin": "pdt",
        "offset": "1",
        "limit": "100",
        "version": "VProductType::v2::",
        "country": "GB",
        "currency": "GBP",
        "keyStoreDataversion": "7jhdf34h-6",
        "lang": "en-GB",
        "sizeSchema": "UK",
        "store": "COM",
        "ctx_productids": product_id
    }

    headers = {
        'authorization': bearerToken,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    }

    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    return jsonify(product=response.json())


# ---------------------------------------------------


# ---------- GET complementaryItems_mf ----------
@app.route('/asos/similar/<product_id>/complementaryItems_mf')
def get_complementaryItems_mf(product_id):
    url = "http://www.asos.com/api/customer/recommendation/v2/customer/me/recommendations"
    querystring = {
        "ctx_origin": "pdt",
        "offset": "1",
        "limit": "100",
        "version": "v3::",
        "country": "GB",
        "currency": "GBP",
        "keyStoreDataversion": "7jhdf34h-6",
        "lang": "en-GB",
        "sizeSchema": "UK",
        "store": "COM",
        "ctx_productids": product_id
    }

    headers = {
        'authorization': bearerToken,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    }

    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    return jsonify(product=response.json())


# ---------------------------------------------------


# ---------- GET impulseItems_mf ----------
@app.route('/asos/similar/<product_id>/impulseItems_mf')
def get_impulseItems_mf(product_id):
    url = "http://www.asos.com/api/customer/recommendation/v2/customer/me/recommendations"
    querystring = {
        "ctx_origin": "pdt",
        "offset": "1",
        "limit": "100",
        "version": "v4::",
        "country": "GB",
        "currency": "GBP",
        "keyStoreDataversion": "7jhdf34h-6",
        "lang": "en-GB",
        "sizeSchema": "UK",
        "store": "COM",
        "ctx_productids": product_id
    }

    headers = {
        'authorization': bearerToken,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    }

    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    return jsonify(product=response.json())


# ---------------------------------------------------
'''
# -- PRODUCT SEARCH -----
@app.route('/asos/search')
def search():
    q = request.args.get('q')
    type = request.args.get('type')
    limit = request.args.get('limit')

#"http://searchapi.asos.com/product/search/v1/?currency=GBP&store=1&lang=en&" + q + "&channel=desktop-web"
    
    response = sp.search(q, type=type, limit=limit)
    return jsonify(response)
'''

if __name__ == '__main__':
    app.debug = False
    app.run(host='0.0.0.0', port=10000)
