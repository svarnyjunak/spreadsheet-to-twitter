# spreadsheet-to-twitter

This projects uses Azure functions to regurarly adds new tweets from google spreadsheet.

To run this project you must set this environment variables:
- CONSUMER_KEY - twitter consumer key
- CONSUMER_SECRET - twitter consumer secret
- ACCESS_TOKEN_KEY - twitter access token
- ACCESS_TOKEN_SECRET - twitter token secret
- GOOGLE_SPREADSHEET_ID - id of your google spreadsheet

Google spreadsheet should have columns day, month and content.
