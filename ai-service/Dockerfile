FROM python:3.9

# Create a non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt uvicorn

# Copy application files
COPY . .

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

# Use non-root user
USER appuser

EXPOSE 8000

# Use uvicorn with --reload flag for development
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]