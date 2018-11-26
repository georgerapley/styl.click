from flask import Flask, jsonify, request, render_template
from flask_cors import CORS, cross_origin
from flask import request, g
import requests
import os

app = Flask(__name__, static_folder='public', template_folder='views') 
 
#Allowed origins
ORIGINS = ['*']

app.config['CORS_HEADERS'] = "Content-Type"
app.config['CORS_RESOURCES'] = {r"/*": {"origins": ORIGINS}}
app.config['PROPAGATE_EXCEPTIONS'] = True

cors = CORS(app)

AUTH_TOKEN = os.environ.get('ASOS_AUTH')

@app.route('/')
def homepage():
    """Displays the homepage."""
    return render_template('index.html')

# -- FOR API REQUESTS
headers = {'authorization': AUTH_TOKEN,
           'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
           'Content-Type': 'application/json'}

ymalURL = os.environ.get('ASOS_YMAL_ENDPOINT')

def getQueryString(version, product_id, limit, offset):
  return {"ctx_origin": "pdt","offset": str(offset),"limit": str(limit),
        "version": version,"country": "GB","currency": "GBP","keyStoreDataversion": "7jhdf34h-6",
        "lang": "en-GB","sizeSchema": "UK","store": "COM","ctx_productids": str(product_id)}

productAPI = os.environ.get('ASOS_PRODUCT_ENDPOINT')

# ---------- GET PRODUCT INFO -----------
@app.route('/product/<product_id>')
def get_product(product_id):
    querystring = {"productIds": str(product_id),
                   "store": "COM",
                   "currency": "GBP",
                   "lang": "en-GB",
                   "includeunavailable": "true"}
    url = productAPI
    response = requests.request("GET", url, headers=headers, params=querystring)
    return jsonify(product=response.json())

# --------- SIMILAR PRODUCTS APIS ------------

# ---------- GET YMAL_mf_sameCat ----------
@app.route('/similar/<product_id>/ymal_mf_sameCat_noBr')
def get_ymal_mf_sameCat(product_id):
    querystring = getQueryString("VProductType::", product_id, 100, 1) 
    response = requests.request("GET", ymalURL, headers=headers, params=querystring)
    return jsonify(product=response.json())

# ---------- GET YMAL_mf_anyCat_noBr ----------
@app.route('/similar/<product_id>/ymal_mf_anyCat_noBr')
def get_ymal_mf_anyCat_noBr(product_id):
    querystring = getQueryString("VNosegbr::", product_id, 100, 1)
    response = requests.request("GET", ymalURL, headers=headers, params=querystring)
    return jsonify(product=response.json())

# ---------------------------------------------------

# -- AUTOCOMPLETE SEARCH -----
autocompleteSearchAPI = os.environ.get('ASOS_AUTOCOMPLETE_SEARCH_ENDPOINT')

@app.route('/searchAutocomplete')
def searchAutocomplete():
    q = request.args.get('q')

    url = autocompleteSearchAPI
    
    querystring = {
        "limit": "10",
        "country": "GB",
        "keyStoreDataversion": "5e950e2a-9",
        "lang": "en-GB",
        "store": "1",
        "q" : q
    }
    
    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    return jsonify(product=response.json())
  
# -- PRODUCT SEARCH -----
productSearchAPI = os.environ.get('ASOS_PRODUCT_SEARCH_ENDPOINT')

@app.route('/productSearch')
def productSearch():
    q = request.args.get('q')

    url = productSearchAPI
    
    querystring = {
        "limit": "10",
        "country": "GB",
        "keyStoreDataversion": "5e950e2a-9",
        "lang": "en-GB",
        "store": "1",
        "currency": "GBP",
        "q" : q
    }
    
    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    print(url)
    return jsonify(product=response.json())

if __name__ == '__main__':
    app.debug = True
    app.run(port=3000)