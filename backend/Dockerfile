# Use an official Python runtime as a parent image
FROM python:3.8.3-alpine

# Set environment variables


# Set the working directory in the container
WORKDIR /srv/app


# Copy the current directory contents into the container
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY ./requirements/base.txt .
# Install dependencies
RUN pip install -r requirements/base.txt


RUN apk add --update --no-cache --virtual .tmp-build-deps \
  gcc \
  libc-dev \
  linux-headers \
  postgresql-dev \
  musl-dev \
  zlib zlib-dev \
  && pip install -r requirements.txt \
  && apk del --no-cache .tmp-build-deps


# Expose the port the application runs on
EXPOSE 8000

COPY ./entrypoint.sh .

# copy project
COPY . .

# run entrypoint.sh
ENTRYPOINT ["/srv/app/entrypoint.sh"]