# spreadsheet-to-twitter

This projects uses Azure functions to regurarly adds new tweets from google spreadsheet.

To run this project you must set this environment variables:
- CONSUMER_KEY - twitter consumer key
- CONSUMER_SECRET - twitter consumer secret
- ACCESS_TOKEN_KEY - twitter access token
- ACCESS_TOKEN_SECRET - twitter token secret
- URL - url to google spreadsheet in JSON format https://spreadsheets.google.com/feeds/cells/SPREADSHEET_ID/od6/public/basic?alt=json

Google spreadsheet should have columns like spreadsheet bellow:
https://docs.google.com/spreadsheets/d/1jZe1T0r5uGjERduZVQewYl0lWw5pEwkUre-RwtQm_b0/edit?usp=sharing
