# Use the official Python image as the base image
FROM python:3.10-slim



# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Expose the port that your app will run on
EXPOSE 5001

# Define the command to run your application
CMD ["python", "app.py"]
