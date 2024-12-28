# [Integration of Salesforce, Node.js, and React: A Step-by-Step Guide](https://dev.to/javiernicolasadan/integration-of-salesforce-nodejs-and-react-a-step-by-step-guide-5d25/edit)

In this article, I’ll walk you through how to connect a backend built with **Node.js** to **Salesforce** using **OAuth 2.0** and then integrate it with a **React** frontend. This solution is with Connected app in **Salesforce**, and  **sf-jwt-token** & **jsforce** packages in the backend.
I’ll explain how to do this on your local in you local machine and in test environment, giving you all tools you need.

---

## **1. Salesforce Configuration**
Before coding, we need to configure Salesforce to allow integration with our application.

### **Steps in Salesforce:**
1. **Create a Connected App**:
   - Go to **Setup → App Manager → Create a Connected App**.
   - Enable **API (Enable OAuth Settings)**.
   - In **Selected OAuth Scopes**, choose:
     - `Refresh token`
     - `API`
     - `Full access`.

2. **Set OAuth Policies**:
   - Inside our new App, navigate to **Manage → Edit Policies** 
 and set:
     - **Permitted Users**: Admin approved users are pre-authorized.
   - Also we need to assign the profile we want to use in **Manage Profiles**.

3. **Consumer Key and Secret**:
From **API(Enable OAuth Settings)**, click on Manage Consumer Details and save **Consumer Key (Consumer_Id)** and **Consumer Secret (Consumer_Secret)** for the .env file later in our backend. 

4. **Reset Your Security Token**:
   - From your personal settings in Salesforce (in your pic profile), you may reset your security token and add it to your environment variables (explained below).



## **2. Setting Up the Node.js Server**
Next, we’ll set up an **Express** backend and the required tools to interact with Salesforce.

You can use this repo already prepared for that purpose:
[Backend Node](https://github.com/javiernicolasadan/Backend_Node_SF/)

### **Install Dependencies:**
```bash
npm install express jsforce sf-jwt-token
```

### **Note**:
Im writing this post december '24, and these might not be the newest tools, but there are two recent nice node's features, nice to know. So i just let you know about them, just in case.
If you're using Node.js 22.12 or later:
- You don’t need **dotenv** for environment variables anymore, you can use `process.loadEnvFile()` instead.
- Also you can use `node --watch <your file>` instead of **nodemon** for automatic restarts of the server.
So, two less packages for installing.


### **Environment Variables**:
Create a `.env` file and define the following:
```plaintext
CONSUMER_ID=your_consumer_id
SF_USERNAME=your_salesforce_username
LOGIN_URL=https://login.salesforce.com OR https://test.salesforce.com
```

### **Testing Locally? Use Ngrok**
To expose your local server to Salesforce (needed mainly in first call):
1. Install and run **ngrok**.
2. Run your server.
3. Point ngrok to the port your backend is running on, typing `ngrok.exe http <you port>` in your terminal.
4. Copy the ngrok-generated URL and set it as the **Callback URL** in your Salesforce Connected App in the API(Enable OAuth Settings) section.

## **3. Private Key and Certificate**
Generate a private key and certificate with the following terminal command:
```
$ openssl req  -nodes -new -x509  -keyout private.pem -out server.cert
```
### **Upload digital signature to SF**
Now the two files are in your project. Time to Enable the option  Use digital signatures in your Connected App, and Upload the generated certificate in **Setup → Certificates and Key Management**.

### Now, run the token route in your brower 

```
http://localhost:3000/token
```
If everything went well, now you will get your access_token.

```
{
  access_token: '',
  scope: 'api full',
  instance_url: '',
  id: '',
  token_type: 'Bearer'
}
```
What I did in my solution its everything a call its done, I getting a new token from SF. May be the same one, o new one because SF its generating a new one from time to time.

## **5. Using JSforce**
With the token, you can start interacting with Salesforce from your Node.js server. Here’s a simple example:

```javascript
const jsforce = require('jsforce');

const conn = new jsforce.Connection({
  instanceUrl: 'https://your-instance.salesforce.com',
  accessToken: 'your_access_token',
});

conn.query('SELECT Id, Name FROM Account', (err, result) => {
  if (err) return console.error(err);
  console.log('Accounts:', result.records);
});
```
 
---

## **6. Integrating with React**
Finally, use React to create a frontend that consumes data from the backend and displays it interactively. For instance, you could build:
- A form to create records in Salesforce.
- A table to display account data retrieved from the backend.

In my use case, I needed a way in which a company's workes were able to put the commuting data in, and make registers in SF, concrete in Net Zero Cloud, but for this exercise I just created the object needed and build the solution with a demo developer free org.

You can use also this React Frontend form repo for this purpose.

[React Frontend](https://github.com/javiernicolasadan/Frontend_React_SF).

---

## **Conclusion**
Integrating Salesforce, Node.js, and React in a easy way, just to play around with tools and make things workings.
I hope this article helps you get started with your own integration solution.

Got questions or ideas to improve this workflow? Drop them in the comments.
