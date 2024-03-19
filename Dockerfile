# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy the built Angular app into the Nginx server directory
COPY dist/fuse /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]