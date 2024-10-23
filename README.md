# User Survey Website

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://w20012045.nuwebspace.co.uk/kv60032/app/)

## 🔍 Project Overview

## 🚀 Part 1: Backend API Endpoints

### 1️⃣ Token Endpoint
- **URL:** 
  ```
  https://w20012045.nuwebspace.co.uk/kv60032/api/token
  https://w20012045.nuwebspace.co.uk/kv60032/api/token/
  ```
- **Parameters:** Username and Password via authorization headers

### 2️⃣ Create Account Endpoint
- **URL:**
  ```
  https://w20012045.nuwebspace.co.uk/kv60032/api/createaccount
  https://w20012045.nuwebspace.co.uk/kv60032/api/createaccount/
  ```
- **Parameters:** All relevant fields in correct format via raw JSON in request body

### 3️⃣ User Data Endpoint
- **URL:**
  ```
  https://w20012045.nuwebspace.co.uk/kv60032/api/userdata
  https://w20012045.nuwebspace.co.uk/kv60032/api/userdata/
  ```
- **Parameters:** Valid token authorization required

### 4️⃣ Country Endpoint
- **URL:**
  ```
  https://w20012045.nuwebspace.co.uk/kv60032/api/country
  https://w20012045.nuwebspace.co.uk/kv60032/api/country/
  ```
- **Parameters:** None required

### 5️⃣ All User Survey Endpoint
- **URL:**
  ```
  https://w20012045.nuwebspace.co.uk/kv60032/api/allusersurvey
  https://w20012045.nuwebspace.co.uk/kv60032/api/allusersurvey/
  ```
- **Example Queries:**
  ```
  ?genderID=1
  ?age=18-29
  ?q1=accountant
  ```

### 6️⃣ Specific User Survey Endpoint
- **URL:**
  ```
  https://w20012045.nuwebspace.co.uk/kv60032/api/specificusersurvey
  https://w20012045.nuwebspace.co.uk/kv60032/api/specificusersurvey/
  ```
- **Parameters:** Valid token authorization required

### 7️⃣ Preview Endpoint
- **URL:**
  ```
  https://w20012045.nuwebspace.co.uk/kv60032/api/preview
  https://w20012045.nuwebspace.co.uk/kv60032/api/preview/
  ```
- **Example Query:**
  ```
  ?limit=1
  ```

## 💻 Part 2: Frontend

### Landing Page
```
https://w20012045.nuwebspace.co.uk/kv60032/app/
```
