FROM --platform=linux/amd64 ubuntu:22.04

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.10 \
    python3.10-dev \
    python3-pip \
    python3-setuptools \
    python3-wheel \
    build-essential \
    libpq-dev \
    nodejs \
    npm \
    tzdata \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create symbolic link for python3 to python
RUN ln -s /usr/bin/python3 /usr/bin/python

# Upgrade pip
RUN python -m pip install --upgrade pip

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install tzdata

# Copy project
COPY . .

# Setup frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Return to main directory
WORKDIR /app

# Collect static files
RUN python manage.py collectstatic --noinput

# Run migrations
RUN python manage.py migrate

# Command to run the application
CMD ["gunicorn", "trm.wsgi:application", "--bind", "0.0.0.0:$PORT"]