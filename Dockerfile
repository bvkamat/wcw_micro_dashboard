FROM node
COPY . /app
WORKDIR /app
ENV PORT 3606
CMD ["node", "app.js"]
