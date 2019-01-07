wrk.method = "POST"
wrk.body   = '{"query": "query { buzz { id } }"}'
wrk.headers["Content-Type"] = "application/json"