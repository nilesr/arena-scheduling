#!/usr/bin/env python3
import requests
CLIENT_ID = "939439849082-e5pjgdqksge5moccdlfvs9tr1bbm9ng7.apps.googleusercontent.com"
REDIRECT_URI = "http://localhost:8080/authn"
SCOPE = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
CLIENT_SECRET = open("client_secret.txt").read().strip()
openid_config = requests.get("https://accounts.google.com/.well-known/openid-configuration").json()

def make_url():
	return openid_config["authorization_endpoint"] + "?scope=" + SCOPE + "&response_type=code&redirect_uri=" + REDIRECT_URI + "&client_id=" + CLIENT_ID + "&access_type=offline"

def get_email(request):
	code = request.query.code
	data = {
		"code": code,
		"client_id": CLIENT_ID,
		"client_secret": CLIENT_SECRET,
		"redirect_uri": REDIRECT_URI,
		"grant_type": "authorization_code"
	}
	token = requests.post(openid_config["token_endpoint"], data=data).json()["access_token"]
	r = requests.get(openid_config["userinfo_endpoint"], headers={"Authorization": "Bearer " + token})
	return r.json()["email"], r.json()["name"]
