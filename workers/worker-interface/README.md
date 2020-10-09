The worker interface will provide the endpoint to get betoffers from different bookmakers.

Basically it redirects calls to the appropriate worker for the specified odds provider. This can be kambi, sbtech or any other odds provider that is implemented as a worker.

This is a simple web server that accepts one endpoint:
POST /providers/{provider}/events/{id}/betoffers
with request object:
{
    "type": "Market",
    "sport": "football",
    "league": "premier-league"
}