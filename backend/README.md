# API Documentation

This document provides details about the available endpoints in the backend system, including their descriptions, required data, and possible responses.

---

## Endpoints

### 1. **Register a New User**

**Endpoint:** `/register`  
**Method:** `POST`  
**Description:** This endpoint is used to register a new user in the system. It validates the input data, hashes the password, and stores the user information in the database.

#### Request Body
| Field               | Type   | Validation                                                                                     | Description                                      |
|---------------------|--------|-----------------------------------------------------------------------------------------------|--------------------------------------------------|
| `fullName.firstName`| String | Must be at least 3 characters long.                                                           | The first name of the user.                     |
| `fullName.lastName` | String | Must be at least 3 characters long.                                                           | The last name of the user.                      |
| `email`             | String | Must be a valid email format.                                                                 | The email address of the user.                  |
| `password`          | String | Must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number. | The password for the user account.             |
| `address`           | String | Must be at least 5 characters long.                                                           | The address of the user.                        |

#### Responses
- **Success Response**
  - **Status Code:** `201 Created`
  - **Body:**
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": "user_id",
        "fullName": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "email": "johndoe@example.com",
        "address": "123 Main Street"
      },
      "token": "generated_auth_token"
    }
    ```

- **Error Responses**
  1. **Validation Errors**
     - **Status Code:** `422 Unprocessable Entity`
     - **Body:**
       ```json
       {
         "errors": [
           {
             "msg": "First name must be at least 3 characters long",
             "param": "fullName.firstName",
             "location": "body"
           },
           ...
         ]
       }
       ```
  2. **User Already Exists**
     - **Status Code:** `400 Bad Request`
     - **Body:**
       ```json
       {
         "message": "User already exists"
       }
       ```
  3. **Server Error**
     - **Status Code:** `500 Internal Server Error`
     - **Body:**
       ```json
       {
         "message": "Error message"
       }
       ```

---

### 2. **Login a User**

**Endpoint:** `/login`  
**Method:** `POST`  
**Description:** This endpoint is used to authenticate an existing user. It verifies the provided credentials and returns the user information along with an authentication token if the credentials are valid.

#### Request Body
| Field     | Type   | Validation                                                              | Description                                  |
|-----------|--------|-------------------------------------------------------------------------|----------------------------------------------|
| `email`   | String | Must be a valid email format.                                           | The registered email address of the user.    |
| `password`| String | Must be at least 8 characters long.                                     | The password for the user account.           |

#### Responses
- **Success Response**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "user": {
        "_id": "user_id",
        "fullName": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "email": "johndoe@example.com",
        "address": "123 Main Street"
      },
      "token": "generated_auth_token"
    }
    ```

- **Error Responses**
  1. **Validation Errors**
     - **Status Code:** `422 Unprocessable Entity`
     - **Body:**
       ```json
       {
         "errors": [
           {
             "msg": "Invalid email format",
             "param": "email",
             "location": "body"
           },
           {
             "msg": "Password must be at least 8 characters long",
             "param": "password",
             "location": "body"
           }
         ]
       }
       ```
  2. **Invalid Credentials**
     - **Status Code:** `401 Unauthorized`
     - **Body:**
       ```json
       {
         "message": "Invalid email or password"
       }
       ```
  3. **Server Error**
     - **Status Code:** `500 Internal Server Error`
     - **Body:**
       ```json
       {
         "message": "Error message"
       }
       ```

---

### 3. **Maps API Key Setup and Provider Configuration**

This project supports two maps API providers:

- **Google Maps API** (default)
- **OpenStreetMap (OSM) with Nominatim and OSRM** (free alternative, no credit card required)

#### Using Google Maps API

To use Google Maps API, obtain an API key from the [Google Cloud Console](https://console.cloud.google.com/) and set it in your `.env` file:

```
MAPS_PROVIDER=google
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

#### Using OpenStreetMap (OSM) Provider

To use the free OpenStreetMap provider, set the following in your `.env` file:

```
MAPS_PROVIDER=osm
```

No API key is required for OSM.

#### Notes

- When using the OSM provider, the `getDistanceTime` endpoint expects origin and destination as addresses, which are internally converted to coordinates before routing.
- The OSM provider uses the public Nominatim service for geocoding and OSRM for routing.
- Ensure you respect the usage policies of these public services.

---

Please restart your backend server after changing environment variables.
