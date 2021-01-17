export default {
  methods: {
    imageUrl(imageUrl) {
      const isProduction   = process.env['NODE_ENV'] === "production"
      const isInitialImage = ! (imageUrl + '').includes('http')
      // serve static image as fallback case user didn't upload a file
      if (isInitialImage) return process.env['baseUrl'] + '/' + imageUrl
      // for production serve an actioal db url and fake for devolopment 
      return isProduction ? imageUrl : "http://localhost:3000/d.jpg"
    },
  }
}