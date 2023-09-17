# Use an official Python runtime as a parent image
FROM python:3.8

# Set environment variables


# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install dependencies
RUN pip install -r requirements/base.txt

# Expose the port the application runs on
EXPOSE 8000

# Run the Django development server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]