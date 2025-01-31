# Microfrontend Project: Host and Remote Apps

This repository contains a microfrontend architecture with three apps:
1. **Host App** (`mainapp`)
2. **Chat App** (`chatapp`)
3. **Email App** (`emailapp`)

## Overview
- **Host App** serves as the main container, integrating the **Remote Apps** (Chat and Email apps) using **Module Federation**.
- **Remote Apps** are independently deployed and integrated into the Host app via Webpack Module Federation.

---

## **Apps in this Project**

### 1. **Host App (`mainapp`)**
- The main application that loads and integrates the `chatapp` and `emailapp` using Module Federation.
- **Technologies**: React, Webpack, Module Federation

#### Setup:
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/microfrontend-app.git
    ```
2. Navigate to `mainapp` folder:
    ```bash
    cd mainapp
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Run the Host App:
    ```bash
    npm start
    ```

---

### 2. **Chat App (`chatapp`)**
- A standalone chat application that is exposed as a remote app for the Host App to consume.
- **Technologies**: React, Webpack, Module Federation

#### Setup:
1. Navigate to `chatapp` folder:
    ```bash
    cd chatapp
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the Chat App:
    ```bash
    npm start
    ```

---

### 3. **Email App (`emailapp`)**
- A standalone email application exposed as a remote app for the Host App to consume.
- **Technologies**: React, Webpack, Module Federation

#### Setup:
1. Navigate to `emailapp` folder:
    ```bash
    cd emailapp
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the Email App:
    ```bash
    npm start
    ```

---

Firstly start both the sub applications, then start the host application.

