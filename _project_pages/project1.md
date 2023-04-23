---
layout: walkthrough
title: Project 1
image: /assets/project1.jpg
description: A brief description of Project 1.
---

# Project 1: Flask News Aggregator with Docker

## Step 1: Create a sample application

Let's start by creating a simple Flask application to search for news articles using the Bing Search API. We'll fetch the top 10 most recent articles for the specified keywords and display them in an aesthetically pleasing format.

### 1.1 Sign up for the Bing Web Search API

[https://www.microsoft.com/en-us/bing/apis/bing-web-search-api](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api)

### 1.2 Install required packages

First, install Flask and the requests library for making API calls by running the following command:

```
pip install Flask requests
```

### 1.3 Create the Flask application

Create a new file called `app.py` and add the following code:

```python
from flask import Flask, render_template
import requests
from dateutil.parser import parse
from dateutil import tz

app = Flask(__name__)

@app.route('/')
def index():
    # Define the keywords you want to search for
    keywords = ['keyword1', 'keyword2', 'keyword3']

    # Replace 'your_api_key' with your actual Bing Search API key
    api_key = 'your_api_key'

    # Make API calls to Bing Search API to fetch articles
    articles = []
    seen_urls = set()  # Keep track of article URLs to avoid duplicates
    headers = {'Ocp-Apim-Subscription-Key': api_key}
    for keyword in keywords:
        url = f'https://api.bing.microsoft.com/v7.0/news/search?q={keyword}&count=10&sortBy=Date'
        response = requests.get(url, headers=headers)
        data = response.json()

        if 'value' in data:
            for article in data['value']:
                if article['url'] not in seen_urls:
                    article['formattedDate'] = format_date(article['datePublished'])
                    articles.append(article)
                    seen_urls.add(article['url'])

    # Sort the articles by their published time in descending order
    articles.sort(key=lambda x: x['datePublished'], reverse=True)

    # Limit the number of articles to display
    articles = articles[:10]

    return render_template('index.html', articles=articles)

if __name__ == '__main__':
    app.run(debug=True)
```

### 1.4 Create the HTML template

Create a folder named `templates` and inside it, create a new file called `index.html`. Add the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News Aggregator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f3f3;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        article {
            border-bottom: 1px solid #ccc;
            padding: 15px 0;
        }
        h1, h2, time {
            margin: 0;
        }
        a {
            color: #333;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class
    <div class="container">
        <h1>News Aggregator</h1>
        {% for article in articles %}
            <article>
                <h2><a href="{{ article.url }}" target="_blank">{{ article.name }}</a></h2>
                <time>{{ article.datePublished }}</time>
                <p>{{ article.description }}</p>
            </article>
        {% endfor %}
    </div>
</body>
</html>
```

Now, run the Flask app using the command `python app.py`, and it will display the aggregated news articles with the specified keywords.

## Step 2: Containerize the Flask application using Docker

In this step, we will containerize the Flask application using Docker. Docker allows you to package an application with its dependencies into a standardized unit for software development. This helps ensure that your application runs consistently across different environments.

### 2.1 Install Docker

- For Windows and macOS, download Docker Desktop from the [official Docker website](https://www.docker.com/products/docker-desktop).
- For Linux, follow the [official installation guide](https://docs.docker.com/engine/install/) for your specific distribution.

### 2.2 Create a `Dockerfile` in the same folder as your Flask application

Create a file named `Dockerfile` (with no file extension) in the same folder as your `app.py`. This file will contain instructions for building the Docker image.

Add the following content to your `Dockerfile`:

```Dockerfile
# Use the official Python base image
FROM python:3.9-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 5000

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Start the Flask app
CMD ["flask", "run"]
```

This `Dockerfile` does the following:

- Specifies the base image as `python:3.9-slim`.
- Sets the working directory to `/app`.
- Copies the `requirements.txt` file into the container and installs the dependencies.
- Copies the rest of the application code into the container.
- Exposes port 5000, which is the default port for Flask applications.
- Sets environment variables required for Flask.
- Starts the Flask application using the `flask run` command.

### 2.3 Create a `requirements.txt` file

In the same folder as your `app.py` and `Dockerfile`, create a file named `requirements.txt`. This file will list the Python dependencies required for your application.

Add the following content to your `requirements.txt` file:

```
Flask==2.1.1
requests==2.27.1
python-dateutil==2.8.2
```

### 2.4. Build the Docker image

Open a terminal or command prompt, navigate to the directory containing your `Dockerfile`, and run the following command:

```sh
docker build -t flask-news-aggregator .
```

This command builds a Docker image and tags it as `flask-news-aggregator`. The process might take some time, depending on your internet connection and computer's performance.

### 2.5 Run the Docker container

After building the Docker image, run the following command to start the Docker container:

```sh
docker run -p 5000:5000 flask-news-aggregator
```

This command maps port 5000 on your local machine to port 5000 on the Docker container.

Now, you should be able to access the Flask application at `http://localhost:5000` in your web browser.

### 2.6 Stop the Docker container

To stop the Docker container, press `Ctrl+C` in the terminal or command prompt where the container is running.

You have now successfully containerized your Flask application using Docker. This makes it easier to deploy the application in different environments and ensures consistent behavior across platforms.

